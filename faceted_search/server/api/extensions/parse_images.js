const facetImages = require('../models/facet_images');
const {facets, filters} = require('./create_facets');

async function parse(arr, host, folderName) {
    let filter = {};

    const timelogID = `parse-images-${folderName}-${Math.random().toString(16).slice(2)}`;
    console.time(timelogID);

    if (arr.length) {
        const insertImagesPromises = [];

        arr.forEach(async (item) => {
            if (!item.largeImage) {
                return;
            }

            const mongo_object = {};

            // save json data to object
            mongo_object.data = item;

            // cork
            mongo_object.facets = facets(mongo_object.data);
            filter = filters(filter, mongo_object.facets);

            mongo_object.filesrc = mongo_object.data.largeImage.src || null;
            mongo_object.filename = null;
            if (host) mongo_object.host = host;
            insertImagesPromises.push(facetImages.insertImage(mongo_object));
        });
        await Promise.all(insertImagesPromises);
        console.timeLog(timelogID);
        return filter;
    }
    console.timeLog(timelogID);
    return filter;
};

module.exports = {
    parseImages: parse
};
