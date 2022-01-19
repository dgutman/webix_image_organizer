const express = require('express');

const facetFilters = require('../models/facet_filters');
const filterCreator = require('../extensions/filters_creator');
const filterImages = require('../extensions/filters_images');
const facetsController = require('../controllers/facets');
const approvedMetadataController = require('../controllers/approved_metadata');
const approvedFacetController = require('../controllers/approved_facets');

const router = express.Router();

module.exports = (app) => {
	router.post('/filters', facetFilters.addFilters);
	router.get('/filters', filterCreator);
	router.get('/get-filters-with-images', filterImages);
	router.get('/image', facetsController.getImageData);
	router.get('/updateCache', facetsController.updateCache);
	router.get('/images', async (req, res, next) => {
		try {
			const [hash, data] = await facetsController.getImagesData(req, res);
			if(hash) {
				if(data) {
					res.status(200).send(data);
				} else {
					res.status(200).send([]);
				}
			} else {
				res.status(304).send();
			}
		} catch(err) {
			if(err.code === 'ENOENT') {
				res.status(200).send({});
			} else {
				next(err);
			}
		}
	});
	router.get('/approved-metadata', async (req, res) => {
		const data = await approvedMetadataController.getApprovedMetadataData();
		if (data) {
			res.status(200).send(data);
		} else {
			res.status(200).send([]);
		}
	});
	router.post('/approved-metadata', async (req, res) => {
		const valuesForUpdate = JSON.parse(req.body.data);
		const data = await approvedMetadataController.updateApprovedMetadata(valuesForUpdate);
		if(data) {
			res.status(200).send(data);
		} else {
			res.status(500).send('Internal error');
		}
	});
	router.get('/approved-facet', async (req, res) => {
		const data = await approvedFacetController.getApprovedFacetData();
		if(data) {
			res.status(200).send(data);
		} else {
			res.status(200).send([]);
		}
	});
	router.post('/approved-facet', (req, res) => {
		const dataToSave = JSON.parse(req.body.data);
		const result = approvedFacetController.updateApprovedFacetData(dataToSave);
		if(result) {
			res.sendStatus(200);
		} else {
			res.status(500).send('Internal error');
		}
	});
	app.use('/facets', router);
};
