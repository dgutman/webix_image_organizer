import utils from "../utils/utils";
import webixViews from "./webixViews";
import dataviewFilterModel from "./galleryDataviewFilterModel";
import ajaxActions from "../services/ajaxActions";

let realScrollPosition;
let treeFolderId;

function setRealScrollPosition(position) {
	realScrollPosition = position;
}

function loadBranch(id, view) {
	const itemsModel = webixViews.getItemsModel();
	const finderView = webixViews.getFinderView();
	const array = [];
	const itemsArray = [];
	const item = finderView.getItem(id);
	if (!item.hasOpened && !item.linear) {
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
						// finderView.parse({
						// 	data: array, parent: item.id
						// });
						utils.parseDataToViews(itemsArray);
						// dataviewFilterModel.prepareDataToFilter(itemsArray);
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
			finderView.find((obj) => {
				if (item.linear && obj._modelType !== "folder" || obj._modelType === "item" && obj.folderId === item._id) {
					itemsArray.push(obj);
				}
			});
			utils.parseDataToViews(itemsArray);
			resolve();
		});
	}
}

function defineSizesAndPositionForDynamicScroll(treeFolder) {
	const finderView = webixViews.getFinderView();
	let branchesArray = [];
	let viewClientHeight = 0;
	let countBottom = false;

	const branchScrollHeight = finderView.getItemNode(treeFolder.id).nextSibling.scrollHeight;
	const branchesHTMLCollection = finderView.getNode().querySelectorAll("div[webix_tm_id]");
	branchesArray = Array.from(branchesHTMLCollection);
	branchesArray.some((branchNode) => {
		let branchId = branchNode.attributes.webix_tm_id.nodeValue;
		const branchClientHeight = branchNode.clientHeight;
		if (parseInt(branchId) === treeFolder.id) {
			countBottom = true;
			return countBottom;
		}
		if (!countBottom) {
			viewClientHeight += branchClientHeight;
		}
	});
	return viewClientHeight + branchScrollHeight + 28;
}

function attachOnScrollEvent(scrollState, treeFolder, view, filterModel) {
	const finderView = webixViews.getFinderView();
	treeFolderId = treeFolder.id;
	const itemsModel = webixViews.getItemsModel();

	if (!treeFolder.linear) {
		finderView.detachEvent("onAfterScroll");
		return false;
	}

	const difference = realScrollPosition - (finderView.$height + scrollState.y - 18);
	if (difference <= 0 && difference >= -200) {
		finderView.select(treeFolderId);
		finderView.blockEvent();
		const count = treeFolder.$count;
		const sourceParams = {
			offset: count
		};
		view.showProgress();
		ajaxActions.getLinearStucture(treeFolder._id, sourceParams)
			.then((data) => {
				if (!utils.isObjectEmpty(data)) {
					itemsModel.parseItems(webix.copy(data), treeFolder.id);
					// finderView.parse({
					// 	data: webix.copy(data), parent: treeFolder.id
					// });
					setRealScrollPosition(defineSizesAndPositionForDynamicScroll(treeFolder));
					utils.parseDataToViews(webix.copy(data), true);
					webix.copy(data).forEach((item) => {
						const itemType = utils.searchForFileType(item);
						dataviewFilterModel.addFilterValue(itemType);
					});
					dataviewFilterModel.parseFilterToRichSelectList();
					const filterValue = dataviewFilterModel.getRichselectDataviewFilter().getValue();
					filterModel.clearFilters();
					if (filterValue) {
						dataviewFilterModel.getRichselectDataviewFilter().callEvent("onChange", [filterValue]);
					}
				}
				else {
					finderView.detachEvent("onAfterScroll");
				}
				finderView.unblockEvent();
				view.hideProgress();
			})
			.catch(() => {
				finderView.unblockEvent();
				view.hideProgress();
			});
	}
}

function closePreviousLinearFolder() {
	const finderView = webixViews.getFinderView();
	if (treeFolderId) {
		finderView.close(treeFolderId);
	}
}

export default {
	loadBranch,
	defineSizesAndPositionForDynamicScroll,
	attachOnScrollEvent,
	setRealScrollPosition,
	closePreviousLinearFolder
};
