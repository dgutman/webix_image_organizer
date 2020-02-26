import utils from "../utils/utils";
import imagesTagsModel from "./imagesTagsModel";

// const imagesTagsCollection = imagesTagsModel.getImagesTagsCollection();

let filtersArray = [];
let richSelectDataviewFilter;

function setRichselectDataviewFilter(dataviewFilter) {
	richSelectDataviewFilter = dataviewFilter;
}

function getRichselectDataviewFilter() {
	return richSelectDataviewFilter;
}

function addFilterValue(filterValue) {
	if (!filtersArray.find(obj => obj === filterValue)) {
		filtersArray.push(filterValue);
	}
}

function getFiltersArray() {
	return filtersArray;
}

function clearFilterValues() {
	filtersArray = [];
}

function addNoFiltersSelection() {
	richSelectDataviewFilter.getList().parse({
		id: "all",
		value: "all"
	});
	richSelectDataviewFilter.blockEvent();
	richSelectDataviewFilter.setValue("all");
	richSelectDataviewFilter.unblockEvent();
}

function clearFilterRichSelectList() {
	richSelectDataviewFilter.getList().clearAll();
}

function parseFilterToRichSelectList() {
	richSelectDataviewFilter.getList().parse(filtersArray);
}

// function filterData(dataview, value) {
// 	const nameValue = nameFilterView ? nameFilterView.getValue() : "";
// 	const lowerCaseNameValue = nameValue ? nameValue.toLowerCase() : "";

// 	dataview.filter((obj) => {
// 		const itemType = utils.searchForFileType(obj);
// 		if (value === "all" || itemType === value || obj.starColor === value.substr(0, value.indexOf(" ")) || value === "warning" && obj.imageWarning) {
// 			if (lowerCaseNameValue) {
// 				return obj.name.toString().toLowerCase().indexOf(lowerCaseNameValue) !== -1;
// 			}
// 			return obj;
// 		}
// 		// } else if (obj.hasOwnProperty("meta") && obj.meta.hasOwnProperty("tag")) {
// 		// 	const tagsImageId = imagesTagsCollection.getLastId();
// 		// 	const tagsImage = imagesTagsCollection.getItem(tagsImageId);
// 		// 	let tagId;
// 		// 	let tagKey;
// 		// 	const objTagsLength = obj.meta.tag.length;
// 		// 	for (let index = 0; index < objTagsLength; index++) {
// 		// 		const tags = obj.meta.tag[index];
// 		// 		if (tagId) {
// 		// 			for (let key in tags) {
// 		// 				if (tags.hasOwnProperty(key)) {
// 		// 					tagId = getTagValue(tagsImage, value, key, "value", "id");
// 		// 					tagKey = key;
// 		// 					if (tagId) {
// 		// 						break;
// 		// 					}
// 		// 				}
// 		// 			}
// 		// 		}
// 		// 	}
// 		//
// 		// 	let objectToReturn;
// 		// 	obj.meta.tag.forEach((imageTag) => {
// 		// 		if (imageTag.hasOwnProperty(tagKey)) {
// 		// 			if (Array.isArray(imageTag[tagKey])) {
// 		// 				if (imageTag[tagKey].find(imageTagId => imageTagId === tagId)) {
// 		// 					objectToReturn = obj;
// 		// 				}
// 		// 			} else {
// 		// 				if (imageTag[tagKey] === tagId) {
// 		// 					objectToReturn = obj;
// 		// 				}
// 		// 			}
// 		// 		}
// 		// 	});
// 		//
// 		// 	return objectToReturn;
// 		// }
// 	});
// }

// function getTagValue(tagsImage, tagId, key, id, objValue) {
// 	let value;

// 	if (tagsImage.hasOwnProperty(key)) {
// 		tagsImage[key].forEach((obj) => {
// 			if (obj[id] === tagId) {
// 				value = obj[objValue];
// 			}
// 		});
// 	}
// 	return value;
// }

function prepareDataToFilter(dataArray) {

	dataArray.forEach((item) => {
		const itemType = utils.searchForFileType(item);
		const itemStarColor = item.starColor;
		const itemWarningStatus = item.imageWarning;
		addFilterValue(itemType);
		if (itemStarColor) addFilterValue(`${itemStarColor} star`);
		if (itemWarningStatus) addFilterValue("warning");
		// if (item.hasOwnProperty("meta") && item.meta.hasOwnProperty("tag")) {
		// 	const tagsImageId = imagesTagsCollection.getLastId();
		// 	const tagsImage = imagesTagsCollection.getItem(tagsImageId);
		// 	item.meta.tag.forEach((tag) => {
		// 		for (let key in tag) {
		// 			if (Array.isArray(tag[key])) {
		// 				tag[key].forEach((tagId) => {
		// 					addFilterValue(getTagValue(tagsImage, tagId, key, "id", "value"));
		// 				});
		// 			} else {
		// 				const tagId = tag[key];
		// 				addFilterValue(getTagValue(tagsImage, tagId, key, "id", "value"));
		// 			}
		// 		}
		// 	});
		// }
	});
	clearFilterRichSelectList();
	addNoFiltersSelection();
	parseFilterToRichSelectList();
}

export default {
	setRichselectDataviewFilter,
	getRichselectDataviewFilter,
	addFilterValue,
	clearFilterValues,
	clearFilterRichSelectList,
	parseFilterToRichSelectList,
	addNoFiltersSelection,
	getFiltersArray,
	prepareDataToFilter
};
