import constants from "../constants";
import ajax from "../services/ajaxActions";

export default class FinderModel {
	constructor(view, finder, itemsModel) {
		this.view = view;
		this.finder = finder;
		this.itemsModel = itemsModel;
	}

	loadBranch(id, view) {
		const itemsModel = this.itemsModel;
		const finderView = this.finder;
		const array = [];
		let itemsArray = [];
		const item = finderView.getItem(id);
		if (!item.hasOpened && !item.linear && !item.caseview) {
			view.showProgress();
			return view.$scope.getSubFinderView()
				.loadTreeFolders("folder", item._id)
				.then((results) => {
					array.push(...results);
					return view.$scope.getSubFinderView()
						.getFolderItems(item)
						.then((items) => {
							if (items) {
								array.push(...items);
								itemsArray.push(...items);
							}
							itemsModel.parseItems(array, item.id);
							itemsModel.parseDataToViews(itemsArray, false, item.id, results.length);
							finderView.blockEvent();
							finderView.open(id);
							finderView.unblockEvent();
							item.hasOpened = true;
							view.hideProgress();
						})
						.catch(() => {
							view.hideProgress();
						});
				})
				.catch(() => {
					view.hideProgress();
				});
		}
		else if (item.hasOpened || item.open && item.linear) {
			return new Promise((resolve) => {
				finderView.blockEvent();
				finderView.open(id);
				finderView.unblockEvent();
				itemsArray = this.finder.data.getBranch(item.id);
				if (itemsArray.length === 1
					&& itemsArray[0]._modelType === constants.SUB_FOLDER_MODEL_TYPE) {
					itemsArray = this.finder.data.getBranch(itemsArray[0].id);
				}
				let isChildFolderExists = false;
				const filteredItems = itemsArray.filter((obj) => {
					if (obj._modelType !== "folder") {
						return true;
					}
					isChildFolderExists = true;
					return false;
				});
				itemsModel.parseDataToViews(filteredItems, false, item.id, isChildFolderExists);
				resolve();
			});
		}

		else if (item.caseview) {
			return new Promise((resolve) => {
				finderView.blockEvent();
				itemsArray = this.finder.data.getBranch(item.id);
				if (itemsArray.length === 1
					&& itemsArray[0]._modelType === constants.SUB_FOLDER_MODEL_TYPE) {
					itemsArray = this.finder.data.getBranch(itemsArray[0].id);
				}
				let isChildFolderExists = false;
				if (itemsArray.length > 0) {
					const filteredItems = itemsArray.filter((obj) => {
						if (obj._modelType !== "folder") {
							return true;
						}
						isChildFolderExists = true;
						return false;
					});
					itemsModel.parseDataToViews(filteredItems, false, item.id, isChildFolderExists);
					finderView.open(id);
					finderView.unblockEvent();
				}
				else {
					ajax.findCaseItems(item.name)
						.then((data) => {
							if (data.length > 0) {
								const filteredItems = data.filter((obj) => {
									if (obj._modelType !== "folder") {
										return true;
									}
									isChildFolderExists = true;
									return false;
								});
								itemsModel.parseItems(filteredItems, item.id);
								itemsModel.parseDataToViews(filteredItems, false, item.id, false);
								finderView.open(id);
								finderView.unblockEvent();
							}
						});
				}
				resolve();
			});
		}
	}
}

