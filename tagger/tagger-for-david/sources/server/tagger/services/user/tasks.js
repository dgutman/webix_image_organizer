const mongoose = require("mongoose");
const dot = require("dot-object");
const request = require("request");
const Tasks = require("../../models/user/tasks");
const Tags = require("../../models/user/tags");
const Values = require("../../models/user/values");
const folderService = require("../folders");
const imagesService = require("../images");

const ObjectID = mongoose.mongo.ObjectID;
const successStatusCode = 200;

async function deleteUncheckedTasks(userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"}

	const tasksToDelete = await Tasks.find({userId, checked_out: false});
	const taskIdsToDelete = tasksToDelete.map(task => task._id);
	const tagsToDelete = await Tags.find({taskId: {$in: taskIdsToDelete}});
	const tagIdsToDelete = tagsToDelete.map(tag => tag._id);

	await Promise.all([
		Tasks.deleteMany({_id: {$in: taskIdsToDelete}}),
		Tags.deleteMany({_id: {$in: tagIdsToDelete}}),
		Values.deleteMany({tagId: {$in: tagIdsToDelete}})
	]);
}

async function getTasks(collectionId, host, token, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"}
	if (!collectionId) throw "Field \"collectionId\" should be set";

	const url = `${host}/folder?parentType=collection&parentId=${collectionId}&limit=0`;
	const options = {
		url,
		json: true,
		method: "GET",
		headers: {
			"Girder-Token": token
		}
	};

	let tags = [];
	let values = [];

	const existingTasks = await Tasks.find({userId, checked_out: true});
	let newTasks = await new Promise((resolve, reject) => {
		request(options, async (err, response, body) => {
			if (err) {
				return reject(err);
			}

			const {statusCode} = response;
			if (statusCode !== successStatusCode) {
				const error = new Error("Request Failed.\n" +
					`Status Code: ${statusCode}`);
				return reject(error);
			}
			resolve(body);
		});
	});
		// filter new tasks
	newTasks = newTasks
		.filter(folder => dot.pick("meta.taggerMetadata.task.user._id", folder) === userId
		&& !existingTasks.find(task => task.folderId === folder._id))
		.map((folder) => {
			const task = folder.meta.taggerMetadata.task;

			const taskProps = {
				_id: new ObjectID(),
				folderId: folder._id,
				parentId: folder.parentId,
				baseParentId: folder.baseParentId,
				parentCollection: folder.parentCollection,
				userId: task.user._id
			};

			// parse TAGS to add to DB
			const tasksTags = task.tags.map((tag) => {
				const tagId = new ObjectID();
				tag.taskId = taskProps._id;
				tag._id = tagId;

				// parse VALUES to add to DB
				const tasksValues = Object.keys(tag.values).map((key) => {
					const value = tag.values[key];
					value.name = key;
					value._id = new ObjectID();
					value.tagId = tagId;
					if (value.default) tag.default = value.name;
					return value;
				});
				values = values.concat(tasksValues);

				return tag;
			});
			tags = tags.concat(tasksTags);

			return Object.assign(task, taskProps);
		});

	// delete old unchecked tasks with tags and values
	await deleteUncheckedTasks(userId);

	// insert new unchecked tasks with tags and values
	await Promise.all([
		Tasks.insertMany(newTasks),
		Tags.insertMany(tags),
		Values.insertMany(values)
	]);

	return Tasks.find({userId});
}

async function checkTask(taskId, hostApi, token, userId) {
	const task = await Tasks.findById(taskId);

	// validation
	if (!task) throw "Task not found";
	if (!userId) throw {name: "UnauthorizedError"}

	const promises = [];

	const folder = await folderService.getById(task.folderId);
	if (!folder) {
		promises.push(folderService.getResourceFolders(task.baseParentId, hostApi, token));
	}
	promises.push(imagesService.getResourceImages(task.folderId, hostApi, token, userId, "folder"));

	await Promise.all(promises);

	task.checked_out = true;
	return task.save();
}

module.exports = {
	getTasks,
	checkTask
};
