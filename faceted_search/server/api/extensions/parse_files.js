const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mv = require('mv');

const archive_upload_path = require('../../../config').archive_upload_path;
const images_folder = require('../../../config').images_folder;
const facetImages = require('../models/facet_images');
const {facets, filters} = require('../extensions/create_facets');

const parse = (arr, filter, host, cb, message) => {
    const length = arr.length ? arr.length : 0;

    if (length % 500 === 0) {
        message(`${length} files in change, ${new Date()}`);
    }

    if (arr.length) {
        const item = arr.shift();
        delete item.provenance;

        if (!item.largeImage) {
            return parse(arr, filter, host, cb, message);
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
        facetImages.insertImage(mongo_object, function () {
            parse(arr, filter, host, cb, message);
        });

    } else cb(filter); // if array empty, all is done
};

const parseFile = (filename, host, message) => {
    message('[Files]: starting');
    return new Promise(function (resolve) {
        const path_to_json = path.join(archive_upload_path, 'json', filename);
        const jsonArray = fs.readFileSync(path_to_json);
        const arr = JSON.parse(jsonArray);
        parse(arr, {}, host, function (data) {
            message('[Files]: finished');
            resolve(data);
        }, message);
    });
};

module.exports = parseFile;
