let elementsArray = [];

function getAddedElements() {
	return elementsArray;
}

function setElementsToAdd(elementsIds) {
	elementsArray.push(elementsIds);
}

function getAddedElementsCount() {
	return elementsArray.length;
}

function clearAddedElements() {
	elementsArray = [];
}

function removeAddedElement(elementId) {
	elementsArray = elementsArray.filter(layoutId => layoutId !== elementId);
}

export default {
	getAddedElements,
	setElementsToAdd,
	getAddedElementsCount,
	clearAddedElements,
	removeAddedElement
};
