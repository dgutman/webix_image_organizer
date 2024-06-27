const fsp = require('fs-promise');
const md5 = require('md5-file/promise');
const facetImages = require('../models/facet_images');
const serviceData = require('../models/service_data');
const filesLock = require('../extensions/files_Lock');

const IMAGES_PATH = require('../../constants').ALL_IMAGES_RES_PATH;

async function updateLocalCache() {
    try {
        const images = await facetImages.getAll();
        const convertedData = await facetImages.convertImagesDataForFrontend(images);
        while (filesLock.get(IMAGES_PATH)) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        filesLock.set(IMAGES_PATH, true);
        await fsp.writeFile(IMAGES_PATH, JSON.stringify(convertedData));
        filesLock.set(IMAGES_PATH, false);
        const hash = await md5(IMAGES_PATH);
        await serviceData.updateImagesHash(hash);
        return true;
    }
    catch (error) {
        console.error('Error in updating local cache', error);
    }
    finally {
        filesLock.set(IMAGES_PATH, false);
    }
}

module.exports = updateLocalCache;
