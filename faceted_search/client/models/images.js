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
		webix.ajax().get(app.config.defaultAPIPath + "/facets/images", params)
			.then(function(response) {
				let data = response.json();
				data = data && data.length > 0 ? data : [];
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

	imagesCollection.filterSingleImage = function(obj, data) {
		const show = {};
		const filteredCases = CaseFilter.getFilteredCases();
		const imagesFilteredByCases = CaseFilter.getFilteredImagesIds()
		const caseFilters = CaseFilter.getFilters();
		const criterionsCount = caseFilters?.length;
		if (criterionsCount === 0
			|| (filteredCases?.includes(obj?.data?.meta?.npSchema?.caseID)
				&& imagesFilteredByCases.includes(obj.id))
		) {
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
		} else {
			return false;
		}
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

	function isCriterionsFit(criterions, image) {
		const isOk = criterions.reduce((isOk, criteria, currentCriterions) => {
			if (isOk) {
				return true;
			} else if (
				((image.data?.meta?.npSchema?.regionName || image.data?.meta?.npSchema?.region) === criteria.region)
				&& image.data?.meta?.npSchema?.stainID === criteria.stain
			) {
				CaseFilter.addCaseCriteria(
					image.data?.meta?.npSchema?.caseID,
					`${criteria.region}-${criteria.stain}`
				);
				return true;
			}
			return false;
		}, false);
		return isOk;
	}

	imagesCollection.filterByCriterions = function(criterions) {
		const casesSet = new Set();
		const allImages = getAllImages();
		allImages.forEach((image) => casesSet.add(image.data?.meta?.npSchema?.caseID));
		CaseFilter.clearCases();
		const filteredImagesByCriterions = allImages.filter((image) => {
			const isOk = criterions
				? isCriterionsFit(criterions, image)
				: true;
			return isOk;
		});
		const filteredImagesId = filteredImagesByCriterions.map((filteredImage) => filteredImage.id);
		const filteredCases = Array.from(casesSet).filter((caseName) => {
			return CaseFilter.isCaseFit(caseName, criterions.length);
		});
		CaseFilter.setFilteredCases(filteredCases);
		CaseFilter.setFilteredImagesIds(filteredImagesId);
		app.callEvent("filtersChanged");
	};

	imagesCollection.getCriterionCount = function(criterion) {
		const allImages = getAllImages();
		const imagesFitsCriteria = allImages.filter((image) => {
			const isOk = image.facets["meta|npSchema|stainID"] === criterion.stain
				&& (image.facets["meta|npSchema|regionName"] || image.facets["meta|npSchema|region"]) === criterion.region;
			return isOk;
		});
		const count = imagesFitsCriteria.length;
		return count;
	};

	function getAllImages() {
		const cloneImages = webix.clone(imagesCollection);
		cloneImages.filter(() => true);
		const images = cloneImages.serialize();
		return images;
	}

	imagesCollection.getCasesCount = function() {
		const images = this.serialize();
		const result = new Set();
		images.forEach((image) => {
			result.add(image.data.meta.npSchema.caseID);
		});
		return result.size;
	};

	return imagesCollection;
});
