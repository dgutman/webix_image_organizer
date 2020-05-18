import dot from "dot-object";
import utils from "../utils/utils";
import constants from "../constants";
import format from "../utils/formats";
import authService from "../services/authentication";
import editableFoldersModel from "./editableFoldersModel";
import webixViews from "./webixViews";

let metadataDotObject = {};

function setFaIconsForDatatable(obj) {
	let icon;
	let fileType = utils.searchForFileType(obj);
	switch (fileType) {
		case "pdf": {
			icon = "fa-file-pdf";
			break;
		}
		case "json": {
			icon = "fa-file-code";
			break;
		}
		case "jpg":
		case "png":
		case "jpeg":
		case "bmp":
		case "tiff": {
			icon = "fa-image";
			break;
		}
		case "ndpi":
		case "svs": {
			icon = "fa-file-excel";
			break;
		}
		default: {
			icon = "fa-file";
			break;
		}
	}
	return `<span class='item-icon webix_icon far ${icon}'></span> ${obj.name}`;
}

function getLocalStorageColumnsConfig() {
	if (authService.isLoggedIn()) {
		return webix.storage.local.get(`${constants.STORAGE_COLUMNS_CONFIG}-${authService.getUserInfo()._id}-${utils.getHostsCollectionFromLocalStorage()._id}`);
	} return false;
}

function getOrEditMetadataColumnValue(obj, valuePath) {
	const parts = valuePath.split(".");
	const newObj = obj[parts[0]];
	if (parts[1] && newObj) {
		parts.splice(0, 1);
		const newString = parts.join(".");
		return getOrEditMetadataColumnValue(newObj, newString);
	}
	return newObj;
}

function setSelectFilterOptions(filterType, columnId, datatable, initial) {
	let options = [];
	if (filterType === "select") {
		options = [{id: "", value: ""}, {id: "empty_value", value: "empty value"}];
		const itemsModel = webixViews.getItemsModel();
		const dataCollection = itemsModel.getDataCollection();
		dataCollection.data.serialize(true).forEach((item) => {
			if (initial) {
				const value = columnId === "_modelType" && !item[columnId] ? "item" : item[columnId];
				const index = options.map(obj => obj.value).indexOf(value);
				if (index === -1) {
					options.push({
						id: item[columnId], value
					});
				}
			}
			if (item.hasOwnProperty("meta")) {
				const metadataValue = dot.pick(`meta.${columnId}`, item);
				const index = options.map(obj => obj.value).indexOf(metadataValue);
				if (metadataValue !== null && metadataValue !== undefined && metadataValue !== "" && !(metadataValue instanceof Object) && index === -1) {
					options.push({
						id: metadataValue, value: metadataValue
					});
				}
			}
		});
	}

	return options;
}

function getMetadataColumnTemplate(obj, columnId) {
	if (obj.hasOwnProperty("meta")) {
		const columnValueColor = utils.getMetadataColumnColor(obj, columnId);
		const metadataColumnValue = getOrEditMetadataColumnValue(obj, `meta.${columnId}`);

		if (metadataColumnValue !== undefined && !(metadataColumnValue instanceof Object)) {
			return `<span class="metadata-column-template" style="color: ${columnValueColor};">${metadataColumnValue}</span>`;
		}
	}
	return "No present metadata";
}

function getForHeaderValue(columnConfig, columnHeaderLength) {
	const lastHeaderElement = columnConfig.header[columnHeaderLength - 1];
	if (typeof lastHeaderElement === "object") {
		if (lastHeaderElement.hasOwnProperty("content")) {
			const newColumnHeaderLength = columnHeaderLength - 1 > 0 ? columnHeaderLength - 1 : 0;
			return getForHeaderValue(columnConfig, newColumnHeaderLength);
		}
		else if (lastHeaderElement.hasOwnProperty("text")) return lastHeaderElement.text;
		return lastHeaderElement;
	}
	return lastHeaderElement;
}

function getHeaderTextValue(columnConfig) {
	let headerTextValue;
	const columnHeaderLength = columnConfig.header.length;
	const regExp = /<.*$/;

	if (Array.isArray(columnConfig.header)) {
		headerTextValue = getForHeaderValue(columnConfig, columnHeaderLength);
	}
	else headerTextValue = columnConfig.header;
	let replacedHeaderValue = headerTextValue.replace(regExp, "");
	if (!replacedHeaderValue) {
		const htmlElement = utils.createElementFromHTML(headerTextValue);
		replacedHeaderValue = utils.isElement(htmlElement) ? htmlElement.innerText : "";
	}

	return replacedHeaderValue;
}

function getInitialColumnsForDatatable() {
	const initialColumnsConfig = [
		{
			id: constants.INITIAL_COLUMNS_IDS.NAME,
			header: "Name",
			sort: "text",
			initial: true,
			fillspace: true,
			minWidth: 300,
			template: obj => `<div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${setFaIconsForDatatable(obj)}</div>`
		},
		{
			id: constants.INITIAL_COLUMNS_IDS.ID,
			header: "id",
			initial: true,
			sort: "text",
			width: 250
		},
		{
			id: constants.INITIAL_COLUMNS_IDS.SIZE,
			header: "Size",
			width: 160,
			initial: true,
			sort: "text",
			template: obj => `${obj.size} B`
		}, {
			id: constants.INITIAL_COLUMNS_IDS.MODEL_TYPE,
			header: "Model type",
			sort: "text",
			initial: true,
			hidden: true,
			width: 100,
			template: obj => obj._modelType || "item"
		},
		{
			id: constants.INITIAL_COLUMNS_IDS.CREATED,
			header: "Created",
			sort: "text",
			initial: true,
			hidden: true,
			width: 235,
			template: obj => format.formatDateString(obj.created)
		},
		{
			id: constants.INITIAL_COLUMNS_IDS.UPDATED,
			header: "Updated",
			sort: "text",
			initial: true,
			hidden: true,
			width: 235,
			template: obj => format.formatDateString(obj.updated)
		},
		{
			id: constants.INITIAL_COLUMNS_IDS.PARENT_TYPE,
			header: "Parent type",
			hidden: true,
			initial: true,
			sort: "text",
			width: 100
		}
	];
	return initialColumnsConfig;
}

