import SelectedItemsModel from "../models/selectItemsModel";

export default class SelectItemsService {
	constructor(dataView) {
		this.selectModel = new SelectedItemsModel(dataView);
		this.dataView = dataView;
		this.invisibleItems = [];
		this.markAllSelectedItems();
	}

	markMainSelectedItems() {
		const selectedItemsArray = this.selectModel.getArrayOfSelectedItems();
		this.dataView.unselectAll();
		this.dataView.select(
			selectedItemsArray
				.filter(item => this.dataView.exists(item.id))
				.map(obj => obj.id)
		);
	}

	markSecondarySelectedItems() {
		const selectedItemsArray = this.selectModel.getArrayOfSelectedItems();
		const secondaryDataViews = this.selectModel.getSecondaryDataViews();
		if (secondaryDataViews.length) {
			secondaryDataViews.forEach((sDataView) => {
				sDataView.unselectAll();
				selectedItemsArray.forEach((item) => {
					if (sDataView.exists(item.id)) {
						sDataView.select(item.id, true);
					}
				});
			});
		}
	}

	markAllSelectedItems() {
		const selectedItems = this.selectModel.getSelectedItems();
		selectedItems.data.attachEvent("onStoreUpdated", () => {
			this.markMainSelectedItems();
			this.markSecondarySelectedItems();
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
		if (!this.selectModel.isSelected(item)) {
			this.selectModel.add(newSelectedItems);
			this.selectModel.setLastUnselectedItem();
		}
		else {
			const lastUnselected = this.selectModel.getLastUnselectedItem();
			if (lastUnselected && isShiftKey) {
				newSelectedItems = this.getNewSelectedItems(item, lastUnselected);
			}
			this.selectModel.setLastUnselectedItem(item);
			this.selectModel.remove(newSelectedItems);
		}
		this.dataView.callEvent("customSelectChange", [this.selectModel.getArrayOfSelectedItems()]);
	}

	selectAllVisibleItems(pager) {
		let visibleData = this.dataView.serialize();
		if (pager) {
			const pData = pager.data;
			const values = {
				amount: pData.count,
				start: pData.count ? pData.page * pData.size : 0,
				end: pData.page + 1 === pData.limit || !pData.count ? pData.count : (pData.page + 1) * pData.size
			};
			visibleData = visibleData.slice(values.start, values.end);
		}
		this.selectModel.add(visibleData);
		this.dataView.callEvent("customSelectChange", [this.selectModel.getArrayOfSelectedItems()]);
	}

	selectAllItems() {
		let data = this.dataView.serialize();

		this.selectModel.add(data);
		this.dataView.callEvent("customSelectChange", [this.selectModel.getArrayOfSelectedItems()]);
	}

	unselectAllItems() {
		const unselectArray = this.selectModel.getArrayOfSelectedItems();
		this.selectModel.remove(unselectArray);
		this.dataView.callEvent("customSelectChange", [this.selectModel.getArrayOfSelectedItems()]);
	}

	getNewSelectedItems(item, lastUnselected) {
		const selectedArray = this.selectModel.getArrayOfSelectedItems();
		const lastSelectedItem = selectedArray.pop() || item;
		const indexOfCurrentItem = this.dataView.getIndexById(item.id);
		const dataViewLastSelectedItem = lastUnselected || this.dataView.find(image => image._id === lastSelectedItem._id, true);
		const indexOfLastSelectedItem = dataViewLastSelectedItem ? this.dataView.getIndexById(dataViewLastSelectedItem.id) : indexOfCurrentItem;
		const start = indexOfLastSelectedItem > indexOfCurrentItem ? indexOfCurrentItem : indexOfLastSelectedItem;
		const end = indexOfLastSelectedItem > indexOfCurrentItem ? indexOfLastSelectedItem : indexOfCurrentItem;
		const newSelectedItems = this.dataView.data.serialize().slice(start, end + 1);
		return newSelectedItems;
	}

	addSecondaryDataView(dataView) {
		this.selectModel.addSecondaryDataView(dataView);
	}

	clearSecondaryDataviews() {
		this.selectModel.clearSecondaryDataviews();
	}

	getSelectedItems() {
		return this.selectModel.getArrayOfSelectedItems();
	}

	onBeforeNewDataLoad() {
		const selectedItemsArray = this.selectModel.getArrayOfSelectedItems();
		this.parseInvisibleItems(selectedItemsArray);
		this.unselectAllItems();
	}

	onAfterNewDataLoad(collectionIds, skipCollectionChecking) {
		this.invisibleItems = this.invisibleItems.filter((item) => {
			const isCollectionExists = collectionIds.includes(item.baseParentId);

			const foundedItem = this.dataView.find(obj => obj._id === item._id, true);
			if (foundedItem) {
				this.selectModel.add(foundedItem);
			}
			return !foundedItem && (isCollectionExists || skipCollectionChecking);
		});
		this.dataView.callEvent("customSelectChange", [this.selectModel.getArrayOfSelectedItems()]);
	}

	parseInvisibleItems(items) {
		this.invisibleItems = this.invisibleItems.concat(items);
		return this.invisibleItems;
	}

	clearInvisibleItems() {
		this.invisibleItems = [];
	}

	clearModel() {
		this.unselectAllItems();
		this.clearInvisibleItems();
	}
}
