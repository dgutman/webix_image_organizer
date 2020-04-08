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

			try {
				await Folders.deleteMany({baseParentId: resourceId});
				body.map((folder) => {
					folder.baseParentId = resourceId;
					return folder;
				});
				await Folders.insertMany(body);
			}
			catch (error) {
				return reject(error);
			}

			resolve({message: "Folders received"});
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
