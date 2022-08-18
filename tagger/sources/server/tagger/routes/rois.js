const express = require("express");

const router = express.Router();
const roisService = require("../services/user/rois");

const notFoundStatus = 404;

function getCroppedImage(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	const roiId = req.params.id || null;
	const hostAPI = req.query.host || null;
	const token = req.headers["girder-token"];

	roisService.getCroppedImage(roiId, userId, hostAPI, token)
		.then((data) => {
			res.type("jpg");
			return data ? res.send(data) : res.sendStatus(notFoundStatus);
		})
		.catch(err => next(err));
}

function getTaskROIs(req, res, next) {
	const userId = req.user.sub;
	let offset = req.query.offset || 0;
	let limit = req.query.limit || 50;
	let readOnly = req.query.readOnly || false;
	offset = parseInt(offset);
	limit = parseInt(limit);
	const filters = req.query.filters ? JSON.parse(req.query.filters) : null;

	const params = {
		id: req.params.id,
		offset,
		limit,
		userId,
		filters,
		readOnly
	};

	roisService.getTaskROIs(params)
		.then(data => res.send(data))
		.catch(err => next(err));
}

function reviewROIs(req, res, next) {
	const rois = JSON.parse(req.body.rois);
	const taskId = req.body.taskId || null;
	const userId = req.user ? req.user.sub : null;
	const preliminarily = req.body.preliminarily || null;

	roisService.reviewROIs(rois, taskId, userId, preliminarily)
		.then(({data, count}) => {
			const correctString = data.length === 1 ? "region of interest was" : "regions of interest were";
			return res.send({message: `${data.length} ${correctString} succesfully updated`, data, count});
		})
		.catch(err => next(err));
}

function finalizeROITask(req, res, next) {
	const rois = JSON.parse(req.body.rois);
	const taskId = req.body.taskId || null;
	const userId = req.user ? req.user.sub : null;
	const preliminarily = req.body.preliminarily || null;

	roisService.finalizeROITask(rois, taskId, userId, preliminarily)
		.then(data => res.send({message: "Task was finalized", data}))
		.catch(err => next(err));
}

function unreviewROIs(req, res, next) {
	const taskId = req.body.taskId;
	const userId = req.user ? req.user.sub : null;

	roisService.unreviewROIs(taskId, userId)
		.then((data) => {
			const correctString = data.nModified === 1 ? "region of interest was" : "regions of interest were";
			return res.send({message: `${correctString} succesfully updated`, data});
		})
		.catch(err => next(err));
}

function undoLastSubmit(req, res, next) {
	const taskIds = JSON.parse(req.body.taskIds);
	const userId = req.user ? req.user.sub : null;
	roisService.undoLastSubmit(taskIds, userId)
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
router.get("/thumbnail/:id", getCroppedImage);
router.get("/task/:id", getTaskROIs);
router.put("/review", reviewROIs);
router.put("/finalize", finalizeROITask);
router.put("/unreview", unreviewROIs);
router.put("/undo", undoLastSubmit);

module.exports = router;
