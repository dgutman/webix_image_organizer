let finderView;
let galleryDataview;
let galleryPager;
let metadataTable;
let mainView;
let imageWindow;
let galleryDataviewContextMenu;
let metadataTableThumbnailTemplate;
let pdfViewerWindow;
let itemsModel;
let renamePopup;
let metadataTemplate;
let dataviewSearchInput;
let csvViewerWindow;

function setMainView(view) {
	mainView = view;
}

function setGalleryDataview(galleryDataView) {
	galleryDataview = galleryDataView;
}

function setMetadataTable(metadataTableView) {
	metadataTable = metadataTableView;
}

function setFinderView(finderview) {
	finderView = finderview;
}

function setGalleryPager(pagerView) {
	galleryPager = pagerView;
}

function getGalleryDataview() {
	return galleryDataview;
}

function getMetadataTableView() {
	return metadataTable;
}

function getFinderView() {
	return finderView;
}

function getGalleryPager() {
	return galleryPager;
}

function getMainView() {
	return mainView;
}

function getImageWindow() {
	return imageWindow;
}

function setImageWindow(imageWindowView) {
	imageWindow = imageWindowView;
}

function setGalleryDataviewContextMenu(galleryContextMenu) {
	galleryDataviewContextMenu = galleryContextMenu;
}

function getGalleryDataviewContextMenu() {
	return galleryDataviewContextMenu;
}

function setMetadataTableThumbnailTemplate(thumbnailTemplate) {
	metadataTableThumbnailTemplate = thumbnailTemplate;
}

function getMetadataTableThumbnailTemplate() {
	return metadataTableThumbnailTemplate;
}

function setPdfViewerWindow(pdfWindow) {
	pdfViewerWindow = pdfWindow;
}

function getPdfViewerWindow() {
	return pdfViewerWindow;
}

function setCsvViewerWindow(csvWindow) {
	csvViewerWindow = csvWindow;
}

function getCsvViewerWindow() {
	return csvViewerWindow;
}

function setItemsModel(dataItemsModel) {
	itemsModel = dataItemsModel;
}

function getItemsModel() {
	return itemsModel;
}

function setRenamePopup(popup) {
	renamePopup = popup;
}

function getRenamePopup() {
	return renamePopup;
}

function setMetadataTemplate(template) {
	metadataTemplate = template;
}

function getMetadataTemplate() {
	return metadataTemplate;
}

function setDataviewSearchInput(input) {
	dataviewSearchInput = input;
}

function getDataviewSearchInput() {
	return dataviewSearchInput;
}

export default {
	setGalleryDataview,
	setMetadataTable,
	setFinderView,
	setGalleryPager,
	getGalleryDataview,
	getMetadataTableView,
	getFinderView,
	getGalleryPager,
	setMainView,
	getMainView,
	getImageWindow,
	setImageWindow,
	setGalleryDataviewContextMenu,
	getGalleryDataviewContextMenu,
	setMetadataTableThumbnailTemplate,
	getMetadataTableThumbnailTemplate,
	setPdfViewerWindow,
	getPdfViewerWindow,
	setCsvViewerWindow,
	getCsvViewerWindow,
	setItemsModel,
	getItemsModel,
	setRenamePopup,
	getRenamePopup,
	setMetadataTemplate,
	getMetadataTemplate,
	setDataviewSearchInput,
	getDataviewSearchInput
};
