import {JetView} from "webix-jet";
import ajax from "../../../services/ajaxActions";
import "../../components/editableTree";
import "../../components/finderCounter";
import constants from "../../../constants";

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
			template: (obj, common) => {
				const branch = this.getTreeRoot().data.getBranch(obj.id);
				let count = obj._modelType === "folder" ? obj.$count : -1;
				if (obj._modelType === "folder" && branch.length === 1 && branch[0]._modelType === constants.SUB_FOLDER_MODEL_TYPE) {
					count = branch[0].$count;
				}
				const countTemplate = count >= 0 ? `<span class='strong-font'>(${count})</span>` : "";
				const loadingStatus = obj.linear || obj.caseview;
				const loadingIcon = loadingStatus ? `<i class='${loadingStatus.icon}' style='color: ${loadingStatus.iconColor};'></i>` : "";
				return `${common.icon(obj, common) + common.folder(obj, common)}<span style="height: 40px">${obj.name} ${countTemplate} ${loadingIcon}</span>`;
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
			id: constants.FINDER_VIEW_ID,
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
