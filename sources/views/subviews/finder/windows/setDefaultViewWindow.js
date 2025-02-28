import {JetView} from "webix-jet";
import ajax from "../../../../services/ajaxActions";
import constants from "../../../../constants";

const SAVE_DSA_BUTTON = "saveDsaDefaultViewButton";
const EDIT_DSA_BUTTON = "editDsaDefaultViewButton";
const CANCEL_DSA_BUTTON = "cancelDsaDefaultViewButton";

const SAVE_CASE_VIEW_BUTTON = "saveCaseViewButton";
const EDIT_CASE_VIEW_BUTTON = "editCaseViewButton";
const CANCEL_CASE_VIEW_BUTTON = "cancelCaseViewButton";

const SAVE_STRUCTURE_BUTTON = "saveStructureButton";
const EDIT_STRUCTURE_BUTTON = "editStructureButton";
const CANCEL_STRUCTURE_BUTTON = "cancelStructureButton";

const SAVE_LABEL = "Save";
const EDIT_LABEL = "Edit";
const CANCEL_LABEL = "Cancel";

const DSA = "DSA";
const CASE_VIEW = "CASE_VIEW";
const FOLDER_STRUCTURE = "FOLDER_STRUCTURE";

export default class SetDefaultViewWindow extends JetView {
	constructor(app, config = {}) {
		super(app, config);
		this.folder = {};
		this.folderStructureSwitchName = "structureSwitch";
		this.setOptionsWindowHeadName = "setOptionsWindowHead";
		this.setDsaDefaultViewWindowName = "setOptionsWindow";
		this.dsaFormViewName = "dsaFormView";
		this.windowFormViewName = "windowFormView";
		this.dsaDefaultViewSelectName = "dsaDefaultViewSelect";
		this.caseViewSwitchName = "caseViewSwitchName";
	}

