const express = require("express");

const router = express.Router();
const imagesService = require("../services/images");

const notFoundStatuts = 404;

function getResourceImages(req, res, next) {
	const type = req.body.type || "collection";
	const collectionId = req.body.resourceId;
	const hostApi = req.body.hostApi;
	const token = req.headers["girder-token"];
	const userId = req.user ? req.user.sub : null;
	const nested = type === "collection";


	imagesService.getResourceImages({collectionId, hostApi, token, userId, type, nested})
		.then((data) => {
			if (data) res.json({message: "Images received"});
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

function getTaskImages(req, res, next) {
	const userId = req.user.sub;
	let offset = req.query.offset || 0;
	let limit = req.query.limit || 50;
	offset = parseInt(offset);
	limit = parseInt(limit);
	const filters = req.query.filters ? JSON.parse(req.query.filters) : null;

	const params = {
		ids: JSON.parse(req.query.ids),
		offset,
		limit,
		userId,
		filters
	};

	imagesService.getTaskImages(params)
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

function reviewImages(req, res, next) {
	const images = JSON.parse(req.body.images);
	const taskIds = JSON.parse(req.body.taskIds);
	const userId = req.user ? req.user.sub : null;
	const preliminarily = req.body.preliminarily || null;

	imagesService.reviewImages(images, taskIds, userId, preliminarily)
		.then(({data, count}) => {
			const correctString = data.length === 1 ? "image was" : "images were";
			return res.send({message: `${data.length} ${correctString} succesfully updated`, data, count});
		})
		.catch(err => next(err));
}

function unreviewTaskImages(req, res, next) {
	const taskIds = JSON.parse(req.body.taskIds);
	const userId = req.user ? req.user.sub : null;

	imagesService.unreviewTaskImages(taskIds, userId)
		.then((data) => {
			const correctString = data.modifiedCount === 1 ? "image was" : "images were";
			return res.send({message: `${data.modifiedCount} ${correctString} succesfully updated`, data});
		})
		.catch(err => next(err));
}

function undoLastSubmit(req, res, next) {
	const taskIds = JSON.parse(req.body.taskIds);
	const userId = req.user ? req.user.sub : null;
	imagesService.undoLastSubmit(taskIds, userId)
		.then((data) => {
			if (data) {
				const correctString = data.length === 1 ? "image was" : "images were";
				return res.send({message: `${data.length} ${correctString} successfully undo`});
			}
			res.send({message: "No records to undo"});
		})
		.catch(err => next(err));
}

// routes
router.get("/tag/:tag/collections", getCollectionsImages);
router.get("/tag/:tag/folders", getFoldersImages);
router.get("/task", getTaskImages);
router.put("/many", updateMany);
router.put("/review", reviewImages);
router.put("/unreview", unreviewTaskImages);
router.post("/resource", getResourceImages);
router.put("/undo", undoLastSubmit);

module.exports = router;
