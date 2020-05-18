import {JetView} from "webix-jet";

webix.type(webix.ui.tree, {
	name: "custom",
	baseType: "lineTree",
	folder(obj) {
		if (obj.open || (obj.hasOpened && obj.$count <= 0)) return "<div class='webix_tree_folder_open'></div>";
		if (obj._modelType !== "folder") return "<div class='webix_tree_file'></div>";
		return "<div class='webix_tree_folder'></div>";
	}
});

export default class UploadMetadataSidebar extends JetView {
	config() {
		const tree = {
			view: "tree",
			localId: "sidebarTree",
			width: 320,
			select: true,
			scroll: "auto",
			css: "finder-view",
			type: "custom",
			template(obj, common) {
				const itemCount = obj.hasOwnProperty("_itemsCount") ? `<b class='strong-font'>(${obj._itemsCount})</b>` : "";
				return `${common.icon(obj, common) + common.folder(obj, common)}<span style="height: 40px">${obj.name} ${itemCount}</span>`;
			},
			scheme: {
				$init(obj) {
					if (obj._modelType === "folder") {
						obj.webix_kids = true;
					}
				}
			}
		};

		const ui = {
			rows: [
				tree
			]
		};

		return ui;
	}

	getTreeView() {
		return this.$$("sidebarTree");
	}
}
