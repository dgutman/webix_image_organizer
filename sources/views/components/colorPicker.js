import {JetView} from "webix-jet";
import VanillaPicker from "vanilla-picker";

const PICKER_ID = "color-picker-id";

webix.protoUI({
	name: "formTemplate",
	getValue() {
		const obj = this.getValues();
		return obj[this.config.name || "value"];
	},
	setValue(value, silent) {
		const valueObj = {
			[this.config.name || "value"]: value
		};
		if (!silent) {
			this.callEvent("onChange", [value]);
		}
		return this.setValues(valueObj);
	}
}, webix.ui.template);


export default class ColorPicker extends JetView {
	constructor(app, config = {}) {
		super(app, config);

		this._cnf = config;
		this._pickerTemplate = null;
	}

	config() {
		return {
			...this._cnf,
			localId: PICKER_ID,
			view: "formTemplate",
			borderless: true,
			css: "color-picker",
			height: 315,
			width: 255,
			template: ""
		};
	}

	$pickerTemplate() {
		if (!this._pickerTemplate) {
			this._pickerTemplate = this.$$(PICKER_ID);
		}
		return this._pickerTemplate;
	}

	init() {
		this._initPicker();
	}

	$picker() {
		if (!this._picker) {
			this._picker = this._initPicker();
		}
		return this._picker;
	}

	_initPicker() {
		const pickerTemplate = this.$pickerTemplate();
		const picker = new VanillaPicker({
			parent: pickerTemplate.getNode(),
			popup: false,
			editorFormat: "rgb",
			alpha: false,
			onChange: ({rgbString}) => {
				pickerTemplate.setValue(rgbString, true);
				pickerTemplate.callEvent("onColorChange", [rgbString]);
			}
		});

		this.on(pickerTemplate, "onChange", (value) => {
			picker.setColor(value, true);
		});
		return picker;
	}
}
