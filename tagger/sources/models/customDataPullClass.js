export default class CustomDataPull {
	constructor(dataStoreView) {
		this.dataStoreView = dataStoreView;
		this.customDataPull = {};
	}

	parseItems(dataArray, position, totalCount) {
		const newDataPull = {};
		if (!dataArray) dataArray = [];
		dataArray.forEach((item) => {
			const id = item.id || webix.uid();
			item.id = id;
			newDataPull[item._id || id] = item;
		});
		Object.assign(this.customDataPull, newDataPull);
		if (totalCount !== undefined && position !== undefined) { // For dynamic loading
			this.dataStoreView.parse({
				data: dataArray,
				total_count: totalCount,
				pos: position
			});
		}
		else {
			this.dataStoreView.parse(dataArray);
		}
	}

	addItem(item) {
		const id = webix.uid();
		item.id = id;
		this.dataStoreView.add(item);
		this.customDataPull[item._id || id] = item;
		return item;
	}

	updateItem(id, baseId, data) {
		const foundedItem = this.getItemById(id, baseId);

		if (foundedItem) {
			data.id = foundedItem.id;

			Object.assign(foundedItem, data);
			this.dataStoreView.updateItem(foundedItem.id, data);
			if (data._id && !foundedItem._id) {
				delete this.customDataPull[foundedItem.id];
				this.customDataPull[data._id] = data;
			}
		}
	}

	removeItem(id, baseId) {
		let item = this.getItemById(id, baseId);

		if (!(Object.keys(item).length === 0)) {
			this.dataStoreView.remove(item.id);
			delete this.customDataPull[item._id];
			delete this.customDataPull[item.id];
		}
	}

	getItemById(id, baseId) {
		let item = null;
		if (id) {
			item = this.dataStoreView.getItem(id);
		}
		if (!item && baseId) {
			item = this.customDataPull[baseId];
		}
		return item;
	}

	clearAll() {
		this.dataStoreView.clearAll();
		this.customDataPull = {};
	}

	getArrayOfItems() {
		return Object.values(this.customDataPull);
	}

	count() {
		return this.dataStoreView.count();
	}

	getDataStoreView() {
		return this.dataStoreView;
	}

	getCustomDataPull() {
		return this.customDataPull;
	}
}
