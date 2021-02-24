const Folders = require("../models/folders");
const mongoose = require("mongoose");
const girderREST = require("./girderServerRequest");

async function create({name, parentId, parentCollection, _id}) {
	const id = mongoose.Types.ObjectId(_id);
	const newFolder = new Folders({name, parentId, parentCollection, _id: id});
	return newFolder.save();
}

async function getIdByParentId(id) {
	const folders = await Folders.find({parentId: {$eq: id}});
	return folders.map(folder => folder.id);
}

function getById(id) {
	return Folders.findById(id);
}

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

async function getResourceFolders(resourceId, host, token) {
	const url = `${host}/folder/query?query={"baseParentId": {"$oid": "${resourceId}"}}&limit=0`;
	return girderREST.get(url, {
		headers: {
			"Girder-Token": token
		}
	}).then(async (data) => {
		await Folders.deleteMany({baseParentId: resourceId});
		data.map((folder) => {
			folder.baseParentId = resourceId;
			return folder;
		});
		return Folders.insertMany(data);
	});
}

async function getResourceFolderById(folderId, host, token) {
	const url = `${host}/folder/${folderId}`;
	return girderREST.get(url, {
		headers: {
			"Girder-Token": token
		}
	});
}

async function giveReadAccessRightsToUsers(folderId, userIds, host, token) {
	const getURL = `${host}/folder/${folderId}/access`;
	const options = {
		headers: {
			"Girder-Token": token
		}
	};
	const accessObj = await girderREST.get(getURL, options);

	const users = accessObj.users;
	userIds
		.filter(id => users.every(user => user.id !== id))
		.forEach((id) => {
			accessObj.users.push({
				id,
				level: 1
			});
		});
	return girderREST.put(`${host}/folder/${folderId}/access?access=${JSON.stringify(accessObj)}`, options);
}

module.exports = {
	create,
	getIdByParentId,
	getResourceFolders,
	getNestedFolderIds,
	getById,
	getResourceFolderById,
	giveReadAccessRightsToUsers
};
