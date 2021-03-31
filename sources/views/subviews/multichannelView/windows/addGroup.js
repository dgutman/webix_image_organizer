import {JetView} from "webix-jet";

const FORM_ID = "add-group-form-id";
const DEFAULT_INVALID_NAME_MESSAGE = "Please, type the group name";

export default class AddGroupWindow extends JetView {
	config() {
		const addGroupWindow = {
			view: "window",
			name: "addGroupWindow",
			position: "center",
			move: true,
			modal: true,
			width: 500,
			height: 250,
			head: {
				height: 30,
				cols: [
					{
						css: "large-image-name",
						template: "Add new group",
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "fas fa-times",
						width: 30,
						height: 30,
						borderless: true,
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				rows: [
					{
						borderless: true,
						view: "form",
						localId: FORM_ID,
						elements: [
							{
								view: "text",
								name: "name",
								css: "text-field",
								label: "Name:",
								labelWidth: 50,
								placeholder: "type group name",
								invalidMessage: "Please, type the group name",
								width: 300
							},
							{
								cols: [
									{},
									{
										view: "button",
										width: 90,
										css: "btn",
										value: "Add",
										hotkey: "enter",
										click: () => this.add()
									}
								]
							}
						],
						rules: {
							name: value => value && value.trim()
						}
					}
				]}
		};

		return addGroupWindow;
	}

	showWindow() {
		this.getRoot().show();
		this.getNameInput().focus();
	}

	closeWindow() {
		this.getForm().clearValidation();
		this.getForm().clear();
		this.getRoot().hide();
	}

	add() {
		const form = this.getForm();
		if (!form.validate()) {
			return;
		}

		this.getRoot().callEvent("addGroup", [form.getValues()]);
	}

	getNameInput() {
		return this.getForm().queryView({name: "name"});
	}

	getForm() {
		return this.$$(FORM_ID);
	}

	markInvalidNameInput(msg = DEFAULT_INVALID_NAME_MESSAGE) {
		const form = this.getForm();
		form.markInvalid("name", msg);
	}
}
