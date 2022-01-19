require("../db");
require("../../../utils/polyfills");
const mongoose = require("mongoose");
const Tasks = require("../models/user/tasks");
const Images = require("../models/images");
const Folders = require("../models/folders");

async function getNestedFolderIds(resArr, ids) {
	const childFolders = await Folders.find({parentId: {$in: ids.map(id => mongoose.Types.ObjectId(id))}});
	const childIds = childFolders.map(folder => folder.id);
	resArr = resArr.concat(childIds);
	if (childIds.length) {
		const nestedIds = await getNestedFolderIds(resArr, childIds);
		resArr = resArr.concat(nestedIds).unique();
	}
	return resArr;
}

async function setTaskIdsIntoImages() {
	const tasks = await Tasks.find({});

	console.log("Updating images in process...");

	await Promise.all(tasks.map(async (task) => {
		const nestedFolderIds = await getNestedFolderIds([task.folderId], [task.folderId]);
		const updatedImages = await Images.updateMany(
			{ // filter
				userId: task.userId,
				folderId: {$in: nestedFolderIds},
				taskId: {$exists: false}
			},
			{$set: { // updated fields
				taskId: task._id
			}}
		);
		console.dir({taskName: task.name, taskId: task._id.toString(), updatedCount: updatedImages});
	}));

	console.log("Done!");

	process.exit(0);
}

setTaskIdsIntoImages();
