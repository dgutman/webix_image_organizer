const express = require("express");
const notificationService = require("../services/notifications");

const router = express.Router();
const notFoundStatus = 404;

async function getNotifications(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	const isAdmin = req.user ? req.user.prms : null;

	notificationService.getNotifications(userId, isAdmin)
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

async function sendNotifications(req, res, next) {
	const isAdmin = req.user ? req.user.prms : null;
	const text = req.body.text;
	const userIds = JSON.parse(req.body.userIds);

	notificationService.sendNotifications(text, userIds, isAdmin)
		.then(data => res.send(data))
		.catch(err => next(err));
}

async function readNotifications(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	const ids = JSON.parse(req.body.ids);

	notificationService.readNotifications(ids, userId)
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

async function removeNotification(req, res, next) {
	const userId = req.user ? req.user.sub : null;
	const isAdmin = req.user ? req.user.prms : null;
	const id = req.params.id;

	notificationService.removeNotification(id, userId, isAdmin)
		.then(data => (data ? res.send(data) : res.sendStatus(notFoundStatus)))
		.catch(err => next(err));
}

// routes
router.get("/", getNotifications);
router.post("/", sendNotifications);
router.put("/", readNotifications);
router.delete("/:id", removeNotification);

module.exports = router;
