import {JetView} from "webix-jet";
import ColorPicker from "../../../components/colorPicker";
import RangeSlider from "../../../components/rangeSlider";

const FORM_ID = "color-form";

export default class ColorPickerWindow extends JetView {
	constructor(app) {
		super(app);

		this._colorPicker = new ColorPicker(app, {name: "color"});
		this._rangeSlider = new RangeSlider(app, {}, 65000, 0);
	}

	config() {
		const colorPopup = {
			view: "popup",
			css: "color-picker-popup",
			move: false,
			modal: true,
			width: 300,
			height: 850,
			body: {
				view: "form",
				localId: FORM_ID,
				elements: [
					this._colorPicker,
					this._rangeSlider,
					{
						cols: [
							{
								view: "button",
								css: "btn-contour",
								label: "Cancel",
								click: () => {
									this.getForm().setValues(this._initValues);
									this.applyChanges();
									this.closeWindow();
								}
							},
							{},
							{
								view: "button",
								css: "btn",
								label: "Apply",
								click: () => {
									this.applyChanges();
									this.closeWindow();
								}
							}
						]
					}
				]
			}
		};

		return colorPopup;
	}

	ready() {
		const form = this.getForm();
		this.on(this._colorPicker.$pickerTemplate(), "onColorChange", () => {
			this.getRoot().callEvent("colorChanged", [form.getValues()]);
		});

		this.on(form, "onChange", () => {
			this.getRoot().callEvent("colorChanged", [form.getValues()]);
		});
	}

	showWindow(initValues, node, pos = "left") {
		this._initValues = webix.copy(initValues);
		this.getRoot().show(node, {pos});
		this.getForm().setValues(initValues);
	}

	closeWindow() {
		this.getForm().clear();
		this.getRoot().hide();
	}

	applyChanges() {
		const form = this.getForm();
		this.getRoot().callEvent("applyColorChange", [form.getValues()]);
	}

	getForm() {
		return this.$$(FORM_ID);
	}
}
