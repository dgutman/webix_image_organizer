import utils from "../utils/utils";
import webixViews from "./webixViews";
import dataviewFilterModel from "./galleryDataviewFilterModel";

let realScrollPosition;

function setRealScrollPosition(position) {
	realScrollPosition = position;
}

function loadBranch(id, view) {
	const finderView = webixViews.getFinderView();
	let array = [];
	let itemsArray = [];
	const item = finderView.getItem(id);
	if (!item.hasOpened && !item.linear) {
		view.showProgress();
		view.$scope.getSubFinderView()
			.loadTreeFolders("folder", item._id)
			.then((results) => {
				array.push(...results);
				view.$scope.getSubFinderView()
					.getFolderItems(item)
					.then((items) => {
						if (items) {
							array.push(...items);
							itemsArray.push(...items);
						}
						finderView.parse({
							data: array, parent: item.id
						});
						utils.parseDataToViews(itemsArray);
						//dataviewFilterModel.prepareDataToFilter(itemsArray);
						finderView.blockEvent();
						finderView.open(id);
						finderView.unblockEvent();
						item.hasOpened = true;
						view.hideProgress();
					})
					.fail(() => {
						view.hideProgress();
					});
			})
			.fail(() => {
				view.hideProgress();
			});
	} else if (item.hasOpened) {
		finderView.blockEvent();
		finderView.open(id);
		finderView.unblockEvent();
		finderView.find((obj) => {
			if (obj._modelType === "item" && obj.folderId === item._id) {
				itemsArray.push(obj);
			}
		});
		utils.parseDataToViews(itemsArray);
	}
}


function defineSizesAndPositionForDynamicScroll(treeFolder) {
	const finderView = webixViews.getFinderView();
	let branchesArray = [];
	let viewClientHeight = 0;
	let countBottom = false;

	const branchScrollHeight = finderView.getItemNode(treeFolder.id).nextSibling.scrollHeight;
	const branchesHTMLCollection = finderView.getNode().firstChild.firstChild.children;
	branchesArray.push(...branchesHTMLCollection);
	branchesArray.forEach((branchNode) => {
		let branchId = branchNode.firstChild.attributes.webix_tm_id.nodeValue;
		const branchClientHeight = branchNode.clientHeight;
		if (parseInt(branchId) === treeFolder.id) {
			countBottom = true;
			return;
		}
		if (!countBottom) {
			viewClientHeight += branchClientHeight;
		}
	});
	return (viewClientHeight + branchScrollHeight + 28);
}

function attachOnScrollEvent(scrollState, treeFolder, view, ajaxActions) {
	const finderView = webixViews.getFinderView();
	const difference = realScrollPosition - (finderView.$height + scrollState.y - 18);
	if (difference <= 0 && difference >= -200) {
		finderView.blockEvent();
		const count = treeFolder.$count;
		const sourceParams = {
			offset: count
		};
		view.showProgress();
		ajaxActions.getLinearStucture(treeFolder._id, sourceParams)
			.then((data) => {
				if (!utils.isObjectEmpty(data)) {
					finderView.parse({
						data: webix.copy(data), parent: treeFolder.id
					});
					setRealScrollPosition(defineSizesAndPositionForDynamicScroll(treeFolder));
					utils.parseDataToViews(webix.copy(data), true);
					webix.copy(data).forEach((item) => {
						let itemType = utils.searchForFileType(item);
						dataviewFilterModel.addFilterValue(itemType);
					});
					dataviewFilterModel.parseFilterToRichSelectList();
					let filterValue = dataviewFilterModel.getRichselectDataviewFilter().getValue();
					if (filterValue && filterValue.length !== 0) {
						dataviewFilterModel.getRichselectDataviewFilter().callEvent("onChange", [filterValue]);
					}
				} else {
					finderView.detachEvent("onAfterScroll");
				}
				finderView.unblockEvent();
				view.hideProgress();
			})
			.fail(() => {
				finderView.unblockEvent();
				view.hideProgress();
			});
	}
}

export default {
	loadBranch,
	defineSizesAndPositionForDynamicScroll,
	attachOnScrollEvent,
	setRealScrollPosition
};