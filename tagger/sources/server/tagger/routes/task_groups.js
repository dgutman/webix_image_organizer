const express = require("express");

const router = express.Router();
const groupsService = require("../services/user/task_groups");

const notFoundStatus = 404;

function getGroups(req, res, next) {
	const userId = req.user ? req.user.sub : null;

	groupsService.getGroups(userId)
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

function createGroup(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	const groupName = req.body.name;

	groupsService.createGroup(groupName, userId)
		.then(data => res.json({message: "Group was successfully created", data}))
		.catch(err => next(err));
}

// routes
router.get("/", getGroups);
router.post("/", createGroup);

module.exports = router;
