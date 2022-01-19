import {JetView} from "webix-jet";

export default class TagSettingsWindow extends JetView {
	config() {
		const form = {
			view: "form",
			name: "tagSettingsForm",
			borderless: true,
			elements: [
				{
					view: "richselect",
					name: "type",
					label: "Type",
					css: "select-field",
					placeholder: "Tag type",
					gravity: 1,
					options: [
						{id: "multiple_with_default", value: "multiple_with_default"},
						{id: "multiple", value: "multiple"}
					]
				},
				{
					view: "richselect",
					name: "selection",
					label: "Selection",
					css: "select-field",
					placeholder: "Tag selection",
					gravity: 1,
					options: [
						{id: "multiple", value: "multiple"},
						{id: "single", value: "single"}
					]
				},
				{
					view: "richselect",
					name: "icontype",
					label: "Icon type",
					css: "select-field",
					placeholder: "Icon type",
					gravity: 1,
					options: [
						{id: "pervalue", value: "pervalue"},
						{id: "badge", value: "badge"},
						{id: "badgecolor", value: "badgecolor"}
					]
				},
				{height: 30},
				{
					cols: [
						{},
						{
							view: "button",
							name: "saveButton",
							css: "btn",
							width: 80,
							value: "Save"
						}
					]
				}
			]
		};

		const window = {
			view: "window",
			name: "tagSettings",
			css: "tagger-window",
			position: "center",
			modal: true,
			width: 500,
			height: 700,
			type: "clean",
			head: {
				cols: [
					{
						template: "Tag settings",
						name: "header",
						css: "main-subtitle2 ellipsis-text",
						borderless: true
					},
					{
						view: "button",
						name: "closeButton",
						type: "icon",
						icon: "fas fa-times",
						hotkey: "esc",
						width: 30,
						height: 30,
						click: () => this.close()
					}
				]
			},
			body: form
		};

		return window;
	}

	init(view) {
		this._view = view;

		this.saveButton.attachEvent("onItemClick", () => {
			view.callEvent("saveButtonClick", [this.form.getValues(), this.form.isDirty()]);

			this.close();
		});
	}

	showWindow(tagForm) {
		this.tagForm = tagForm;
		this.getRoot().show();

		this.form.setValues(tagForm.config.tagSettings);
	}

	get form() {
		return this.getRoot().queryView({name: "tagSettingsForm"});
	}

	get saveButton() {
		return this.form.queryView({name: "saveButton"});
	}

	get closeButton() {
		return this.getRoot().queryView({name: "closeButton"});
	}

	close() {
		this.tagForm = null;
		this.getRoot().hide();
	}
}
