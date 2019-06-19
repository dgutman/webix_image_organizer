import {JetView} from "webix-jet";
import ProjectMetadataWindow from "./windows/projectMetadataWindow";
import galleryCell from "jet-views/subviews/gallery/gallery";
import metadataTableCell from "jet-views/subviews/metadataTable/metadataTable";

export default class DataviewActionPanelClass extends JetView {
	config() {
		const projectFolderWindowButton = {
			view: "button",
			css: "transparent-button",
			value: "Show Project Folder",
			name: "projectFolderWindowButtonName",
			width: 160,
			hidden: true,
			click: () => {
				this.projectMetadataWindow.showWindow();
			}
		};

		const switchButton = {
			view: "switch",
			value: 0,
			labelAlign: "right",
			width: 570,
			labelWidth: 200,
			labelRight: "Metadata table view",
			label: "Images thumbnail view",
			multiview: true
		};

		const pager = {
			view: "pager",
			width: 305,
			size: 70,
			template: (obj, common) => {
				return `${common.first()} ${common.prev()} <input type='text' class='pager-input' value='${common.page(obj)}'>
							<span class='pager-amount'>of ${obj.limit} ${this.getItemsCount(obj)}</span> ${common.next()} ${common.last()}`;
			}
		};

		const filterBySelection = {
			view: "richselect",
			css: "select-field",
			name: "filterTableBySelectionName",
			width: 305,
			label: "Filter table",
			labelWidth: 90,
			placeholder: "Select file type",
			options: {
				body: {
					template: (obj) => {
						if (obj.value) {
							return `Show ${obj.value.toUpperCase()} files`;
						}
					}
				}
			}
		};

		const multiview = {
			view: "multiview",
			cells: [
				pager,
				filterBySelection
			]
		};

		const cartButton = {
			view: "button",
			name: "hideOrShowCartListButtonName",
			css: "transparent-button",
			width: 120,
			hidden: true
		};

		return {
			name: "dataviewActionPanelClass",
			padding: 5,
			cols: [
				{width: 75},
				projectFolderWindowButton,
				{},
				switchButton,
				{},
				multiview,
				{},
				cartButton,
				{width: 40}
			]
		};
	}

	ready() {
		this.projectMetadataWindow = this.ui(ProjectMetadataWindow);
	}

	getItemsCount(pagerObj) {
		let count = pagerObj.count;
		let page = pagerObj.page + 1; //because first page in object is 0
		let pageSize = pagerObj.size;
		if (count < pageSize) {
			return `(${count}/${count})`;
		} else {
			let pageCount = pageSize * page;
			if (pageCount > count) {
				pageCount = count;
			}
			return `(${pageCount}/${count})`;
		}
	}

	getSwitcherView() {
		return this.getRoot().queryView({view: "switch"});
	}

	getPagerView() {
		return this.getRoot().queryView({view: "pager"});
	}

	getCartButton() {
		return this.getRoot().queryView({name: "hideOrShowCartListButtonName"});
	}

	getProjectFolderWindowButton() {
		return this.getRoot().queryView({name: "projectFolderWindowButtonName"});
	}

	getFilterTableView() {
		return this.getRoot().queryView({name: "filterTableBySelectionName"});
	}
}
