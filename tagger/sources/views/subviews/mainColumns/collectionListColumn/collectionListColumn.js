import {JetView} from "webix-jet";

export default class CollectionListColumn extends JetView {
	config() {
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

		const ui = {
			name: "collectionListColumn",
			margin: 10,
			rows: [
				collectionTreeView
			]
		};

		return ui;
	}

	init() {
		this.defineListTemplate();
	}

	getCollectionListColumn() {
		return this.getRoot();
	}

	getCollectionTreeView() {
		return this.getRoot().queryView({name: "collectionTreeView"});
	}
}
