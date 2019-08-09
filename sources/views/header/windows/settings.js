import {JetView} from "webix-jet";
import webixViews from "../../../models/webixViews";
import utils from "../../../utils/utils";
import constants from "../../../constants";

const mouseOptions = [
	{id: "open", value: "Image open in new window"},
	{id: "edit", value: "Cell edit"},
	{id: "select", value: "Row selection"}
];

export default class SettingsWindow extends JetView {
	config() {
		const settingsForm = {
			view: "form",
			name: "settingsForm",
			borderless: true,
			elements: [
				{
					view: "richselect",
					css: "select-field",
					icon: "fas fa-chevron-down",
					name: constants.MOUSE_LEFT_SINGLE_CLICK,
					placeholder: "Choose action",
					labelWidth: 210,
					validate: this.validateMouseClicks,
					invalidMessage: "Same action for different mouse clicks",
					label: "Mouse left button single click",
					options: mouseOptions,
					on: {
						// onChange: this.onChangeMouseClicks
					}
				},
				{
					view: "richselect",
					css: "select-field",
					icon: "fas fa-chevron-down",
					name: constants.MOUSE_RIGHT_SINGLE_CLICK,
					placeholder: "Choose action",
					labelWidth: 210,
					validate: this.validateMouseClicks,
					invalidMessage: "Same action for different mouse clicks",
					label: "Mouse right button single click",
					options: mouseOptions,
					on: {
						// onChange: this.onChangeMouseClicks
					}
				},
				{
					view: "richselect",
					icon: "fas fa-chevron-down",
					css: "select-field",
					name: constants.MOUSE_LEFT_DOUBLE_CLICK,
					placeholder: "Choose action",
					labelWidth: 210,
					validate: this.validateMouseClicks,
					invalidMessage: "Same action for different mouse clicks",
					label: "Mouse left button double click",
					options: mouseOptions,
					on: {
						// onChange: this.onChangeMouseClicks
					}
				}
			]
		};

		const saveButton = {
			view: "button",
			name: "saveButton",
			value: "Save",
			css: "btn",
			height: 30,
			width: 100,
			click: () => {
				if (this.settingsForm.validate()) {
					const values = this.settingsForm.getValues();
					const galleryDataview = webixViews.getGalleryDataview();
					const metadataTable = webixViews.getMetadataTableView();

					utils.setMouseSettingsEvents(galleryDataview, metadataTable, values);
					this.getRoot().hide();
				}
			}
		};

		const cancelButton = {
			view: "button",
			name: "cancelButton",
			css: "btn-contour",
			value: "Cancel",
			height: 30,
			width: 100,
			click: () => this.hideWindow()
		};


		const settingsWindow = {
			view: "window",
			scroll: true,
			paddingX: 35,
			width: 470,
			move: true,
			modal: true,
			position: "center",
			type: "clean",
			head: {
				cols: [
					{
						view: "template",
						css: "edit-window-header",
						name: "headerTemplateName",
						template: "Settings",
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "fas fa-times",
						width: 30,
						height: 30,
						click: () => this.hideWindow()
					}
				]
			},
			body: {
				borderless: true,
				rows: [
					{
						margin: 10,
						type: "clean",
						cols: [
							settingsForm
						]
					},
					{},
					{
						cols: [
							{},
							saveButton,
							{width: 15},
							cancelButton,
							{width: 20}
						]
					},
					{height: 15}
				]
			}
		};
		return settingsWindow;
	}

	ready(view) {
		this.settingsForm = this.getSettingsForm();
	}

	getSettingsForm() {
		return this.getRoot().queryView({name: "settingsForm"});
	}

	validateMouseClicks(value, obj, name) {
		const values = this.getValues();
		for (let key in values) {
			if (name !== key && values[key] === value && value) {
				return false;
			}
		}
		return value || true;
	}

	onChangeMouseClicks(value, oldValue) {
		if (value !== oldValue) {
			if (!this.validate()) {
				this.blockEvent();
				this.setValue("");
				this.unblockEvent();
			}
		}
	}

	showWindow() {
		this.settingsFormValues = utils.getLocalStorageSettingsValues() || utils.getDefaultMouseSettingsValues();
		this.settingsForm.setValues(this.settingsFormValues);
		this.getRoot().show();
	}

	hideWindow() {
		const values = this.settingsForm.getValues();
		if (JSON.stringify(values) === JSON.stringify(this.settingsFormValues)) {
			this.settingsForm.clearValidation();
			this.getRoot().hide();
		}
		else {
			webix.confirm({
				title: "Attention!",
				text: "Are you sure you don't want to save your changes?",
				type: "confirm-warning",
				cancel: "Yes",
				ok: "No",
				callback: (result) => {
					if (!result) {
						this.settingsForm.clearValidation();
						this.getRoot().hide();
					}
				}
			});
		}
	}
}
