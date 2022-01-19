import authService from "../services/authentication";
import constants from "../constants";

let selectedItems = {};
let lastSelectedItem = null;
let lastUnselectedItem = null;
const deletedItemsCollection = new webix.DataCollection();

function processItems(elements) {
	if (!Array.isArray(elements)) {
		elements = [elements];
	}
	elements = elements.filter(element => element);

	lastSelectedItem = elements[elements.length - 1];

	return elements.reduce((acc, val) => {
		acc[val._id] = val;
		return acc;
	}, {});
}

function add(elements) {
	const newElements = processItems(elements);
	Object.assign(selectedItems, newElements);
}

function remove(elements) {
	if (!Array.isArray(elements)) {
		elements = [elements];
	}

	elements.forEach((obj) => {
		delete selectedItems[obj._id];
		if (lastSelectedItem && obj._id === lastSelectedItem._id) lastSelectedItem = null;
	});
}

function isSelected(id) {
	return !!selectedItems[id];
}

function clearAll() {
	selectedItems = {};
	lastSelectedItem = null;
}

function count() {
	return Object.keys(selectedItems).length;
}

function getURIEncoded() {
	const selectedImagesIds = Object.keys(selectedItems); // Array.from(selectedItems, selectedImage => selectedImage._id);
	return encodeURI(JSON.stringify(selectedImagesIds));
}

function getDeletedItemsDataCollection() {
	return deletedItemsCollection;
}

function getSelectedImages() {
	return Object.values(selectedItems);
}

function removeSelectedItemsFromLocalStorage() {
	const hostId = authService.getHostId();
	const userId = authService.getUserId() || "unregistered";
	webix.storage.local.remove(`selectedGalleryItems-${userId}-${hostId}`);
}

function putSelectedImagesToLocalStorage() {
	const selectedItemsArray = Object.values(selectedItems);
	if (selectedItemsArray.length) {
		const hostId = authService.getHostId();
		const userId = authService.getUserId() || "unregistered";
		webix.storage.local.put(`selectedGalleryItems-${userId}-${hostId}`, selectedItemsArray);
	}
	else {
		removeSelectedItemsFromLocalStorage();
	}
}

function getSelectedItemsFromLocalStorage() {
	const hostId = authService.getHostId();
	const userId = authService.getUserId() || "unregistered";
	return webix.storage.local.get(`selectedGalleryItems-${userId}-${hostId}`) || [];
}

function getNewSelectedItems(item, lastUnselected, dataView) {
	lastSelectedItem = lastSelectedItem || item;
	const indexOfCurrentItem = dataView.getIndexById(item.id);
	const dataViewLastSelectedItem = lastUnselected || dataView.find(image => image._id === lastSelectedItem._id, true);
	const indexOfLastSelectedItem = dataViewLastSelectedItem ? dataView.getIndexById(dataViewLastSelectedItem.id) : indexOfCurrentItem;
	const start = indexOfLastSelectedItem > indexOfCurrentItem ? indexOfCurrentItem : indexOfLastSelectedItem;
	const end = indexOfLastSelectedItem > indexOfCurrentItem ? indexOfLastSelectedItem : indexOfCurrentItem;
	const newSelectedItems = dataView.data.serialize().slice(start, end + 1);
	return newSelectedItems;
}

function onItemSelect(isShiftKey, item, dataView) {
	let newSelectedItems = [];
	if (isShiftKey) {
		newSelectedItems = getNewSelectedItems(item, null, dataView);
	}
	else {
		newSelectedItems = [item];
	}
	if (!isSelected(item._id)) {
		newSelectedItems = newSelectedItems.filter(obj => !isSelected(obj._id));

		const selectCount = count() + newSelectedItems.length;
		if (selectCount > constants.MAX_COUNT_IMAGES_SELECTION) {
			const end = constants.MAX_COUNT_IMAGES_SELECTION - count();
			newSelectedItems = newSelectedItems.slice(0, end);

			webix.alert({
				text: `You can select maximum ${constants.MAX_COUNT_IMAGES_SELECTION} images`
			});
		}

		add(newSelectedItems);
		lastUnselectedItem = null;
	}
	else {
		const lastUnselected = lastUnselectedItem ? dataView.getItem(lastUnselectedItem.id) : null;
		if (lastUnselected && isShiftKey) {
			newSelectedItems = getNewSelectedItems(item, lastUnselected, dataView);
		}
		lastUnselectedItem = item;
		remove(newSelectedItems);
	}
	return newSelectedItems;
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
	processItems,
	putSelectedImagesToLocalStorage,
	getSelectedItemsFromLocalStorage,
	removeSelectedItemsFromLocalStorage,
	onItemSelect
};
