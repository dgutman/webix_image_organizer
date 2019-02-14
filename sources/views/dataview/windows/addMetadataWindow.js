import {JetView} from "webix-jet";
import addNewMetadataWindowModel from "../../../models/addNewMetadataWindow";
import utils from "../../../utils/utils";
import ajaxActions from "../../../services/ajaxActions";

let itemId;

export default class AddMetadataWindow extends JetView {
	config() {
		const addNewMetadataFieldButton = {
			view: "button",
			type: "icon",
			width: 30,
			name: "addNewMetadataFieldButtonName",
			icon: "plus",
			value: "Add new field",
			click: () => {
				let elementsNamesToChange = [];
				let newElementsNames = [];
				let objectOfNamesAndValuesToSet = {};
				let regExp = /-.*$/;
				let wasRemoved = addNewMetadataWindowModel.getWasRemoved();
				this.addNewElementToForm();
				let elementsToAdd = addNewMetadataWindowModel.getAddedElements();
				let metadataAddedFieldsValues = this.metadataAddedFieldsWindowForm.getValues();
				webix.ui(elementsToAdd, this.metadataAddedFieldsWindowForm);
				if (wasRemoved) {
					let keys = Object.keys(metadataAddedFieldsValues);
					let values = Object.values(metadataAddedFieldsValues);
					keys.forEach((key, index) => {
						let remainder = index % 2;
						if (remainder > 0) {
							elementsNamesToChange.push({
								name: keys[index-1],
								value: keys[index]
							});
						}
					});
					elementsNamesToChange.forEach((elementsName, index) => {
						let addedName = elementsName.name;
						let addedValue = elementsName.value;
						let newAddedName = addedName.replace(regExp, `-${index + 1}`);
						let newAddedValue = addedValue.replace(regExp, `-${index + 1}`);
						newElementsNames.push(newAddedName);
						newElementsNames.push(newAddedValue);
					});
					newElementsNames.forEach((elementName, index) => {
						objectOfNamesAndValuesToSet[elementName] = values[index];
					});
				} else {
					objectOfNamesAndValuesToSet = metadataAddedFieldsValues;
				}
				this.metadataAddedFieldsWindowForm.setValues(objectOfNamesAndValuesToSet);
				addNewMetadataWindowModel.setWasRemoved(false);
			}
		};

		const metadataInitialWindowForm = {
			view: "form",
			name: "metadataInitialWindowFormName",
			borderless: true,
			elements: [
				{
					name: "initialName",
					view: "text",
					label: "Name",
					validate: webix.rules.isNotEmpty,
					css: "select-field",
					invalidMessage: "Name field should not be empty"
				},
				{
					name: "initialValue",
					view: "text", label: "Value",
					validate: webix.rules.isNotEmpty,
					css: "select-field",
					invalidMessage: "Value field should not be empty"
				}
			]
		};

		const metadataAddedFieldsWindowForm = {
			view: "form",
			name: "metadataAddedFieldsWindowFormName",
			borderless: true,
			elements: [] //init by clicking on 'plus' button
		};

		const saveButton = {
			view: "button",
			name: "saveButton",
			value: "Add",
			css: "btn",
			height: 30,
			width: 100,
			click: () => {
				let objectNames = [];
				let objectValues = [];
				let objectToPost = {};
				if (this.metadataInitialWindowForm.validate() && this.metadataAddedFieldsWindowForm.validate()) {
					let metadataInitialValues = this.metadataInitialWindowForm.getValues();
					let metadataAddedFieldsValues = this.metadataAddedFieldsWindowForm.getValues();
					let initialName = utils.escapeHTML(metadataInitialValues.initialName);
					let initialValue =  utils.escapeHTML(metadataInitialValues.initialValue);
					for (let key in metadataAddedFieldsValues) {
						metadataAddedFieldsValues[key] = utils.escapeHTML(metadataAddedFieldsValues[key]);
						objectNames.push(metadataAddedFieldsValues[key]);
					}
					for (let value in metadataAddedFieldsValues) {
						metadataAddedFieldsValues[value] = utils.escapeHTML(metadataAddedFieldsValues[value]);
						objectValues.push(metadataAddedFieldsValues[value]);
					}

					objectToPost[initialName] = initialValue;
					objectNames.forEach((objectName, index) => {
						objectToPost[objectName] = objectValues[index];
					});
					//use encoded if there will be a problem with previous json object
					//let encodedMetadataToParse = encodeURI(JSON.stringify(objectToPost));
					this.view.showProgress();
					ajaxActions.updateItemMetadata(itemId, objectToPost)
						.then(() => {
							this.view.hideProgress();
						})
						.fail(() => {
							this.view.hideProgress();
						});

				}
				// add to the server after they fix it
				// let initialValues = this.metadataInitialWindowForm.getValues();
				// let addedValues = this.metadataAddedFieldsWindowForm.getValues();
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

		const scrollView = {
			view: "scrollview",
			height: 325,
			scroll: true,
			body: {
				borderless: true,
				rows: [
					{
						margin: 10,
						type: "clean",
						cols: [
							metadataInitialWindowForm
						]
					},
					{
						cols: [
							{width: 20},
							addNewMetadataFieldButton,
							{template: "<span style='font-size:17px; font-style:italic'>Add new metadata fields</span>",
								css: {"height": "15px", "padding-top": "3px"},
								width: 250,
								borderless: true
							},
							{}
						]
					},
					{
						margin: 10,
						type: "clean",
						cols: [
							metadataAddedFieldsWindowForm
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

		const metadataWindow = {
			view: "window",
			scroll: true,
			paddingX: 35,
			width: 350,
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
						template: () => {
							return "Add metadata";
						},
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
			body: scrollView
		};

		return metadataWindow;
	}

	ready(view) {
		this.view = view;
		webix.extend(this.view, webix.ProgressBar);
		this.metadataInitialWindowForm = this.getMetadataInitialWindowForm();
		this.metadataAddedFieldsWindowForm = this.getMetadataAddedFieldsWindowForm();
	}

	getMetadataInitialWindowForm() {
		return this.getRoot().queryView({name: "metadataInitialWindowFormName"});
	}

	getMetadataAddedFieldsWindowForm() {
		return this.getRoot().queryView({name: "metadataAddedFieldsWindowFormName"});
	}

	addNewElementToForm() {
		let addedElementsLength = addNewMetadataWindowModel.getAddedElementsCount();
		addNewMetadataWindowModel.clearAddedElements();
		let index = 0;

		while (index <= addedElementsLength) {
			index++;
			addNewMetadataWindowModel.setElementsToAdd({
				id: `layoutId-${index}`,
				rows: [
					{
						cols: [
							{
								rows: [
									{
										name: `addedName-${index}`,
										view: "text", label: "Name",
										validate: webix.rules.isNotEmpty,
										css: "select-field",
										width: 275,
										invalidMessage: "Name field should not be empty"
									},
									{
										name: `addedValue-${index}`,
										view: "text", label: "Value",
										validate: webix.rules.isNotEmpty,
										css: "select-field",
										width: 275,
										invalidMessage: "Value field should not be empty"
									}
								]
							},
							{
								rows: [
									{},
									{
										view: "button",
										type: "icon",
										icon: "times",
										topLayoutId: `layoutId-${index}`,
										css: "delete-icon-button",
										width: 25,
										height: 25,
										click: (id) => {
											let deleteButton = this.$$(id);
											let layoutId = deleteButton.config.topLayoutId;
											addNewMetadataWindowModel.removeAddedElement(layoutId);
											this.metadataAddedFieldsWindowForm.removeView(layoutId);
											addNewMetadataWindowModel.setWasRemoved(true);
										}
									},
									{}
								]
							}
						]
					}
				]
			});
		}
	}

	showWindow(parsedItemId) {
		itemId = parsedItemId;
		this.getRoot().show();
	}

	hideWindow() {
		addNewMetadataWindowModel.clearAddedElements();
		this.metadataInitialWindowForm.clear();
		this.metadataInitialWindowForm.clearValidation();
		webix.ui([], this.metadataAddedFieldsWindowForm);
		this.getRoot().hide();
	}
}