function getSelectedFolderState() {
	const finder = webixViews.getFinderView();
	let isEditable = false;
	if (finder) {
		const selectedItem = finder.getSelectedItem();
		let folderId = null;
		if (selectedItem) {
			folderId = selectedItem._modelType === "folder" ? selectedItem._id : selectedItem.folderId;
			isEditable = editableFoldersModel.isFolderEditable(folderId);
		}
	}
	return isEditable;
}

function getColumnsForDatatable(datatable) {
	let columnConfig = [];
	const initialColumnsConfig = getInitialColumnsForDatatable();
	const localStorageColumnsConfig = getLocalStorageColumnsConfig();
	// const isAdmin = authService.isLoggedIn() && authService.getUserInfo().admin;

	if (localStorageColumnsConfig) {
		localStorageColumnsConfig.forEach((localColumnConfig) => {
			const filterType = localColumnConfig.filterType;
			const filterTypeValue = localColumnConfig.filterTypeValue;
			const columnId = localColumnConfig.id;
			let localColumnHeader = localColumnConfig.header;
			let placeholder;

			if (filterTypeValue === constants.FILTER_TYPE_DATE) {
				placeholder = "mm/dd/yy";
			}

			if (!Array.isArray(localColumnHeader)) {
				localColumnHeader = [localColumnHeader];
			}

			if (filterType) {
				const lastHeaderItem = localColumnHeader[localColumnHeader.length - 1];
				if (lastHeaderItem instanceof Object && lastHeaderItem.hasOwnProperty("content")) localColumnHeader.pop();
				localColumnHeader.push({
					content: `${filterType}Filter`,
					options: setSelectFilterOptions(filterType, columnId, datatable, localColumnConfig.initial),
					placeholder
				});
			}
			else {
				const lastHeaderItem = localColumnHeader[localColumnHeader.length - 1];
				if (lastHeaderItem instanceof Object && lastHeaderItem.hasOwnProperty("content")) localColumnHeader.pop();
			}

			if (!localColumnConfig.initial) {
				const headerValue = getHeaderTextValue(localColumnConfig);
				const lastHeaderItem = localColumnHeader[localColumnHeader.length - 1];
				const isEditable = getSelectedFolderState() ? "webix_icon fas fa-pencil-alt" : "";
				if (lastHeaderItem instanceof Object && lastHeaderItem.hasOwnProperty("content")) {
					localColumnHeader[localColumnHeader.length - 2] = `<span class="column-header-bottom-name">${headerValue}</span><span class="column-editable-icon ${isEditable}"></span>`;
				}
				else localColumnHeader[localColumnHeader.length - 1] = `<span class="column-header-bottom-name">${headerValue}</span><span class="column-editable-icon ${isEditable}"></span>`;

				localColumnConfig = {
					id: columnId,
					header: localColumnHeader,
					fillspace: true,
					editor: authService.isLoggedIn() ? "text" : false,
					sort: "text",
					filterType,
					minWidth: 180,
					template: obj => getMetadataColumnTemplate(obj, columnId)
				};
			}
			else {
				localColumnConfig.header = localColumnHeader;
				const initialColumn = initialColumnsConfig.find(initialColumnConfig => initialColumnConfig.id === localColumnConfig.id && !localColumnConfig.hidden);
				if (initialColumn && initialColumn.template) localColumnConfig.template = initialColumn.template;
			}
			if (filterTypeValue) localColumnConfig.filterTypeValue = filterTypeValue;
			columnConfig.push(localColumnConfig);
		});
	}
	else {
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

function putNewItemFieldsToStorage(fields, userId) {
	webix.storage.local.put(`${constants.STORAGE_NEW_ITEM_META_FIELDS}-${userId}-${utils.getHostsCollectionFromLocalStorage()._id}`, fields);
}

function clearNewItemFieldsInStorage(userId) {
	webix.storage.local.remove(`${constants.STORAGE_NEW_ITEM_META_FIELDS}-${userId}-${utils.getHostsCollectionFromLocalStorage()._id}`);
}

function getLocalStorageNewItemFields() {
	if (authService.isLoggedIn()) {
		return webix.storage.local.get(`${constants.STORAGE_NEW_ITEM_META_FIELDS}-${authService.getUserInfo()._id}-${utils.getHostsCollectionFromLocalStorage()._id}`);
	} return false;
}

function getConfigForNewColumn() {
	return {
		id: webix.uid(),
		header: [""],
		minWidth: 180
	};
}

export default {
	getInitialColumnsForDatatable,
	getColumnsForDatatable,
	getLocalStorageColumnsConfig,
	putInLocalStorage,
	getOrEditMetadataColumnValue,
	getHeaderTextValue,
	clearColumnsInLocalStorage,
	getConfigForNewColumn,
	putNewItemFieldsToStorage,
	clearNewItemFieldsInStorage,
	getLocalStorageNewItemFields,
	setFaIconsForDatatable,
	metadataDotObject
};
