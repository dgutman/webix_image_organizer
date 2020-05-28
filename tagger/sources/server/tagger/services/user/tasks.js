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

async function deleteUncheckedTasks(userId, isAdmin) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"}

	const tasksToDeleteQuery = isAdmin ? {checked_out: false} : {userId, checked_out: false};
	const tasksToDelete = await Tasks.find(tasksToDeleteQuery);
	const taskIdsToDelete = tasksToDelete.map(task => task._id);
	const tagsToDelete = await Tags.find({taskId: {$in: taskIdsToDelete}});
	const tagIdsToDelete = tagsToDelete.map(tag => tag._id);

	await Promise.all([
		Tasks.deleteMany({_id: {$in: taskIdsToDelete}}),
		Tags.deleteMany({_id: {$in: tagIdsToDelete}}),
		Values.deleteMany({tagId: {$in: tagIdsToDelete}})
	]);
}

async function getNewTasksFromGirger(collectionId, host, token, userId, isAdmin) {
	// validation
	if (!collectionId) throw "Field \"collectionId\" should be set";

	const url = `${host}/folder/query?query={"baseParentId": {"$oid": "${collectionId}"}}&limit=0`;
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

	const existingTasksQuery = isAdmin ? {} : {userId};
	const existingTasks = await Tasks.find(existingTasksQuery);
	let newTasks = await new Promise((resolve, reject) => {
		request(options, async (err, response, body) => {
			if (err) {
				return reject(err);
			}

			const {statusCode} = response;
			if (statusCode !== successStatusCode) {
				const errorMessage = body && body.message ? `with message: ${body.message}` : "&lt;none&gt;";
				const error = new Error(
					`Request to ${url} failed\n
					${errorMessage}\n
					Status Code: ${statusCode}`
				);
				return reject(error);
			}
			resolve(body);
		});
	});
	// filter new tasks
	newTasks = newTasks
		.filter((folder) => {
			const taskData = dot.pick("meta.taggerMetadata.task", folder);
			const taskUserId = dot.pick("user._id", taskData || {});
			const checkOwner = isAdmin ? true : taskUserId === userId;
			return taskData && checkOwner && !existingTasks.find(task => (task.checked_out && task.folderId === folder._id));
		})
		.map((folder) => {
			const task = folder.meta.taggerMetadata.task;
			const existedTask = existingTasks.find(exTask => exTask.name === task.name && exTask.folderId === folder._id);

			const taskProps = {
				_id: existedTask ? existedTask._id : new ObjectID(),
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
	await deleteUncheckedTasks(userId, isAdmin);

	// insert new unchecked tasks with tags and values
	return Promise.all([
		Tasks.insertMany(newTasks),
		Tags.insertMany(tags),
		Values.insertMany(values)
	]);
}

async function getTasks(collectionId, host, token, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"}
	if (!collectionId) throw "Field \"collectionId\" should be set";

	await getNewTasksFromGirger(collectionId, host, token, userId);
	return Tasks.find({userId});
}

async function checkTask(taskId, hostApi, token, userId) {
	const task = await Tasks.findById(taskId);

	// validation
	if (!task) throw "Task not found";
	if (task.checked_out) throw `The task ${taskId} has already loaded`;
	if (!userId) throw {name: "UnauthorizedError"}

	const promises = [];

	const folder = await folderService.getById(task.folderId);
	if (!folder) {
		promises.push(folderService.getResourceFolders(task.baseParentId, hostApi, token));
	}
	promises.push(imagesService.getResourceImages(task.folderId, hostApi, token, userId, "folder", taskId)
		.then(async (images) => {
			const defaultTagValues = await Tags.collectDefaultValues(taskId);
			return imagesService.setTagsByTask(images, defaultTagValues);
		}));

	await Promise.all(promises);

	task.checked_out = true;
	return task.save();
}

async function getUsersFromGirger(host, token, userId, isAdmin) {
	// validation
	if (!userId || !isAdmin) throw {name: "UnauthorizedError"};

	const url = `${host}/user?limit=0&sort=lastName`;
	const options = {
		url,
		json: true,
		method: "GET",
		headers: {
			"Girder-Token": token
		}
	};

	return new Promise((resolve, reject) => {
		request(options, async (err, response, body) => {
			if (err) {
				return reject(err);
			}

			const {statusCode} = response;
			if (statusCode !== successStatusCode) {
				const errorMessage = body && body.message ? `with message: ${body.message}` : "&lt;none&gt;";
				const error = new Error(
					`Request to ${url} failed\n
					${errorMessage}\n
					Status Code: ${statusCode}`
				);
				return reject(error);
			}
			resolve(body);
		});
	});
}

async function getTasksData(collectionId, host, token, userId, isAdmin) {
	// validation
	if (!userId || !isAdmin) throw {name: "UnauthorizedError"};
	if (!collectionId) throw "Field \"collectionId\" should be set";

	const [, users] = await Promise.all([
		getNewTasksFromGirger(collectionId, host, token, userId, isAdmin),
		getUsersFromGirger(host, token, userId, isAdmin)
	]);

	const aggregatePipeline = [
		{$match: {}},
		{
			$lookup: {
				from: "images",
				localField: "_id",
				foreignField: "taskId",
				as: "images"
			}
		},
		{
			$project: {
				_id: 1,
				name: 1,
				checked_out: 1,
				userId: 1,
				deadline: 1,
				latest: {$max: "$images.updatedDate"},
				count: {
					$size: "$images"
				},
				reviewed: {
					$filter: {
						input: "$images",
						as: "item",
						cond: {$eq: ["$$item.isReviewed", true]}
					}
				}
			}
		},
		{
			$project: {
				_id: 1,
				name: 1,
				checked_out: 1,
				userId: 1,
				deadline: 1,
				latest: 1,
				count: 1,
				reviewed: {
					$size: "$reviewed"
				}
			}
		},
		{$sort: {checked_out: -1, userId: 1, name: 1, _id: 1}}
	];

	const tasks = await Tasks.aggregate(aggregatePipeline);

	return tasks.map((task) => {
		const taskUser = users.find(user => user._id === task.userId.toString());
		task.userName = taskUser ? `${taskUser.firstName || ""} ${taskUser.lastName || ""}` : "unreachable";
		return task;
	});
}

module.exports = {
	getTasks,
	checkTask,
	getTasksData
};
