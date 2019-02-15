import utils from "../utils/utils";

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

function setFilterValue(valueToSet) {
	richSelectDataviewFilter.setValue(valueToSet);
}

function addNoFiltersSelection() {
	richSelectDataviewFilter.getList().parse({
		id: "all",
		value: "all"
	});
}

function clearFilterRichSelectList() {
	richSelectDataviewFilter.getList().clearAll();
}

function parseFilterToRichSelectList() {
	richSelectDataviewFilter.getList().parse(filtersArray);
}

function filterData(dataview, value) {
	dataview.filter((obj) => {
		let itemType = utils.searchForFileType(obj);
		if (value === "all" || itemType === value || obj.starColor === value.substr(0, value.indexOf(" "))) {
			return obj;
		}
	});
}

function prepareDataToFilter(dataArray) {
	richSelectDataviewFilter.blockEvent();
	setFilterValue("");
	richSelectDataviewFilter.unblockEvent();
	clearFilterValues();
	dataArray.forEach((item) => {
		const itemType = utils.searchForFileType(item);
		addFilterValue(itemType);
		const itemStarColor = item.starColor;
		if (itemStarColor) {
			addFilterValue(`${itemStarColor} star`);
		}

	});
	clearFilterRichSelectList();
	addNoFiltersSelection();
	parseFilterToRichSelectList();
}

function filterByName(dataview, searchValue) {
	let richSelectValue = richSelectDataviewFilter.getValue();
	let lowerCaseSearchValue = searchValue.toLowerCase();
	dataview.filter((obj) => {
		let lowerCaseName;
		let itemType = utils.searchForFileType(obj);
		if (richSelectValue) {
			if (itemType === richSelectValue || richSelectValue === "all") {
				lowerCaseName = obj.name.toString().toLowerCase();
			}
		} else {
			lowerCaseName = obj.name.toString().toLowerCase();
		}
		if (lowerCaseName) {
			return lowerCaseName.indexOf(lowerCaseSearchValue) !== -1;
		}
	});
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
	filterData,
	setFilterValue,
	prepareDataToFilter,
	filterByName
};