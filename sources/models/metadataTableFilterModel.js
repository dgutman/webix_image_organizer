import utils from "../utils/utils";

let filtersArray = [];
let metadataTableFilter;

function setMetadataTableFilter(dataviewFilter) {
	metadataTableFilter = dataviewFilter;
}

function getMetadataTableFilter() {
	return metadataTableFilter;
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
	metadataTableFilter.setValue(valueToSet);
}

function addNoFiltersSelection() {
	metadataTableFilter.getList().parse({
		id: "all",
		value: "all"
	});
}

function clearFilterSelectList() {
	metadataTableFilter.getList().clearAll();
}

function parseFilterToSelectList() {
	metadataTableFilter.getList().parse(filtersArray);
}


function prepareDataToFilter(dataArray) {
	metadataTableFilter.blockEvent();
	setFilterValue("");
	metadataTableFilter.unblockEvent();
	clearFilterValues();
	dataArray.forEach((item) => {
		const itemType = utils.searchForFileType(item);
		addFilterValue(itemType);
	});

	clearFilterSelectList();
	addNoFiltersSelection();
	parseFilterToSelectList();
}

function filterData(datatable, value) {
	datatable.filter((obj) => {
		const itemType = utils.searchForFileType(obj);
		if (value === "all" || itemType === value) {
			return obj;
		}
	});
}


export default {
	prepareDataToFilter,
	filterData,
	setMetadataTableFilter,
	getMetadataTableFilter
}