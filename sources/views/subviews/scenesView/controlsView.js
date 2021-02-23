import {JetView} from "webix-jet";
import Slider from "../../components/slider";
import BaseSliderTitle from "../../../utils/templates/slider/baseSliderTitle";
import FloatingNumberSliderTitle from "../../../utils/templates/slider/floatingNumberSliderTitle";

const CONTROL_FORM_ID = "control-form-id";

export default class ControlsView extends JetView {
	get _sliderCss() {
		return "io-slider-title-with-value";
	}

	constructor(app, config = {}) {
		super(app, config);

		this._cnf = config;
		this._colorizeSlider = this._createColorizeSlider();
		this._hueSlider = this._createHueSlider();
		this._brightnessSlider = this._createBrightnessSlider();
		this._contrastSlider = this._createContrastSlider();
		this._rotationSlider = this._createRotationSlider();
	}

	config() {
		return {
			...this._cnf,
			view: "form",
			localId: CONTROL_FORM_ID,
			type: "clean",
			elements: [
				this._colorizeSlider,
				this._hueSlider,
				this._brightnessSlider,
				this._contrastSlider,
				this._rotationSlider,
				{}
			]
		};
	}

	_createColorizeSlider() {
		return new Slider(this.app, {
			...this._getFloatingNumberSliderBaseConfig("Colorize:"),
			name: "colorize",
			value: 0
		});
	}

	_createHueSlider() {
		return new Slider(this.app, {
			name: "hue",
			css: this._sliderCss,
			min: 0,
			max: 360,
			step: 1,
			title: BaseSliderTitle.getTemplate("Hue:"),
			value: 0,
			moveTitle: false
		});
	}

	_createBrightnessSlider() {
		return new Slider(this.app, {
			name: "brightness",
			css: this._sliderCss,
			min: -1,
			max: 1,
			step: 0.02,
			title: BaseSliderTitle.getTemplate("Brightness:"),
			value: 0,
			moveTitle: false
		});
	}

	_createContrastSlider() {
		return new Slider(this.app, {
			name: "contrast",
			css: this._sliderCss,
			min: -1,
			max: 1,
			step: 0.02,
			title: BaseSliderTitle.getTemplate("Contrast:"),
			value: 0,
			moveTitle: false
		});
	}

	_createRotationSlider() {
		return new Slider(this.app, {
			name: "rotation",
			css: this._sliderCss,
			min: -180,
			max: 180,
			step: 0.1,
			title: BaseSliderTitle.getTemplate("Rotation:"),
			value: 0,
			moveTitle: false
		});
	}

	_getFloatingNumberSliderBaseConfig(titleText) {
		return {
			css: this._sliderCss,
			min: 0,
			max: 1,
			step: 0.01,
			title: FloatingNumberSliderTitle.getTemplate(titleText),
			moveTitle: false
		};
	}


	$colorizeSlider() {
		return this._colorizeSlider.$slider();
	}

	$hueSlider() {
		return this._hueSlider.$slider();
	}

	$brightnessSlider() {
		return this._brightnessSlider.$slider();
	}

	$contrastSlider() {
		return this._contrastSlider.$slider();
	}

	$rotationSlider() {
		return this._rotationSlider.$slider();
	}

	$controlForm() {
		return this.$$(CONTROL_FORM_ID);
	}
}
