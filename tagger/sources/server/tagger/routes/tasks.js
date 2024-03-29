const express = require("express");

const router = express.Router();
const tasksService = require("../services/user/tasks");

const notFoundStatus = 404;

function createTask(req, res, next) {
	const taskData = JSON.parse(req.body.task);
	const imageIds = JSON.parse(req.body.imageIds);
	const selectedImages = JSON.parse(req.body.selectedImages);
	const hostApi = req.body.hostApi;
	const userId = req.user ? req.user.sub : null;
	const token = req.headers["girder-token"];

	tasksService.createTask(taskData, imageIds, selectedImages, userId, hostApi, token)
		.then(data => res.json({message: "Task was successfully created", data}))
		.catch(err => next(err));
}

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

function getTasksData(req, res, next) {
	const collectionId = req.query.collectionId;
	const host = req.query.host;
	const groupId = req.query.group || null;
	const type = req.query.type;
	const token = req.headers["girder-token"];
	const userId = req.user ? req.user.sub : null;
	const isAdmin = req.user ? req.user.prms : false;

	tasksService.getTasksData({collectionId, host, token, userId, isAdmin, groupId, type})
		.then(data => res.json({data}))
		.catch(err => next(err));
}

function groupTasks(req, res, next) {
	const groupId = req.body.groupId || null;
	const ids = JSON.parse(req.body.ids);
	const isAdmin = req.user ? req.user.prms : false;

	tasksService.groupTasks(ids, groupId, isAdmin)
		.then(data => res.json({message: "Tasks succesfully moved", data}))
		.catch(err => next(err));
}

function deleteTask(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	const taskId = req.params.id;
	const isAdmin = req.user ? req.user.prms : false;
	const force = req.body.force;

	tasksService.deleteTask(taskId, userId, isAdmin, force)
		.then(data => res.json({message: "Task succesfully removed", data}))
		.catch(err => next(err));
}

function editTask(req, res, next) {
	const taskId = req.params.id;
	const taskData = JSON.parse(req.body.task);
	const imageIds = req.body.imageIds ? JSON.parse(req.body.imageIds) : null;
	const hostApi = req.query.host;
	const userId = req.user ? req.user.sub : null;
	const token = req.headers["girder-token"];

	tasksService.editTask(taskId, taskData, imageIds, userId, hostApi, token)
		.then(data => res.json({message: "Task was successfully updated", data}))
		.catch(err => next(err));
}

function changeTaskStatus(req, res, next) {
	const taskId = req.params.id;
	const status = req.body.status;
	const userId = req.user ? req.user.sub : null;

	tasksService.changeTaskStatus(taskId, status, userId)
		.then(task => res.json({message: "Task status was successfully updated", task}))
		.catch(err => next(err));
}

function getTaskJSON(req, res, next) {
	const taskId = req.params.id;
	const userId = req.user ? req.user.sub : null;
	const isAdmin = req.user ? req.user.prms : false;
	const hostApi = req.query.host;
	const token = req.headers["girder-token"];

	tasksService.getTaskJSON({taskId, userId, isAdmin, hostApi, token})
		.then(data => res.json({data}))
		.catch(err => next(err));
}

function getTaskResults(req, res, next) {
	const taskId = req.params.id;
	const isAdmin = req.user ? req.user.prms : false;
	const fromROI = JSON.parse(req.query.fromROI) || false;

	tasksService.getTaskResults(taskId, isAdmin, fromROI)
		.then(data => res.json({data}))
		.catch(err => next(err));
}

async function getResultsPerTask(req, res) {
	const token = req.headers["girder-token"];
	const host = req.query.host;
	const results = await tasksService.getResultsPerTask(host, token);
	res.json(results);
}

async function getResultsPerUser(req, res) {
	const token = req.headers["girder-token"];
	const host = req.query.host;
	const results = await tasksService.getResultsPerUser(host, token);
	res.json(results);
}

// routes
router.get("/", getTasks);
router.get("/data", getTasksData);
router.get("/json/:id", getTaskJSON);
router.get("/results/:id", getTaskResults);
router.get("/results-per-user", getResultsPerUser);
router.get("/results-per-task", getResultsPerTask);
router.put("/check/:id", checkTask);
router.put("/group", groupTasks);
router.put("/edit/:id", editTask);
router.put("/status/:id", changeTaskStatus);
router.post("/", createTask);
router.delete("/:id", deleteTask);

module.exports = router;
