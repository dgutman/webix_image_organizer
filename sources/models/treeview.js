import helpingFunctions from "./helpingFunctions";
import views from "./dataViews";
import dataviewFilterModel from "./dataviewFilterModel";

let realScrollPosition;

function setRealScrollPosition(position) {
	realScrollPosition = position;
}

function loadBranch(id, view) {
	const treeView = views.getTree();
	let array = [];
	let itemsArray = [];
	const item = treeView.getItem(id);
	if (!item.hasOpened && !item.linear) {
		view.showProgress();
		view.$scope.getSubTreeView()
			.loadTreeFolders("folder", item._id)
			.then((results) => {
				array.push(...results);
				view.$scope.getSubTreeView()
					.getFolderItems(item)
					.then((items) => {
						if (items) {
							array.push(...items);
							itemsArray.push(...items);
						}
						treeView.parse({
							data: array, parent: item.id
						});
						helpingFunctions.parseDataToViews(itemsArray);
						//dataviewFilterModel.prepareDataToFilter(itemsArray);
						treeView.blockEvent();
						treeView.open(id);
						treeView.unblockEvent();
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
		treeView.blockEvent();
		treeView.open(id);
		treeView.unblockEvent();
		treeView.find((obj) => {
			if (obj._modelType === "item" && obj.folderId === item._id) {
				itemsArray.push(obj);
			}
		});
		helpingFunctions.parseDataToViews(itemsArray);
	}
}


function defineSizesAndPositionForDynamicScroll(treeFolder) {
	const treeView = views.getTree();
	let branchesArray = [];
	let viewClientHeight = 0;
	let countBottom = false;

	const branchScrollHeight = treeView.getItemNode(treeFolder.id).nextSibling.scrollHeight;
	const branchesHTMLCollection = treeView.getNode().firstChild.firstChild.children;
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
	const treeView = views.getTree();
	const difference = realScrollPosition - (treeView.$height + scrollState.y - 18);
	if (difference <= 0 && difference >= -200) {
		treeView.blockEvent();
		const count = treeFolder.$count;
		const sourceParams = {
			offset: count
		};
		view.showProgress();
		ajaxActions.getLinearStucture(treeFolder._id, sourceParams)
			.then((data) => {
				if (!helpingFunctions.isObjectEmpty(data)) {
					treeView.parse({
						data: webix.copy(data), parent: treeFolder.id
					});
					setRealScrollPosition(defineSizesAndPositionForDynamicScroll(treeFolder));
					helpingFunctions.parseDataToViews(webix.copy(data), true);
					webix.copy(data).forEach((item) => {
						let itemType = helpingFunctions.searchForFileType(item);
						dataviewFilterModel.addFilterValue(itemType);
					});
					dataviewFilterModel.parseFilterToRichSelectList();
					let filterValue = dataviewFilterModel.getRichselectDataviewFilter().getValue();
					if (filterValue && filterValue.length !== 0) {
						dataviewFilterModel.getRichselectDataviewFilter().callEvent("onChange", [filterValue]);
					}
				} else {
					treeView.detachEvent("onAfterScroll");
				}
				treeView.unblockEvent();
				view.hideProgress();
			})
			.fail(() => {
				treeView.unblockEvent();
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