import {JetView} from "webix-jet";
import viewEvents from "../../../utils/viewEvents";
import webixViews from "../../../models/webixViews";

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
					name: "mouseLeftSingle",
					placeholder: "Choose action",
					labelWidth: 200,
					validate: this.validateMouseClicks,
					invalidMessage: "Same action for different mouse clicks",
					label: "Mouse left button single click",
					options: mouseOptions,
					on: {
						onChange: this.onChangeMouseClicks
					}
				},
				{
					view: "richselect",
					css: "select-field",
					name: "mouseRightSingle",
					placeholder: "Choose action",
					labelWidth: 200,
					validate: this.validateMouseClicks,
					invalidMessage: "Same action for different mouse clicks",
					label: "Mouse right button single click",
					options: mouseOptions,
					on: {
						onChange: this.onChangeMouseClicks
					}
				},
				{
					view: "richselect",
					css: "select-field",
					name: "mouseLeftDouble",
					placeholder: "Choose action",
					labelWidth: 200,
					validate: this.validateMouseClicks,
					invalidMessage: "Same action for different mouse clicks",
					label: "Mouse left button double click",
					options: mouseOptions,
					on: {
						onChange: this.onChangeMouseClicks
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
					const galleryDataview = webixViews.getGalleryDataview();
					const metadataTable = webixViews.getMetadataTableView();
					viewEvents.setDataviewEvent(galleryDataview, "open", "onItemClick");
					viewEvents.setDatatableEvent(metadataTable, "open", "onItemClick");
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
			width: 450,
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
						icon: "times",
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
							{width: 15}
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
		this.getRoot().show();
	}

	hideWindow() {
		webix.confirm({
			title: "Attention!",
			text: "Are you sure you don't want to save your changes?",
			type: "confirm-warning",
			callback: (result) => {
				if (result) {
					this.settingsForm.clearValidation();
					this.getRoot().hide();
				}
			}
		});
	}
}