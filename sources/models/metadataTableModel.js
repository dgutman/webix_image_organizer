import utils from "../utils/utils";
import constants from "../constants";
import format from "../utils/formats";
import authService from "../services/authentication";
import instance from "../services/ajaxActions";

const columnsForDatatableToAddCollection = new webix.DataCollection();
const columnsForDatatableToRemoveCollection = new webix.DataCollection();

function getColumnsForDatatableToAddCollection() {
	return columnsForDatatableToAddCollection;
}

function getColumnsForDatatableToRemove() {
	return columnsForDatatableToRemoveCollection;
}

function setFaIconsForDatatable(obj) {
	let icon;
	let fileType = utils.searchForFileType(obj);
	switch (fileType) {
		case "pdf": {
			icon = "fa-file-pdf-o";
			break;
		}
		case "json": {
			icon = "fa-file-code-o";
			break;
		}
		case "jpg":
		case "png":
		case "jpeg": {
			icon = "fa-picture-o";
			break;
		}
		case "ndpi":
		case "svs": {
			icon = "fa-file-excel-o";
			break;
		}
		default: {
			icon = "fa-file-o";
			break;
		}
	}
	return `<span class='webix_icon ${icon}'></span> ${obj.name}`;
}

function getLocalStorageColumnsConfig() {
	if (authService.isLoggedIn()) {
		return webix.storage.local.get(`${constants.STORAGE_COLUMNS_CONFIG}-${authService.getUserInfo()._id}-${utils.getHostsCollectionFromLocalStorage()._id}`);
	} else return false;
}

function getInitialColumnsForDatatable() {
	let initialColumnsConfig = [
		{
			id: constants.INITIAL_COLUMNS_IDS.NAME,
			header: "Name",
			sort: "text",
			fillspace: true,
			minWidth: 300,
			template: (obj) => {
				return `<div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${setFaIconsForDatatable(obj)}</div>`;
			}
		},
		{id: constants.INITIAL_COLUMNS_IDS.ID, header: "id", sort: "text", width: 250},
		{
			id: constants.INITIAL_COLUMNS_IDS.MODEL_TYPE,
			header: "Model type",
			sort: "text",
			width: 100,
			template: (obj) => {
				return obj._modelType || "item";
			}
		},
		{
			id: constants.INITIAL_COLUMNS_IDS.CREATED, header: "Created", sort: "text", width: 235, template: (obj) => {
				return format.formatDateString(obj.created);
			}
		},
		{
			id: constants.INITIAL_COLUMNS_IDS.UPDATED, header: "Updated", sort: "text", width: 235, template: (obj) => {
				return format.formatDateString(obj.updated);
			}
		},
		{id: constants.INITIAL_COLUMNS_IDS.PARENT_TYPE, header: "Parent type", sort: "text", width: 100},
		{
			id: constants.INITIAL_COLUMNS_IDS.SIZE, header: "Size", width: 120, sort: "text", template: (obj) => {
				return `${obj.size} B`;
			}
		}
	];
	return initialColumnsConfig;
}

function getColumnsForDatatable(datatable) {
	let columnConfig = [];
	const initialColumnsConfig = getInitialColumnsForDatatable();
	const localStorageColumnsConfig = getLocalStorageColumnsConfig();
	if (localStorageColumnsConfig && !utils.isObjectEmpty(localStorageColumnsConfig)) {
		localStorageColumnsConfig.forEach((localColumnConfig) => {
			const filterType = localColumnConfig.filterType;
			const filterTypeValue = localColumnConfig.filterTypeValue;
			const columnId = localColumnConfig.id;
			const metadataColumn = localColumnConfig.metadataColumn;
			let placeholder;

			if (filterTypeValue === constants.FILTER_TYPE_DATE) {
				placeholder = "mm/dd/yy";
			}

			initialColumnsConfig.forEach((initialColumnConfig) => {
				if (localColumnConfig.id === initialColumnConfig.id) {
					localColumnConfig.wasInitial = true;
					let localColumnHeader = localColumnConfig.header;
					initialColumnConfig.header = localColumnConfig.header;

					if (!Array.isArray(localColumnHeader)) {
						localColumnHeader = [localColumnHeader];
					}

					const initialColumnHeaderLength = initialColumnConfig.header.length;
					const lastHeaderItem = localColumnHeader[initialColumnHeaderLength - 1];

					if (lastHeaderItem instanceof Object && lastHeaderItem.hasOwnProperty("content")) {
						localColumnHeader.pop();
						localColumnHeader.push({
							content: `${filterType}Filter`,
							options: setSelectFilterOptions(filterType, columnId, datatable),
							placeholder: placeholder, compare: (value, filter, obj) => {
								return compareInitialColumnFilter(obj, filter, columnId, filterType, filterTypeValue, initialColumnConfig.id);
							}
						});
					}

					initialColumnConfig.header = localColumnHeader;
					columnConfig.push(initialColumnConfig);

				}
			});
			if (!localColumnConfig.wasInitial) {
				let headerConfig = localColumnConfig.header;
				if (headerConfig) {
					if (!Array.isArray(headerConfig)) {
						headerConfig = [headerConfig];
					}

					const headerConfigLength = headerConfig.length;
					const lastHeaderItem = headerConfig[headerConfigLength - 1];

					if (lastHeaderItem instanceof Object && lastHeaderItem.hasOwnProperty("content")) {
						headerConfig.pop();
						headerConfig.push({
							content: `${filterType}Filter`,
							options: setSelectFilterOptions(filterType, columnId, datatable),
							placeholder: placeholder, compare: (value, filter, obj) => {
								return compareMetadataColumnFilter(obj, filter, columnId, filterType);
							}
						});
					}
					const newColumnConfig = {
						id: columnId,
						header: headerConfig,
						fillspace: true,
						editor: "text",
						sort: "text",
						filterType: filterType,
						minWidth: 145,
						metadataColumn: metadataColumn,
						template: (obj) => {
							return getMetadataColumnTemplate(obj, columnId);
						}
					};
					columnConfig.push(newColumnConfig);
				}
			}
		});
	} else {
		columnConfig = initialColumnsConfig;
	}
	return columnConfig;
}

