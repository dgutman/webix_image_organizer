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
			// TODO: find out if it necessary
			// ProcessApprovedMetadataRequest.getData(),
			// TODO: temporary do not check access
			// TODO: check request before move to prod
			hash ? LoadFromGirder.getAllowedFolders(host, token) : null
		]);
	})
	.then(([hash, images, allowedFolders]) => {
		let filteredImages;
		let hostImages;
		if(hash) {
			res.set({
				'Cache-Control': 'private',
				'ETag': hash.data
			});
			if (host) {
				hostImages = images.filter((obj) => obj.host === host);
			}
			if (allowedFolders) {
				filteredImages = hostImages?.filter((obj) => lodash.includes(allowedFolders, obj.data.folderId));
			}
			else {
				filteredImages = [...hostImages];
			}
		} else {
			hostImages = images;
		}
		return [hash, filteredImages];
	});
};

exports.getImageData = (req, res, next) => {
	const host = req.query.host;
	ProcessImagesRequest.getImageData(req.query.id)
	.then((image) => {
		return Promise.all([
			Promise.resolve(image),
			ProcessApprovedMetadataRequest.getData()
		]);
	})
	.then(([image, approvedMetadataData]) => {
		if (host) {
			if(image.host === host) {
				const filteredImageData = filterImageData(image, approvedMetadataData.data);
				res.status(200).send(filteredImageData);
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

exports.deleteImages = () => {
	
};
