import {JetView} from "webix-jet";
import templates from "../../../templates";
import ValueForm from "./valueForm";
import TagSettingsWindow from "../../../windows/tagSettings";
import AdditionalInputsFactory from "./additionalInputs";
import {DELETE_VALUE_FORM, SET_DEFAULT_VALUE, RESIZE_TAGS_FORM} from "../../../../models/customEventNames";


const TAG_FORM_ID = "tag-form";
const VALUES_CONTAINER_ID = "values-container";

export default class TagForm extends JetView {
	constructor(app, tagSettings, order) {
		super(app);

		this._tagSettings = tagSettings;
		this._order = order;

		this.settingsWindow = this.ui(TagSettingsWindow);
	}

	config() {
		const settings = this._tagSettings;
		const order = this._order;

		const tagForm = {
			view: "form",
			borderless: true,
			localId: TAG_FORM_ID,
			selector: "tagForm",
			order,
			type: "clean",
			tagSettings: settings,
			rules: {
				name: (value) => {
					const isUnique = this.checkIsUnique(value, "name");
					return webix.rules.isNotEmpty(value.trim()) && isUnique;
				},
				icon: (value) => {
					const isUnique = this.checkIsUnique(value, "icon");
					return !value || isUnique;
				},
				help: value => this.checkEmptySpaces(value),
				description: value => this.checkEmptySpaces(value)
			},
			elements: [
				{
					cols: [
						{
							view: "tagCombo",
							css: "text-field",
							placeholder: "Enter tag",
							gravity: 4,
							label: `Tag ${order + 1}`,
							name: "name",
							invalidMessage: "Please, specify the unique tag name",
							inputHeight: 36,
							on: {
								itemSelected: (tag) => {
									this.selectTagTemplateHandler(tag);
								}
							}
						},
						{
							view: "button",
							type: "icon",
							css: "btn webix_transparent",
							icon: "fas fa-cogs",
							width: 40,
							tooltip: "Change tag settings",
							click: () => {
								this.changeTagSettingsHandler();
							}
						},
						{
							view: "button",
							type: "icon",
							css: "btn webix_transparent",
							icon: "fas fa-times",
							width: 40,
							tooltip: "Delete tag",
							click: () => {
								const form = this._form;
								const parentForm = this.getParentForm();
								parentForm.removeView(form);

								if (!parentForm.queryView({selector: "tagForm"}, "all").length) {
									parentForm.hide();
								}
								else {
									parentForm.callEvent(RESIZE_TAGS_FORM);
								}
							}
						}
					]
				},
				{
					cols: [
						{
							localId: VALUES_CONTAINER_ID,
							rows: []
						},
						{width: 10},
						{
							template: () => templates.getPlusButtonTemplate("Add new value", "add-new-value"),
							name: "addNewValueButton",
							height: 35,
							css: "add-new-button",
							width: 130,
							borderless: true,
							onClick: {
								"add-new-value": () => {
									this.addNewValueForm();
									this.getParentForm().callEvent(RESIZE_TAGS_FORM);
								}
							}
						}
					]
				},
				{height: 10},
				{
					cols: [
						{
							view: "textarea",
							name: "help",
							css: "textarea-field",
							label: "Tag help",
							invalidMessage: "Please, fill the text field correctly",
							labelPosition: "top",
							height: 100,
							placeholder: "Please type the explanation for the task"
						},
						{
							view: "textarea",
							name: "description",
							css: "textarea-field",
							label: "Tag description",
							invalidMessage: "Please, fill the text field correctly",
							labelPosition: "top",
							height: 100,
							placeholder: "Please type the short explanation for the task"
						}
					]
				},
				{
					view: "checkbox",
					name: "template",
					css: "checkbox-ctrl",
					labelRight: "Create template",
					labelWidth: 0,
					width: 150,
					value: 0
				}
			]
		};

		if (settings.icontype === "badge" || settings.icontype === "badgecolor") {
			tagForm.elements[0].cols.splice(1, 0, AdditionalInputsFactory.create("icon"));
		}

		return tagForm;
	}

	ready() {
		const valueForms = this.getFormChildViews(this._valuesContainer);
		if (!valueForms.length) {
			this.addNewValueForm(); // Add first value form
			this.getParentForm().callEvent(RESIZE_TAGS_FORM);
		}
		this.attachValuesContainerEvents();
	}

	destroy() {
		this.settingsWindow.close();
	}

	get _form() {
		return this.getRoot();
	}

