const express = require('express');

const facetFilters = require('../models/facet_filters');
const approvedFacetModel = require('../models/approved_facet');
const facetImagesModel = require('../models/facet_images');
const approvedMetadataModel = require('../models/approved_metadata');
const filterCreator = require('../extensions/filters_creator');
const filterImages = require('../extensions/filters_images');
const facetsController = require('../controllers/facets');
const approvedMetadataController = require('../controllers/approved_metadata');
const approvedFacetController = require('../controllers/approved_facets');
const updateLocalCache = require('../extensions/updateLocalCache');

const router = express.Router();

module.exports = (app) => {
	router.post('/filters', facetFilters.addFilters);
	router.get('/filters', filterCreator);
	router.delete('/filters', async (req, res) => {
		try {
			await facetFilters.deleteAllDocuments();
			res.sendStatus(204);
		} catch(err) {
			res.status(500).send('Internal error');
		}
	});
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
	router.delete('/images', async (req, res) => {
		try {
			await facetImagesModel.deleteAllDocuments();
			await updateLocalCache();
			res.sendStatus(204);
		} catch(err) {
			res.status(500).send('Internal error');
		}
	});
	router.get('/approved-metadata', async (req, res) => {
		try {
			const data = await approvedMetadataController.getData();
			if (data) {
				res.status(200).send(data);
			} else {
				res.status(200).send([]);
			}
		} catch(err) {
			res.status(500).send('Internal Error');
		}
	});
	router.post('/approved-metadata', async (req, res) => {
		try {
			const valuesForUpdate = JSON.parse(req.body.data);
			const data = await approvedMetadataController.updateApprovedMetadata(valuesForUpdate);
			if(data) {
				res.status(200).send(data);
			} else {
				res.status(200).send([]);
			}
		} catch (err) {
			res.status(500).send('Internal error');
		}
	});
	router.delete('/approved-metadata', async (req, res) => {
		try {
			await approvedMetadataModel.deleteAllDocuments();
			res.sendStatus(204);
		} catch (err) {
			res.status(500).send('Internal error');
		}
	});
	router.get('/approved-facet', async (req, res) => {
		try{
			const data = await approvedFacetController.getApprovedFacetData();
			if(data) {
				res.status(200).send(data);
			} else {
				res.status(200).send([]);
			}
		} catch (err) {
			res.status(500).send('Internal error');
		}
	});
	router.post('/approved-facet', async (req, res) => {
		try{
			const dataToSave = JSON.parse(req.body.data);
			await approvedFacetController.updateApprovedFacetData(dataToSave);
			res.sendStatus(204);
		} catch (err) {
			res.status(500).send('Internal error');
		}
	});
	router.delete('/approved-facets', async (req, res) => {
		try {
			await approvedFacetModel.deleteAllDocuments();
			res.sendStatus(204);
		} catch(err) {
			res.status(500).send('Internal error');
		}
	});

	app.use('/facets', router);
};
