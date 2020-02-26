import {JetView} from "webix-jet";
import ajax from "../../../services/ajaxActions";
import "../../components/editableTree";
import "../../components/finderCounter";

export default class FinderViewClass extends JetView {
	config() {
		const treeView = {
			view: "editableTree",
			width: 320,
			select: true,
			scroll: "auto",
			css: "finder-view",
			type: "lineTree",
			editable: true,
			editor: "text",
			editaction: "custom",
			editValue: "name",
			oncontext: {},
			template(obj, common) {
				const count = obj._modelType === "folder" && obj.$count !== -1 ? `<span class='strong-font'>(${obj.$count})</span>` : "";
				return `${common.icon(obj, common) + common.folder(obj, common)}<span style="height: 40px">${obj.name} ${count}</span>`;
			},
			scheme: {
				$init(obj) {
					if (obj._modelType === "folder") {
						obj.webix_kids = true;
					}
				}
			}
		};

		const finderCounter = {
			view: "finderCounter"
		};

		return {
			name: "finderClass",
			rows: [
				treeView,
				finderCounter
			]
		};
	}

	loadTreeFolders(parentType, parentId) {
		let foldersArray = [];
		return ajax.getFolders(parentType, parentId)
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

	getTreeCountTemplate() {
		return this.getRoot().queryView({view: "finderCounter"});
	}

	getTreePositionX() {
		return this.getRoot().positionX;
	}

	setTreePosition(scrollStateX) {
		this.getRoot().positionX = parseInt(scrollStateX);
	}
}
