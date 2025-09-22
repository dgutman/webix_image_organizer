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
			view: this.viewName,
			id: this.ID_LIST,
			css: "right-panel-list",
			editable: true,
			editor: "custom",
			template: (obj) => {
				// TODO check item for visibility
				const iconsVisibility = Object.assign({}, this.iconsVisibility);
				const editNameIcon = `<span class="icon edit-item fas fa-edit ${iconsVisibility.editIcon ? "" : "hidden-block"} font-size-12"></span>`;
				const editStyleIcon = `<span class="icon edit-style fas fa-palette ${iconsVisibility.editStyleIcon ? "" : "hidden-block"} font-size-12"></span>`;
				const deleteIcon = `<span class="icon delete-item fas fa-times-circle ${iconsVisibility.deleteIcon ? "" : "hidden-block"} font-size-12"></span>`;
				const visibleIcon = `<span class="icon visible fas fa-eye ${obj.visible ?? iconsVisibility.visibleIcon ? "" : "hidden-block"} font-size-12"></span>`;
				const invisibleIcon = `<span class="icon invisible fas fa-eye-slash ${obj.visible ?? iconsVisibility.visibleIcon ? "hidden-block" : ""} font-size-12"></span>`;
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
				"edit-item": (ev, id) => {
					this.editItem.call(this, ev, id);
					return false;
				},
				"delete-item": (ev, id) => {
					this.deleteItem.call(this, ev, id);
					return false;
				},
				"edit-style": (ev, id) => {
					this.editStyle.call(this, ev, id);
					return false;
				},
				visible: (ev, id) => {
					this.handleVisibility.call(this, ev, id, true);
					return false;
				},
				invisible: (ev, id) => {
					this.handleVisibility.call(this, ev, id, false);
					return false;
				},
				focus: (ev, id) => {
					this.handleFocus.call(this, ev, id);
					return false;
				},
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
		list.add({name: `${this._newItemName}`, id: Number(lastId) + 1, ...attributes});
	}

	editItem(event, id) {
		const list = this.getList();
		const item = list.getItem(id);
		const node = list.getItemNode(id);
		const nameEditor = {
			view: "text",
			value: item.name || "Name",
			name: "edit-name",
			placeholder: "name",
		};
		const editPopup = this.webix.ui({
			view: "popup",
			body: {
				rows: [
					nameEditor,
					{
						view: "button",
						value: "Save",
						click: () => {
							const name = editPopup.queryView({view: "text"}).getValue();
							item.name = name;
							list.updateItem(item.id, item);
							editPopup.close();
						}
					},
				]
			}
		});
		editPopup.show(node);
	}

	deleteItem(ev, id) {
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

	handleVisibility(ev, id, isVisible) {
		const list = this.getList();
		const item = list.getItem(id);
		if (item) {
			item.visible = !isVisible;
			list.updateItem(item.id, item);
		}
		this.togglePaperJSVisibility(item, isVisible);
	}

	togglePaperJSVisibility(item, isVisible) {
		// TODO: implement
		throw new Error(`Implement paperJS element visibility: ${isVisible}`);
	}

	handleFocus(ev, id) {
		// TODO: implement
	}


	clearAll() {
		const listView = this.getList();
		listView.clearAll();
	}
}
