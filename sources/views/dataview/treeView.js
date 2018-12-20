import {JetView} from "webix-jet";
import ajax from "../../services/ajaxActions";
import "../components/editableTree";

export default class TreeView extends JetView {
	config() {
		const treeView = {
			view: "editableTree",
			width: 320,
			select: true,
			scroll: "xy",
			type: "lineTree",
			editable: true,
			editor: "text",
			editaction: "custom",
			editValue: "name",
			oncontext: {},
			template: function (obj, common) {
				return common.icon(obj, common) + common.folder(obj, common) + `<span style="height: 40px">${obj.name}</span>`;
			},
			scheme: {
				$init(obj) {
					if (obj._modelType === "folder") {
						obj.webix_kids = true;
					}
				}
			}
		};

		return {
			name: "treeViewClass",
			rows: [
				treeView
			]
		};
	}

	loadTreeFolders(parentType, parentId) {
		let foldersArray = [];
		return ajax.getFolder(parentType, parentId)
			.then((folders) => {
				foldersArray.push(...folders);
			}).then(() => foldersArray);
	}

	getFolderItems(folder) {
		let items = [];
		return ajax.getItems(folder._id)
			.then((results) => {
				items.push(...results);
			}).then(() => items);
	}

	getTreeRoot() {
		return this.getRoot().queryView({view: "editableTree"});
	}

	getTreePositionX() {
		return this.getRoot().positionX;
	}

	setTreePosition(scrollStateX) {
		this.getRoot().positionX = parseInt(scrollStateX);
	}


}
