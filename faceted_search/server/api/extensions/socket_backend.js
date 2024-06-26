const ss = require('socket.io-stream');
const fsp = require('fs-promise');

const {loadImagesFileFromGirderFolder, resyncImages} = require('./load_from_girder');
const {parseImages} = require('./parse_images');

const facetImages = require('../models/facet_images');
const serviceData = require('../models/service_data');
const approvedFacetModel = require('../models/approved_facet');
const approvedMetadataModel = require('../models/approved_metadata');
const {default: axios} = require('axios');
const filtersController = require('../controllers/filters');
const updateLocalCache = require('./updateLocalCache');

const RESYNC = require('../../constants').RESYNC;

class Backend {
    constructor(socket) {
        const backend = socket.of('/backend');

        this.socket = backend;

        backend.on('connection', (socket) => {
            ss(socket).on('loadGirderFolder', (data) => {
                this.loadGirderFolder(data);
            });

            ss(socket).on('loadGirderCollection', (data) => {
                this.loadGirderCollection(data);
            });

            ss(socket).on('resyncUploadedData', (data) => {
                this.resyncUploadedData(data);
            });
            ss(socket).on('deleteResource', (data) => {
                this.deleteResource(data);
            });
        });

        this._message = (msg, folderName, collectionName) => {
            this.socket.emit('message', msg, folderName, collectionName);
        };
    }

    loadGirderFolder(data) {
        const {name: folderName, collectionName} = data;
        // TODO: move message generator to separate service
        let msg = collectionName
            ? `[Uploading "${folderName}"]: started`
            : '[Uploading]: started';
        this._message(msg, folderName, collectionName);
        return loadImagesFileFromGirderFolder(data, folderName)
            .then((images) => {
                msg = collectionName
                    ? `[Uploading "${folderName}"]: finished`
                    : '[Uploading]: finished';
                this._message(msg, folderName, collectionName);
                return this._parseData(images, data.host, folderName, collectionName);
            })
            .catch((error) => {
                this._message(`[Error]: something went wrong`, folderName, collectionName);
                console.log(error);
            });
    }

    async loadGirderCollection(data) {
        const {host, id, token, name: collectionName} = data;
        const url = `${host}/folder?parentType=collection&limit=0&parentId=${id}`;
        const options = {
            headers: {
                "girder-token": token
            }
        };
        try {
            const folders = await axios.get(url, options).then((response) => response.data);
            this._message('[Uploading]: started', collectionName);
            if (folders) {
                for(const folder of folders) {
                    const folderId = folder._id;
                    const name = folder.name;
                    await serviceData.addResources([folderId]);
                    await this.loadGirderFolder({host, id: folderId, name, token, collectionName});
                };
            }
            this._message('[Uploading]: finished', collectionName);
            await serviceData.addResources([id]);
            this.socket.emit('finishLoading', collectionName);
        } catch(err) {
            console.log(err.response || err);
        }
    }

    async resyncUploadedData({host, token}) {
        this._message('[Resync]: started', RESYNC);
        return resyncImages(host, token)
            .then((images) => {
                this._message('[Resync]: finished', RESYNC);
                return this._parseData(images, host, RESYNC);
            })
            .then(() => {
                this.socket.emit("finishResync");
            })
            .catch((err) => {
                console.error(err.response || err);
                this._message("[Resync]: error", RESYNC);
                this.socket.emit("finishResync");
            });
    }

    /**
     * 
     * @param {Object} data 
     * @param {string} data.host
     * @param {string} data.id
     * @param {string} data.token
     * @param {string} data.name
     * @param {string} data.type
     */
    async deleteResource(data) {
        try {
            const {host, id, token, name, type} = data;
            const url = `${host}/folder?parentType=collection&parentId=${id}`;
            this._message('[Looking images]: started', name);
            const images = [];
            const resourcesIds = [];
            if (type === "collection") {
                const options = {
                    headers: {
                        "girder-token": token
                    }
                };
                const folders = await axios.get(url, options).then((response) => response.data);
                const promises = [];
                folders.forEach((f) => {
                    resourcesIds.push(f._id);
                    promises.push(loadImagesFileFromGirderFolder({host, id: f._id, token}));
                });
                const values = await Promise.all(promises);
                values.forEach((v) => {
                    images.push(...v);
                });
            }
            else {
                images.push(...await loadImagesFileFromGirderFolder(data));
            }
            if (images) {
                resourcesIds.push(...this.getImagesResources(images));
            }
            if (data?.id) {
                resourcesIds.push(data?.id);
            }
            this._message('[Delete]: started', data.folderName);
            const ids = images ? images.map((image) => {
                return image._id;
            }) : 0;
            const deletedCount = await facetImages.removeImages(ids);
            await serviceData.deleteDownloadedResource(resourcesIds);
            this._message(`[Delete]: finished successfully, deleted ${deletedCount} images. Update filters`, data?.folderName || data.name);
            filtersController.updateFilters();
            this.socket.emit('finishDelete', data?.folderName || data.name);
            this.socket.emit('updateUploadedResources');
            await updateLocalCache();
        }
        catch (error) {
            console.error(error);
            await updateLocalCache();
            this._message('[Delete]: something went wrong', data?.folderName);
            this.socket.emit('finishDelete', data?.folderName);
            this.socket.emit('updateUploadedResources');
        }
    }

    async _parseData(images, host, folderName, collectionName) {
        const timelogID = `parse-data-${folderName}-${Math.random().toString(16).slice(2)}`;
        console.time(timelogID);
        let msg = collectionName
            ? `[Parse folder "${folderName}"]: started`
            : '[Parse]: started';
        this._message(msg, folderName, collectionName);
        const resourcesIds = this.getImagesResources(images);
        return parseImages(images, host, folderName)
            .then(() => {
                msg = collectionName
                    ? `[Parse folder "${folderName}"]: finished`
                    : '[Parse]: finished';
                this._message(msg, folderName, collectionName);
            })
            .then(() => {
                filtersController.updateFilters();
                const filters = filtersController.getAllFilters();
                this.socket.emit('data', filters);
            })
            .then(() => updateLocalCache())
            .then(() => serviceData.addResources(resourcesIds))
            .then(() => approvedFacetModel.addApprovedFacetData())
            .then(() => approvedMetadataModel.updateApprovedMetadata())
            .then(() => {filtersController.updateFilters();})
            .then(() => {
                if (!collectionName) {
                    this.socket.emit('finishLoading', folderName);
                }
                console.log('response for images collection is cached');
            })
            .catch((err) => {
                this.socket.emit('error', err, folderName);
                console.log(err);
                return Promise.resolve();
            })
            .finally(() => {
                console.timeLog(timelogID);
            });
    }

    getImagesResources(images) {
        const resourcesIds = Array.from(images?.reduce((resourcesIdsSet, currentImage) => {
            if (currentImage.folderId) {
                resourcesIdsSet.add(currentImage.folderId);
            }
            return resourcesIdsSet;
        }, new Set())) ?? [];
        return resourcesIds;
    }
}

module.exports = {Backend};
