const serviceData = require('../models/service_data');
const facetImages = require('../models/facet_images');

class ProcessImagesRequest {
	checkEtag(clientHash) {
		let promise;
		if(clientHash) {
			return Promise.all([
				serviceData.getImagesHash()
			])
			.then(([hashObj]) => {
				if (!hashObj) {
					return Promise.reject({code: 'ENOENT'});
				}
				let promise;
				if(clientHash === hashObj.data) {
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
		const timeLogID = `get-images-data-${Math.random().toString(16).slice(2)}`;
		console.time(timeLogID);
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
			console.timeLog(timeLogID);
			return promise;
		});
	};

	getImageData(id) {
		return facetImages.getImageById(id);
	}
}

module.exports = new ProcessImagesRequest();