	config() {
		const saveDsaDefaultViewButton = this.createButton(SAVE_DSA_BUTTON, SAVE_LABEL, true);
		saveDsaDefaultViewButton.click = () => {
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
			this.switchButtonsVisibility(DSA);
			selectView.disable();
		};

		const editDsaDefaultViewButton = this.createButton(EDIT_DSA_BUTTON, EDIT_LABEL, false);
		editDsaDefaultViewButton.click = () => {
			const editField = this.getDsaDefaultView();
			this.switchButtonsVisibility(DSA, true);
			editField.enable();
		};

		const cancelDsaDefaultViewButton = this.createButton(CANCEL_DSA_BUTTON, CANCEL_LABEL, true);
		cancelDsaDefaultViewButton.click = () => {
			const editField = this.getDsaDefaultView();
			editField.setValue(this.dsaDefaultView);
			editField.disable();
			this.switchButtonsVisibility(DSA);
		};

		const saveCaseViewButton = this.createButton(SAVE_CASE_VIEW_BUTTON, SAVE_LABEL, true);
		saveCaseViewButton.click = () => {
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
			this.switchButtonsVisibility(CASE_VIEW);
			selectView.disable();
		};

		const editCaseViewButton = this.createButton(EDIT_CASE_VIEW_BUTTON, EDIT_LABEL, false);
		editCaseViewButton.click = () => {
			const editField = this.getCaseViewSwitch();
			this.switchButtonsVisibility(CASE_VIEW, true);
			editField.enable();
		};

		const cancelCaseViewButton = this.createButton(CANCEL_CASE_VIEW_BUTTON, CANCEL_LABEL , true);
		cancelCaseViewButton.click = () => {
			const editField = this.getCaseViewSwitch();
			editField.disable();
			this.switchButtonsVisibility(CASE_VIEW);
		};

		const saveStructureButton = this.createButton(SAVE_STRUCTURE_BUTTON, SAVE_LABEL, true);
		saveStructureButton.click = async () => {
			const newFolderStructureValue = this.getFolderStructureSwitch().getValue();
			if (newFolderStructureValue === 1) {
				this.folder.meta.isLinear = true;
			}
			else {
				this.folder.meta.isLinear = false;
			}
			const params = {};
			if (this.folder._id && this.folder.meta) {
				params.metadata = JSON.stringify(this.folder.meta);
				const result = await ajax.updateFolderMetadata(this.folder._id, params);
				if (result) {
					webix.message("Changes are successfully saved");
					this.isLinear = true;
				}
			}
		};

		const editStructureButton = this.createButton(EDIT_STRUCTURE_BUTTON, EDIT_LABEL, false);
		editStructureButton.click = () => {
			const editField = this.getFolderStructureSwitch();
			this.switchButtonsVisibility(FOLDER_STRUCTURE, true);
			editField.enable();
		};

		const cancelStructureButton = this.createButton(CANCEL_STRUCTURE_BUTTON, CANCEL_LABEL, true);
		cancelStructureButton.click = () => {
			const editField = this.getFolderStructureSwitch();
			editField.disable();
			this.switchButtonsVisibility(FOLDER_STRUCTURE);
		};

		const window = {
			view: "window",
			name: this.setDsaDefaultViewWindowName,
			position: "center",
			move: true,
			modal: true,
			minWidth: 600,
			head: {
				cols: [
					{
						css: "edit-window-header",
						name: this.setOptionsWindowHeadName,
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
						name: this.dsaFormViewName,
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
										name: this.dsaDefaultViewSelectName,
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
										name: this.caseViewSwitchName,
										width: 300,
										disabled: true
									},
									saveCaseViewButton,
									{gravity: 1},
									editCaseViewButton,
									cancelCaseViewButton
								]
							}
						]
					},
					{
						view: "form",
						name: "linierStructureFormView",
						borderless: true,
						elements: [
							{
								template: "Set default folder structure",
								height: 30
							},
							{
								cols: [
									{
										view: 'switch',
										name: this.folderStructureSwitchName,
										onLabel: "linear",
										offLabel: "tree",
										disabled: true,
										width: 300
									},
									saveStructureButton,
									{gravity: 1},
									editStructureButton,
									cancelStructureButton
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
		if (this.folder.meta.folderStructure) {
			this.isLinear = !!this.folder.meta.folderStructure;
		}
		else {
			this.isLinear = false;
		}
		this.fillFormElements();
		this.getRoot().show();
	}

	fillFormElements() {
		const dsaDefaultViewTextView = this.getDsaDefaultView();
		dsaDefaultViewTextView.setValue(this.dsaDefaultView);
		const caseViewSwitch = this.getCaseViewSwitch();
		caseViewSwitch.setValue(this.caseViewFlag);
	}

	getForm() {
		return this.getRoot().queryView({name: this.windowFormViewName});
	}

	getActionButton(nameValue) {
		return this.getRoot().queryView({name: `${nameValue}`});
	}

	getDsaDefaultView() {
		return this.getRoot().queryView({name: this.dsaDefaultViewSelectName});
	}

	getCaseViewSwitch() {
		return this.getRoot().queryView({name: this.caseViewSwitchName});
	}

	getFolderStructureSwitch() {
		return this.getRoot().queryView({name: this.folderStructureSwitchName});
	}

	switchButtonsVisibility(form, isEdit) {
		let cancelActionButton;
		let saveActionButton;
		let editActionButton;
		switch (form) {
			case DSA:
				cancelActionButton = this.getActionButton(CANCEL_DSA_BUTTON);
				saveActionButton = this.getActionButton(SAVE_DSA_BUTTON);
				editActionButton = this.getActionButton(EDIT_DSA_BUTTON);
				break;
			case CASE_VIEW:
				cancelActionButton = this.getActionButton(CANCEL_CASE_VIEW_BUTTON);
				saveActionButton = this.getActionButton(SAVE_CASE_VIEW_BUTTON);
				editActionButton = this.getActionButton(EDIT_CASE_VIEW_BUTTON);
				break;
			case FOLDER_STRUCTURE:
				cancelActionButton = this.getActionButton(CANCEL_STRUCTURE_BUTTON);
				saveActionButton = this.getActionButton(SAVE_STRUCTURE_BUTTON);
				editActionButton = this.getActionButton(EDIT_STRUCTURE_BUTTON);
				break;
			default:
				return;
		}
		if (isEdit) {
			editActionButton.hide();
			cancelActionButton.show();
			saveActionButton.show();
		}
		else {
			saveActionButton.hide();
			cancelActionButton.hide();
			editActionButton.show();
		}
	}

	createButton(name, value, hidden) {
		return {
			view: "button",
			css: "btn",
			name: name,
			width: 100,
			height: 30,
			value: value,
			hidden: hidden
		};
	}
}