	get _valuesContainer() {
		return this.$$(VALUES_CONTAINER_ID);
	}

	checkIsUnique(value, fieldName) {
		const thisForm = this._form;
		const tagForms = this.getParentForm().getChildViews();
		return tagForms
			.every(form => form.getValues()[fieldName] !== value || thisForm === form);
	}

	checkEmptySpaces(value) {
		const inputValue = !(value === "") && (value.trim()  === "");
		return !inputValue;
	}

	attachValuesContainerEvents() {
		this.on(this._valuesContainer, DELETE_VALUE_FORM, (form) => {
			this.removeValueForm(form);
			this.getParentForm().callEvent(RESIZE_TAGS_FORM);
		});

		this.on(this._valuesContainer, SET_DEFAULT_VALUE, (form) => {
			this.setDefaultValue(form);
		});
	}

	setFormValues(formValues = {}, tagValues) {
		this._form.setValues(formValues);
		if (tagValues) {
			this.populateValuesByObject(tagValues);
		}
	}

	getTagValues() {
		const forms = this.getFormChildViews(this._valuesContainer);
		return forms.map(form => form.getValues());
	}

	addNewValueForm() {
		const forms = this.getFormChildViews(this._valuesContainer);
		const order = forms.length;
		const newForm = this.app
			.createView(new ValueForm(this.app, this._tagSettings, order, this._valuesContainer));
		this._valuesContainer.addView(newForm);

		return newForm;
	}

	removeValueForm(form) {
		const forms = this._valuesContainer.getChildViews();
		if (forms.length > 1) {
			this._valuesContainer.removeView(form);
		}
	}

	getParentForm(view = this._form) {
		const parentView = view.getParentView();
		if (!parentView) return;

		return parentView.config.view === "form" ? parentView : this.getParentForm(parentView);
	}

	populateValuesByObject(values) {
		const valuesWrap = this._valuesContainer;
		const valuesEntries = Object.entries(values);
		valuesEntries.forEach(([name, config], i) => {
			const valueForms = this.getFormChildViews(valuesWrap);
			let form;
			if (i + 1 <= valueForms.length) {
				form = valueForms[i];
			}
			else {
				form = this.addNewValueForm();
			}
			form.setValues({name, ...config});
		});
	}

	getFormChildViews(view = this._form) {
		return [...view.getChildViews()]; // to copy the array with forms
	}

	changeTagSettingsHandler() {
		const thisForm = this._form;
		const parentForm = this.getParentForm();
		this.settingsWindow.showWindow(thisForm);
		if (!this.settingsWindow.getRoot().hasEvent("savebuttonclick")) {
			const eventID = this.settingsWindow.getRoot().attachEvent("saveButtonClick", (newSettings, isChanged) => {
				if (isChanged) {
					thisForm.config.tagSettings = newSettings;
					const values = thisForm.getValues();
					const tagValues = this.getTagValues();
					if (thisForm.config.tagSettings.type !== "multiple_with_default") {
						tagValues.forEach((tag) => tag.default = false);
					}
					const index = parentForm.getChildViews()
						.findIndex(view => view === thisForm);

					const newForm = this.app
						.createView(new TagForm(this.app, newSettings, index));

					parentForm.removeView(thisForm);
					parentForm.addView(newForm, index || 0);

					newForm.setFormValues(values, tagValues);
				}
				this.destroy();
			});
		}
	}

	selectTagTemplateHandler(tag) {
		const thisForm = this._form;
		const parentForm = this.getParentForm();

		const index = parentForm.getChildViews()
			.findIndex(view => view === thisForm);
		const newForm = this.app
			.createView(new TagForm(this.app, tag, index));

		parentForm.removeView(thisForm);
		parentForm.addView(newForm, index || 0);

		tag.values = tag.values.map((val) => {
			val.name = val.value;
			return val;
		});

		newForm.setFormValues(tag, tag.values);
	}

	setDefaultValue(defaultValueForm) {
		const valueForms = this._valuesContainer.getChildViews();

		valueForms.forEach((form) => {
			if (form === defaultValueForm) {
				return;
			}
			const values = form.getValues();
			form.setValues(Object.assign(values, {default: false}));
		});
		const values = defaultValueForm.getValues();
		defaultValueForm.setValues(Object.assign(values, {default: true}));
	}

	collectValuesData() {
		const valueForms = this._valuesContainer.getChildViews();
		return valueForms.reduce((acc, form) => {
			const value = form.getValues();
			acc[value.name] = value;
			return acc;
		}, {});
	}
}
