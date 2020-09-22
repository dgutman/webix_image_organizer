import tagTemplates from "../../models/tagTemplates"; 

webix.protoUI({
	name: "customSuggest",
	_preselectMasterOption(data) {
		let master;
		let node;
		let text = "";

		if (data) {
			text = data.name || "";
			if (this._settings.master) {
				master = $$(this._settings.master);
				node = master.getInputNode();

				if (node && master.$setValueHere) {
					master.$setValueHere(data.value);
				}
				else if (node) {
					if (master.options_setter) text = this.getItemText(data.id);
					else if (data.value) text = master._get_visible_text ? master._get_visible_text(data.value) : data.value.toString();
					if (typeof node.value === "undefined") node.innerHTML = text;
					else node.value = text.replace(/<[^>]*>/g, "");
				}
			}
		}

		node = node || this._last_input_target;
		if (node) node.focus();
	}
}, webix.ui.suggest);

const comboPopup = {
	view: "customSuggest",
	autofocus: false,
	autofit: true,
	fitMaster: true,
	textValue: name,
	filter(obj, value) {
		const list = this.getList();
		const listedValue = list.find(item => item.name === value, true);
		if (listedValue) list.select(listedValue.id);
		else list.unselectAll();

		return obj.name.includes(value);
	},
	body: {
		name: "popupList",
		borderless: true,
		template: obj => obj.name,
		tooltip: obj => obj.name
	}
};

const codes = {
	up: 38,
	down: 40,
	left: 37,
	right: 39,
	enter: 13
};

let counter = 1;
let timeoutId;

function getComponentId(component) {
	const comboStr = `$editCombo${counter}`;
	switch (component) {
		case "list": {
			return `${comboStr}-popup-list`;
		}
		case "popup": {
			return `${comboStr}-popup`;
		}
		case "combo":
		default: {
			return comboStr;
		}
	}
}

webix.protoUI({
	name: "editCombo",
	$init() {
		this.$view.classList.add("edit-combo");
		this.$view.classList.add("webix_el_text");
		comboPopup.id = getComponentId("popup");
		comboPopup.body.id = getComponentId("list");
		this.config.suggest = comboPopup.id;
		this.config.id = getComponentId("combo");

		counter++;
		this._comboPopup = this.$scope.ui(comboPopup);
		this._attachCustomEvents();
	},

	getCustomPopup() {
		return this._comboPopup;
	},

	getPopupList() {
		return this.getCustomPopup().getList();
	},

	_attachCustomEvents() {
		const popup = this.getCustomPopup();
		const list = this.getPopupList();
		// const combo = this;
		this.attachEvent("onKeyPress", (code) => {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = webix.delay(() => {
				switch (code) {
					case codes.up: {
						this._handleUp();
						break;
					}
					case codes.down: {
						this._handleDown();
						break;
					}
					case codes.enter: {
						this._handleEnter();
						break;
					}
					case codes.right:
					case codes.left: {
						break;
					}
					default: {
						const value = this.getValue();
						// list.filter(obj => obj.name.includes(value));

						const listedValue = list.find(obj => obj.name === value, true);
						if (listedValue) {
							if (list.getSelectedId() !== listedValue.id) list.select(listedValue.id);
						}
						else list.unselectAll();

						// if (list.data.count() && !popup.isVisible()) {
						// 	popup.show();
						// }
						// else if (!list.data.count()) {
						// 	popup.hide();
						// }
						// break;
					}
				}
			}, 100);
		});

		this.attachEvent("onDestruct", () => {
			this._comboPopup = null;
			popup.destructor();
		});

		popup.attachEvent("onBeforeShow", () => {
			const value = this.getValue();

			list.filter(obj => obj.name.includes(value));
			if (!list.data.count()) {
				return false;
			}
		});

		list.attachEvent("onAfterSelect", (id) => {
			const item = list.getItem(id);
			this.setValue("");
			this.setValue(item.name);
		});

		list.attachEvent("onItemClick", (id) => {
			list.select(id);
			this._handleEnter();
		});
	},

	_handleUp() {
		const list = this.getPopupList();
		if (list.data.count()) {
			const selectedId = list.getSelectedId();
			const prevId = list.getPrevId(selectedId);
			list.select(prevId || list.getLastId());
		}
	},

	_handleDown() {
		const list = this.getPopupList();
		if (list.data.count()) {
			const selectedId = list.getSelectedId();
			const nextId = list.getNextId(selectedId);
			list.select(nextId || list.getFirstId());
		}
	},

	_handleEnter() {
		const popup = this.getCustomPopup();
		const list = this.getPopupList();
		const selectedId = list.getSelectedId();
		if (selectedId) {
			const item = list.getItem(selectedId);
			this.setValue("");
			this.setValue(item.name);
			popup.hide();
			this.callEvent("itemSelected", [item]);
		}
	}
}, webix.ui.text);

webix.protoUI({
	name: "tagCombo",
	$init() {
		this.$view.classList.add("edit-combo");
		this.$view.classList.add("webix_el_text");
		comboPopup.id = getComponentId("popup");
		comboPopup.body.id = getComponentId("list");
		this.config.suggest = comboPopup.id;
		this.config.id = getComponentId("combo");

		counter++;
		this._comboPopup = this.$scope.ui(comboPopup);
		this._attachCustomEvents();
		this._connectSuggestion();
	},
	_connectSuggestion() {
		this.getPopupList().sync(tagTemplates.tagsWithValues);
	}
}, webix.ui.editCombo);
