let elementsArray = [];
let wasRemoved = false;

function getAddedElements() {
	return elementsArray;
}

function setElementsToAdd(elementsObject) {
	elementsArray.push(elementsObject);
}

function getAddedElementsCount() {
	return elementsArray.length;
}

function clearAddedElements() {
	elementsArray = [];
}

function removeAddedElement(layoutId) {
	elementsArray = elementsArray.filter(layout => layout.id !== layoutId);
}

function setWasRemoved(value) {
	wasRemoved = value;
}

function getWasRemoved() {
	return wasRemoved;
}

export default {
	getAddedElements,
	setElementsToAdd,
	getAddedElementsCount,
	clearAddedElements,
	removeAddedElement,
	setWasRemoved,
	getWasRemoved
}