const request = require("request");
const Folders = require("../models/folders");
const mongoose = require("mongoose");

const successStatusCode = 200;

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
	return Folders.find({_id: id});
}

async function getNestedFolderIds(resArr, ids) {
	await Promise.all(ids.map(async (id) => {
		const nestedIds = await getIdByParentId(id);
		if (nestedIds.length) {
			resArr = resArr.concat(nestedIds);
			await getNestedFolderIds(resArr, nestedIds);
		}
		return Promise.resolve(resArr);
	}));
	return resArr;
}

function getMainFolderRootPath(id, host, token) {
	const url = `${host}/folder/${id}/rootpath`;
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
				reject(err);
			}

			const {statusCode} = response;
			if (statusCode !== successStatusCode) {
				const error = new Error("Request Failed.\n" +
					`Status Code: ${statusCode}`);
				return reject(error);
			}

			const folders = body
				.filter(folder => folder.type === "folder")
				.map(folder => folder.object);
			const folderIds = folders.map(folder => folder._id);
			if (folderIds) {
				await Folders.deleteMany({_id: {$in: folderIds}});
			}
			const createdFolders = await Folders.insertMany(folders);
			resolve(createdFolders);
		});
	});
}

async function getResourceFolders(collectionId, host, token, userId, type) {
	const property = type === "collection" ? "baseParentId" : "parentId";
	const url = `${host}/resource/mongo_search?type=folder&q={"${property}": {"$oid": "${collectionId}"}}`;
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
				reject(err);
			}

			const {statusCode} = response;
			if (statusCode !== successStatusCode) {
				const error = new Error("Request Failed.\n" +
					`Status Code: ${statusCode}`);
				return reject(error);
			}

			if (type === "folder") {
				const folderIds = await getNestedFolderIds([collectionId], [collectionId]);
				await Folders.deleteMany({parentId: {$in: folderIds}});
				await getMainFolderRootPath(collectionId, host, token);
			}
			else {
				await Folders.deleteMany({parentId: collectionId});
			}

			const createdFolders = await Folders.insertMany(body);
			resolve({data: createdFolders});
		});
	});
}

module.exports = {
	create,
	getIdByParentId,
	getResourceFolders,
	getNestedFolderIds,
	getById
};
