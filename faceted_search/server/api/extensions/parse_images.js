const facetImages = require('../models/facet_images');
const {facets, filters} = require('./create_facets');
const approvedMetadataModel = require('../models/approved_metadata');

function parse(arr, host) {
    let filter = {};

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
            approvedMetadataModel.insertItems(mongo_object);
            insertImagesPromises.push(facetImages.insertImage(mongo_object));
        });
        return Promise.all(insertImagesPromises).then(() => {
            return filter;
        });
    }
    return Promise.resolve(filter);
};

module.exports = {
    parseImages: parse
};
