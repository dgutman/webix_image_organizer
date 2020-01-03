const express = require("express");

const router = express.Router();
const imagesService = require("../services/images");

const notFoundStatuts = 404;

function getResourceImages(req, res, next) {
	const collectionId = req.body.collectionId;
	const hostApi = req.body.hostApi;
	const token = req.headers["girder-token"];

	imagesService.getResourceImages(collectionId, hostApi, token)
		.then((data) => {
			if (data) res.json({tags: data.tags});
			else res.sendStatus(notFoundStatuts);
		})
		.catch(err => next(err));
}

function getCollectionsImages(req, res, next) {
	let offset = req.query.offset || 0;
	let limit = req.query.limit || 50;
	offset = parseInt(offset);
	limit = parseInt(limit);

	const params = {
		tag: req.params.tag,
		collectionIds: JSON.parse(req.query.ids),
		value: req.query.value || null,
		confidence: req.query.confidence || null,
		latest: req.query.latest,
		name: req.query.s || null,
		offset,
		limit
	};

	imagesService.getCollectionsImages(params)
		.then(data => res.send(data))
		.catch(err => next(err));
}

function updateMany(req, res, next) {
	const addIds = JSON.parse(req.body.addIds);
	const removeIds = JSON.parse(req.body.removeIds);
	const tagId = req.body.tagId;
	const valueId = req.body.valueId;
	const confidence = req.body.confidence;

	imagesService.updateMany(addIds, removeIds, tagId, valueId, confidence)
		.then(data => res.send(data))
		.catch(err => next(err));
}

// routes
router.get("/tag/:tag/collections", getCollectionsImages);
router.put("/many", updateMany);
router.post("/resource", getResourceImages);

module.exports = router;
