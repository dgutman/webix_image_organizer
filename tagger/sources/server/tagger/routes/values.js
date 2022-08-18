const express = require("express");

const router = express.Router();
const valuesServices = require("../services/values");

const notFoundStatus = 404;
const noContentStatus = 204;

function create(req, res, next) {
	const values = JSON.parse(req.body.values);

	valuesServices.create(values)
		.then(data => res.send(data))
		.catch(err => next(err));
}

function getAll(req, res, next) {
	valuesServices.getAll()
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

function getByTags(req, res, next) {
	const tagIds = JSON.parse(req.query.tagIds);
	valuesServices.getByTags(tagIds)
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

function updateMany(req, res, next) {
	const values = JSON.parse(req.body.values);
	const onlyValues = req.body.onlyValues;
	valuesServices.updateMany(values, onlyValues)
		.then((data) => {
			const correctString = data.length === 1 ? "Value was" : "Values were";
			return res.json({message: `${data.length} ${correctString} successfully updated`, data});
		})
		.catch(err => next(err));
}

function _delete(req, res, next) {
	const tagIds = JSON.parse(req.body.ValueIds);

	valuesServices.deleteMany(tagIds, next)
		.then(() => res.sendStatus(noContentStatus))
		.catch(err => next(err));
}

// routes
router.get("", getAll);
router.get("/tag", getByTags);
router.put("/many", updateMany);
router.post("", create);
router.delete("", _delete);

module.exports = router;
