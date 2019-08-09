import utils from "../utils/utils";

let selectedItems = [];
const deletedItemsCollection = new webix.DataCollection();

function add(elements) {
	if (!Array.isArray(elements)) {
		elements = [elements];
	}
	elements = elements.filter(element => element);
	selectedItems = selectedItems.concat(elements);
}

function remove(element) {
	const index = selectedItems.findIndex((item) => item._id === element);
	if (index > -1) {
		selectedItems.splice(index, 1);
	}
}

function isSelected(element) {
	const index = selectedItems.findIndex((item) => item._id === element);
	return index > -1;
}

function clearAll() {
	selectedItems = [];
}

function count() {
	return selectedItems.length;
}

function getURIEncoded() {
	const selectedImagesIds = Array.from(selectedItems, selectedImage => selectedImage._id);
	return encodeURI(JSON.stringify(selectedImagesIds));
}

function getDeletedItemsDataCollection() {
	return deletedItemsCollection;
}

function getSelectedImages() {
	return selectedItems;
}

function putSelectedImagesToLocalStorage() {
	if (selectedItems.length) {
		utils.putSelectedItemsToLocalStorage(selectedItems);
	}
	else {
		utils.removeSelectedItemsFromLocalStorage();
	}
}

export default {
	add,
	remove,
	isSelected,
	clearAll,
	count,
	getURIEncoded,
	getDeletedItemsDataCollection,
	getSelectedImages,
	putSelectedImagesToLocalStorage
};
