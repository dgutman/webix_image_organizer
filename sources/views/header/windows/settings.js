import {JetView} from "webix-jet";
<<<<<<< HEAD
import webixViews from "../../../models/webixViews";
import utils from "../../../utils/utils";
import constants from "../../../constants";
=======
import viewEvents from "../../../utils/viewEvents";
import webixViews from "../../../models/webixViews";
>>>>>>> a43c0359131ee95b214c2d18f5e2cc5da3eb88a4

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
<<<<<<< HEAD
					name: constants.MOUSE_LEFT_SINGLE_CLICK,
=======
					name: "mouseLeftSingle",
>>>>>>> a43c0359131ee95b214c2d18f5e2cc5da3eb88a4
					placeholder: "Choose action",
					labelWidth: 200,
					validate: this.validateMouseClicks,
					invalidMessage: "Same action for different mouse clicks",
					label: "Mouse left button single click",
					options: mouseOptions,
					on: {
<<<<<<< HEAD
						//onChange: this.onChangeMouseClicks
=======
						onChange: this.onChangeMouseClicks
>>>>>>> a43c0359131ee95b214c2d18f5e2cc5da3eb88a4
					}
				},
				{
					view: "richselect",
					css: "select-field",
<<<<<<< HEAD
					name: constants.MOUSE_RIGHT_SINGLE_CLICK,
=======
					name: "mouseRightSingle",
>>>>>>> a43c0359131ee95b214c2d18f5e2cc5da3eb88a4
					placeholder: "Choose action",
					labelWidth: 200,
					validate: this.validateMouseClicks,
					invalidMessage: "Same action for different mouse clicks",
					label: "Mouse right button single click",
					options: mouseOptions,
					on: {
<<<<<<< HEAD
						//onChange: this.onChangeMouseClicks
=======
						onChange: this.onChangeMouseClicks
>>>>>>> a43c0359131ee95b214c2d18f5e2cc5da3eb88a4
					}
				},
				{
					view: "richselect",
					css: "select-field",
<<<<<<< HEAD
					name: constants.MOUSE_LEFT_DOUBLE_CLICK,
=======
					name: "mouseLeftDouble",
>>>>>>> a43c0359131ee95b214c2d18f5e2cc5da3eb88a4
					placeholder: "Choose action",
					labelWidth: 200,
					validate: this.validateMouseClicks,
					invalidMessage: "Same action for different mouse clicks",
					label: "Mouse left button double click",
					options: mouseOptions,
					on: {
<<<<<<< HEAD
						//onChange: this.onChangeMouseClicks
=======
						onChange: this.onChangeMouseClicks
>>>>>>> a43c0359131ee95b214c2d18f5e2cc5da3eb88a4
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
<<<<<<< HEAD
					const values = this.settingsForm.getValues();
					const galleryDataview = webixViews.getGalleryDataview();
					const metadataTable = webixViews.getMetadataTableView();

					utils.setMouseSettingsEvents(galleryDataview, metadataTable, values);
=======
					const galleryDataview = webixViews.getGalleryDataview();
					const metadataTable = webixViews.getMetadataTableView();
					viewEvents.setDataviewEvent(galleryDataview, "open", "onItemClick");
					viewEvents.setDatatableEvent(metadataTable, "open", "onItemClick");
>>>>>>> a43c0359131ee95b214c2d18f5e2cc5da3eb88a4
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
<<<<<<< HEAD
=======

>>>>>>> a43c0359131ee95b214c2d18f5e2cc5da3eb88a4
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
<<<<<<< HEAD
		const settingsFromValues = utils.getLocalStorageSettingsValues() || utils.getDefaultMouseSettingsValues();
		this.settingsForm.setValues(settingsFromValues);
=======
>>>>>>> a43c0359131ee95b214c2d18f5e2cc5da3eb88a4
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