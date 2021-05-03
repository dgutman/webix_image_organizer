const express = require('express');

const facetFilters = require('../models/facet_filters');
const facetImages = require('../models/facet_images');
const filterCreator = require('../extensions/filters_creator');
const filterImages = require('../extensions/filters_images');
const serviceData = require('../models/service_data');
const facetsController = require('../controllers/facets');
const whitelistModel = require('../models/whitelist');
const whitelistGetProps = require('../extensions/whitelist');

let router = express.Router();

module.exports = (app) => {
    router.post('/filters', facetFilters.addFilters);
    router.get('/filters', filterCreator);
    router.get('/get-filters-with-images', filterImages);
    router.get('/images', facetsController.getImagesData);
    router.get('/updateCache', facetsController.updateCache);
    router.get('/whitelist', whitelistGetProps);
    router.post('/whitelist', whitelistModel.updateWhitelist);

    app.use('/facets', router);
};
