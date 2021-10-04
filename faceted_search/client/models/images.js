define([
	"app",
	"helpers/ajax",
	"helpers/authentication",
	"libs/lodash/lodash.min",
	"constants"
], function(
	app,
	ajax,
	auth,
	lodash,
	constants
) {
	let imagesViewState = false;
	const imagesCollection = new webix.DataCollection({});
	let sizes;

	imagesCollection.loadImages = function() {
		const params = {
			host: ajax.getHostApiUrl(),
			token: auth.getToken()
		};
		webix.ajax().get(app.config.defaultAPIPath + "/facets/images", params)
			.then(function(response) {
				let data = response.json();
				data = data && data.length > 0 ? data : [];
				imagesCollection.clearAll();
				imagesCollection.parse(data);
				imagesCollection.callEvent("imagesLoaded", []);
				imagesCollection.callEvent("changeButtonAfterImageLoaded", []);
				app.callEvent("buildFiltersAfterImagesLoaded", [true]);
			})
			.fail(function() {
				imagesCollection.clearAll();
				imagesCollection.callEvent("imagesLoaded", []);
				imagesCollection.callEvent("changeButtonAfterImageLoaded", []);
				app.callEvent("buildFiltersAfterImagesLoaded", [true]);
			});
	};

	imagesCollection.getImages = function() {
		return this;
	};

	imagesCollection.changeImagesViewState = function(state) {
		imagesViewState = state;
		this.callEvent('imagesViewStateChange', []);
	};

	imagesCollection.getImagesSize = function(dataviewWidth) {
		if(dataviewWidth) {
			if(imagesViewState) {
				sizes = {
					height: 600,
					width: dataviewWidth
				};
			} else {
				sizes = {
					height: 230,
					width: dataviewWidth/5
				};
			}
		} else if(!sizes) {
			if(imagesViewState) {
				sizes = {
					height: 600,
					width: (window.outerWidth - 430)
				};
			} else {
				sizes = {
					height: 230,
					width: (window.outerWidth - 430)/5
				};
			}
		}
		return sizes;
	};

	imagesCollection.getImagesViewState = function() {
		return imagesViewState;
	};

	imagesCollection.getImagesCount = function() {
		return this.count();
	};

	const allTrue = function(obj) {
		for (const key in obj) {
			if (!obj.hasOwnProperty(key) || obj[key] === false) {
				return false;
			}
		}
		return true;
	};

	imagesCollection.filterSingleImage = function(obj, data) {
		const show = {};
		for(let i = 0; i < data.length; i++) {
			show[data[i].key] = false;

			if (data[i].key === constants.CHANNEL_MAP_FILTER) {
				show[data[i].key] = data[i].value.every((filterValue) => {
					return lodash.get(obj.data, `${constants.CHANNEL_MAP_FIELD_PATH}.${filterValue}`) !== undefined;
				});
			} else if(obj.facets.hasOwnProperty((data[i].key))) {
				if (data[i].status == "equals") {
					if (data[i].value instanceof Array) {
						for (let k = 0; k < data[i].value.length; k++) {
							if (data[i].value[k] == obj.facets[data[i].key]) {
								show[data[i].key] = true;
							}
						}
					} else if (data[i].value == obj.facets[data[i].key]) {
						show[data[i].key] = true;
					}
				} else if (data[i].status == "less" && data[i].value < obj.facets[data[i].key]) {
					show[data[i].key] = true;
				} else if (data[i].status == "between" && data[i].max >= obj.facets[data[i].key] && data[i].min <= obj.facets[data[i].key]) {
					show[data[i].key] = true;
				}
			}
		}
		return allTrue(show);
	};

	app.attachEvent("images:FilterImagesView", function(data, skipId) {
		const arr = [];
		imagesCollection.filter((obj) => {
			const isOk = data ? imagesCollection.filterSingleImage(obj, data) : true;
			if(isOk) {
				arr.push(obj.facets);
			}
			return isOk;
		});
		imagesCollection.callEvent("imagesFiltered", []);
		app.callEvent("reloadFormAfterCalculating", [arr, skipId]);
	});

	return imagesCollection;
});
