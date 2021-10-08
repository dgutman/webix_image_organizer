const axios = require("axios");
const facetImagesModel = require("../models/facet_images");

async function getFoldersByIds({host, ids, token}) {
	const query = `{"_id":{"$in":${JSON.stringify(ids.map((id) => ({$oid: id})))}}}`;
	const url = `${host}/folder/query?query=${query}&limit=0&sort=_id&sortdir=1`;

	const options = {
		headers: {
			"girder-token": token
		}
	};

	return axios.get(url, options).then((response) => response.data);
}

function addParentMetaToImages(images, folders) {
	const foldersMetaObject = folders.reduce((obj, folder) => {
		obj[folder._id] = folder.meta || {};
		return obj;
	}, {});

	images = images.map((image) => {
		delete image.provenance;
		const parentMeta = foldersMetaObject[image.folderId] || {};
		image.meta = image.meta || {};
		image.meta.parentMeta = parentMeta;
		return image;
	});
	return images;
}

async function loadImagesFileFromGirder({host, id, token}) {
	const url = `${host}/resource/${id}/items?type=folder&limit=0&sort=_id&sortdir=1`;

	const options = {
		headers: {
			"girder-token": token
		}
	};

	try {
		let images = await axios.get(url, options).then((response) => response.data);
		const imageFolderIds = Array.from(images.reduce((set, image) => set.add(image.folderId), new Set()));
		const folders = await getFoldersByIds({host, ids: imageFolderIds, token});
		images = addParentMetaToImages(images, folders);
		return images;
	} catch(err) {
		console.log(err.response || err);
	}
}

async function resyncImages(host, token) {
	try {
		const existedFolderIds = await facetImagesModel.getImagesFolderIds(host);
		const folders = await getFoldersByIds({host, ids: existedFolderIds, token});

		const options = {
			headers: {
				"girder-token": token
			}
		};

		const urlParams = new URLSearchParams("type=folder&limit=0&sort=_id&sortdir=1");
		const mongoQuery = {
			"folderId": {
				"$in": existedFolderIds.map((id) => ({$oid: id}))
			}
		};
		urlParams.append("query", JSON.stringify(mongoQuery));

	const url = `${host}/item/query?${urlParams.toString()}`;
		const deletedCount = await facetImagesModel.removeImages({host});
		console.log(`Deleted ${deletedCount} images`);
		let images = await axios.get(url, options).then((response) => response.data);
		console.log(`Fetched ${images.length} images`);
		images = addParentMetaToImages(images, folders);
		return images;
	} catch (err) {
		console.error(err.response || err);
	}
}

async function getAllowedFolders(host, token) {
	try {
		const url = `${host}/folder`;
		const options = token
			? {headers: {"girder-token": token}}
			: {headers: {"girder-token": ""}};
		const existedFolderIds = await facetImagesModel.getImagesFolderIds(host);
		const allowedFolders = [];
		const existedFolderIdsCount = existedFolderIds.length;
		for(let i = 0; i < existedFolderIdsCount; i++) {
			const folder = await axios.get(`${url}/${existedFolderIds[i]}`, options)
				.then((response) => {
					return response.data;
				})
				.catch((err) => {
					console.log(err.response || err);
				});
			if(folder && folder._id) {
				allowedFolders.push(existedFolderIds[i]);
			} else {
				console.log(`${existedFolderIds[i]} does not fit`);
			}
		}
		return allowedFolders;
	} catch(err) {
		console.error(err.response || err);
	}
}

module.exports = {
	loadImagesFileFromGirder,
	resyncImages,
	getAllowedFolders
};

