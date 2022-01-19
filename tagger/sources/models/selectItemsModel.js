export default class SelectedItemsModel {
	constructor(dataView) {
		this.selectedItems = new webix.DataCollection();
		this.dataView = dataView;
		this.secondaryDataViews = [];
	}

	add(elements) {
		if (!Array.isArray(elements)) {
			elements = [elements];
		}
		let selectedItemsArray = this.getArrayOfSelectedItems();
		selectedItemsArray = selectedItemsArray
			.concat(elements)
			.filter((item, index, self) => index === self.findIndex(obj => obj._id === item._id));
		this.selectedItems.clearAll();
		this.selectedItems.parse(selectedItemsArray);
		this.setLastUnselectedItem();
	}

	remove(elements) {
		if (!Array.isArray(elements)) {
			elements = [elements];
		}
		let selectedItemsArray = this.getArrayOfSelectedItems();
		elements.forEach((element) => {
			selectedItemsArray = selectedItemsArray.filter(item => item._id !== element._id);
		});
		this.selectedItems.clearAll();
		this.selectedItems.parse(selectedItemsArray);
	}

	isSelected(element) {
		return this.selectedItems.find(item => item._id === element._id, true);
	}

	clearAll() {
		this.selectedItems.clearAll();
		this.setLastUnselectedItem();
	}

	count() {
		return this.selectedItems.count();
	}

	getSelectedItems() {
		return this.selectedItems;
	}

	getArrayOfSelectedItems() {
		return this.selectedItems.data.serialize();
	}

	setLastUnselectedItem(element) {
		this.lastUnselected = element;
	}

	getLastUnselectedItem() {
		return this.lastUnselected;
	}

	addSecondaryDataView(dataView) {
		this.secondaryDataViews.push(dataView);
	}

	getSecondaryDataViews() {
		return this.secondaryDataViews;
	}

	clearSecondaryDataviews() {
		this.secondaryDataViews = [];
	}
}
