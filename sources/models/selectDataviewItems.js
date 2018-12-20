let selectedItems = [];

function add(element) {
	selectedItems.push(element);
}

function remove(element) {
	const index = selectedItems.indexOf(element);
	if (index > -1) {
		selectedItems.splice(index, 1);
	}
}

function isSelected(element) {
	return selectedItems.indexOf(element) > -1;
}

function clearAll() {
	selectedItems = [];
}

function count() {
	return selectedItems.length;
}

function getURIEncoded() {
	return encodeURI(JSON.stringify(selectedItems));
}

export default {
	add,
	remove,
	isSelected,
	clearAll,
	count,
	getURIEncoded
};
