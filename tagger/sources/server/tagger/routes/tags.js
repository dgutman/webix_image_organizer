const express = require("express");

const router = express.Router();
const tagsService = require("../services/tags");
const userTagsService = require("../services/user/tags");

const notFoundStatus = 404;
const noContentStatus = 204;

function create(req, res, next) {
	const tags = JSON.parse(req.body.tags);
	const collectionIds = req.body.collectionIds ? JSON.parse(req.body.collectionIds) : false;

	tagsService.create(tags, collectionIds)
		.then((data) => {
			const correctString = data.length === 1 ? "Tag was" : "Tags were";
			return res.json({message: `${data.length} ${correctString} successfully created`, data});
		})
		.catch(err => next(err));
}

function getAll(req, res, next) {
	tagsService.getAll()
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

function getByCollection(req, res, next) {
	const collectionIds = JSON.parse(req.query.collectionIds);
	tagsService.getByCollection(collectionIds)
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

function updateMany(req, res, next) {
	const tags = JSON.parse(req.body.tags);
	const onlyTags = req.body.onlyTags;
	tagsService.updateMany(tags, onlyTags)
		.then((data) => {
			const correctString = data.length === 1 ? "Tag was" : "Tags were";
			return res.json({message: `${data.length} ${correctString} successfully updated`, data});
		})
		.catch(err => next(err));
}

function _delete(req, res, next) {
	const tagIds = JSON.parse(req.body.tagIds);

	tagsService.deleteMany(tagIds, next)
		.then(() => res.sendStatus(noContentStatus))
		.catch(err => next(err));
}

function getTagsWithValuesByTask(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	const taskId = req.query.taskId;
	userTagsService.getTagsWithValuesByTask(taskId, userId)
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

function getTagTemplatesWithValues(req, res, next) {
	const userId = req.user ? req.user.sub : null;

	userTagsService.getTagTemplatesWithValues(userId)
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

// routes
router.get("", getAll);
router.get("/task", getTagsWithValuesByTask);
router.get("/template", getTagTemplatesWithValues);
router.get("/collection", getByCollection);
router.put("/many", updateMany);
router.post("", create);
router.delete("", _delete);

module.exports = router;
