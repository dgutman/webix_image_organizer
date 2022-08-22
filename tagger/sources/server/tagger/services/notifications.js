const Notifications = require("../models/notifications");
const mongoose = require("mongoose");

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

async function getNotifications(userId, isAdmin) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};

	const query = isAdmin ? {} : {userId: mongoose.Types.ObjectId(userId)};

	const aggregatePipeline = [
		{$match: query},
		{
			$lookup: {
				from: "tasks",
				localField: "taskId",
				foreignField: "_id",
				as: "task"
			}
		},
		{$unwind: "$task"},
		{
			$project: {
				created: 1,
				isRead: 1,
				taskName: {$cond: {if: {$anyElementTrue: ["$task"]}, then: "$task.name", else: "Automatic message"}},
				taskId: 1,
				text: 1
			}
		},
		{$sort: {created: -1, _id: 1}}
	];
	return Notifications.aggregate(aggregatePipeline);
}

async function sendNotifications(text, ids, isAdmin) {
	// validation
	if (!isAdmin) throw {name: "UnauthorizedError"};
	if (!ids) throw "Field \"taskIds\" should be specified";
	if (!text || typeof text !== "string") throw "Field \"text\" should be a string";

	const message = escapeHtml(text);

	const notifications = Object
		.entries(ids)
		.map(([taskId, userIds]) => userIds.map(id => ({text: message, userId: id, taskId}))).flat();

	return Notifications.insertMany(notifications);
}

async function readNotifications(ids, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	if (!ids || !Array.isArray(ids)) throw "Field \"ids\" should be an array";

	return Notifications.updateMany(
		{_id: {$in: ids.map(id => mongoose.Types.ObjectId(id))}, isRead: false},
		{$set: {isRead: true}}
	);
}

async function removeNotification(id, userId, isAdmin) {
	// validation
	if (!id) throw "Field \"id\" should be set";
	if (!userId) throw {name: "UnauthorizedError"};
	const notification = await Notifications.findById(id);
	if (notification.userId.toString() !== userId && !isAdmin) throw {name: "UnauthorizedError"};

	return Notifications.findByIdAndDelete(id);
}

module.exports = {
	getNotifications,
	sendNotifications,
	readNotifications,
	removeNotification
};
