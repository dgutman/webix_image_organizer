let modifiedObjects = [];

function add(element) {
	modifiedObjects.push(element);
}

function remove(element) {
	const index = modifiedObjects.indexOf(element);
	if (index > -1) {
		modifiedObjects.splice(index, 1);
	}
}

function count() {
	return modifiedObjects.length;
}

function getObjects() {
	return modifiedObjects;
}

export default {
	add,
	remove,
	count,
	getObjects
};
