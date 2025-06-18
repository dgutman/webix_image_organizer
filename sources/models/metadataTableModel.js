import dot from "dot-object";

import editableFoldersModel from "./editableFoldersModel";
import galleryImageUrl from "./galleryImageUrls";
import nonImageUrls from "./nonImageUrls";
import webixViews from "./webixViews";
import constants from "../constants";
import authService from "../services/authentication";
import ImageThumbnailLoader from "../services/gallery/imageThumbnailLoader";
import format from "../utils/formats";
import utils from "../utils/utils";

let metadataDotObject = {};
let patientsDataDotObject = {};
const metadataTableDataCollection = new webix.DataCollection();

function getMetadataTableDataCollection() {
	return metadataTableDataCollection;
}

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
			if (obj._modelType === "folder") {
				icon = "fa-folder";
			}
			else {
				icon = "fa-file";
			}
			break;
		}
	}
	return `<span class='item-icon webix_icon far ${icon}'></span> ${obj.name}`;
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

function getLocalStorageColumnsConfig() {
	if (authService.isLoggedIn()) {
		return webix.storage.local.get(`${constants.STORAGE_COLUMNS_CONFIG}-${authService.getUserInfo()._id}-${utils.getHostsCollectionFromLocalStorage()._id}`);
	} return false;
}

function getLocalStoragePatientsFields() {
	if (authService.isLoggedIn()) {
		return webix.storage.local.get(`${constants.STORAGE_PATIENTS_DATA_FIELDS}-${authService.getUserInfo()._id}-${utils.getHostsCollectionFromLocalStorage()._id}`);
	}
	return false;
}

