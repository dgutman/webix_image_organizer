const express = require('express');

const ServiceData = require('../models/service_data');

const router = express.Router();

module.exports = (app) => {
	router.get('/downloaded-resources', function(req, res, next) {
		ServiceData.getDownloadedResources()
		.then((result) => {
			if(result && result.data) {
				res.status(200).send(result.data);
			} else {
				res.status(200).send([]);
			}
		})
		.catch((err) => next(err));
	});

	router.delete('/downloaded-resources', async function(req, res, next) {
		try{
			await ServiceData.clearDownloadedResources();
			res.sendStatus(204);
		} catch(err) {
			res.status(500).send('Internal error');
		}
	});

	router.delete('/:id', async function(req, res, next) {
		const resourceId = req.params.id;
		try{
			await ServiceData.deleteDownloadedResource(resourceId);
			res.sendStatus(204);
		} catch(err) {
			res.status(500).send('Internal error');
		}
	});

	app.use('/resources', router);
};
