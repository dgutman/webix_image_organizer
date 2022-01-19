import {JetView} from "webix-jet";

const PALETTE_ID = "color-palette-id";

webix.protoUI({
	name: "formDataview",
	setValue(value) {
		if (!value) {
			this.unselectAll();
		}
		else {
			const id = typeof value === "object" ? value.id : value;
			const item = this.getItem(id);
			if (item) this.select(item.id);
		}
	},
	getValue() {
		return this.getSelectedItem();
	}
}, webix.ui.dataview);

export default class ColorPalette extends JetView {
	constructor(app, config) {
		super(app, config);

		this._cnf = config;
		this._dataview = null;
	}

	config() {
		return {
			...this._cnf,
			localId: PALETTE_ID,
			view: "formDataview",
			css: "palette-dataview",
			select: true,
			type: {
				width: 30,
				height: 30
			},
			template: obj => `<div class="palette-dataview__item" style='background-color: ${obj.color || "black"};'></div>`
		};
	}

	$palette() {
		if (!this._dataview) {
			this._dataview = this.$$(PALETTE_ID);
		}
		return this._dataview;
	}
}
