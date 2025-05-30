import {JetView} from "webix-jet";

export default class ListView extends JetView {
	constructor(app, config = {}) {
		super(app);
		const {name, newItemName, view} = config;
		this._name = name;
		this._newItemName = newItemName;
		this.viewName = view || "list";
		this.ID_LIST = `list-id-${webix.uid()}`;
		this.ID_ADD_BUTTON = `add-item-button-id-${webix.uid()}`;
		this.iconsVisibility = {
			editIcon: true,
			editStyleIcon: true,
			deleteIcon: true,
			visibleIcon: true,
			focusIcon: true,
		};
	}

	config() {
		const list = {
			view: "list",
			id: this.ID_LIST,
			css: "right-panel-list",
			template: (obj) => {
				// TODO check item for visibility
				const iconsVisibility = Object.assign({}, this.iconsVisibility);
				const editNameIcon = `<span class="icon edit-item fas fa-edit ${iconsVisibility.editIcon ? "" : "hidden-block"} font-size-12"></span>`;
				const editStyleIcon = `<span class="icon edit-style fas fa-palette ${iconsVisibility.editStyleIcon ? "" : "hidden-block"} font-size-12"></span>`;
				const deleteIcon = `<span class="icon delete-item fas fa-times-circle ${iconsVisibility.deleteIcon ? "" : "hidden-block"} font-size-12"></span>`;
				const visibleIcon = `<span class="icon visible fas fa-eye ${iconsVisibility.visibleIcon ? "" : "hidden-block"} font-size-12"></span>`;
				const invisibleIcon = `<span class="icon invisible fas fa-eye-slash ${iconsVisibility.visibleIcon ? "hidden-block" : ""} font-size-12"></span>`;
				const focusIcon = `<span class="icon focus fas fa-crosshairs ${iconsVisibility.focusIcon ? "" : "hidden-block"} font-size-12"></span>`;
				const name = `<span class="right-panel-list__item_name">${obj.name}</span>`;
				const element = `<div class="right-panel-list__item" style='padding-left:10px'>
									${invisibleIcon}
									${visibleIcon}
									${name}
									${editNameIcon}
									${editStyleIcon}
									${focusIcon}
									${deleteIcon}
								</div>`;
				return element;
			},
			type: {
				height: 30
			},
			onClick: {
				"edit-item": this.editItem.bind(this),
				"delete-item": this.deleteItem.bind(this),
				"edit-style": this.editStyle.bind(this),
				visible: this.handleVisibility.bind(this, true),
				invisible: this.handleVisibility.bind(this, false),
				focus: this.handleFocus.bind(this),
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
						{width: 10},
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

	editItem(event, id) {
		const list = this.getList();
		const item = list.getItem(id);
		if (item) {
			list.editItem(id);
		}
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

	/**
	 *
	 * @returns {webix.ui.button}
	 */
	getAddButton() {
		return this.getRoot().queryView({id: this.ID_ADD_BUTTON});
	}

	handleVisibility(isVisible) {
		const list = this.getList();
		const item = list.getSelectedItem();
		if (item) {
			item.visible = isVisible;
			list.updateItem(item.id, item);
		}
	}

	handleFocus() {
		// TODO: implement in descendants
	}


	clearAll() {
		const listView = this.getList();
		listView.clearAll();
	}
}
