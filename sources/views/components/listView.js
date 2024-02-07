import {JetView} from "webix-jet";

export default class ListView extends JetView {
	constructor(app, config = {}) {
		super(app);
		const {name, newItemName} = config;
		this.name = name;
		this.newItemName = newItemName;
		this.ID_FORM = `form-id-${webix.uid()}`;
		this.ID_CHANGE_FORM = `change-form-id-${webix.uid()}`;
		this.ID_LIST = `list-id-${webix.uid()}`;
		this.ID_SAVE_BUTTON = `save-button-id-${webix.uid()}`;
		this.ID_CANCEL_BUTTON = `cancel-button-id-${webix.uid()}`;
		this.ID_ADD_BUTTON = `add-item-button-id-${webix.uid()}`;
	}

	config() {
		return {
			rows: [
				{
					id: this.ID_FORM,
					view: "form",
					elements: [
						{
							cols: [
								{
									view: "label",
									template: `${this.name}`,
									height: 30,
									gravity: 1
								},
								{
									view: "button",
									id: this.ID_ADD_BUTTON,
									type: "form",
									click: () => {
										this.addItem();
									},
									label: "+",
									width: 24,
									height: 24,
									gravity: 1
								},
							]
						},
						{
							height: 30,
							id: this.ID_CHANGE_FORM,
							hidden: true,
							cols: [
								{
									view: "text",
									name: "name",
									label: "Name"
								},
								{
									view: "button",
									id: this.ID_SAVE_BUTTON,
									type: "icon",
									click: () => {
										this.saveForm();
									},
									icon: "fas fa-save",
									width: 24,
									height: 24,
								},
								{
									view: "button",
									id: this.ID_CANCEL_BUTTON,
									type: "icon",
									click: () => {
										this.cancelEdit();
									},
									icon: "fas fa-times-circle",
									width: 24,
									height: 24,
								}
							]
						}
						// {
						// 	height: 30,
						// 	cols: [
						// 		{
						// 			view: "button",
						// 			id: this.ID_ADD_BUTTON,
						// 			type: "icon",
						// 			click: this.saveForm,
						// 			icon: "fas fa-save",
						// 			width: 24,
						// 			height: 24,
						// 			hidden: true
						// 		},
						// 		{
						// 			view: "button",
						// 			id: this.ID_CANCEL_BUTTON,
						// 			type: "icon",
						// 			click: this.cancelEdit,
						// 			icon: "fas fa-times-circle",
						// 			width: 24,
						// 			height: 24,
						// 			hidden: true
						// 		}
						// 	]
						// }
					],
					rules: {
						name: webix.rules.isNotEmpty,
					},
					gravity: 1
				},
				{
					view: "list",
					id: this.ID_LIST,
					template: obj => `<div style='padding-left:18px'>
						${obj.name}
						<span class="edit-item fas fa-edit"></span>
						<span class="delete-item fas fa-times-circle"></span>
					</div>`,
					type: {
						height: 30
					},
					onClick: {
						"edit-item": () => {
							this.editItem();
						},
						"delete-item": (event, id) => {
							this.deleteItem(id);
						}
					},
					select: true,
					autowidth: true,
					gravity: 1,
					scroll: true
				},
			]
		};
	}

	init() {
		// const editButton = this.getEditButton();
		// editButton.attachEvent("onItemClick", this.showEditForm);
		const form = this.getForm();
		const list = this.getList();
		form.bind(list);
	}

	ready(view) {
		this._view = view;
		// const list = this.getList();
		// if (list.serialize().length < 1) {

		// }
	}

	saveForm() {
		const form = this.getForm();
		if (form.isDirty()) {
			if (!form.validate()) {
				webix.message("field shouldn't be empty", "warn", 5000);
				return;
			}
			form.save();
			this.cancelEdit();
		}
		else {
			webix.message("field shouldn't be empty", "warn", 5000);
		}
	}

	showEditForm() {
		const addButton = this.getAddButton();
		const changeForm = this.getChangeForm();
		changeForm.show();
		addButton.hide();
	}

	hideEditForm() {
		const addButton = this.getAddButton();
		const changeForm = this.getChangeForm();
		changeForm.hide();
		addButton.show();
	}

	cancelEdit() {
		this.hideEditForm();
	}

	addItem() {
		const list = this.getList();
		const lastId = list.getLastId() ?? 0;
		list.add({name: `${this.newItemName} ${lastId + 1}`, id: Number(lastId) + 1});
		list.select(`${lastId + 1}`);
		this.showEditForm();
	}

	editItem() {
		this.showEditForm();
	}

	deleteItem(id) {
		const listView = this.getList();
		listView.remove(id);
	}

	getForm() {
		return this.getRoot().queryView({id: this.ID_FORM});
	}

	getChangeForm() {
		return this.getRoot().queryView({id: this.ID_CHANGE_FORM});
	}

	getList() {
		return this.getRoot().queryView({id: this.ID_LIST});
	}

	getSaveButton() {
		return this.getRoot().queryView({id: this.ID_SAVE_BUTTON});
	}

	getCancelButton() {
		return this.getRoot().queryView({id: this.ID_CANCEL_BUTTON});
	}

	getAddButton() {
		return this.getRoot().queryView({id: this.ID_ADD_BUTTON});
	}
}
