const serviceData = require('../models/service_data');
const facetImages = require('../models/facet_images');
const approvedMetadataModel = require('../models/approved_metadata');
const crypto = require('crypto');

class ProcessImagesRequest {
	checkEtag(clientHash) {
		let promise;
		if(clientHash) {
			return Promise.all([
				serviceData.getImagesHash(),
				approvedMetadataModel.getApprovedMetadata()
			])
			.then(([hashObj, approvedMetadata]) => {
				if (!hashObj) {
					return Promise.reject({code: 'ENOENT'});
				}
				if (!approvedMetadata) {
					return Promise.resolve(false);
				}
				let promise;
				const approvedMetadataHash = crypto.createHash('sha256');
				approvedMetadataHash.update(approvedMetadata?.updatedAt?.toString());
				if(clientHash === hashObj.data + approvedMetadataHash.digest('hex').slice(0, 10)) {
					promise = Promise.resolve(true);
				} else {
					promise = Promise.resolve(false);
				}
				return promise;
			});
		} else {
			promise = Promise.resolve(false);
		}
		return promise;
	}

	getImagesData(clientHash) {
		return this.checkEtag(clientHash)
		.then((result) => {
			let promise;
			if(result) {
				promise = Promise.resolve(null);
			} else {
				promise = facetImages.getAllImages();
			}
			return promise;
		})
		.then((images) => {
			let promise;
			if(images) {
				const promises = [];
				promises.push(serviceData.getImagesHash());
				promises.push(Promise.resolve(images));
				promise = Promise.all(promises);
			} else {
				promise = Promise.resolve([null, null]);
			}
			return promise;
		});
	};

	getImageData(id) {
		return facetImages.getImageById(id);
	}
}

module.exports = new ProcessImagesRequest();
