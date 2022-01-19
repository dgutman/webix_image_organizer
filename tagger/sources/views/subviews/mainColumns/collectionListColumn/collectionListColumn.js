import {JetView} from "webix-jet";
import SearchWithHeaderClass from "../parts/searchWithHeader";

const SearchWithHeaderConfig = {
	headerValue: "Collections list",
	searchPlaceholder: "Search collection",
	viewWithData: {}
};

export default class CollectionListColumn extends JetView {
	config() {
		// const collectionList = {
		// 	view: "list",
		// 	name: "collectionList",
		// 	tooltip: "#name#",
		// 	css: "ellipsis-text",
		// 	borderless: true
		// };

		const collectionTreeView = {
			view: "tree",
			name: "collectionTreeView",
			gravity: 2,
			borderless: true,
			select: true,
			multiselect: "level",
			scroll: "auto",
			css: "finder-view",
			type: "lineTree",
			oncontext: {},
			template(obj, common) {
				return `${common.icon(obj, common) + common.folder(obj, common)}<span style="height: 40px">${obj.name}</span>`;
			},
			scheme: {
				$init(obj) {
					if (obj._modelType === "folder" || obj._modelType === "collection") {
						obj.webix_kids = true;
					}
				}
			}
		};

		// const selectAllTemplate = {
		// 	name: "selectAllTemplate",
		// 	height: 40,
		// 	css: "collection-list-select-template",
		// 	template: () => "<div><a class='select-all'>Select all</a></div> <div><a class='unselect-all'>Unselect all</a></div>",
		// 	borderless: true
		// };

		const ui = {
			name: "collectionListColumn",
			margin: 10,
			rows: [
				// {$subview: new SearchWithHeaderClass(this.app, "", SearchWithHeaderConfig), name: "searchWithHeader"},
				// collectionList,
				collectionTreeView
				// selectAllTemplate
			]
		};

		return ui;
	}

	init(view) {
		// this.collectionList = this.getCollectionList();
		this.defineListTemplate();
	}

	getCollectionListColumn() {
		return this.getRoot();
	}

	// getCollectionList() {
	// 	return this.getRoot().queryView({name: "collectionList"});
	// }

	getCollectionTreeView() {
		return this.getRoot().queryView({name: "collectionTreeView"});
	}

	// getSelectAllTemplate() {
	// 	return this.getRoot().queryView({name: "selectAllTemplate"});
	// }

	// getSearchInput() {
	// 	return this.getSubView("searchWithHeader").getSearchInput();
	// }

	// defineListTemplate() {
	// 	this.collectionList.define("template", (obj) => {
	// 		const checkboxState = this.collectionList.isSelected(obj.id) ? "fas fa-check-square" : "far fa-square";
	// 		return `<div class='ellipsis-text' onmousedown='return false' onselectstart='return false'><i class='icon-btn checkbox-icon ${checkboxState}'></i> <span class='item-name'>${obj.name}</span></div>`;
	// 	});
	// 	this.collectionList.refresh();
	// }
}
