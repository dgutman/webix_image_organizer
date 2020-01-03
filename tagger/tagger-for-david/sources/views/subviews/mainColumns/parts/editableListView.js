import {JetView} from "webix-jet";
import SearchWithHeaderClass from "./searchWithHeader";
import EditableListService from "../../../../services/mainColumns/editableListService/editableListService";
import "../../../components/editableList";

export default class EditableListView extends JetView {
	constructor(app, name, service, subConfig) {
		super(app, name);
		this.service = service;
		this.subConfig = subConfig;
	}

	config() {
		const editableList = {
			view: "editableList",
			name: "editableList",
			css: "tagger-editable-list",
			tooltip: `#${this.subConfig.editValue}#`,
			template: (obj, common) => {
				const itemState = this.subConfig.isViewEditable && !obj._id ? "not-saved-item" : "";
				const deleteBtn = this.subConfig.isViewEditable ? "<i class='icon-btn delete-item-icon fas fa-times'></i>" : "";
				return `<div class='list-item ${itemState}'>
							<div class='list-item-name'>
								<i class='icon-btn image-icon fas fa-image'></i>
								${obj[this.subConfig.editValue]}
							</div>
 							${common.switchIcon(obj, common)}
 							${deleteBtn}
 						</div>`;
			},
			type: {
				switchIcon(obj) {
					let switchState = "off";
					switch (obj.type) {
						case "multi": {
							switchState = "on";
							break;
						}
						case "single": {
							switchState = "off";
							break;
						}
						default: {
							return "";
						}
					}
					let switchIcon = `<div class='switch-icon icon-btn switch-type'>${obj.type} <span class='switch-type fas fa-toggle-${switchState}'></span></div>`;
					return switchIcon;
				}
			},
			borderless: true,
			editable: false,
			select: true,
			editor: "text",
			editValue: this.subConfig.editValue,
			editaction: "dblclick"
		};

		const addNewItemTemplate = {
			template: () => `<div class='add-new-item-flex-container'><a class='add-new'><i class="fas fa-plus-circle"></i> ${this.subConfig.addItemBtnText}</a></div>`,
			name: "addNewItemTemplate",
			height: 25,
			borderless: true,
			hidden: !this.subConfig.isViewEditable
		};

		const saveBtn = {
			view: "button",
			name: "saveBtn",
			css: "btn",
			label: "Save"
		};

		const editModeBtn = {
			view: "button",
			name: "editModeBtn",
			css: "btn",
			value: "Edit mode (turn on)"
		};

		const buttonsForm = {
			view: "form",
			name: "buttonsForm",
			type: "clean",
			borderless: true,
			hidden: !this.subConfig.isViewEditable,
			margin: 10,
			elements: [
				editModeBtn,
				saveBtn
			],
			elementsConfig: {
				height: 30
			}
		};

		const editableListContainer = {
			disabled: true,
			css: "disabled-editing",
			margin: 10,
			rows: [
				{$subview: new SearchWithHeaderClass(this.app, "", this.subConfig), name: "searchWithHeader"},
				editableList,
				addNewItemTemplate,
				buttonsForm
			]
		};

		return editableListContainer;
	}

	ready(view) {
		this.buttonsForm = this.getButtonsForm();
		this.editableList = this.getEditableList();
		this.editListViewService = new EditableListService(view);
	}

	getEditableList() {
		return this.getRoot().queryView({name: "editableList"});
	}

	getAddNewItemTemplate() {
		return this.getRoot().queryView({name: "addNewItemTemplate"});
	}

	getButtonsForm() {
		return this.getRoot().queryView({name: "buttonsForm"});
	}

	getEditModeButton() {
		return this.buttonsForm.queryView({name: "editModeBtn"});
	}

	getSaveBtn() {
		return this.buttonsForm.queryView({name: "saveBtn"});
	}

	getSearchWithHeaderClass() {
		return this.getSubView("searchWithHeader");
	}

	getSearchInput() {
		return this.getSubView("searchWithHeader").getSearchInput();
	}
}
