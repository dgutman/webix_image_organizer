import {JetView} from "webix-jet";

export default class ListView extends JetView {
	constructor(app, config = {}) {
		super(app);
		const {name, newItemName} = config;
		this._name = name;
		this._newItemName = newItemName;
		this.ID_LIST = `list-id-${webix.uid()}`;
		this.ID_ADD_BUTTON = `add-item-button-id-${webix.uid()}`;
	}

	config() {
		const list = {
			view: "list",
			id: this.ID_LIST,
			css: "right-panel-list",
			template: (obj) => {
				// TODO check item for visibility
				const hidden = true;
				const editNameIcon = '<span class="edit-item fas fa-edit"></span>';
				const editStyleIcon = '<span class="edit-style fas fa-palette"></span>';
				const deleteIcon = '<span class="delete-item fas fa-times-circle"></span>';
				const visibleIcon = `<span class="visible fas fa-eye ${hidden ? "hidden-block" : ""}"></span>`;
				const invisibleIcon = `<span class="invisible fas fa-eye-slash ${hidden ? "hidden-block" : ""}"></span>`;
				const name = `<span class="right-panel-list__item_name">${obj.name}</span>`;
				const element = `<div class="right-panel-list__item" style='padding-left:18px'>
									${name}
									${invisibleIcon}
									${visibleIcon}
									${editNameIcon}
									${editStyleIcon}
									${deleteIcon}
								</div>`;
				return element;
			},
			type: {
				height: 30
			},
			onClick: {
				"edit-item": () => {
					this.editItem();
				},
				"delete-item": (event, id) => {
					this.deleteItem(id);
				},
				"edit-style": (event, id) => {
					this.editStyle();
				}
			},
			select: true,
			autowidth: true,
			gravity: 1,
			scroll: true
		};

		const addButton = {
			view: "button",
			id: this.ID_ADD_BUTTON,
			click: () => {
				this.addItem();
			},
			label: "Add new",
			height: 30,
			gravity: 1,
			width: 100,
		};

		/** @type {webix.ui.labelConfig} */
		const label = {
			view: "label",
			align: "left",
			borderless: true,
			gravity: 3,
			label: this._name,
		};

		return {
			rows: [
				{
					cols: [
						label,
						addButton
					]
				},
				list,
			]
		};
	}

	init() {
	}

	ready(view) {
		this._view = view;
	}

	addItem(attributes) {
		const list = this.getList();
		const lastId = list.getLastId() ?? 0;
		list.add({name: `${this._newItemName} ${lastId + 1}`, id: Number(lastId) + 1, ...attributes});
	}

	editItem() {
		// TODO: implement in descendants
	}

	deleteItem(id) {
		const listView = this.getList();
		listView.remove(id);
	}

	editStyle() {
		// TODO: implement in descendants
	}

	/**
	 * Return webix.ui.list
	 *
	 * @returns {webix.ui.list}
	 */
	getList() {
		return this.getRoot().queryView({id: this.ID_LIST});
	}

	getAddButton() {
		return this.getRoot().queryView({id: this.ID_ADD_BUTTON});
	}

	clearAll() {
		const listView = this.getList();
		listView.clearAll();
	}
}
