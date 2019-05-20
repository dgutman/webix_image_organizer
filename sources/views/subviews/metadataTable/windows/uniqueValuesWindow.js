import {JetView} from "webix-jet";
import webixViews from "../../../../models/webixViews";

let uniqueValuesArray = [];

export default class UniqueValuesWindow extends JetView {
	config() {
		const formOfUniqueValues = {
			view: "form",
			name: "formOfUniqueValuesName",
			borderless: true,
			elements: [
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
				if (this.formOfUniqueValues.validate()) {
					let valuesObject = this.formOfUniqueValues.getValues();
					let arrayOfNewValues = Object.values(valuesObject);
					uniqueValuesArray.forEach((uniqueValue, index) => {
						this.datatable.eachRow((rowId) => {
							let metadataValue = this.datatable.getText(rowId, this.columnId);
							if (metadataValue === uniqueValue) {
								let newValue = arrayOfNewValues[index];
								let valuesObjectToEdit = {
									value: newValue,
									old: uniqueValue
								};
								let objectOfIds = {
									column: this.columnId,
									row: rowId
								};
								this.datatable.callEvent("onBeforeEditStop", [valuesObjectToEdit, objectOfIds]);
								this.hideWindow();
							}
						});
					});
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

		const scrollView = {
			view: "scrollview",
			scroll: true,
			body: {
				borderless: true,
				rows: [
					{
						margin: 10,
						type: "clean",
						cols: [
							formOfUniqueValues
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
			width: 300,
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
							return "Edit unique values in metadata";
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
		this.formOfUniqueValues = this.getFormOfUniqueValues();
	}

	getFormOfUniqueValues() {
		return this.getRoot().queryView({name: "formOfUniqueValuesName"});
	}

	createFormElements() {
		let formElements = [];
		const htmlTagsRexeg = /<\/?[^>]+(>|$)/g;
		const firstUniqueValue = uniqueValuesArray[0].replace(htmlTagsRexeg, "");
		const firstUniqueTextValue = {
			name: "firstUniqueValue",
			view: "text",
			labelPosition: "top",
			label: `Column: ${this.columnId}`,
			validate: webix.rules.isNotEmpty,
			css: "select-field",
			value: firstUniqueValue,
			invalidMessage: "Value field should not be empty"
		};
		formElements.push(firstUniqueTextValue);
		if (uniqueValuesArray.length > 1) {
			for (let index = 1; index < uniqueValuesArray.length; index++) {
				const uniqueValue = uniqueValuesArray[index].replace(htmlTagsRexeg, "");
				let formTextElement = {
					name: `uniqueValue-${index}`,
					view: "text",
					validate: webix.rules.isNotEmpty,
					css: "select-field",
					value: uniqueValue,
					invalidMessage: "Value field should not be empty"
				};
				formElements.push(formTextElement);
			}
		}
		return formElements;
	}

	showWindow(columnId, valuesArray) {
		this.datatable = webixViews.getMetadataTableView();
		this.columnId = columnId;
		uniqueValuesArray = valuesArray;
		if (uniqueValuesArray.length !== 0) {
			let createdFormElements = this.createFormElements();
			webix.ui(createdFormElements, this.formOfUniqueValues);

			this.getRoot().show();
		}
	}

	hideWindow() {
		this.getRoot().hide();
	}
}