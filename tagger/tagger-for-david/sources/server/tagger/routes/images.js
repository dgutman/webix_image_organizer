const express = require("express");

const router = express.Router();
const imagesService = require("../services/images");

const notFoundStatuts = 404;

function getResourceImages(req, res, next) {
	const type = req.body.type || "collection";
	const collectionId = req.body.collectionId;
	const hostApi = req.body.hostApi;
	const token = req.headers["girder-token"];
	const userId = req.user ? req.user.sub : null;


	imagesService.getResourceImages(collectionId, hostApi, token, userId, type)
		.then((data) => {
			if (data) res.json(data);
			else res.sendStatus(notFoundStatuts);
		})
		.catch(err => next(err));
}

function getCollectionsImages(req, res, next) {
	const userId = req.user ? req.user.sub : null;
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
		limit,
		userId
	};

	imagesService.getCollectionsImages(params)
		.then(data => res.send(data))
		.catch(err => next(err));
}

function getFoldersImages(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	let offset = req.query.offset || 0;
	let limit = req.query.limit || 50;
	offset = parseInt(offset);
	limit = parseInt(limit);

	const params = {
		tag: req.params.tag,
		folderIds: JSON.parse(req.query.ids),
		value: req.query.value || null,
		confidence: req.query.confidence || null,
		latest: req.query.latest,
		name: req.query.s || null,
		offset,
		limit,
		userId
	};

	imagesService.getFoldersImages(params)
		.then(data => res.send(data))
		.catch(err => next(err));
}

function updateMany(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	const addIds = JSON.parse(req.body.addIds);
	const removeIds = JSON.parse(req.body.removeIds);
	const tagId = req.body.tagId;
	const valueId = req.body.valueId;
	const confidence = req.body.confidence;

	imagesService.updateMany(addIds, removeIds, tagId, valueId, confidence, userId)
		.then(data => res.send(data))
		.catch(err => next(err));
}

// routes
router.get("/tag/:tag/collections", getCollectionsImages);
router.get("/tag/:tag/folders", getFoldersImages);
router.put("/many", updateMany);
router.post("/resource", getResourceImages);

module.exports = router;
