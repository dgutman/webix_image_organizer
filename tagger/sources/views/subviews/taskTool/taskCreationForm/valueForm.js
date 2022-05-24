import {JetView} from "webix-jet";
import AdditionalInputsFactory from "./additionalInputs";
import {DELETE_VALUE_FORM, SET_DEFAULT_VALUE} from "../../../../models/customEventNames";

const VALUE_FORM_ID = "value-form";

export default class ValueForm extends JetView {
	constructor(app, tagSettings, order, parentContainer) {
		super(app);

		this._tagSettings = tagSettings;
		this._order = order;
		this._parentContainer = parentContainer;
	}

	config() {
		const settings = this._tagSettings;
		const order = this._order;

		let input;
		switch (settings.icontype) {
			case "pervalue":
				input = AdditionalInputsFactory.create("icon");
				break;
			case "badge":
				input = AdditionalInputsFactory.create("badgevalue");
				break;
			default:
				input = AdditionalInputsFactory.create("badgecolor");
				break;
		}

		const radioButtonTemplate = {
			view: "formTemplate",
			name: "default",
			css: "value-radio-button-template",
			borderless: true,
			width: 30,
			tooltip: (config) => {
				const view = $$(config.id);
				const data = view.getValue();
				return data ? "Default" : "Not default";
			},
			template: obj => (obj.default ? "<i class='value-radio checked fas fa-circle'></i>" : "<i class='value-radio unchecked far fa-circle'></i>"),
			onClick: {
				"value-radio": (ev, id, node) => {
					if (node.classList.contains("checked")) {
						return;
					}
					this._parentContainer.callEvent(SET_DEFAULT_VALUE, [this._form]);
				}
			}
		};

		const radioButton = settings.type === "multiple_with_default" ? radioButtonTemplate : {hidden: true};

		return {
			view: "form",
			borderless: true,
			type: "clean",
			localId: VALUE_FORM_ID,
			selector: "valueForm",
			order,
			rules: {
				name: (value, obj, fieldName) => {
					const isUnique = this.checkIsUnique(value, fieldName);
					return webix.rules.isNotEmpty(value) && isUnique;
				},
				hotkey: (value, obj, fieldName) => {
					const isUnique = this.checkIsUnique(value, fieldName);
					return !value || isUnique;
				},
				icon: (value, obj, fieldName) => {
					const isUnique = this.checkIsUnique(value, fieldName);
					return !value || isUnique;
				},
				badgevalue: (value, obj, fieldName) => {
					const isUnique = this.checkIsUnique(value, fieldName);
					return !value || isUnique;
				},
				badgecolor: (value, obj, fieldName) => {
					const isUnique = this.checkIsUnique(value, fieldName);
					return !value || isUnique;
				}
			},
			elements: [
				{
					cols: [
						{
							view: "search",
							icon: "fas fa-times",
							css: "search-field",
							placeholder: "Enter value",
							label: `Value ${order + 1}`,
							name: "name",
							invalidMessage: "Use unique and not empty values",
							gravity: 2.5,
							inputHeight: 36,
							on: {
								onSearchIconClick: () => {
									this._parentContainer.callEvent(DELETE_VALUE_FORM, [this._form]);
								}
							}
						},
						{width: 10},
						AdditionalInputsFactory.create("hotkey"),
						{width: 10},
						input,
						radioButton
					]
				}
			]
		};
	}

	get _form() {
		return this.getRoot();
	}

	getValues() {
		return this._form.getValues();
	}

	setValues(values) {
		return this._form.setValues(values);
	}

	checkIsUnique(value, fieldName) {
		const thisForm = this._form;
		const valueForms = this._parentContainer.getChildViews();
		return valueForms
			.every(form => form.getValues()[fieldName] !== value || thisForm === form);
	}
}
