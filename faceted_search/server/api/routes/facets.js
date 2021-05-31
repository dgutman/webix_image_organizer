const express = require('express');

const facetFilters = require('../models/facet_filters');
const filterCreator = require('../extensions/filters_creator');
const filterImages = require('../extensions/filters_images');
const facetsController = require('../controllers/facets');
const whitelistModel = require('../models/whitelist');
const whitelistExtensions = require('../extensions/whitelist');

const router = express.Router();

module.exports = (app) => {
    router.post('/filters', facetFilters.addFilters);
    router.get('/filters', filterCreator);
    router.get('/get-filters-with-images', filterImages);
    router.get('/images', facetsController.getImagesData);
    router.get('/image', facetsController.getImageData);
    router.get('/updateCache', facetsController.updateCache);
    router.get('/whitelist', whitelistExtensions.getProps);
    router.post('/whitelist', (req, res) => {
        const valuesForUpdate = JSON.parse(req.body.data);
        whitelistModel.updateWhitelist(valuesForUpdate)
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((error) => {
                res.status(500).send('internal error');
                console.error(error);
            });
    });

    app.use('/facets', router);
};
