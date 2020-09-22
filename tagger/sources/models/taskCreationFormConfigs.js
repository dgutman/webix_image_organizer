import iconsCollection from "./iconsCollection";
import keysCollection from "./hotkeysCollection";
import taskUsers from "./taskUsers";
import utils from "../utils/utils";

const iconInput = {
	view: "combo",
	name: "icon",
	css: "select-field",
	placeholder: "Icon",
	tooltip: obj => `<div class='ellipsis-text'><i class='fas ${obj.value}'></i> ${obj.value}</div>`,
	options: {
		data: iconsCollection,
		body: {
			tooltip: "#value#",
			template: obj => `<div class='ellipsis-text'><i class='fas ${obj.id}'></i> ${obj.value}</div>`
		}
	},
	gravity: 1,
	inputHeight: 36
};

const badgeInput = {
	view: "text",
	name: "badgevalue",
	css: "text-field",
	placeholder: "Badge",
	gravity: 1,
	inputHeight: 36
};

const badgeColorInput = {
	view: "colorpicker",
	name: "badgecolor",
	placeholder: "Badge color",
	value: "#FFFFFF",
	gravity: 1,
	inputHeight: 36
};

export default class FromConfigs {
	constructor(mainForm, tagsForm, settingsWindow) {
		this.mainForm = mainForm;
		this.tagsForm = tagsForm;
		this.settingsWindow = settingsWindow;
	}

