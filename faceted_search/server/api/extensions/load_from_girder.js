const axios = require("axios");
const serviceData = require("../models/service_data");
const facetImagesModel = require("../models/facet_images");
const updateLocalCache = require("./updateLocalCache");

async function getFoldersByIds({host, ids, token}) {
	const options = {
		headers: {
			"girder-token": token
		}
	};
	if (ids?.length > 0) {
		const promises = [];
		const chunks = splitArray(ids, 50);
		for (const chunkIds of chunks) {
			const query = `{"_id":{"$in":${JSON.stringify(chunkIds.map((id) => ({$oid: id})))}}}`;
			const url = `${host}/folder/query?query=${query}&limit=0&sort=_id&sortdir=1`;
			promises.push(axios.get(url, options).then((response) => response.data));
		}
		const result = await Promise.all(promises);
		return [].concat(...result);
	}
	return [];
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

async function loadImagesFileFromGirderFolder({host, id, token}, folderName) {
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
		// function addResources accept array
		await serviceData.addResources([id]);
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

		const promises = [];
		const chunks = splitArray(existedFolderIds, 50);
		for (const chunkIds of chunks) {
			const urlParams = new URLSearchParams("type=folder&limit=0&sort=_id&sortdir=1");
			const mongoQuery = {
				"folderId": {
					"$in": chunkIds.map((id) => ({$oid: id}))
				}
			};
			urlParams.append("query", JSON.stringify(mongoQuery));
			const url = `${host}/item/query?${urlParams.toString()}`;
			promises.push(axios.get(url, options).then((response) => response.data));
		}
		const result = await Promise.all(promises);
		const images = [].concat(...result);

		const deletedCount = await facetImagesModel.removeImages({host});
		console.log(`Deleted ${deletedCount} images`);
		console.log(`Fetched ${images.length} images`);
		const updatedImages = addParentMetaToImages(images, folders);
		await updateLocalCache();
		return updatedImages;
	} catch (err) {
		console.error(err.response || err);
	}
}

async function getAllowedFolders(host, token) {
	try {
		const url = `${host}/folder`;
		const urlParams = new URLSearchParams("limit=0");
		const options = token
			? {headers: {"girder-token": token}}
			: {headers: {"girder-token": ""}};
		const existedFolderIds = await facetImagesModel.getImagesFolderIds(host);
		const allowedFolders = [];
		const existedFolderIdsCount = existedFolderIds.length;
		const promises = [];
		for(let i = 0; i < existedFolderIdsCount; i++) {
			promises.push(axios.get(`${url}/${existedFolderIds[i]}?${urlParams.toString()}`, options));
		}
		const results = await Promise.allSettled(promises);
		results.forEach((result, i) => {
			if (result.status === "fulfilled") {
				const folder = result.value.data;
				if(folder && folder._id) {
					allowedFolders.push(existedFolderIds[i]);
				} else {
					console.log(`${existedFolderIds[i]} does not fit`);
				}
			}
		});
		return allowedFolders;
	} catch(err) {
		console.error(err.response || err);
	}
}

function splitArray(array, chunkSize) {
	const result = [];
	if (Array.isArray(array)) {
		for (let i = 0; i < array.length; i += chunkSize) {
			const chunk = array.slice(i, i + chunkSize);
			result.push(chunk);
		}
	}
	return result;
}

module.exports = {
	loadImagesFileFromGirderFolder,
	resyncImages,
	getAllowedFolders
};

