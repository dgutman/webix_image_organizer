import {JetView} from "webix-jet";
import Slider from "../../components/slider";
import BaseSliderTitle from "../../../utils/templates/slider/baseSliderTitle";

const CONTROL_FORM_ID = "control-form-id";

export default class ChannelsControls extends JetView {
	constructor(app, config = {}) {
		super(app);
		this._cnf = config;
		this._brightnessSlider = this._createBrightnessSlider();
		this._contrastSlider = this._createContrastSlider();
	}

	config() {
		return {
			...this._cnf,
			view: "form",
			localId: CONTROL_FORM_ID,
			type: "clean",
			padding: 5,
			margin: 5,
			elements: [
				this._brightnessSlider,
				this._contrastSlider,
				{gravity: 1}
			]
		};
	}

	get _sliderCss() {
		return "io-slider-title-with-value";
	}

	get _defaultFormValues() {
		return {
			brightness: 0,
			contrast: 0
		};
	}

	_createBrightnessSlider() {
		return new Slider(this.app, {
			name: "brightness",
			css: this._sliderCss,
			min: -1,
			max: 1,
			step: 0.02,
			title: BaseSliderTitle.getTemplate("Brightness:"),
			value: this._defaultFormValues.brightness,
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
			value: this._defaultFormValues.contrast,
			moveTitle: false
		});
	}

	get _controls() {
		return [
			this.$brightnessSlider(),
			this.$contrastSlider()
		];
	}

	_blockControlsEvents() {
		this._controls
			.forEach(control => control.blockEvent());
	}

	_unblockControlsEvents() {
		this._controls
			.forEach(control => control.unblockEvent());
	}

	$brightnessSlider() {
		return this._brightnessSlider.$slider();
	}

	$contrastSlider() {
		return this._contrastSlider.$slider();
	}

	$controlForm() {
		if (!this._$controlForm) {
			this._$controlForm = this.$$(CONTROL_FORM_ID);
		}

		return this._$controlForm;
	}

	reset() {
		this._blockControlsEvents();
		this.$controlForm().setValues(this._defaultFormValues);
		this._unblockControlsEvents();
	}
}
