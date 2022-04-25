export default class SelectImagesModel {
	constructor(dataView) {
		this.showSelected = false;
		this.dataView = dataView || new webix.DataCollection();
		this.selectedImages = {};
		this.dataView.isCustomSelected = this.isSelected.bind(this);

		this.dataView.attachEvent("customSelectChange", () => {
			this.dataView.refresh();
		});
	}

	onItemSelect(isShiftKey, item) {
		let newSelectedItems = [];
		if (isShiftKey) {
			newSelectedItems = this.getNewSelectedItems(item);
		}
		else {
			newSelectedItems = [item];
		}
		if (!this.isSelected(item)) {
			this.add(newSelectedItems);
			this.setLastUnselectedItem();
		}
		else {
			const lastUnselected = this.getLastUnselectedItem();
			if (lastUnselected && isShiftKey) {
				newSelectedItems = this.getNewSelectedItems(item, lastUnselected);
			}
			this.setLastUnselectedItem(item);
			this.remove(newSelectedItems);
		}
		this.dataView.callEvent("customSelectChange", [this.getSelectedItems()]);
	}

	selectAllVisibleItems(pager) {
		let visibleData = this.dataView.serialize();
		if (pager) {
			const pData = pager.data;
			const values = {
				amount: pData.count,
				start: pData.count ? pData.page * pData.size : 0,
				end: pData.page + 1 === pData.limit ||
					!pData.count ? pData.count : (pData.page + 1) * pData.size
			};
			visibleData = visibleData.slice(values.start, values.end);
		}
		this.add(visibleData);
		this.dataView.callEvent("customSelectChange", [this.getSelectedItems()]);
	}

	selectAllItems() {
		let data = this.dataView.serialize();

		this.add(data);
		this.dataView.callEvent("customSelectChange", [this.getSelectedItems()]);
	}

	unselectAllItems() {
		this.lastSelectedItem = null;
		this.selectedImages = {};
		this.dataView.callEvent("customSelectChange", [this.getSelectedItems()]);
	}

	getNewSelectedItems(item, lastUnselected) {
		const lastSelectedItem = this.lastSelectedItem || item;
		const indexOfCurrentItem = this.dataView.getIndexById(item.id);
		const dataViewLastSelectedItem = lastUnselected ||
			this.dataView.find(image => image._id === lastSelectedItem._id, true);
		const indexOfLastSelectedItem = dataViewLastSelectedItem ?
			this.dataView.getIndexById(dataViewLastSelectedItem.id) : indexOfCurrentItem;
		const start = indexOfLastSelectedItem > indexOfCurrentItem ?
			indexOfCurrentItem : indexOfLastSelectedItem;
		const end = indexOfLastSelectedItem > indexOfCurrentItem ?
			indexOfLastSelectedItem : indexOfCurrentItem;
		const newSelectedItems = this.dataView.data.serialize().slice(start, end + 1);
		return newSelectedItems;
	}

	getSelectedItems() {
		return Object.values(this.selectedImages);
	}

	getSelectedIds() {
		const images = this.getSelectedItems();

		return images.reduce((acc, val) => {
			if (!Array.isArray(acc[val.folderId])) {
				acc[val.folderId] = [];
			}
			acc[val.folderId].push(val._id);
			return acc;
		}, {});
	}

	parseImages(images) {
		if (!Array.isArray(images)) {
			images = [images];
		}

		this.lastSelectedItem = images[images.length - 1];

		return images.reduce((acc, val) => {
			acc[val._id] = val;
			return acc;
		}, {});
	}

	selectImages(images) {
		this.add(images);
		this.dataView.callEvent("customSelectChange", [this.getSelectedItems()]);
	}

	add(images) {
		Object.assign(this.selectedImages, this.parseImages(images));
	}

	remove(images) {
		if (!Array.isArray(images)) {
			images = [images];
		}

		images.forEach((obj) => {
			delete this.selectedImages[obj._id];
			if (obj._id === this.lastSelectedItem._id) this.lastSelectedItem = null;
		});
	}

	setLastUnselectedItem(element) {
		this.lastUnselected = element;
	}

	getLastUnselectedItem() {
		return this.lastUnselected;
	}

	isSelected(item) {
		return !!this.selectedImages[item._id];
	}
}
