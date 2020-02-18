const express = require("express");

const router = express.Router();
const tasksService = require("../services/user/tasks");

const notFoundStatus = 404;

function getTasks(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	const collectionId = req.query.collectionId;
	const host = req.query.host;
	const token = req.headers["girder-token"];

	tasksService.getTasks(collectionId, host, token, userId)
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

function checkTask(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	const taskId = req.params.id;
	const hostApi = req.body.hostApi;
	const token = req.headers["girder-token"];

	tasksService.checkTask(taskId, hostApi, token, userId)
		.then(data => res.json({message: "Task images successfully downloaded", data}))
		.catch(err => next(err));
}

// routes
router.get("/", getTasks);
router.put("/check/:id", checkTask);

module.exports = router;
