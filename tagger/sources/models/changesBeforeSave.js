function removeItemFromArray(item, arr) {
	const arrItemIndex = arr
		.findIndex(obj => item.id == obj.id || (item._id && item._id === obj._id));
	if (arrItemIndex !== -1) {
		return arr.splice(arrItemIndex, 1);
	}
	return false;
}

export default class ChangesBeforeSave {
	constructor(dataStore) {
		this.dataArrays = {
			updated: [],
			created: [],
			removed: []
		};
		this.dataStore = dataStore;
		dataStore.getDataStoreView().attachEvent("undoButtonClicked", (item, action) => {
			this.removeItem(item);
			switch (action) {
				case "add":
				case "update":
					if (item._id) {
						this.addItem(item, "updated");
					}
					else {
						this.addItem(item, "created");
					}
					break;
				case "delete":
					if (item._id) {
						this.addItem(item, "updated");
					}
					break;
				default:
					break;
			}
		});
	}

	getItems(type) {
		return this.dataArrays[type] || this.dataArrays;
	}

	addItem(item, type) {
		this.addUniqueItem(item, this.dataArrays[type]);
	}

	removeItem(item, type) {
		if (this.dataArrays[type]) {
			return removeItemFromArray(item, this.dataArrays[type]);
		}
		return Object.values(this.dataArrays).some(arr => removeItemFromArray(item, arr));
	}

	addUniqueItem(item, arrayOfItems) {
		const types = Object.keys(this.dataArrays);
		types.forEach((type) => {
			const foundedItemIndex = this.dataArrays[type]
				.findIndex(obj => item.id === obj.id || (item._id && item._id === obj._id));
			if (foundedItemIndex !== -1) {
				this.dataArrays[type].splice(foundedItemIndex, 1);
			}
		});
		arrayOfItems.push(item);
	}

	findItemByProperty(property, value) {
		const arraysOfItems = Object.values(this.dataArrays);
		const items = arraysOfItems.reduce((acc, val) => acc.concat(val), []);
		return items.find(item => item[property] === value);
	}

	clearItems(type) {
		if (this.dataArrays[type]) {
			this.dataArrays[type] = [];
		}
		else {
			this.dataArrays.created = [];
			this.dataArrays.updated = [];
			this.dataArrays.removed = [];
		}
	}
}