	getTagFormConfig(settings, order) {
		const formName = `tagForm${order}`;

		const tagForm = {
			view: "form",
			borderless: true,
			name: formName,
			selector: "tagForm",
			order,
			type: "clean",
			tagSettings: settings,
			rules: {
				name: (value) => {
					const thisForm = this.tagsForm.queryView({name: formName});
					const tagForms = this.tagsForm.getChildViews();
					const isUnique = tagForms.every(form => form.getValues().name !== value || thisForm === form);
					return webix.rules.isNotEmpty(value) && isUnique;
				},
				icon: (value) => {
					const thisForm = this.tagsForm.queryView({name: formName});
					const tagForms = this.tagsForm.getChildViews();
					const isUnique = tagForms.every(form => form.getValues().icon !== value || thisForm === form);
					return !value || isUnique;
				}
			},
			elements: [
				{
					cols: [
						{
							view: "tagCombo",
							css: "text-field",
							placeholder: "Enter tag",
							gravity: 4,
							label: `Tag ${order}`,
							name: "name",
							invalidMessage: "Please, specify the unique tag name",
							inputHeight: 36,
							on: {
								itemSelected: (tag) => {
									const thisForm = this.mainForm.queryView({name: formName});
									const newConfig = this.getTagFormConfig(tag, thisForm.config.order);

									const index = this.tagsForm.getChildViews()
										.findIndex(view => view.config.name === formName);

									this.tagsForm.removeView(thisForm);
									this.tagsForm.addView(newConfig, index || 0);
									const thisNewForm = this.mainForm.queryView({name: newConfig.name});
									thisNewForm.setValues(tag);
									tag.values = tag.values.map((val) => {
										val.name = val.value;
										return val;
									});
									this.addValueViewsByJSON(thisNewForm, tag.values);
								}
							}
						},
						{
							view: "button",
							type: "icon",
							icon: "fas fa-cogs",
							width: 40,
							tooltip: "Change tag settings",
							click: () => {
								const thisForm = this.mainForm.queryView({name: formName});
								this.settingsWindow.showWindow(thisForm);
								const eventID = this.settingsWindow.getRoot().attachEvent("saveButtonClick", (newSettings, isChanged) => {
									if (isChanged) {
										thisForm.config.tagSettings = newSettings;
										const values = thisForm.getValues();
										const newConfig = this.getTagFormConfig(newSettings, thisForm.config.order);

										const index = this.tagsForm.getChildViews()
											.findIndex(view => view.config.name === formName);

										this.tagsForm.removeView(thisForm);
										this.tagsForm.addView(newConfig, index || 0);
										this.mainForm.queryView({name: newConfig.name}).setValues(values);
									}

									this.settingsWindow.getRoot().detachEvent(eventID);
								});
							}
						},
						{
							
							view: "button",
							type: "icon",
							icon: "fas fa-times",
							width: 40,
							tooltip: "Delete tag",
							click: () => {
								const form = this.tagsForm.queryView({name: formName});
								this.tagsForm.removeView(form);

								if (!this.tagsForm.queryView({selector: "tagForm"}, "all").length) {
									this.tagsForm.hide();
								}
								else {
									this.redefineTagsFormSize();
								}
							}
						}
					]
				},
				{
					cols: [
						{
							name: "valuesWrap",
							rows: [
								this.getValuesFormConfig(1, formName, settings)
							]
						},
						{width: 10},
						{
							template: () => "<a class='add-new-value'><i class='fas fa-plus-circle'></i> Add new value </a>",
							name: "addNewValueButton",
							height: 35,
							css: "add-new-button",
							width: 130,
							borderless: true,
							onClick: {
								"add-new-value": () => {
									this.addNewValueHandler(formName);
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
							labelPosition: "top",
							height: 100,
							placeholder: "Please type the explanation for the task"
						},
						{
							view: "textarea",
							name: "description",
							css: "textarea-field",
							label: "Tag description",
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
			tagForm.elements[0].cols.splice(1, 0, iconInput);
		}

		return tagForm;
	}

	getValuesFormConfig(order, formName, settings) {
		const name = `valueLayout${order}`;

		let input;
		switch (settings.icontype) {
			case "pervalue":
				input = iconInput;
				break;
			case "badge":
				input = badgeInput;
				break;
			default:
				input = badgeColorInput;
				break;
		}

		const radioButtonTemplate = {
			view: "formTemplate",
			name: "default",
			css: "value-radio-button-template",
			width: 30,
			tooltip: (config) => {
				const view = $$(config.id);
				const data = view.getValue();
				return data ? "Default" : "Not default";
			},
			template: obj => (obj.default ? "<i class='value-radio checked fas fa-circle'></i>" : "<i class='value-radio unchecked far fa-circle'></i>"),
			onClick: {
				"value-radio": (ev, id, node) => {
					const {valuesWrap, valueForms} = this.getWrapFormsForValues(formName);

					if (node.classList.contains("unchecked")) {
						valueForms.forEach((form) => {
							const values = form.getValues();
							form.setValues(Object.assign(values, {default: false}));
						});
						const thisForm = valuesWrap.queryView({name});
						const values = thisForm.getValues();
						thisForm.setValues(Object.assign(values, {default: true}));
					}
				}
			}
		};

		const radioButton = settings.type === "multiple_with_default" ? radioButtonTemplate : {hidden: true};

		return {
			view: "form",
			borderless: true,
			type: "clean",
			name,
			selector: "valueLayout",
			order,
			rules: {
				name: (value, obj, fieldName) => {
					const isUnique = this.isUniqueValue(value, fieldName, formName, name);
					return webix.rules.isNotEmpty(value) && isUnique;
				},
				hotkey: (value, obj, fieldName) => {
					const isUnique = this.isUniqueValue(value, fieldName, formName, name);
					return !value || isUnique;
				},
				icon: (value, obj, fieldName) => {
					const isUnique = this.isUniqueValue(value, fieldName, formName, name);
					return !value || isUnique;
				},
				badgevalue: (value, obj, fieldName) => {
					const isUnique = this.isUniqueValue(value, fieldName, formName, name);
					return !value || isUnique;
				},
				badgecolor: (value, obj, fieldName) => {
					const isUnique = this.isUniqueValue(value, fieldName, formName, name);
					return !value || isUnique;
				}
			},
			cols: [
				{
					view: "search",
					icon: "fas fa-times",
					css: "search-field",
					placeholder: "Enter value",
					label: `Value ${order}`,
					name: "name",
					invalidMessage: "Please, specify the unique value",
					gravity: 2.5,
					inputHeight: 36,
					on: {
						onSearchIconClick: () => {
							const {valuesWrap, valueForms} = this.getWrapFormsForValues(formName);
							const layout = valuesWrap.queryView({name});

							if (valueForms.length > 1) {
								valuesWrap.removeView(layout);
							}

							this.redefineTagsFormSize();
						}
					}
				},
				{width: 10},
				{
					view: "combo",
					name: "hotkey",
					css: "select-field",
					options: keysCollection,
					placeholder: "Hot-key",
					gravity: 1,
					inputHeight: 36
				},
				{width: 10},
				input,
				radioButton
			]
		};
	}

	addNewValueHandler(formName) {
		const {tagForm, valuesWrap, valueForms} = this.getWrapFormsForValues(formName);
		const settings = tagForm.config.tagSettings;
		const order = valueForms.pop().config.order + 1;

		const newValueLayout = this.getValuesFormConfig(order, formName, settings);
		const viewId = valuesWrap.addView(newValueLayout);
		this.redefineTagsFormSize();
		return viewId;
	}

	addNewTagHandler(settings) {
		const tagsForm = this.tagsForm;
		tagsForm.show();

		const forms = tagsForm.queryView({selector: "tagForm"}, "all");
		const order = forms.length ? forms[forms.length - 1].config.order + 1 : 1;

		const tagForm = this.getTagFormConfig(settings, order);

		const viewId = tagsForm.addView(tagForm, forms.length);
		this.redefineTagsFormSize();
		return viewId;
	}

	redefineTagsFormSize() {
		const childHeightSum = this.tagsForm.getChildViews()
			.slice(0, 2)
			.reduce((acc, el) => acc + el.$height, 0);
		const tagsFormHeight = Math.min(childHeightSum + 5, 370);

		if (tagsFormHeight !== this.tagsForm.$height) {
			this.tagsForm.define("height", Math.min(tagsFormHeight + 5, 370));
			this.tagsForm.resize();
		}
	}

	removeTagForms() {
		const forms = [...this.tagsForm.getChildViews()]; // to copy the array with forms
		forms.forEach((view) => {
			this.tagsForm.removeView(view);
		});
		this.tagsForm.hide();
	}

	setFormValuesByJSON(json) {
		const {name, group, tags, user, creator} = json;
		this.mainForm.clear();

		const userIds = utils.transformToArray(user).map((id) => {
			const found = taskUsers.find(obj => obj._id === id, true);
			return found ? found.id : null;
		}).filter(id => id);
		const creatorIds = utils.transformToArray(creator).map((id) => {
			const found = taskUsers.find(obj => obj._id === id, true);
			return found ? found.id : null;
		}).filter(id => id);

		this.mainForm.setValues({name, group: group || "", creator: creatorIds, user: userIds});

		this.addTagViewsByJSON(tags);
	}

	addTagViewsByJSON(tags) {
		tags.forEach((tag) => {
			const {type, icontype, selection, name, description, help, icon} = tag;
			const formId = this.addNewTagHandler({type, icontype, selection});
			const tagForm = this.mainForm.$scope.$$(formId);
			tagForm.setValues({name, description, help, icon});

			this.addValueViewsByJSON(tagForm, tag.values);
		});
	}

	addValueViewsByJSON(tagForm, values) {
		const valuesWrap = tagForm.queryView({name: "valuesWrap"});
		const valuesEntries = Object.entries(values);
		valuesEntries.forEach(([name, config], i) => {
			const valueForms = valuesWrap.queryView({selector: "valueLayout"}, "all");
			let form;
			if (i + 1 <= valueForms.length) {
				form = valueForms[i];
			}
			else {
				const formId = this.addNewValueHandler(tagForm.config.name);
				form = this.mainForm.$scope.$$(formId);
			}
			form.setValues({name, ...config});
		});
	}

	getWrapFormsForValues(tagFormName) {
		const tagForm = this.tagsForm.queryView({name: tagFormName});
		const valuesWrap = tagForm.queryView({name: "valuesWrap"});
		const valueForms = valuesWrap.queryView({selector: "valueLayout"}, "all");
		return {tagForm, valuesWrap, valueForms};
	}

	isUniqueValue(value, fieldName, tagFormName, valueFormName) {
		const {valuesWrap, valueForms} = this.getWrapFormsForValues(tagFormName);
		const thisForm = valuesWrap.queryView({name: valueFormName});
		const isUnique = valueForms.every(form => form.getValues()[fieldName] !== value || thisForm === form);
		return isUnique;
	}
}
