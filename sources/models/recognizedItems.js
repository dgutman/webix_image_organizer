let arrayOfProcessedItems = [];
let validOptions = [];

function getRecognizedItemsByOption(option) {
	let arrayToReturn = [];
	switch (option) {
		case "marker": {
			arrayOfProcessedItems.forEach((item) => {
				if (item.meta.marker) {
					arrayToReturn.push(item);
				}
			});
			break;
		}
		case "sticker": {
			arrayOfProcessedItems.forEach((item) => {
				if (item.meta.stickers.length) {
					arrayToReturn.push(item);
				}
			});
			break;
		}
		case "label": {
			arrayOfProcessedItems.forEach((item) => {
				if (item.meta.ocrRawText) {
					arrayToReturn.push(item);
				}
			});
			break;
		}
		default: {
			break;
		}
	}
	return arrayToReturn;
}

function addProcessedItems(array) {
	array.forEach((item) => {
		const processedItem = webix.copy(item);
		arrayOfProcessedItems.push(processedItem);
	});
}

function clearProcessedItems() {
	arrayOfProcessedItems = [];
}

function setValidOptions(array) {
	array = array || [];
	validOptions = array;
}

function getValidOptions() {
	return validOptions;
}


export default {
	addProcessedItems,
	getRecognizedItemsByOption,
	clearProcessedItems,
	setValidOptions,
	getValidOptions
};
