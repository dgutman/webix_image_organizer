const ProcessImagesRequest = require('../extensions/process_images_request');
const updateLocalCache = require('../extensions/updateLocalCache');
const ProcessApprovedMetadataRequest = require('../extensions/process_approved_metadata_request');
const crypto = require('crypto');
const constants = require('../../constants');
const lodash = require('lodash');
const LoadFromGirder = require('../extensions/load_from_girder');

exports.getImagesData = (req, res) => {
	const host = req.query.host;
	const token = req.query.token;
	const clientHash = req.get('If-None-Match');

	return ProcessImagesRequest.getImagesData(clientHash, host)
	.then(([hash, images]) => {
		return Promise.all([
			Promise.resolve(hash),
			Promise.resolve(images),
			ProcessApprovedMetadataRequest.getApprovedMetadataData(),
			LoadFromGirder.getAllowedFolders(host, token)
		]);
	})
	.then(([hash, images, approvedMetadataData, allowedFolders]) => {
		if(hash) {
			const approvedMetadataHash = crypto.createHash('sha256');
			approvedMetadataHash.update(approvedMetadataData.updatedAt.toString());

			res.set({
				'Cache-Control': 'private',
				'ETag': hash.data + approvedMetadataHash.digest('hex').slice(0, 10)
			});
			if (host) {
				images = JSON.parse(images).filter((obj) => obj.host === host);
			}
			if (allowedFolders) {
				images = images.filter((obj) => lodash.includes(allowedFolders, obj.data.folderId));
			}
		}
		return [hash, images];
	});
};

exports.getImageData = (req, res, next) => {
	const host = req.query.host;
	ProcessImagesRequest.getImageData(req.query.id)
	.then((image) => {
		return Promise.all([
			Promise.resolve(image),
			ProcessApprovedMetadataRequest.getApprovedMetadataData()
		]);
	})
	.then(([image, approvedMetadataData]) => {
		if (host) {
			if(image.host === host) {
				image = filterImageData(image, approvedMetadataData.data);
				res.status(200).send(image);
			} else {
				res.status(404);
			}
		}
	})
	.catch((err) => {
		next(err);
	});
};

const filterImageData = function(image, approvedMetadataData) {
	image.facets = filterFacets(image.facets, approvedMetadataData);
	const dataToDisplay = filterData(image.data, approvedMetadataData);
	addServiceData(dataToDisplay, image.data);
	image.data = dataToDisplay;
	return image;
};

const filterFacets = function(facets, approvedMetadataData) {
	approvedMetadataData.forEach((filter) => {
		if(filter.checked === false) {
			delete(facets[filter.id]);
		}
		if(filter.data.length !== 0) {
			facets = filterFacets(facets, filter.data);
		}
	});
	return facets;
};

const filterData = function(data, approvedMetadataData) {
	const dataToDisplay = {};
	approvedMetadataData.forEach((filter) => {
		if(filter.checked === false) {
			let dataForChecking;
			if(data.hasOwnProperty(filter.value)) {
				dataForChecking = data[filter.value];
			}
			if(Array.isArray(dataForChecking)) {
				filter.data.forEach((item, i) => {
					if(item.checked) {
						if(!dataToDisplay.hasOwnProperty(filter.value)) {
							dataToDisplay[filter.value] = {};
						}
						dataToDisplay[filter.value][i] = dataForChecking[i];
					}
				});
			} else {
				if(dataForChecking && typeof(dataForChecking) === "object" && !Array.isArray(dataForChecking)) {
					if(filter.data.length > 0) {
						dataForChecking = filterData(dataForChecking, filter.data);
					}
					const checkingDataLength = Object.keys(dataForChecking).length > 0
						? Object.keys(dataForChecking).length
						: 0;
					if(checkingDataLength > 0) {
						dataToDisplay[filter.value] = dataForChecking;
					}
				}
			}
		} else if(data.hasOwnProperty(filter.value)) {
			dataToDisplay[filter.value] = data[filter.value];
		}
	});
	return dataToDisplay;
};

const addServiceData = function(dataToDisplay, data) {
	const arrayOfServiceMetadata = constants.HIDDEN_METADATA_FIELDS.slice();
	arrayOfServiceMetadata.forEach((serviceMetadataItem) => {
		if(lodash.get(data, serviceMetadataItem)) {
			lodash.set(dataToDisplay, serviceMetadataItem, lodash.get(data, serviceMetadataItem));
		}
	});
};

exports.updateCache = (req, res, next) => {
	updateLocalCache()
	.then((result) => {
		console.log(result);
		res.status(200).send({'status': result});
	})
	.catch((err) => {
		res.status(500).send({'status': 'server error'});
	});
};
