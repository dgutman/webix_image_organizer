const fsp = require('fs-promise');
const md5 = require('md5-file/promise');
const facetImages = require('../models/facet_images');
const serviceData = require('../models/service_data');

const IMAGES_PATH = require('../../constants').ALL_IMAGES_RES_PATH;

async function updateLocalCache() {
    const images = await facetImages.getAll();
    const convertedData = await facetImages.convertImagesDataForFrontend(images);
    const result = await fsp.writeFile(IMAGES_PATH, JSON.stringify(convertedData));
    const hash = await md5(IMAGES_PATH);
    await serviceData.updateImagesHash(hash);
    return true;
}

module.exports = updateLocalCache;