function putInLocalStorage(newColumnsConfig, userId) {
	webix.storage.local.put(`${constants.STORAGE_COLUMNS_CONFIG}-${userId}-${utils.getHostsCollectionFromLocalStorage()._id}`, newColumnsConfig.map(column => column));
}

function clearColumnsInLocalStorage(userId) {
	webix.storage.local.remove(`${constants.STORAGE_COLUMNS_CONFIG}-${userId}-${utils.getHostsCollectionFromLocalStorage()._id}`);
}

function getOrEditMetadataColumnValue(obj, valuePath) {
	const pathArray = valuePath.split(".");
	let result = obj;
	for (let index = 0; index < pathArray.length; index++) {
		if (typeof result === "object") {
			if (result.hasOwnProperty(pathArray[index])) {
				result = result[pathArray[index]];
			}
		}
	}
	return result;
}

function setSelectFilterOptions(filterType, columnId, datatable) {
	let options = [];
	if (filterType === "select") {
		options = [
			{
				id: "", value: ""
			}
		];
		datatable.data.each((item) => {
			if (item) {
				if (item.hasOwnProperty("meta")) {
					let metadataValue = getOrEditMetadataColumnValue(item.meta, `meta.${columnId}`);
					let index = options.map((obj) => obj.value).indexOf(metadataValue);
					if (!(metadataValue instanceof Object)) {
						if (index === -1) {
							options.push({
								id: metadataValue, value: metadataValue
							});
						}
					}
				}
			}
		});
	}
	return options;
}

function compareMetadataColumnFilter(obj, filter, columnId, filterType, filterTypeValue) {
	if (obj && obj.hasOwnProperty("meta")) {
		let metadataColumnValue = getOrEditMetadataColumnValue(obj.meta, `meta.${columnId}`);
		if (!metadataColumnValue && metadataColumnValue !== 0 && metadataColumnValue !== "") {
			metadataColumnValue = "null";
		}
		if (filterTypeValue === constants.FILTER_TYPE_DATE) {
			return metadataColumnValue.toString().indexOf(filter) !== -1;
		} else if (filterType === "text") {
			return metadataColumnValue.toString().toLowerCase().indexOf(filter) !== -1;
		} else if (filterType === "select") {
			return metadataColumnValue.toString() === filter;
		}
	}
}

function getMetadataColumnTemplate(obj, columnId) {
	if (obj.hasOwnProperty("meta")) {
		const columnValueColor = utils.getMetadataColumnColor(obj, columnId);
		const metadataColumnValue = getOrEditMetadataColumnValue(obj, `meta.${columnId}`);

		if (metadataColumnValue !== undefined && !(metadataColumnValue instanceof Object)) {
			return `<span class="metadata-column-template" style="color: ${columnValueColor};">${metadataColumnValue}</span>`;
		} else {
			return "No present metadata";
		}
	}
}

function compareInitialColumnFilter(value, filter, obj, columnId, filterType, filterTypeValue, columnValue) {
	if (filterTypeValue === constants.FILTER_TYPE_DATE) {
		const date = new Date(value);
		const formatToSting = webix.Date.dateToStr("%m/%d/%y");
		const dateToCompare = formatToSting(date);
		return dateToCompare.indexOf(filter) !== -1;
	} else if (filterType === "text") {
		return obj[columnValue].toString().toLowerCase().indexOf(filter) !== -1;
	} else if (filterType === "select") {
		return obj[columnValue].toString().toLowerCase() === filter;
	}
}

export default {
	getInitialColumnsForDatatable,
	getColumnsForDatatable,
	getLocalStorageColumnsConfig,
	getColumnsForDatatableToAddCollection,
	getColumnsForDatatableToRemove,
	putInLocalStorage,
	clearColumnsInLocalStorage,
	getOrEditMetadataColumnValue
};
