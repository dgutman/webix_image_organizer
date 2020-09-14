const ss = require('socket.io-stream');
const fsp = require('fs-promise');
const md5 = require('md5-file/promise');

const saveFile = require('./save_file');
const moveFile = require('./move_file');
// const parseArchive = require('./parse_archive');
// const parseDirectory = require('./parse_directory');
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
    });
}

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
    // .then((directory) => parseDirectory(directory, message))
    // .then((arr) => parseFiles(arr, message))
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
