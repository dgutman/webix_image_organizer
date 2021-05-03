const axios = require("axios");
const serviceData = require('../models/service_data');

async function getFoldersByIds({host, ids, token}) {
	const query = `{"_id":{"$in":${JSON.stringify(ids.map(id => ({$oid: id})))}}}`;
	const url = `${host}/folder/query?query=${query}&limit=0&sort=_id&sortdir=1`;

	const options = {
		headers: {
			"girder-token": token
		}
	};

	return axios.get(url, options).then((response) => response.data);
}

async function loadImagesFileFromGirder({host, id, token}) {
	const url = `${host}/resource/${id}/items?type=folder&limit=0&sort=_id&sortdir=1`;

	const options = {
		headers: {
			"girder-token": token
		}
	};

	try {
		let images = await axios.get(url, options).then(response => response.data);
		const imageFolderIds = Array.from(images.reduce((set, image) => set.add(image.folderId), new Set()));
		const folders = await getFoldersByIds({host, ids: imageFolderIds, token});
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
	catch(err) {
		console.log(err.response || err);
	}

	// await axios.get(url, options)
	// 	.then((response) => {
	// 		const images = response.data;
	// 		const imageFolderIds = Array.from(images.reduce((set, image) => set.add(image.folderId), new Set()));
	// 		console.log(imageFolderIds);
	// 	})
	// 	.catch((err) => {
	// 		console.log(err);
	// 	});
}

module.exports = loadImagesFileFromGirder;

// {"_id": {"$in": [{"$oid": "5e9c01bf1cbc2d13ab214486"}, {"$oid": "5e9c03161cbc2d13ab21efe7"}]}}
