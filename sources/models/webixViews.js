let finderView;
let galleryDataview;
let galleryPager;
let metadataTable;
let mainView;

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
	getMainView
};