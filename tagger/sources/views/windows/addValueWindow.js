import {JetView} from "webix-jet";
import addNewValuesWindowModel from "../../models/addNewValuesWindowModel";
import undoFactory from "../../models/undoModel";
import constants from "../../constants";
import messageBoxes from "../components/messageBoxes";


export default class AddValueWindow extends JetView {
	config() {
		const addValueForm = {
			view: "form",
			name: "addValueForm",
			rules: {
				value: (value) => {
					const regexp = new RegExp(constants.PATTERN_VALUES, "g");
					const validValue = value.match(regexp) ? value.match(regexp).join("") : "";
					return webix.rules.isNotEmpty(value) && validValue === value;
				},
				mainTag: webix.rules.isNotEmpty
			},
			elements: [
				{
					view: "text",
					label: "Value name",
					placeholder: "Value name",
					css: "text-field ellipsis-text",
					invalidMessage: "Add correct value name",
					name: "value"
				},
				{
					view: "richselect",
					label: "Connection to tag",
					css: "select-field ellipsis-text",
					name: "mainTag",
					options: {
						css: "ellipsis-text",
						body: {
							template: obj => obj.name,
							tooltip: "#name#"
						}
					}
				}
			],
			elementsConfig: {
				labelWidth: 150
			}
		};

		const addNewRichselectTag = {
			template: () => "<div class='add-new-item-flex-container'><a class='add-new-tag'><i class='fas fa-plus-circle'></i> Connect to another tag </a></div>",
			name: "addNewItemTemplate",
			height: 25,
			borderless: true,
			onClick: {
				"add-new-tag": () => {
					const layoutId = this.addTagSelectLayout();
					addNewValuesWindowModel.setElementsToAdd(layoutId);
					const newSelectTag = this.secondaryForm.queryView({name: `secondaryTag-${layoutId}`});
					this.parseDataToList(newSelectTag);
				}
			}
		};

		const addSecondaryTagsForm = {
			view: "form",
			name: "addSecondaryTagsForm",
			borderless: true,
			elements: [], // init by clicking on 'plus' button
			elementsConfig: {
				labelWidth: 150
			}
		};

		const buttons = {
			margin: 15,
			padding: 15,
			borderless: true,
			cols: [
				{},
				{
					view: "button",
					css: "btn-contour",
					width: 80,
					name: "cancelButton",
					value: "Cancel",
					hotkey: "escape",
					click: () => this.closeWindow()
				},
				{
					view: "button",
					css: "btn",
					width: 80,
					name: "saveButton",
					value: "Save",
					click: () => {
						if (this.mainForm.validate() && this.secondaryForm.validate()) {
							this.saveValues();
							this.closeWindow();
						}
					}
				}
			]
		};

		const scrollView = {
			view: "scrollview",
			height: 325,
			scroll: true,
			body: {
				borderless: true,
				rows: [
					addValueForm,
					addNewRichselectTag,
					addSecondaryTagsForm
				]
			}
		};

		const addValueWindow = {
			view: "window",
			css: "tagger-window",
			scroll: true,
			width: 400,
			height: 450,
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
						template: "Add new value name",
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "fas fa-times",
						width: 30,
						height: 30,
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				rows: [
					scrollView,
					buttons
				]
			}
		};

