let counter = 1;
let timeoutId;
const filterValue = "name";

function getComponentId(component) {
	const comboStr = `$multiCombo${counter}`;
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

function getComboPopupConfig(combo, field) {
	return {
		view: "popup",
		id: getComponentId("popup"),
		autofocus: false,
		autofit: true,
		body: {
			view: "list",
			id: getComponentId("list"),
			yCount: 7,
			name: "popupList",
			css: "popup-list ellipsis-text",
			borderless: true,
			template(obj) {
				const checkboxState = combo.getPopupList().isSelected(obj.id) ? "fas fa-check-square" : "far fa-square";
				return `<i class="${checkboxState}"></i> ${obj[field]}`;
			},
			tooltip: obj => obj[field],
			autoheight: true
		}
	};
}

webix.protoUI({
	name: "multiCombo",
	defaults: {
		icon: "fas fa-angle-down",
		filterValue,
		navigation: false
	},
	_disabledItems: new Map(),
	$init(settings) {
		this.$view.classList.add("multi-combo");
		this.$view.classList.add("webix_el_search");

		const comboPopup = getComboPopupConfig(this, settings.filterValue || filterValue);
		this._settings.id = getComponentId("combo");
		this._settings.popup = getComponentId("popup");

		counter++;
		this._comboPopup = this.$scope.ui(comboPopup);
		this._attachCustomEvents();
	},

	$getValue() {
		const list = this.getPopupList();
		return list._multiSelected.map(id => list.getItem(id));
	},

	$setValue(ids) {
		ids = ids ? ids.split(",") : [];
		const list = this.getPopupList();
		list._multiSelected = ids.filter(id => list.getItem(id)).unique();
		this.callEvent("customSelectChange", [list._multiSelected]);
	},

	_applyChanges() {
		let newvalue = this.getValue();
		newvalue = newvalue.map(obj => obj.id);
		const res = this.setValue(newvalue, true);

		if (this._custom_format && res === false) {
			this.$setValue(newvalue);
		}
	},

	getText() {
		let value = "";
		if (this._rendered_input) {
			const inputValue = this.getInputNode().value;
			value = inputValue === 0 ? "0" : inputValue;
		}
		else {
			value = this._settings.value;
		}
		return value || "";
	},

	getCustomPopup() {
		return this._comboPopup;
	},

	getPopupList() {
		return this.getCustomPopup().queryView({name: "popupList"});
	},

	customSelect(ids, many) {
		if (!Array.isArray(ids)) {
			ids = [ids];
		}
		ids = ids.filter(id => !this._disabledItems.has(parseInt(id)));

		const list = this.getPopupList();
		list.select(ids, many);
		if (many) list._multiSelected = [...list._multiSelected, ...ids];
		else list._multiSelected = ids;

		this.callEvent("customSelectChange", [list._multiSelected]);
	},

	customUnselect(id) {
		const list = this.getPopupList();
		list.unselect(id);
		list._multiSelected = list._multiSelected.filter(selId => +selId !== +id);

		this.callEvent("customSelectChange", [list._multiSelected]);
	},

	disableItem(id) {
		const item = this.getPopupList().getItem(id);
		if (!item) {
			return;
		}

		this.customUnselect(id);
		this.getPopupList().addCss(id, "webix_disabled");
		this._disabledItems.set(id, item);
	},

	enableItem(id) {
		const item = this.getPopupList().getItem(id);
		if (!item) {
			return;
		}

		this.getPopupList().removeCss(id, "webix_disabled");
		this._disabledItems.delete(id, item);
	},

	disableAll() {
		const itemIds = Object.keys(this.getPopupList().data.pull);
		itemIds.forEach((id) => {
			this.disableItem(id);
		});
	},

	enableAll() {
		const disabledIds = [...this._disabledItems.keys()];
		disabledIds.forEach((id) => {
			this.enableItem(id);
		});
	},

	_filterList(value) {
		const list = this.getPopupList();
		const field = this.config.filterValue;
		list.filter(obj => obj[field].toLowerCase().includes(value.toLowerCase()));
	},

	_attachCustomEvents() {
		const popup = this.getCustomPopup();
		const list = this.getPopupList();
		list._multiSelected = [];

		this.attachEvent("onKeyPress", () => {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = webix.delay(() => {
				const value = this.getText();
				this._filterList(value);

				if (list.data.count()) {
					popup.show(this.getInputNode(), {pos: "bottom"});
				}
				else if (!list.data.count()) {
					popup.hide();
				}
			}, 100);
		});

		this.attachEvent("onDestruct", () => {
			this._comboPopup = null;
			popup.destructor();
		});

		popup.attachEvent("onBeforeShow", () => {
			const value = this.getText();
			this._filterList(value);

			const selectedIds = list._multiSelected;
			list.blockEvent();
			selectedIds.forEach(id => list.select(id, true));
			list.unblockEvent();

			if (!list.data.count()) {
				return false;
			}
		});

		list.attachEvent("onItemClick", (id) => {
			const selected = list.isSelected(id);
			if (selected) this.customUnselect(id);
			else this.customSelect(id, true);
		});

		list.data.attachEvent("onClearAll", () => {
			this._disabledItems.clear();
		});
	}
}, webix.ui.search);
