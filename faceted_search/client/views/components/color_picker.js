define([
	"helpers/base_jet_view",
	"libs/vanilla-picker/vanilla-picker"
], function(BaseJetView, VanillaPicker) {
	'use strict';
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

	return class ColorPicker extends BaseJetView {
		constructor(app, config = {}) {
			super(app, config);
	
			this._cnf = config;
			this._pickerTemplate = null;

			this.$oninit = () => {
				this._initPicker();
			};
		}
	
		get $ui() {
			return {
				...this._cnf,
				id: this._rootId,
				localId: PICKER_ID,
				view: "formTemplate",
				borderless: true,
				css: "color-picker",
				height: 315,
				template: ""
			};
		}
	
		$pickerTemplate() {
			if (!this._pickerTemplate) {
				this._pickerTemplate = this.$$(PICKER_ID);
			}
			return this._pickerTemplate;
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
	
			pickerTemplate.attachEvent("onChange", (value) => {
				picker.setColor(value, true);
			});
			return picker;
		}
	};
});
