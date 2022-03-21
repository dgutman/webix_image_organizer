const ss = require('socket.io-stream');
const fsp = require('fs-promise');
const md5 = require('md5-file/promise');

const {loadImagesFileFromGirder, resyncImages} = require('./load_from_girder');
const {parseImages} = require('./parse_images');
const uniqFilter = require('./create_facets').uniqFilter;

const facetImages = require('../models/facet_images');
const serviceData = require('../models/service_data');
const approvedFacetModel = require('../models/approved_facet');

const IMAGES_PATH = require('../../constants').ALL_IMAGES_RES_PATH;

class Backend {
    constructor(socket) {
        const backend = socket.of('/backend');

        this.socket = backend;

        backend.on('connection', (socket) => {
            ss(socket).on('loadGirderFolder', (data) => {
                this.loadGirderFolder(data);
            });

            ss(socket).on('resyncUploadedData', (data) => {
                this.resyncUploadedData(data);
            });
            ss(socket).on('deleteResource', (data) => {
                this.deleteResource(data);
            });
        });

        this._message = (msg) => {
            this.socket.emit('message', msg);
        };
    }

    loadGirderFolder(data) {
        this._message('[Uploading]: started');
        loadImagesFileFromGirder(data)
            .then((images) => {
                this._message('[Uploading]: finished');
                return this._parseData(images, data.host, data.id);
            });
    }

    async resyncUploadedData({host, token}) {
        this._message('[Resync]: started');
        return resyncImages(host, token)
            .then((images) => {
                this._message('[Resync]: finished');
                return this._parseData(images, host);
            });
    }

    async deleteResource(data) {
        this._message('[Looking images]: started');
        const images = await loadImagesFileFromGirder(data);
        this._message('[Delete]: started');
        const ids = [];
        let imagesCount = 0;
        images.forEach((image) => {
            ids.push(image._id);
            imagesCount++;
        });
        const deletedCount = await facetImages.removeImages(ids);
        if(imagesCount === deletedCount) {
            this._message('[Delete]: finished successfully');
            this.socket.emit('finishLoading', {});
        } else {
            this._message('[Delete]: something went wrong');
            this.socket.emit('finishLoading', {});
        }
    }

    async _parseData(images, host, id) {
        this._message('[Parse]: started');
        const resourceId = id;
        return parseImages(images, host, this._message)
            .then((data) => {
                this._message('[Parse]: finished');
                return uniqFilter(data);
            })
            .then((data) => this.socket.emit('data', data))
            .then(() => facetImages.getAll())
            .then((images) => facetImages.convertImagesDataForFrontend(images))
            .then((convertedData) => fsp.writeFile(IMAGES_PATH, JSON.stringify(convertedData)))
            .then((result) => md5(IMAGES_PATH))
            .then((hash) => serviceData.updateImagesHash(hash))
            .then(() => serviceData.addResource(resourceId))
            .then(() => approvedFacetModel.addApprovedFacetData())
            .then(() => {
                this.socket.emit('finishLoading', {});
                console.log('response for images collection is cached');
            })
            .catch((err) => {
                this.socket.emit('error', err);
                console.log(err);
                return Promise.resolve();
            });
    }
}

module.exports = {Backend};
