import helpingFunctions from "./helpingFunctions";
import constants from "../constants";
import format from "../utils/formats";
import authService from "../services/authentication";
import "../views/components/datatableEditor";

const columnsForDatatableToAddCollection = new webix.DataCollection();
const columnsForDatatableToRemoveCollection = new webix.DataCollection();

function getColumnsForDatatableToAddCollection() {
	return columnsForDatatableToAddCollection;
}

function getColumnsForDatatableToRemove() {
	return columnsForDatatableToRemoveCollection;
}

function clearColumnsForDatatableToAddCollection() {
	columnsForDatatableToAddCollection.clearAll();
}

function clearColumnsForDatatableToRemoveCollection() {
	columnsForDatatableToRemoveCollection.clearAll();
}

function setFaIconsForDatatable(obj) {
	let icon;
	let fileType = helpingFunctions.searchForFileType(obj);
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
	return `<span class='webix_icon ${icon}'> ${obj.name}</span>`;
}

function getLocalStorageColumnsConfig() {
	if (authService.isLoggedIn()) {
		return webix.storage.local.get(`${constants.STORAGE_COLUMNS_CONFIG}-${authService.getUserInfo()._id}-${helpingFunctions.getHostsCollectionFromLocalStorage()._id}`);
	} else return false;
}

function getInitialColumnsForDatatable() {
	let initialColumnsConfig = [
		{
			id: constants.INITIAL_COLUMNS_IDS.NAME, header: "Name", fillspace: true, minWidth: 300, template: (obj) => {
				return `<div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${setFaIconsForDatatable(obj)}</div>`;
			}
		},
		{id: constants.INITIAL_COLUMNS_IDS.ID, header: "id", width: 250},
		{id: constants.INITIAL_COLUMNS_IDS.MODEL_TYPE, header: "Model type", width: 100, template: (obj) => {
			return obj._modelType || "item";
		}},
		{
			id: constants.INITIAL_COLUMNS_IDS.CREATED, header: "Created", width: 235, template: (obj) => {
				return format.formatDateString(obj.created);
			}
		},
		{
			id: constants.INITIAL_COLUMNS_IDS.UPDATED, header: "Updated", width: 235, template: (obj) => {
				return format.formatDateString(obj.updated);
			}
		},
		{id: constants.INITIAL_COLUMNS_IDS.PARENT_TYPE, header: "Parent type", width: 100},
		{
			id: constants.INITIAL_COLUMNS_IDS.SIZE, header: "Size", width: 120, template: (obj) => {
				return `${obj.size} B`;
			}
		}
	];
	return initialColumnsConfig;
}

function getColumnsForDatatable() {
	let columnConfig = [];
	let initialColumnsConfig = getInitialColumnsForDatatable();
	let localStorageColumnsConfig = getLocalStorageColumnsConfig();
	if (localStorageColumnsConfig && !helpingFunctions.isObjectEmpty(localStorageColumnsConfig)) {
		localStorageColumnsConfig.forEach((localColumnConfig) => {
			initialColumnsConfig.forEach((initialColumnConfig) => {
				if (localColumnConfig.id === initialColumnConfig.id) {
					localColumnConfig.wasInitial = true;
					columnConfig.push(initialColumnConfig);
				}
			});
			if (!localColumnConfig.wasInitial) {
				let headerConfig;
				if (localColumnConfig.header[1]) {
					headerConfig = localColumnConfig.header;
				} else {
					headerConfig = `${localColumnConfig.header[0].text}`;
				}
				let newColumnConfig = {
					id: localColumnConfig.id,
					header: headerConfig,
					fillspace: true,
					editor: "text",
					minWidth: 145,
					template: (obj) => {
						if (obj.meta) {
							const columnValueColor = helpingFunctions.getMetadataColumnColor(obj, localColumnConfig.id);
							if (obj.meta.groups) {
								return `<span style="color: ${columnValueColor}">${obj.meta.groups[localColumnConfig.id]}</span>`;
							} else {
								return `<span style="color: ${columnValueColor}">${obj.meta[localColumnConfig.id]}</span>`;
							}

						} else return "No metadata for item";
					}
				};
				columnConfig.push(newColumnConfig);
			}
		});
	} else {
		columnConfig = initialColumnsConfig;
	}
	return columnConfig;
}

function putInLocalStorage(newColumnsConfig, userId) {
	webix.storage.local.put(`${constants.STORAGE_COLUMNS_CONFIG}-${userId}-${helpingFunctions.getHostsCollectionFromLocalStorage()._id}`, newColumnsConfig.map(column => column));
}

export default {
	getInitialColumnsForDatatable,
	getColumnsForDatatable,
	getLocalStorageColumnsConfig,
	getColumnsForDatatableToAddCollection,
	getColumnsForDatatableToRemove,
	clearColumnsForDatatableToAddCollection,
	clearColumnsForDatatableToRemoveCollection,
	putInLocalStorage
};
