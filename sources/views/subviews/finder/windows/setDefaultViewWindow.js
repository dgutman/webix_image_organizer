import {JetView} from "webix-jet";
import ajax from "../../../../services/ajaxActions";
import constants from "../../../../constants";

const SAVE_DSA_BUTTON = "saveDsaDefaultViewButton";
const EDIT_DSA_BUTTON = "editDsaDefaultViewButton";
const CANCEL_DSA_BUTTON = "cancelDsaDefaultViewButton";

const SAVE_CASE_BUTTON = "saveCaseViewButton";
const EDIT_CASE_BUTTON = "editCaseViewButton";
const CANCEL_CASE_BUTTON = "cancelCaseViewButton";


export default class SetDefaultViewWindow extends JetView {
	constructor(app, config = {}) {
		super(app, config);
		this.folder = {};
	}

	config() {
		const saveDsaDefaultViewButton = {
			view: "button",
			css: "btn",
			name: SAVE_DSA_BUTTON,
			width: 100,
			height: 30,
			value: "Save",
			hidden: true,
			click: () => {
				const selectView = this.getDsaDefaultView();
				const newOptionValue = selectView.getText();
				this.folder.meta.dsaDefaultView = newOptionValue;
				const params = {};
				if (this.folder._id && this.folder.meta) {
					params.metadata = JSON.stringify(this.folder.meta);
					ajax.updateFolderMetadata(this.folder._id, params)
						.then((result) => {
							if (result) {
								webix.message("Changes are successfully saved");
								this.dsaDefaultView = newOptionValue;
							}
							else {
								webix.message("Something went wrong");
								this.folder.meta.dsaDefaultView = this.dsaDefaultView;
								selectView.setValue(this.dsaDefaultView);
							}
						});
				}
				else {
					webix.message("Something went wrong");
				}
				const cancelActionButton = this.getActionButton(CANCEL_DSA_BUTTON);
				const saveActionButton = this.getActionButton(SAVE_DSA_BUTTON);
				const editActionButton = this.getActionButton(EDIT_DSA_BUTTON);
				cancelActionButton.hide();
				saveActionButton.hide();
				editActionButton.show();
				selectView.disable();
			}
		};

		const editDsaDefaultViewButton = {
			view: "button",
			css: "btn",
			name: EDIT_DSA_BUTTON,
			width: 100,
			height: 30,
			value: "Edit",
			hidden: false,
			click: () => {
				const editField = this.getDsaDefaultView();
				const cancelActionButton = this.getActionButton(CANCEL_DSA_BUTTON);
				const saveActionButton = this.getActionButton(SAVE_DSA_BUTTON);
				const editActionButton = this.getActionButton(EDIT_DSA_BUTTON);
				editActionButton.hide();
				cancelActionButton.show();
				saveActionButton.show();
				editField.enable();
			}
		};

		const cancelDsaDefaultViewButton = {
			view: "button",
			css: "btn",
			name: CANCEL_DSA_BUTTON,
			width: 100,
			height: 30,
			value: "Cancel",
			hidden: true,
			click: () => {
				const editField = this.getDsaDefaultView();
				editField.setValue(this.dsaDefaultView);
				const cancelActionButton = this.getActionButton(CANCEL_DSA_BUTTON);
				const saveActionButton = this.getActionButton(SAVE_DSA_BUTTON);
				const editActionButton = this.getActionButton(EDIT_DSA_BUTTON);
				editField.disable();
				cancelActionButton.hide();
				saveActionButton.hide();
				editActionButton.show();
			}
		};

		const saveCaseViewButton = {
			view: "button",
			css: "btn",
			name: SAVE_CASE_BUTTON,
			width: 100,
			height: 30,
			value: "Save",
			hidden: true,
			click: () => {
				const selectView = this.getCaseViewSwitch();
				const newOptionValue = selectView.getValue();
				this.folder.meta.caseViewFlag = newOptionValue;
				const params = {};
				if (this.folder._id && this.folder.meta) {
					params.metadata = JSON.stringify(this.folder.meta);
					ajax.updateFolderMetadata(this.folder._id, params)
						.then((result) => {
							if (result) {
								webix.message("Changes are successfully saved");
								this.caseViewFlag = newOptionValue;
							}
							else {
								webix.message("Something went wrong");
								this.folder.meta.caseViewFlag = this.caseViewFlag;
								selectView.setValue(this.caseViewFlag);
							}
						});
				}
				else {
					webix.message("Something went wrong");
				}
				const cancelActionButton = this.getActionButton(CANCEL_CASE_BUTTON);
				const saveActionButton = this.getActionButton(SAVE_CASE_BUTTON);
				const editActionButton = this.getActionButton(EDIT_CASE_BUTTON);
				cancelActionButton.hide();
				saveActionButton.hide();
				editActionButton.show();
				selectView.disable();
			}
		};

		const editCaseViewButton = {
			view: "button",
			css: "btn",
			name: EDIT_CASE_BUTTON,
			width: 100,
			height: 30,
			value: "Edit",
			hidden: false,
			click: () => {
				const editField = this.getCaseViewSwitch();
				const cancelActionButton = this.getActionButton(CANCEL_CASE_BUTTON);
				const saveActionButton = this.getActionButton(SAVE_CASE_BUTTON);
				const editActionButton = this.getActionButton(EDIT_CASE_BUTTON);
				editActionButton.hide();
				cancelActionButton.show();
				saveActionButton.show();
				editField.enable();
			}
		};

		const cancelCaseViewButton = {
			view: "button",
			css: "btn",
			name: CANCEL_CASE_BUTTON,
			width: 100,
			height: 30,
			value: "Cancel",
			hidden: true,
			click: () => {
				const editField = this.getCaseViewSwitch();
				const cancelActionButton = this.getActionButton(CANCEL_CASE_BUTTON);
				const saveActionButton = this.getActionButton(SAVE_CASE_BUTTON);
				const editActionButton = this.getActionButton(EDIT_CASE_BUTTON);
				editField.disable();
				saveActionButton.hide();
				cancelActionButton.hide();
				editActionButton.show();
			}
		};

		const windowForm = {
			view: "form",
			name: "windowFormView",
			borderless: true,
			elements: []
		};

		const window = {
			view: "window",
			name: "setDsaDefaultViewWindow",
			position: "center",
			move: true,
			modal: true,
			minWidth: 600,
			// height: 500,
			head: {
				cols: [
					{
						css: "edit-window-header",
						name: "setOptionsWindowHead",
						template: "Set options"
					},
					{
						view: "button",
						type: "icon",
						icon: "fas fa-times",
						width: 30,
						height: 29,
						click: () => this.getRoot().close()
					}
				]
			},
			body: {
				rows: [
					// TODO: make it as dropdown
					// {
					// 	template: "Edit dsa default view"
					// },
					{
						view: "form",
						name: "dsaFormView",
						borderless: true,
						elements: [
							{
								template: "Edit dsa default view",
								height: 30
							},
							{
								cols: [
									{
										view: "richselect",
										css: "select-field ellipsis-text",
										name: "dsaDefaultView-select",
										disabled: true,
										label: "Set default view",
										options: [
											"",
											constants.DEFAULT_VIEW_SIGNS.SCENES_VIEW
										],
										width: 300
									},
									saveDsaDefaultViewButton,
									{gravity: 1},
									editDsaDefaultViewButton,
									cancelDsaDefaultViewButton
								]
							}
						]

					},
					{height: 10},
					{
						view: "form",
						name: "caseViewFormView",
						borderless: true,
						elements: [
							{
								template: "Switch caseview flag",
								height: 30
							},
							{
								cols: [
									{
										view: "switch",
										label: "CaseView",
										name: "caseView-switch",
										width: 300,
										disabled: true
									},
									saveCaseViewButton,
									editCaseViewButton,
									cancelCaseViewButton
								]
							}
						]
					}
				]
			}
		};

		return window;
	}

