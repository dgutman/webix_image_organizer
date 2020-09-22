let counter = 1;
let timeoutId;

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

function getComboPopupConfig(combo) {
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
			css: "popup-list",
			borderless: true,
			template(obj) {
				const checkboxState = combo.getPopupList().isSelected(obj.id) ? "fas fa-check-square" : "far fa-square";
				return `<i class="${checkboxState}"></i> ${obj.name}`;
			},
			tooltip: obj => obj.name,
			autoheight: true
		}
	};
}

webix.protoUI({
	name: "multiCombo",
	defaults: {
		icon: "fas fa-angle-down"
	},
	$init() {
		this.$view.classList.add("multi-combo");
		this.$view.classList.add("webix_el_search");

		const comboPopup = getComboPopupConfig(this);
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

	customSelect(id, many) {
		const list = this.getPopupList();
		list.select(id, many);
		if (many) list._multiSelected.push(id);
		else list._multiSelected = [id];

		this.callEvent("customSelectChange", [list._multiSelected]);
	},

	customUnselect(id) {
		const list = this.getPopupList();
		list.unselect(id);
		list._multiSelected = list._multiSelected.filter(selId => +selId !== +id);

		this.callEvent("customSelectChange", [list._multiSelected]);
	},

	_attachCustomEvents() {
		const popup = this.getCustomPopup();
		const list = this.getPopupList();
		list._multiSelected = [];

		this.attachEvent("onKeyPress", () => {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = webix.delay(() => {
				const value = this.getText();
				list.filter(obj => obj.name.toLowerCase().includes(value.toLowerCase()));

				if (list.data.count() && !popup.isVisible()) {
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
			list.filter(obj => obj.name.includes(value));

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
	}
}, webix.ui.search);
