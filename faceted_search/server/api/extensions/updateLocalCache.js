const fsp = require('fs-promise');
const md5 = require('md5-file/promise');
const facetImages = require('../models/facet_images');
const serviceData = require('../models/service_data');

const IMAGES_PATH = require('../../constants').ALL_IMAGES_RES_PATH;

function updateLocalCache() {
    return facetImages.getAll()
    .then((images) => facetImages.convertImagesDataForFrontend(images))
    .then((convertedData) => fsp.writeFile(IMAGES_PATH, JSON.stringify(convertedData)))
    .then((result) => md5(IMAGES_PATH))
    .then((hash) => serviceData.updateImagesHash(hash))
    .then(()=>Promise.resolve(true))
    .catch((err)=>Promise.reject(err));
}

module.exports = updateLocalCache;