	showWindow(folder) {
		this.folder = folder;
		if (this.folder.meta.dsaDefaultView) {
			this.dsaDefaultView = this.folder.meta.dsaDefaultView;
		}
		else {
			this.dsaDefaultView = "";
		}
		if (this.folder.meta.caseViewFlag) {
			this.caseViewFlag = this.folder.meta.caseViewFlag;
		}
		else {
			this.caseViewFlag = 0;
		}
		this.fillFormElements();
		this.getRoot().show();
	}

	getFormElement(dsaDefaultView) {
		const element = {
			cols: [
				{
					view: "text",
					css: "text-field",
					disabled: true,
					value: dsaDefaultView,
					name: `${dsaDefaultView}-text`
				},
				{
					view: "button",
					type: "icon",
					icon: buttonMinusIcon,
					actionButtonName: `${dsaDefaultView}-button`,
					width: 30,
					click: () => {
						const actionButton = this.getActionButton(dsaDefaultView);
						const currentRow = actionButton.getParentView();
						const form = this.getForm();
						form.removeView(currentRow.config.id);
					}
				}
			]
		};
		return element;
	}

	fillFormElements() {
		const dsaDefaultViewTextView = this.getDsaDefaultView();
		dsaDefaultViewTextView.setValue(this.dsaDefaultView);
		const caseViewSwitch = this.getCaseViewSwitch();
		caseViewSwitch.setValue(this.caseViewFlag);
	}

	// createFormElement(option) {
	// 	const label = this.getText(option);
	// 	const actionButton = this.getActionButton(option);
	// 	return {
	// 		cols: [
	// 			label,
	// 			actionButton
	// 		]
	// 	};
	// }

	getForm() {
		return this.getRoot().queryView({name: "windowFormView"});
	}

	getActionButton(nameValue) {
		return this.getRoot().queryView({name: `${nameValue}`});
	}

	// setActionButton(nameValue) {
	// 	const newButton = {};
	// 	Object.assign(newButton, )
	// }

	// getText(option) {
	// 	return {
	// 		view: "text",
	// 		css: "text-field",
	// 		disabled: true,
	// 		value: option,
	// 		name: `${option}-text`
	// 	};
	// }

	getDsaDefaultView() {
		return this.getRoot().queryView({name: "dsaDefaultView-select"});
	}

	getCaseViewSwitch() {
		return this.getRoot().queryView({name: "caseView-switch"});
	}
}
