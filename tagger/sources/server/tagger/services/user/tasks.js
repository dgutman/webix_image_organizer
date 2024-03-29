const mongoose = require("mongoose");
const dot = require("dot-object");
const Tasks = require("../../models/user/tasks");
const Tags = require("../../models/user/tags");
const Values = require("../../models/user/values");
const Groups = require("../../models/user/task_groups");
const Images = require("../../models/images");
const Rois = require("../../models/user/rois");
const groupService = require("./task_groups");
const folderService = require("../folders");
const imagesService = require("../images");
const tagsService = require("./tags");
const roisService = require("./rois");
const notificationsService = require("../notifications");
const girderREST = require("../girderServerRequest");

const ajvSchemas = require("../../etc/json-validation-schemas");
const constants = require("../../etc/constants");

const ObjectID = mongoose.mongo.ObjectID;

async function collectTaskData({taskData, userId, imageIds, taskId, groupId, fromPattern, folderImageIds}) {
	let tags = [];
	let values = [];

	let taskUsers = taskData.user || taskData.userId;
	if (taskUsers && !Array.isArray(taskUsers)) {
		taskUsers = [taskUsers];
		taskUsers = taskUsers.filter(user => user).map(user => typeof user === "string" ? user : user._id);
	}
	let taskCreators = taskData.creator || taskData.creatorId;
	if (taskCreators && !Array.isArray(taskCreators)) {
		taskCreators = [taskCreators];
		taskCreators = taskCreators.filter(user => user).map(user => typeof user === "string" ? user : user._id);
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
		taskProps.folderIds = fromPattern ? folderImageIds.flat() : Object.keys(imageIds);
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

async function createTask(taskData, imageIds, selectedImages, userId, hostApi, token) {
	// validation
	if (imageIds.undefined) imageIds = imageIds.undefined;
	const valid = ajvSchemas.validate("task", {task: taskData});

	let fromPattern = taskData.fromPattern;

	if (!valid) throw {message: ajvSchemas.errors};
	if (!userId) throw {name: "UnauthorizedError"};
	let folderImageIds = [];
	if (fromPattern) {
		let mainIdsArr = [];
		selectedImages.forEach(img => mainIdsArr.push(img.folderId || img.mainId));
		folderImageIds.push(mainIdsArr);
	}
	else {
		folderImageIds = Object.values(imageIds);
	}
	const validImageIds = folderImageIds.every(ids => ids.length) && folderImageIds.length;
	if (!validImageIds) throw {name: "ValidationError", message: "Image ids are not specified"};

	const data = await collectTaskData({taskData, userId, imageIds, fromPattern, folderImageIds});
	data.taskData.owner = userId;

	const promisesArr = [
		Tasks.create(data.taskData),
		Tags.insertMany(data.tags),
		Values.insertMany(data.values)
	];

	if (taskData.fromROI && selectedImages) {
		let tags = {};
		data.tags.forEach((tag) => {
			let tagKey = tag.name;
			let valueDefault = [];
			let values = Object.values(tag.values);
			if (values) {
				values.forEach((val) => {
					let defVal = {value: val.name};
					if (val.default) valueDefault.push(defVal);
				});
			}
			tags[tagKey] = valueDefault || "";
		});

		let roiImgs = [];
		selectedImages.forEach((img) => {
			let roiImg = {
				taskId: taskData._id,
				name: img.name,
				mainId: img.mainId,
				imageId: img._id,
				folderId: img.folderId,
				_id: img._id,
				userId,
				left: img.left || 20,
				top: img.top || 20,
				right: img.right || 200,
				bottom: img.bottom || 200,
				meta: {...img.meta, tags},
				boxColor: img.boxColor,
				style: {
					boxLeft: img.boxLeft || 20,
					boxTop: img.boxTop || 20,
					boxWidth: img.boxWidth || 200,
					boxHeight: img.boxLeft || 200
				},
				roi: true,
				apiUrl: img.apiUrl
			};
			roiImgs.push(roiImg);
		});

		promisesArr.push(Rois.create(roiImgs));
	}

	const [task] = await Promise.all(promisesArr);

	const userIDs = data.taskUsers.concat(data.taskCreators).unique();
	await Promise.all(
		data.taskData.folderIds
			.map(id => folderService.giveReadAccessRights(id, userIDs, hostApi, token))
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
		taskToDelete.fromROI === true
			? Rois.deleteMany({taskId: taskToDelete._id})
			: Images.deleteMany({taskId: taskToDelete._id})
	]);

	if (force) {
		const notificationText = `The task "${taskToDelete.name}" has been deleted`;
		const ids = {
			[taskToDelete._id]: taskToDelete.checked_out
		};

		notificationsService.sendNotifications(notificationText, ids, isAdmin);
	}
}

async function editTask(id, taskData, imageIds, userId, hostApi, token) {
	// validation
	const task = await Tasks.findById(id);
	if (!task) throw {name: "ValidationError", message: "Task not found"};
	if (!["created", "published"].includes(task.status)) throw {name: "ValidationError", message: "Task can't be editted"};
	if (!userId) throw {name: "UnauthorizedError"};
	if (taskData.creatorId && userId !== task.owner.toString()) throw {message: "Creators changing is not allowed"};
	if (taskData.creatorId && !taskData.creatorId.includes(task.owner.toString())) throw {name: "AccessError", message: "Can't remove the owner of the task"};
	if (taskData.userId && !taskData.userId.length) throw {message: "At least one user should exist"};
	if (imageIds) {
		const folderImageIds = Object.values(imageIds);
		const validImageIds = folderImageIds.every(ids => ids.length);
		if (!validImageIds) throw {name: "ValidationError", message: "Image ids are not specified"};
	}

	const data = await collectTaskData({
		taskData,
		userId,
		imageIds,
		taskId: task._id,
		groupId: task.groupId
	});

	const oldUsers = [...task.userId, ...task.creatorId];
	const newUsers = [...data.taskUsers || [], ...data.taskCreators || []]
		.filter(newId => oldUsers.find(oldId => oldId.toString() !== newId));

	if (newUsers.length && data.taskData.folderIds) {
		await Promise.all(
			data.taskData.folderIds
				.map(folderId => folderService.giveReadAccessRights(folderId, newUsers, hostApi, token))
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
	if (!userId) throw {name: "UnauthorizedError"};
	const task = await Tasks.findById(id);
	if (!task) throw {message: "Task not found"};
	if (task.status === "canceled" || (status !== "canceled" && !["created", "published"].includes(status))) throw {message: "Task can't be editted"};

	task.status = status;

	return task.save();
}

async function deleteUncheckedTasks(userId, isAdmin, type) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"}

	const taskType = type || "girder";

	const tasksToDeleteQuery = isAdmin ?
		{checked_out: [], type: taskType} : {userId, checked_out: [], type: taskType};

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

	let taskFolders;

	try {
		taskFolders = await girderREST.get(url, {
			headers: {
				"Girder-Token": token
			}
		});
	}
	catch (err) {
		taskFolders = [];
	}

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
			const checkOwner = isAdmin ? true : taskUsers.find(user => typeof user === "string" ? userId === user : userId === user._id);
			return checkOwner && !existingTasks
				.find(task => task.checked_out.length && task.folderId === folder._id);
		});

	newTasks = newTasks.map((folder) => {
		const task = folder.meta.taggerMetadata.task;
		const existedTask = existingTasks
			.find(exTask => exTask.name === task.name && exTask.folderId === folder._id);

		let taskUsers = task.user;
		if (!Array.isArray(taskUsers)) {
			taskUsers = [taskUsers];
		}
		let taskCreators = task.creator || folder.creatorId;
		if (!Array.isArray(taskCreators)) {
			taskCreators = [taskCreators];
		}

		taskUsers = taskUsers.map(user => typeof user === "string" ? user : user._id);
		taskCreators = taskCreators.filter(user => user).map(user => typeof user === "string" ? user : user._id);

		const taskProps = {
			_id: existedTask ? existedTask._id : new ObjectID(),
			folderId: folder._id,
			baseParentId: folder.baseParentId,
			userId: taskUsers,
			groupId: existedTask ? existedTask.groupId : null,
			type: "girder",
			status: "published",
			checked_out: [],
			owner: taskCreators[0]
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
	if (task.fromROI) {
		await roisService.setTagsByTask(images, defaultTagValues);
	}
	else {
		await imagesService.setTagsByTask(images, defaultTagValues);
	}

	task.checked_out.push(userId);
	task.status = "in_progress";
	return task.save();
}


async function getTasksData({collectionId, host, token, userId, isAdmin, groupId, type}) {
	// validation
	if (!isAdmin) throw {name: "UnauthorizedError"};
	if (!collectionId) throw "Field \"collectionId\" should be set";

	if (!groupId && type === "girder") await getNewTasksFromGirder(collectionId, host, token, userId, isAdmin);

	const searchParams = {
		groupId: groupId ? new ObjectID(groupId) : null,
		creatorId: mongoose.Types.ObjectId(userId)
	};

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
				owner: 1,
				fromROI: 1,
				updatedAt: 1,
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
				owner: 1,
				count: 1,
				fromROI: 1,
				updatedAt: 1,
				groupId: 1,
				_modelType: 1
			}
		},
		{$sort: {userId: 1, name: 1, _id: 1}}
	];
	return Tasks.aggregate(aggregatePipeline);
}

