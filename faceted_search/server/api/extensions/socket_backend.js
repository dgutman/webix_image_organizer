const ss = require('socket.io-stream');
const fsp = require('fs-promise');
const md5 = require('md5-file/promise');

const saveFile = require('./save_file');
const createFile = require('./create_file');
const moveFile = require('./move_file');
const loadFromGirder = require('./load_from_girder');
const parseFile = require('./parse_files');
const uniqFilter = require('./create_facets').uniqFilter;

const facetImages = require('../models/facet_images');
const serviceData = require('../models/service_data');

const IMAGES_PATH = require('../../constants').ALL_IMAGES_RES_PATH;

function Backend(socket) {
    const backend = socket.of('/backend');
    const that = this;

    this.socket = backend;

    backend.on('connection', function(socket) {
        ss(socket).on('file', that.file.bind(that));
        ss(socket).on('loadGirderFolder', that.loadGirderFolder.bind(that));
    });
}

Backend.prototype.loadGirderFolder = function (data) {
    const that = this;
    const filename = `${data.name}.json`;

    const message = (msg) => {
        that.socket.emit('message', msg);
    };

    that.socket.emit('message', '[Uploading]: started');
    loadFromGirder(data)
        .then(images => createFile(filename, JSON.stringify(images)))
        .then((from) => {
            message('[Uploading]: finished');
            message('[Moving]: started');
            return moveFile(from, filename);
        })
        .then((filename) => {
            message('[Moving]: finished');
            return parseFile(filename, data.host.hostAPI, message);
        })
        .then((data) =>  uniqFilter(data))
        .then((data) => that.socket.emit('data', data))
        .then(() => facetImages.getAll())
        .then((images) => facetImages.convertImagesDataForFrontend(images))
        .then((convertedData) => fsp.writeFile(IMAGES_PATH, JSON.stringify(convertedData)))
        .then((result) => md5(IMAGES_PATH))
        .then((hash) => serviceData.updateImagesHash(hash))
        .then(() => {
            that.socket.emit('finishLoading', {});
            console.log('response for images collection is cached');
        })
        .catch((err) => {
            that.socket.emit('error', err);
            console.log(err);
            return Promise.resolve();
        });
};

Backend.prototype.file = function (stream, data) {
    const that = this;
    const filename = data.name;

    const message = (msg) => {
        that.socket.emit('message', msg);
    };

    that.socket.emit('message', '[Uploading]: started');
    saveFile(stream, filename)
    .then((from) => {
        that.socket.emit('message', '[Uploading]: finished');
        that.socket.emit('message', '[Moving]: started');
        return moveFile(from, filename);
    })
    .then((filename) => {
        that.socket.emit('message', '[Moving]: finished');
        return parseFile(filename, data.host, message);
    })
    .then((data) =>  uniqFilter(data))
    .then((data) => that.socket.emit('data', data))
    .then(() => facetImages.getAll())
    .then((images) => facetImages.convertImagesDataForFrontend(images))
    .then((convertedData) => fsp.writeFile(IMAGES_PATH, JSON.stringify(convertedData)))
    .then((result) => md5(IMAGES_PATH))
    .then((hash) => serviceData.updateImagesHash(hash))
    .then(() => console.log('response for images collection is cached'))
    .catch((err) => {
        that.socket.emit('error', err);
        console.log(err);
        return Promise.resolve();
    });
};

module.exports = {Backend};