function setSelectFilterOptions(filterType, columnId, initial) {
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

function markWrongMetadata(value, obj, rowId, columnId) {
	let style = {"background-color": "#90EE90"};
	if (obj?.highlightedValues?.find(highlightedValue => columnId.startsWith(highlightedValue))) {
		style = {"background-color": "#fc8b18", color: "#FFFFFF"};
	}
	if (obj?.highlightedValues?.find(highlightedValue => highlightedValue === columnId)) {
		style = {"background-color": "#ff5d5d", color: "#FFFFFF"};
	}
	if (value === "No present metadata") {
		style = {"background-color": "#fc8b18", color: "#FFFFFF"};
	}
	if (value?.trim() === "" || value === null || value === undefined) {
		style = {"background-color": "#ff5d5d", color: "#FFFFFF"};
	}
	return style;
}

function getMetadataColumnTemplate(obj, config, columnId) {
	if (obj.hasOwnProperty("meta")) {
		// const columnValueColor = utils.getMetadataColumnColor(obj, columnId);
		const metadataColumnValue = getOrEditMetadataColumnValue(obj, `meta.${columnId}`);
		config.cssFormat = markWrongMetadata;

		if (metadataColumnValue !== undefined && !(metadataColumnValue instanceof Object)) {
			if (obj.highlightedValues
					&& obj.highlightedValues.find(highlightedValue => highlightedValue === columnId)) {
				config.cssFormat = markWrongMetadata;
			}
			return metadataColumnValue;
		}
	}
	else if (obj.hasOwnProperty("patient-meta")) {
		const metadataColumnValue = getOrEditMetadataColumnValue(obj, `patient-meta.${columnId}`);

		if (metadataColumnValue !== undefined && !(metadataColumnValue instanceof Object)) {
			return metadataColumnValue;
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
			header: "Size, B",
			width: 160,
			initial: true,
			sort: "int",
			template: obj => Number(obj.size)
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
			sort: "date",
			initial: true,
			hidden: true,
			width: 235,
			template: obj => format.formatDateString(obj.created)
		},
		{
			id: constants.INITIAL_COLUMNS_IDS.UPDATED,
			header: "Updated",
			sort: "date",
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

function getCurrentItemPreviewType(type) {
	let imageType;
	let getPreviewUrl;
	let setPreviewUrl;

	switch (type) {
		case "thumbnail": {
			getPreviewUrl = galleryImageUrl.getPreviewImageUrl;
			setPreviewUrl = galleryImageUrl.setPreviewImageUrl;
			imageType = "thumbnail";
			break;
		}
		case "label": {
			getPreviewUrl = galleryImageUrl.getLabelPreviewImageUrl;
			setPreviewUrl = galleryImageUrl.setPreviewLabelImageUrl;
			imageType = "images/label";
			break;
		}
		case "macro": {
			getPreviewUrl = galleryImageUrl.getPreviewMacroImageUrl;
			setPreviewUrl = galleryImageUrl.setPreviewMacroImageUrl;
			imageType = "images/macro";
			break;
		}
		default: {
			break;
		}
	}
	return {imageType, getPreviewUrl, setPreviewUrl};
}

function getImageColumnTemplate(columnConfig, size) {
	return (obj) => {
		const metadataTable = webixViews.getMetadataTableView();
		const {imageType, getPreviewUrl} = getCurrentItemPreviewType(columnConfig.imageType);
		ImageThumbnailLoader.loadImagePreview(obj, imageType, metadataTable);

		return `<div class='datatable-image-column'>
					<img
						style='background: url(${nonImageUrls.getNonImageUrl(obj)}) center / auto 100% no-repeat;'
						width='${size - 2}'
						height='${size - 2}'
						loading='lazy'
						src='${getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}'
					>
				</div>`;
	};
}

function addColumnConfig(initialColumnsConfig, columnConfigToAdd, columnsConfig) {
	if (columnConfigToAdd.columnType === "image") {
		columnConfigToAdd.template = getImageColumnTemplate(
			columnConfigToAdd,
			columnConfigToAdd.imageSize
		);
		columnConfigToAdd.tooltip = getImageColumnTemplate(columnConfigToAdd, 400);
	}
	else {
		const filterType = columnConfigToAdd.filterType;
		const filterTypeValue = columnConfigToAdd.filterTypeValue;
		const columnId = columnConfigToAdd.id;
		const localColumnHeader = columnConfigToAdd.header;
		const localColumnHeaderArray = [];
		let placeholder;

		if (filterTypeValue === constants.FILTER_TYPE_DATE) {
			placeholder = "mm/dd/yy";
		}

		if (!Array.isArray(localColumnHeader)) {
			localColumnHeaderArray.push(localColumnHeader);
		}
		else {
			localColumnHeaderArray.push(...localColumnHeader);
		}

		let lastHeaderItem = localColumnHeaderArray[localColumnHeaderArray.length - 1];
		if (lastHeaderItem instanceof Object && lastHeaderItem.hasOwnProperty("content")) localColumnHeaderArray.pop();
		if (filterType) {
			localColumnHeaderArray.push({
				content: `${filterType}Filter`,
				options: setSelectFilterOptions(filterType, columnId, columnConfigToAdd.initial),
				placeholder
			});
		}
		if (!columnConfigToAdd.initial) {
			const headerValue = getHeaderTextValue(columnConfigToAdd);
			lastHeaderItem = localColumnHeaderArray[localColumnHeaderArray.length - 1];
			const isEditable = getSelectedFolderState() ? "webix_icon fas fa-pencil-alt" : "";
			// if pencil is disappeared check if folder selected;
			const headerText = `<span class="column-header-bottom-name">${headerValue}</span><span class="column-editable-icon ${isEditable}"></span>`;
			if (lastHeaderItem instanceof Object && lastHeaderItem.hasOwnProperty("content")) {
				localColumnHeaderArray.splice(-2, 2);
				localColumnHeaderArray.push(headerText, lastHeaderItem);
			}
			else {
				localColumnHeaderArray.splice(-1, 1);
				localColumnHeaderArray.push(headerText);
			}
			const isPatientColumn = columnConfigToAdd.patientColumn;
			columnConfigToAdd = {
				id: columnId,
				header: localColumnHeaderArray,
				fillspace: true,
				editor: authService.isLoggedIn() ? "text" : false,
				sort: "text",
				filterType,
				minWidth: 180,
				template: (obj, common, value, config) => getMetadataColumnTemplate(obj, config, columnId)
			};
			if (isPatientColumn) columnConfigToAdd.patientColumn = isPatientColumn;
		}
		else {
			columnConfigToAdd.header = localColumnHeaderArray;
			const initialColumn = initialColumnsConfig
				// eslint-disable-next-line max-len
				.find(initialColumnConfig => initialColumnConfig.id === columnConfigToAdd.id && !columnConfigToAdd.hidden);
			if (initialColumn && initialColumn.template) {
				columnConfigToAdd.template = initialColumn.template;
			}
		}
		if (filterTypeValue) columnConfigToAdd.filterTypeValue = filterTypeValue;
	}
	columnsConfig.push(columnConfigToAdd);
}

function getColumnsForDatatable() {
	let columnConfig = [];
	const patientConfig = [];
	const initialColumnsConfig = getInitialColumnsForDatatable();
	const localStorageColumnsConfig = getLocalStorageColumnsConfig();
	const patientLocalStorageColumnsConfig = getLocalStoragePatientsFields();
	// const isAdmin = authService.isLoggedIn() && authService.getUserInfo().admin;

	if (localStorageColumnsConfig) {
		localStorageColumnsConfig.forEach((localColumnConfig) => {
			addColumnConfig(initialColumnsConfig, localColumnConfig, columnConfig);
		});
	}
	else {
		columnConfig = initialColumnsConfig;
	}
	if (patientLocalStorageColumnsConfig) {
		patientLocalStorageColumnsConfig.forEach((patientColumnConfig) => {
			addColumnConfig(initialColumnsConfig, patientColumnConfig, patientConfig);
		});
	}

	return [columnConfig, patientConfig];
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

function putNewPatientFieldsToStorage(fields, userId) {
	webix.storage.local.put(`${constants.STORAGE_NEW_PATIENTS_DATA_FIELDS}-${userId}-${utils.getHostsCollectionFromLocalStorage()._id}`, fields);
}

function clearNewItemFieldsInStorage(userId) {
	webix.storage.local.remove(`${constants.STORAGE_NEW_ITEM_META_FIELDS}-${userId}-${utils.getHostsCollectionFromLocalStorage()._id}`);
}

function clearNewPatientFieldsInStorage(userId) {
	webix.storage.local.remove(`${constants.STORAGE_NEW_PATIENTS_DATA_FIELDS}-${userId}-${utils.getHostsCollectionFromLocalStorage()._id}`);
}

function getLocalStorageNewItemFields() {
	if (authService.isLoggedIn()) {
		return webix.storage.local.get(`${constants.STORAGE_NEW_ITEM_META_FIELDS}-${authService.getUserInfo()._id}-${utils.getHostsCollectionFromLocalStorage()._id}`);
	} return false;
}

function getLocalStorageNewPatientFields() {
	if (authService.isLoggedIn()) {
		return webix.storage.local.get(`${constants.STORAGE_NEW_PATIENTS_DATA_FIELDS}-${authService.getUserInfo()._id}-${utils.getHostsCollectionFromLocalStorage()._id}`);
	} return false;
}


function putPatientsFieldsToStorage(fields, userId) {
	webix.storage.local.put(`${constants.STORAGE_PATIENTS_DATA_FIELDS}-${userId}-${utils.getHostsCollectionFromLocalStorage()._id}`, fields);
}

function clearPatientsFieldsInStorage(userId) {
	webix.storage.local.remove(`${constants.STORAGE_PATIENTS_DATA_FIELDS}-${userId}-${utils.getHostsCollectionFromLocalStorage()._id}`);
}

function getConfigForNewColumn() {
	return {
		id: webix.uid(),
		header: [""],
		minWidth: 180
	};
}

function refreshDatatableColumns() {
	const defaultHeight = constants.METADATA_TABLE_ROW_HEIGHT;
	const metadataTable = webixViews.getMetadataTableView();
	const [datatableItemColumns, datatablePatientColumns] = getColumnsForDatatable();
	const imageColumn = datatableItemColumns.find(col => col.id === "-image");

	const newRowHeight = Math.max(imageColumn ? imageColumn.imageSize : defaultHeight, defaultHeight);
	const oldRowHeight = metadataTable.config._rowHeight || defaultHeight;

	if (newRowHeight !== oldRowHeight) {
		webixViews.getItemsModel().dataCollection.waitData.then(() => {
			metadataTable.data.each((obj) => { obj.$height = newRowHeight; });
			metadataTable.define("_rowHeight", newRowHeight);
			metadataTable.refresh();
		});
	}

	const datatableColumns = datatableItemColumns.concat(datatablePatientColumns);

	metadataTable.refreshColumns(datatableColumns);
}

export default {
	getMetadataTableDataCollection,
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
	putPatientsFieldsToStorage,
	clearPatientsFieldsInStorage,
	getLocalStoragePatientsFields,
	setFaIconsForDatatable,
	refreshDatatableColumns,
	metadataDotObject,
	patientsDataDotObject,
	getLocalStorageNewPatientFields,
	putNewPatientFieldsToStorage,
	clearNewPatientFieldsInStorage,
};
