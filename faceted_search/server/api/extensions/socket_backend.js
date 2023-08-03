const ss = require('socket.io-stream');
const fsp = require('fs-promise');
const md5 = require('md5-file/promise');

const {loadImagesFileFromGirderFolder, resyncImages} = require('./load_from_girder');
const {parseImages} = require('./parse_images');
const uniqFilter = require('./create_facets').uniqFilter;

const facetImages = require('../models/facet_images');
const serviceData = require('../models/service_data');
const approvedFacetModel = require('../models/approved_facet');
const {default: axios} = require('axios');

const IMAGES_PATH = require('../../constants').ALL_IMAGES_RES_PATH;
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

        this._message = (msg, folderName) => {
            this.socket.emit('message', msg, folderName);
        };
    }

    loadGirderFolder(data) {
        const folderName = data.name;
        this._message('[Uploading]: started', folderName);
        loadImagesFileFromGirderFolder(data)
            .then((images) => {
                this._message('[Uploading]: finished', folderName);
                return this._parseData(images, data.host, folderName);
            })
            .catch((error) => {
                this._message(`[Error]: something went wrong`, folderName);
                console.log(error);
            });
    }

    async loadGirderCollection(data) {
        const {host, id, token, name} = data;
        const url = `${host}/folder?parentType=collection&parentId=${id}`;
        const options = {
            headers: {
                "girder-token": token
            }
        };
        try {
            const folders = await axios.get(url, options).then((response) => response.data);
            this._message('[Uploading]: started', name);
            if (folders) {
                folders.forEach((folder) => {
                    const id = folder._id;
                    this.loadGirderFolder({host, id, token});
                });
            }
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
            });
    }

    async deleteResource(data) {
        this._message('[Looking images]: started', data?.folderName);
        const images = await loadImagesFileFromGirderFolder(data);
        const resourcesIds = this.getImagesResources(images);
        if (data?.id) {
            resourcesIds.push(data?.id);
        }
        this._message('[Delete]: started', data.folderName);
        let imagesCount = 0;
        const ids = images ? images.map((image) => {
            imagesCount++;
            return image._id;
        }) : 0;
        const deletedCount = await facetImages.removeImages(ids);
        await serviceData.deleteDownloadedResource(resourcesIds);
        if(imagesCount === deletedCount) {
            this._message('[Delete]: finished successfully', data?.folderName);
            this.socket.emit('finishLoading', data?.folderName);
            this.socket.emit('updateUploadedResources');
        } else {
            this._message('[Delete]: something went wrong', data?.folderName);
            this.socket.emit('finishLoading', data?.folderName);
            this.socket.emit('updateUploadedResources');
        }
    }

    async _parseData(images, host, folderName) {
        this._message('[Parse]: started', folderName);
        const resourcesIds = this.getImagesResources(images);
        return parseImages(images, host, this._message)
            .then((data) => {
                this._message('[Parse]: finished', folderName);
                return uniqFilter(data);
            })
            .then((data) => this.socket.emit('data', data))
            .then(() => facetImages.getAll())
            .then((images) => facetImages.convertImagesDataForFrontend(images))
            .then((convertedData) => fsp.writeFile(IMAGES_PATH, JSON.stringify(convertedData)))
            .then((result) => md5(IMAGES_PATH))
            .then((hash) => serviceData.updateImagesHash(hash))
            .then(() => serviceData.addResources(resourcesIds))
            .then(() => approvedFacetModel.addApprovedFacetData())
            .then(() => {
                this.socket.emit('finishLoading', folderName);
                console.log('response for images collection is cached');
            })
            .catch((err) => {
                this.socket.emit('error', err);
                console.log(err);
                return Promise.resolve();
            });
    }

    getImagesResources(images) {
        const resourcesIds = Array.from(images.reduce((resourcesIdsSet, currentImage) => {
            if (currentImage.folderId) {
                resourcesIdsSet.add(currentImage.folderId);
            }
            return resourcesIdsSet;
        }, new Set()));
        return resourcesIds;
    }
}

module.exports = {Backend};