		return addValueWindow;
	}

	ready() {
		this.mainForm = this.getMainForm();
		this.mainTagSelect = this.getMainTagSelect();
		this.secondaryForm = this.getSecondaryForm();
		this.undoModel = undoFactory.create("main");
	}

	showWindow(selectedTag, tagStore, valuesStore, changesModel) {
		if (tagStore.count()) {
			if (selectedTag) {
				this.selectedTag = selectedTag;
			}
			this.tagStore = tagStore;
			this.valuesStore = valuesStore;
			this.changesModel = changesModel;
			this.getRoot().show();
			this.parseDataToList(this.mainTagSelect);
			this.initValidationValueName();
			const valueInput = this.getValueField();
			valueInput.focus();
		}
	}

	closeWindow() {
		this.selectedTag = null;
		const addedLayoutsIds = addNewValuesWindowModel.getAddedElements();
		addedLayoutsIds.forEach((id) => {
			this.secondaryForm.removeView(id);
		});
		addNewValuesWindowModel.clearAddedElements();
		this.mainForm.clear();
		this.mainForm.clearValidation();
		webix.eventRemove(this.editInputEventId);
		this.getRoot().hide();
	}

	parseDataToList(dropDown) {
		const list = dropDown.getList();
		const tags = this.tagStore.getArrayOfItems() // get old tags only
			.filter(tag => tag._id);
		list.clearAll();
		list.parse(tags);
		const selectedTagId = this.selectedTag ? this.selectedTag.id : list.getFirstId();
		if (selectedTagId) {
			dropDown.setValue(selectedTagId);
		}
	}

	getDataFromForms() {
		let value = {
			tagIds: [],
			value: ""
		};
		const mainFormValues = this.mainForm.getValues();
		const secondaryFormValues = this.secondaryForm.getValues();
		value.value = mainFormValues.value;

		const mainTag = this.tagStore.getItemById(mainFormValues.mainTag);
		value.tagIds.push(mainTag._id);
		const secondaryTagsIds = Object.values(secondaryFormValues);
		secondaryTagsIds.forEach((id) => {
			const tag = this.tagStore.getItemById(id);
			value.tagIds.push(tag._id);
		});

		value.tagIds = value.tagIds
			.filter((tagId, index, self) => index === self.findIndex(id => id === tagId));

		return value;
	}

	addTagSelectLayout() {
		const layoutId = webix.uid();
		const layout = {
			id: layoutId,
			cols: [
				{
					view: "richselect",
					css: "select-field ellipsis-text",
					name: `secondaryTag-${layoutId}`,
					validate: webix.rules.isNotEmpty,
					options: {
						body: {
							css: "ellipsis-text",
							template: obj => obj.name,
							tooltip: "#name#"
						}
					}
				},
				{
					rows: [
						{},
						{
							view: "button",
							type: "icon",
							icon: "fas fa-times",
							width: 25,
							height: 25,
							click: () => {
								this.secondaryForm.removeView(layoutId);
								addNewValuesWindowModel.removeAddedElement(layoutId);
							}
						},
						{}
					]
				}
			]
		};
		this.secondaryForm.addView(layout);
		return layoutId;
	}

	saveValues() {
		const values = this.getDataFromForms();
		const existedItem = this.getExistedItem(values);
		if (existedItem) {
			if (existedItem.tagIds.includes(this.selectedTag._id)) {
				webix.message("Value with this name already exists");
			}
			const copy = webix.copy(existedItem);
			this.undoModel.setActionToUndo(copy, this.valuesStore, "update");

			values.tagIds = values.tagIds.filter(tagId => !existedItem.tagIds.includes(tagId));
			const tagIds = existedItem.tagIds.concat(values.tagIds);
			this.valuesStore.updateItem(existedItem.id, null, {tagIds});
			if (existedItem._id) {
				this.changesModel.addItem(existedItem, "updated");
			}
			else {
				this.changesModel.addItem(existedItem, "created");
			}
		}
		else {
			const item = this.valuesStore.addItem(values);
			this.undoModel.setActionToUndo(item, this.valuesStore, "remove");
			this.changesModel.addItem(item, "created");
		}
	}

	initValidationValueName() {
		// validate value field
		const valueInput = this.getValueField();
		const inputNode = valueInput.getInputNode();
		this.editInputEventId = webix.event(inputNode, "input", () => {
			const maxCharCount = 50;
			const regexp = new RegExp(constants.PATTERN_VALUES, "g");

			const value = inputNode.value;
			let validValue = value.match(regexp) ? value.match(regexp).join("") : "";
			let text = "";

			if (value !== validValue) {
				text = "Invalid character";
			}
			else {
				validValue = validValue.slice(0, maxCharCount);
				text = `Symbols left - ${maxCharCount - validValue.length}`;
			}
			valueInput.setValue(validValue);
			inputNode.value = validValue;
			messageBoxes.showValidationPopup(inputNode, text);
		});
	}

	getExistedItem(item) {
		const itemsArray = this.valuesStore.getArrayOfItems();
		const foundedItem = itemsArray.find(obj => obj.value.toLowerCase() === item.value.toLowerCase());
		return foundedItem;
	}

	getMainForm() {
		return this.getRoot().queryView({name: "addValueForm"});
	}

	getSecondaryForm() {
		return this.getRoot().queryView({name: "addSecondaryTagsForm"});
	}

	getValueField() {
		return this.getRoot().queryView({name: "value"});
	}

	getMainTagSelect() {
		return this.getRoot().queryView({name: "mainTag"});
	}
}