async function getTaskResults(taskId, isAdmin, fromROI) {
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

	let result = fromROI ? Rois.aggregate(aggregatePipeline) : Images.aggregate(aggregatePipeline);
	return result;
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
	const fromROI = task.fromROI || false;

	const options = {
		headers: {
			"Girder-Token": token
		}
	};
	const imagePromises = [];
	// copy imagesId;
	const imageIdsArray = [...task.imageIds];
	let objROI = [];
	let imagesROI;
	if (fromROI) {
		imagesROI = await Rois.find({taskId: mongoose.Types.ObjectId(taskId), userId});
		imagesROI.forEach(img => imagePromises.push(girderREST.get(img.apiUrl, options)));
		objROI = imagesROI.map(img => img.toObject());
	}
	else {
		while (imageIdsArray.length > 0) {
			const imageArr = imageIdsArray.splice(0, 50);
			const query = imageArr.map(id => ({$oid: id.toString()}));
			const url = encodeURI(`${hostApi}/item/query?query={"_id": {"$in": ${JSON.stringify(query)}}}&limit=50&offset=0`);
			imagePromises.push(girderREST.get(url, options));
		}
	}

	const imgs = fromROI ? objROI : await Promise.all(imagePromises);
	const images = fromROI ? objROI : imgs.reduce((prev, curr) => {
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

async function getFinishedTasks() {
	const finishedTasksPipeline = [{
		$match: {
			status: constants.TASK_STATUS_FINISHED
		}
	}, {
		$project: {
			_id: 1,
			name: 1,
			userId: 1,
			groupId: 1,
			fromROI: 1
		}
	}];
	const finishedTasks = await Tasks.aggregate(finishedTasksPipeline);
	return finishedTasks;
}

async function getResultsPerTask(host, token) {
	const url = `${host}/user?limit=0&sort=lastName&sortdir=1`;
	const usersInfo = await girderREST.get(url, {
		headers: {
			"Girder-Token": token
		}
	});
	const groupIds = [];
	const finishedTasks = await getFinishedTasks();
	finishedTasks.forEach((task) => {
		if (!groupIds.includes(task.groupId)) {
			groupIds.push(task.groupId);
		}
	});
	const groupAggregatePipeline = [
		{$match: {_id: {$in: groupIds}}},
		{$project: {
			_id: 1,
			name: 1
		}}
	];
	const groups = await Groups.aggregate(groupAggregatePipeline);
	groups.push({name: "No group tasks"});
	const result = await Promise.all(groups.map(async (group) => {
		group.tasks = [];
		const tasksOfGroup = finishedTasks.filter((task) => {
			if (group._id?.equals(task.groupId)) {
				return true;
			}
			else if (!task.groupId && group.name === "No group tasks") {
				return true;
			}
			return false;
		});
		const tasks = await Promise.all(tasksOfGroup.map(async (task) => {
			const fromROI = task.fromROI;
			const imagesAggregatePipeline = [
				{$match: {
					taskId: task._id
				}},
				{$project: {
					_id: 1,
					name: 1,
					mainId: 1,
					tags: {$objectToArray: "$meta.tags"}
				}},
				{$project: {
					_id: 1,
					name: 1,
					mainId: 1,
					tags: {$map: {input: "$tags", as: "kv", in: {k: "$$kv.k", v: "$$kv.v.value"}}}
				}},
				{$group: {
					_id: {
						mainId: "$mainId",
						name: "$name"
					},
					reviewedImages: {
						$push: {
							_id: "$_id",
							tags: "$tags"
						}
					}
				}},
				{$project: {
					_id: "$_id.mainId",
					name: "$_id.name",
					reviewedImages: 1
				}}
			];
			let taskImages;
			if (fromROI) {
				taskImages = await Rois.aggregate(imagesAggregatePipeline);
			}
			else {
				taskImages = await Images.aggregate(imagesAggregatePipeline);
			}
			const images = await Promise.all(taskImages.map(async (image) => {
				const tagsAggregatePipeline = [
					{$match: {taskId: task._id}},
					{$project: {
						_id: 1,
						name: 1
					}}
				];
				const tags = await Tags.aggregate(tagsAggregatePipeline);
				const imageTags = image.reviewedImages.reduce((prev, curr) => {
					prev.push(...curr.tags);
					return prev;
				}, []);
				const newTags = await Promise.all(tags.map(async (tag) => {
					const currentImageTags = imageTags.filter(imageTag => imageTag.k === tag.name);
					const tagValues = currentImageTags.reduce((prev, curr) => {
						prev.push(...curr.v);
						return prev;
					}, []);
					const valuesAggregatePipeline = [
						{
							$match: {
								tagId: tag._id,
								name: {
									$in: tagValues
								}
							}
						},
						{
							$project: {
								_id: 1,
								name: 1,
								tagId: 1
							}
						},
						{
							$lookup: {
								from: "users_tags",
								localField: "tagId",
								foreignField: "_id",
								as: "tags"
							}
						},
						{
							$unwind: "$tags"
						},
						{
							$lookup: {
								from: "images",
								localField: "tags.taskId",
								foreignField: "taskId",
								as: "images"
							}
						},
						{
							$unwind: "$images"
						},
						{
							$project: {
								_id: 1,
								name: 1,
								tagId: 1,
								imageId: "$images._id",
								mainId: "$images.mainId",
								userId: "$images.userId"
							}
						},
						{
							$group: {
								_id: {
									id: "$_id",
									name: "$name",
									mainId: "$mainId"
								},
								users: {
									$push: {
										userId: "$userId"
									}
								}
							}
						},
						{
							$project: {
								_id: "$_id.id",
								name: "$_id.name",
								users: "$users"
							}
						}
					];
					const values = await Values.aggregate(valuesAggregatePipeline);
					values.forEach((value) => {
						value.users.forEach((user) => {
							const userInfo = usersInfo.find(
								currentUserInfo => currentUserInfo._id === user.userId.toString()
							);
							user.firstName = userInfo.firstName;
							user.lastName = userInfo.lastName;
						});
						value.usersCount = value.users.length;
					});
					tag.values = values;
					return tag;
				}));
				image.tags = newTags;
				delete image.reviewedImages;
				return image;
			}));
			task.images = images;
			delete task.userId;
			delete task.groupId;
			delete task.fromROI;
			return task;
		}));
		group.tasks.push(...tasks);
		return group;
	}));
	return result;
}

// TODO: find a way not to duplicate the code
async function getResultsPerUser(host, token) {
	const url = `${host}/user?limit=0&sort=lastName&sortdir=1`;
	const usersInfo = await girderREST.get(url, {
		headers: {
			"Girder-Token": token
		}
	});
	const groupIds = [];
	const finishedTasks = await getFinishedTasks();
	finishedTasks.forEach((task) => {
		if (!groupIds.includes(task.groupId)) {
			groupIds.push(task.groupId);
		}
	});
	const groupAggregatePipeline = [
		{$match: {_id: {$in: groupIds}}},
		{$project: {
			_id: 1,
			name: 1
		}}
	];
	const groups = await Groups.aggregate(groupAggregatePipeline);
	groups.push({name: "No group tasks"});
	const result = await Promise.all(groups.map(async (group) => {
		group.tasks = [];
		const tasksOfGroup = finishedTasks.filter((task) => {
			if (group._id?.equals(task.groupId)) {
				return true;
			}
			else if (!task.groupId && group.name === "No group tasks") {
				return true;
			}
			return false;
		});
		const tasks = await Promise.all(tasksOfGroup.map(async (task) => {
			const fromROI = task.fromROI;
			const users = await Promise.all(task.userId.map(async (id) => {
				const user = {_id: id};
				user.name = usersInfo.find(userInfo => userInfo._id === id.toString())?.login;
				const imagesAggregatePipeline = [
					{$match: {
						userId: id.toString(),
						taskId: task._id
					}},
					{$project: {
						_id: 1,
						name: 1,
						tags: {$objectToArray: "$meta.tags"}
					}},
					{$project: {
						_id: 1,
						name: 1,
						tags: {$map: {input: "$tags", as: "kv", in: {k: "$$kv.k", v: "$$kv.v.value"}}}
					}}
				];
				let taskImages;
				if (fromROI) {
					taskImages = await Rois.aggregate(imagesAggregatePipeline);
				}
				else {
					taskImages = await Images.aggregate(imagesAggregatePipeline);
				}
				const images = await Promise.all(taskImages.map(async (image) => {
					const tagsAggregatePipeline = [
						{$match: {taskId: task._id}},
						{$project: {
							_id: 1,
							name: 1
						}}
					];
					const tags = await Tags.aggregate(tagsAggregatePipeline);
					const newTags = await Promise.all(tags.map(async (tag) => {
						const currentImageTagIndex = image.tags.findIndex(imageTag => imageTag.k === tag.name);
						const valuesAggregatePipeline = [
							{$match: {
								tagId: tag._id,
								name: {$in: image.tags[currentImageTagIndex].v}
							}},
							{$project: {
								_id: 1,
								name: 1
							}}
						];
						const values = await Values.aggregate(valuesAggregatePipeline);
						tag.values = values;
						return tag;
					}));
					image.tags = newTags;
					return image;
				}));
				user.images = images;
				delete image.reviewedImages;
				return user;
			}));
			task.users = users;
			delete task.userId;
			delete task.groupId;
			delete task.fromROI;
			return task;
		}));
		group.tasks.push(...tasks);
		return group;
	}));

	return result;
}

module.exports = {
	getTasks,
	checkTask,
	getTasksData,
	groupTasks,
	createTask,
	deleteTask,
	editTask,
	getTaskJSON,
	getTaskResults,
	changeTaskStatus,
	getResultsPerTask,
	getResultsPerUser
};
