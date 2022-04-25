const mongoose = require("mongoose");
const dot = require("dot-object");
const Tasks = require("../../models/user/tasks");
const Tags = require("../../models/user/tags");
const Values = require("../../models/user/values");
const Groups = require("../../models/user/task_groups");
const Images = require("../../models/images");
const groupService = require("./task_groups");
const folderService = require("../folders");
const imagesService = require("../images");
const tagsService = require("./tags");
const girderREST = require("../girderServerRequest");

const ajvSchemas = require("../../etc/json-validation-schemas");

const ObjectID = mongoose.mongo.ObjectID;

async function collectTaskData({taskData, userId, imageIds, taskId, groupId}) {
	let tags = [];
	let values = [];

	let taskUsers = taskData.user || taskData.userId;
	if (taskUsers && !Array.isArray(taskUsers)) {
		taskUsers = [taskUsers];
		taskUsers = taskUsers.map(user => (typeof user === "string" ? user : user._id));
	}
	let taskCreators = taskData.creator || taskData.creatorId;
	if (taskCreators && !Array.isArray(taskCreators)) {
		taskCreators = [taskCreators];
		taskCreators = taskCreators.filter(user => user).map(user => (typeof user === "string" ? user : user._id));
	}

	if (taskData.group) {
		let group = await groupService.getGroupByName(taskData.group, userId)
			|| await groupService.createGroup(taskData.group, userId);
		groupId = group._id;
	}

	const taskProps = {
		_id: taskId || new ObjectID(),
		groupId,
		status: taskData.status || "created",
		checked_out: []
	};

	if (taskUsers) taskProps.userId = taskUsers;
	if (taskCreators) taskProps.creatorId = taskCreators;
	if (imageIds) {
		taskProps.imageIds = Object.values(imageIds).flat();
		taskProps.folderIds = Object.keys(imageIds);
	}

	if (taskData.tags) {
		const tagTemplates = [];
		const tasksTags = taskData.tags.map((tag) => {
			const tagId = new ObjectID();
			tag.taskId = taskProps._id;
			tag._id = tagId;
			if (tag.template) {
				tagTemplates.push(tag);
			}

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
		await tagsService.createTagTemplates(tagTemplates);
	}

	// parse TAGS to add to DB
	Object.assign(taskData, taskProps);

	return {taskData, tags, values, taskUsers, taskCreators};
}

async function createTask(taskData, imageIds, userId, hostApi, token) {
	// validation
	const valid = ajvSchemas.validate("task", {task: taskData});
	if (!valid) throw {name: "ValidationError", message: ajvSchemas.errors};
	if (!userId) throw {name: "UnauthorizedError"};
	const folderImageIds = Object.values(imageIds);
	const validImageIds = folderImageIds.every(ids => ids.length) && folderImageIds.length;
	if (!validImageIds) throw {name: "ValidationError", message: "Image ids are not specified"};

	const data = await collectTaskData({taskData, userId, imageIds});

	const [task] = await Promise.all([
		Tasks.create(data.taskData),
		Tags.insertMany(data.tags),
		Values.insertMany(data.values)
	]);

	const userIDs = data.taskUsers.concat(data.taskCreators).unique();
	await Promise.all(
		data.taskData.folderIds.map(id => folderService.giveReadAccessRightsToUsers(id, userIDs, hostApi, token))
	);

	return task;
}

async function deleteTask(id, userId, isAdmin, force) {
	// validation
	if (!isAdmin) throw {name: "UnauthorizedError"}
	const taskToDelete = await Tasks.findById(id);
	if (!force && taskToDelete.checked_out.length) throw {name: "ValidationError", message: "Cannot delete checked out task"};

	const tagsToDelete = await Tags.find({taskId: mongoose.Types.ObjectId(id)});
	const tagIdsToDelete = tagsToDelete.map(tag => tag._id);

	await Promise.all([
		Tasks.deleteMany({_id: taskToDelete._id}),
		Tags.deleteMany({_id: {$in: tagIdsToDelete}}),
		Values.deleteMany({tagId: {$in: tagIdsToDelete}}),
		Images.deleteMany({taskId: taskToDelete._id})
	]);
}

async function editTask(id, taskData, imageIds, userId, hostApi, token) {
	// validation
	const task = await Tasks.findById(id);
	if (!task) throw {name: "ValidationError", message: "Task not found"};
	if (!["created", "published"].includes(task.status)) throw {name: "ValidationError", message: "Task can't be editted"};
	if (!userId) throw {name: "UnauthorizedError"};
	if (imageIds) {
		const folderImageIds = Object.values(imageIds);
		const validImageIds = folderImageIds.every(ids => ids.length);
		if (!validImageIds) throw {name: "ValidationError", message: "Image ids are not specified"};
	}

	const data = await collectTaskData({taskData, userId, imageIds, taskId: task._id, groupId: task.groupId});

	const oldUsers = [...task.userId, ...task.creatorId];
	const newUsers = [...data.taskUsers || [], ...data.taskCreators || []]
		.filter(newId => oldUsers.find(oldId => oldId.toString() !== newId));

	if (newUsers.length && data.taskData.folderIds) {
		await Promise.all(
			data.taskData.folderIds.map(folderId => folderService.giveReadAccessRightsToUsers(folderId, newUsers, hostApi, token))
		);
	}
	if (data.tags.length) {
		const tagsToDelete = await Tags.find({taskId: task._id});
		const tagIdsToDelete = tagsToDelete.map(tag => tag._id);
		await Promise.all([
			Tags.deleteMany({_id: {$in: tagIdsToDelete}}),
			Values.deleteMany({tagId: {$in: tagIdsToDelete}})
		]);
		await Promise.all([
			Tags.insertMany(data.tags),
			Values.insertMany(data.values)
		]);
	}

	Object.assign(task, data.taskData);
	return task.save();
}

async function changeTaskStatus(id, status, userId) {
	// validation
	if (!userId) generateError({name: "UnauthorizedError"});
	const task = await Tasks.findById(id);
	if (!task) generateError({message: "Task not found"});
	if (task.status === "canceled" || (status !== "canceled" && !["created", "published"].includes(status))) generateError({message: "Task can't be editted"});

	task.status = status;

	return task.save();
}

async function deleteUncheckedTasks(userId, isAdmin) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"}

	const tasksToDeleteQuery = isAdmin ? {checked_out: [], type: "girder"} : {userId, checked_out: [], type: "girder"};
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

async function getNewTasksFromGirder(collectionId, host, token, userId, isAdmin) {
	// validation
	if (!collectionId) throw "Field \"collectionId\" should be set";

	const url = `${host}/folder/query?query={"baseParentId": {"$oid": "${collectionId}"}}&limit=0`;

	let tags = [];
	let values = [];

	const existingTasksQuery = isAdmin ? {} : {userId: mongoose.Types.ObjectId(userId)};
	const existingTasks = await Tasks.find(existingTasksQuery);
	let taskFolders = await girderREST.get(url, {
		headers: {
			"Girder-Token": token
		}
	});

	// taskFolders.unshift(testData);

	// filter new tasks
	let newTasks = taskFolders
		.filter((folder) => {
			const taggerMetadata = dot.pick("meta.taggerMetadata", folder) || {};
			const valid = ajvSchemas.validate("task", taggerMetadata);
			if (!valid) {
				return false;
			}
			const taskData = taggerMetadata.task;

			let taskUsers = dot.pick("user", taskData || {});
			if (!Array.isArray(taskData.user)) {
				taskUsers = [taskUsers];
			}
			const checkOwner = isAdmin ? true : taskUsers.find(user => (typeof user === "string" ? userId === user : userId === user._id));
			return checkOwner && !existingTasks.find(task => (task.checked_out.length && task.folderId === folder._id));
		})
		.map((folder) => {
			const task = folder.meta.taggerMetadata.task;
			const existedTask = existingTasks.find(exTask => exTask.name === task.name && exTask.folderId === folder._id);

			let taskUsers = task.user;
			if (!Array.isArray(taskUsers)) {
				taskUsers = [taskUsers];
			}
			let taskCreators = task.creator || folder.creatorId;
			if (!Array.isArray(taskCreators)) {
				taskCreators = [taskCreators];
			}

			taskUsers = taskUsers.map(user => (typeof user === "string" ? user : user._id));
			taskCreators = taskCreators.filter(user => user).map(user => (typeof user === "string" ? user : user._id));

			const taskProps = {
				_id: existedTask ? existedTask._id : new ObjectID(),
				folderId: folder._id,
				baseParentId: folder.baseParentId,
				userId: taskUsers,
				groupId: existedTask ? existedTask.groupId : null,
				type: "girder",
				status: "published",
				checked_out: []
			};

			if (taskCreators.length) taskProps.creatorId = taskCreators;

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

	await getNewTasksFromGirder(collectionId, host, token, userId);
	return Tasks.aggregate([
		{$match: {userId: mongoose.Types.ObjectId(userId), status: {$nin: ["canceled", "created"]}}},
		{
			$set: {
				checked_out: {
					$in: [mongoose.Types.ObjectId(userId), "$checked_out"]
				}
			}
		}
	]);
}

async function checkTask(taskId, hostApi, token, userId) {
	const task = await Tasks.findById(taskId);

	// validation
	if (!task) throw "Task not found";
	if (task.checked_out.find(id => id.toString() === userId)) throw `The task ${taskId} has already loaded`;
	if (!userId) throw {name: "UnauthorizedError"};
	if (task.status === "canceled") throw `The task ${taskId} has canceled`;

	let images = [];

	if (task.type === "girder") {
		let folder = await folderService.getById(task.folderId);
		if (!folder) {
			folder = await folderService.getResourceFolderById(task.folderId, hostApi, token);
		}
		images = await imagesService.getResourceImages({
			collectionId: task.folderId,
			hostApi,
			token,
			userId,
			type: "folder",
			taskId,
			nested: !folder.isVirtual
		});
	}
	else if (task.type === "default") {
		images = await imagesService.getDefaultTaskImages({
			taskId,
			hostApi,
			token,
			userId,
			imageIds: task.imageIds
		});
	}

	const defaultTagValues = await Tags.collectDefaultValues(taskId);
	await imagesService.setTagsByTask(images, defaultTagValues);

	task.checked_out.push(userId);
	task.status = "in_progress";
	return task.save();
}


async function getTasksData({collectionId, host, token, userId, isAdmin, groupId, type}) {
	// validation
	if (!isAdmin) throw {name: "UnauthorizedError"};
	if (!collectionId) throw "Field \"collectionId\" should be set";

	if (!groupId && type !== "girder") await getNewTasksFromGirder(collectionId, host, token, userId, isAdmin);

	const searchParams = {groupId: groupId ? new ObjectID(groupId) : null};
	if (type) searchParams.type = type;

	const aggregatePipeline = [
		{$match: searchParams},
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
				checked_out: {$size: "$checked_out"},
				userId: 1,
				deadline: 1,
				status: 1,
				created: 1,
				creatorId: 1,
				latest: {$max: "$images.updatedDate"},
				groupId: 1,
				_modelType: 1,
				count: {
					$divide: [{$size: "$images"}, {$max: [{$size: "$checked_out"}, 1]}]
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
				status: 1,
				created: 1,
				creatorId: 1,
				latest: 1,
				count: 1,
				groupId: 1,
				_modelType: 1
			}
		},
		{$sort: {userId: 1, name: 1, _id: 1}}
	];
	return Tasks.aggregate(aggregatePipeline);
}

async function getTaskResults(taskId, isAdmin) {
	// validation
	if (!isAdmin) throw {name: "UnauthorizedError"};

	const aggregatePipeline = [
		{$match: {taskId: mongoose.Types.ObjectId(taskId), isReviewed: true}},
		{$project: {
			_id: 1,
			tags: {$objectToArray: "$meta.tags"},
			userId: 1
		}},
		{$project: {
			_id: 1,
			tags: {$map: {input: "$tags", as: "kv", in: {k: "$$kv.k", v: "$$kv.v.value"}}},
			userId: 1
		}},
		{$group: {_id: "$userId", reviewed: {$sum: 1}, items: {$addToSet: "$$ROOT"}}},
		{$unwind: "$items"},
		{$unwind: "$items.tags"},
		{$unwind: "$items.tags.v"},
		{$group: {_id: {user: "$_id", tag: "$items.tags.k", value: "$items.tags.v"}, count: {$sum: 1}, reviewed: {$first: "$reviewed"}}},
		{$group: {_id: {user: "$_id.user", tag: "$_id.tag"}, values: {$push: {value: "$_id.value", count: "$count"}}, reviewed: {$first: "$reviewed"}}},
		{$group: {_id: "$_id.user", reviewed: {$first: "$reviewed"}, tags: {$push: {name: "$_id.tag", values: "$values"}}}}
	];

	return Images.aggregate(aggregatePipeline);
}

async function groupTasks(ids, groupId, isAdmin) {
	const group = await Groups.findById(groupId);

	if (!isAdmin) throw {name: "UnauthorizedError"};
	if (groupId && !group) throw {name: "ValidationError", message: "Group not found"};

	await Tasks.updateMany({_id: {$in: ids.map(id => new ObjectID(id))}}, {$set: {groupId}});
	return Tasks.find({_id: {$in: ids.map(id => new ObjectID(id))}});
}

async function getTaskJSON({taskId, userId, isAdmin, hostApi, token}) {
	let task = await Tasks.findById(taskId);

	// validation
	if (!task) throw "Task not found";
	if (!isAdmin) throw {name: "UnauthorizedError"};

	task = task.toObject();

	const options = {
		headers: {
			"Girder-Token": token
		}
	};

	const imagePromises = [];
	// copy imagesId;
	const imageIdsArray = [...task.imageIds];
	while (imageIdsArray.length > 0) {
		const imageArr = imageIdsArray.splice(0, 50);
		const query = imageArr.map(id => ({$oid: id.toString()}));
		const url = encodeURI(`${hostApi}/item/query?query={"_id": {"$in": ${JSON.stringify(query)}}}&limit=50&offset=0`);
		imagePromises.push(girderREST.get(url, options));
	}
	const imgs = await Promise.all(imagePromises);
	const images = imgs.reduce((prev, curr) => {
		if (curr) {
			prev.push(...curr);
		}
		return prev;
	}, []);

	const promises = [
		tagsService.getTagsWithValuesByTask(taskId, userId)
	];
	const fieldsToRemove = ["checked_out", "created", "updatedAt", "_modelType", "__v", "creatorId", "userId", "folderIds", "imageIds", "status", "type"];
	
	if (task.groupId) promises.push(Groups.findById(task.groupId));

	const [tags, group] = await Promise.all(promises);

	if (group) task.group = group.name;

	task.tags = tags.map((tag) => {
		delete tag._id;
		delete tag.taskId;
		delete tag.__v;

		tag.values = tag.values.map((config) => {
			delete config.__v;
			delete config.tagId;
			delete config._id;
			return config;
		});
		return tag;
	});

	task.user = task.userId;
	task.creator = task.creatorId;

	fieldsToRemove.forEach((field) => {
		delete task[field];
	});


	return {images, task};
}

module.exports = {
	getTasks,
	checkTask,
	getTasksData,
	groupTasks,
	createTask,
	deleteTask,
	editTask,
	changeTaskStatus,
	getTaskJSON,
	getTaskResults
};
