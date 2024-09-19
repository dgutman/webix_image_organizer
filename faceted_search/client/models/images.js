define([
	"app",
	"helpers/ajax",
	"helpers/authentication",
	"models/case_filter",
	"libs/lodash/lodash.min",
	"constants"
], function(
	app,
	ajax,
	auth,
	CaseFilter,
	lodash,
	constants
) {
	let imagesViewState = constants.TEMPLATE_IMAGE_SIZE.SMALL;
	const imagesCollection = new webix.DataCollection({});
	let sizes;

	imagesCollection.loadImages = function() {
		const params = {
			host: ajax.getHostApiUrl(),
			token: auth.getToken()
		};
		// if (auth.isLoggedIn()) {
			webix.ajax().get(app.config.defaultAPIPath + "/facets/images", params)
			.then(function(response) {
				let data = response.json();
				data = data?.length > 0 ? data : [];
				imagesCollection.clearAll();
				imagesCollection.parse(data);
				imagesCollection.callEvent("imagesLoaded", []);
				imagesCollection.callEvent("changeButtonAfterImageLoaded", []);
				app.callEvent("buildFiltersAfterImagesLoaded", [true]);
				app.callEvent("caseForm: filtersChanged");
			})
			.fail(function(error) {
				imagesCollection.clearAll();
				imagesCollection.callEvent("imagesLoaded", []);
				imagesCollection.callEvent("changeButtonAfterImageLoaded", []);
				app.callEvent("buildFiltersAfterImagesLoaded", [true]);
				app.callEvent("caseForm: filtersChanged");
			});
		// }
		// else {
		// 	imagesCollection.callEvent("imagesLoaded", []);
		// 	imagesCollection.callEvent("changeButtonAfterImageLoaded", []);
		// 	app.callEvent("buildFiltersAfterImagesLoaded", [true]);
		// 	app.callEvent("caseForm: filtersChanged");
		// }
	};

	imagesCollection.getImages = function() {
		return this;
	};

	imagesCollection.changeImagesViewState = function(state) {
		imagesViewState = state;
		this.callEvent('imagesViewStateChange', []);
	};

	imagesCollection.getImagesSize = function(dataviewWidth) {
		const containerWidth = dataviewWidth ? dataviewWidth : window.outerWidth - 430;
		switch (imagesViewState) {
			case constants.TEMPLATE_IMAGE_SIZE.LARGE:
				sizes = {
					height: 600,
					width: containerWidth
				};
				break;
			case constants.TEMPLATE_IMAGE_SIZE.MEDIUM:
				sizes = {
					height: 420,
					width: containerWidth/3
				};
				break;
			case constants.TEMPLATE_IMAGE_SIZE.SMALL:
				sizes = {
					height: 230,
					width: containerWidth/5
				};
				break;
			default:
				sizes = {
					height: 230,
					width: containerWidth/5
				};
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

	imagesCollection.filterSingleImage = function(image, filterData) {
		const show = {};
		const filteredCases = CaseFilter.getFilteredCases();
		const imagesFilteredByCasesIds = CaseFilter.getFilteredImagesIds();
		const caseFilters = CaseFilter.getFilters();
		const criterionsCount = caseFilters?.length;
		if (criterionsCount === 0
			|| (filteredCases?.includes(image?.data?.meta?.npSchema?.caseID)
				&& imagesFilteredByCasesIds.includes(image.id))
		) {
			for(let i = 0; i < filterData.length; i++) {
				show[filterData[i].key] = false;
				if (image.facets[filterData[i].key]) {
				}
				if (filterData[i].key === constants.CHANNEL_MAP_FILTER) {
					show[filterData[i].key] = filterData[i].value.every((filterValue) => {
						return lodash.get(image.data, `${constants.CHANNEL_MAP_FIELD_PATH}.${filterValue}`) !== undefined;
					});
				} else if(image.facets.hasOwnProperty((filterData[i].key))) {
					if (filterData[i].status == "equals") {
						if (filterData[i].value instanceof Array) {
							for (let k = 0; k < filterData[i].value.length; k++) {
								if (
									Array.isArray(image.facets[filterData[i].key])
									&& image.facets[filterData[i].key].includes(filterData[i].value[k])) {
									show[filterData[i].key] = true;
								}
								else if (filterData[i].value[k] == image.facets[filterData[i].key]) {
									show[filterData[i].key] = true;
								}
							}
						} else if (filterData[i].value == image.facets[filterData[i].key]) {
							show[filterData[i].key] = true;
						}
					} else if (filterData[i].status == "less" && filterData[i].value < image.facets[filterData[i].key]) {
						show[filterData[i].key] = true;
					} else if (filterData[i].status == "between" && filterData[i].max >= image.facets[filterData[i].key] && filterData[i].min <= image.facets[filterData[i].key]) {
						show[filterData[i].key] = true;
					}
				}
			}
			return allTrue(show);
		} else {
			return false;
		}
	};

	app.attachEvent("images:FilterImagesView", function(filterData, skipId) {
		const arr = [];
		imagesCollection.filter((image) => {
			const isOk = filterData ? imagesCollection.filterSingleImage(image, filterData) : true;
			if(isOk) {
				arr.push(image.facets);
			}
			return isOk;
		});
		imagesCollection.callEvent("imagesFiltered", []);
		// app.callEvent("caseForm: filtersChanged");
		app.callEvent("reloadFormAfterCalculating", [arr, skipId]);
	});

	imagesCollection.getAllImages = function() {
		const cloneImages = webix.clone(imagesCollection);
		cloneImages.filter(() => true);
		const images = cloneImages.serialize();
		return images;
	};

	return imagesCollection;
});
