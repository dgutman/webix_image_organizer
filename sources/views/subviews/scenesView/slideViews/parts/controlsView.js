import {JetView} from "webix-jet";
import Slider from "../../../../components/slider";
import ColorPalette from "../../../../components/colorPalette";
import BaseSliderTitle from "../../../../../utils/templates/slider/baseSliderTitle";
import FloatingNumberSliderTitle from "../../../../../utils/templates/slider/floatingNumberSliderTitle";
import MathCalculations from "../../../../../utils/mathCalculations";

const CONTROL_FORM_ID = "control-form-id";
const PALETTE_COLORS_COUNT = 12;

export default class ControlsView extends JetView {
	get _sliderCss() {
		return "io-slider-title-with-value";
	}

	constructor(app, config = {}) {
		super(app, config);

		this._cnf = config;
		this._opacitySlider = this._createOpacitySlider();
		this._colorizeSlider = this._createColorizeSlider();
		this._hueSlider = this._createHueSlider();
		this._brightnessSlider = this._createBrightnessSlider();
		this._contrastSlider = this._createContrastSlider();
		this._rotationSlider = this._createRotationSlider();
		this._colorPalette = this._createColorPalette(PALETTE_COLORS_COUNT);
	}

	config() {
		return {
			...this._cnf,
			view: "form",
			localId: CONTROL_FORM_ID,
			type: "clean",
			padding: 5,
			elements: [
				this._opacitySlider,
				this._colorizeSlider,
				this._hueSlider,
				this._brightnessSlider,
				this._contrastSlider,
				this._rotationSlider,
				{height: 10},
				this._colorPalette,
				{}
			]
		};
	}

	_createOpacitySlider() {
		return new Slider(this.app, {
			...this._getFloatingNumberSliderBaseConfig("Opacity:"),
			name: "opacity",
			hidden: true,
			value: 1
		});
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

	_createColorPalette(colorsCount) {
		const data = this._getColorValuesByCount(colorsCount);
		return new ColorPalette(this.app, {
			name: "colorItem",
			borderless: true,
			autoheight: true,
			scroll: false,
			data
		});
	}

	_getColorValuesByCount(count) {
		const colors = [];
		for (let i = 0; i < count; i++) {
			const hue = this._getHueFromPaletteIndex(i, count);
			colors.push({
				hue,
				color: `hsl(${hue}, 100%, 50%)`
			});
		}
		return colors;
	}

	_getHueFromPaletteIndex(index, colorPaletteLength) {
		return Math.round(MathCalculations.mapLinear(index, 0, colorPaletteLength, 0, 360, true));
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

	$opacitySlider() {
		return this._opacitySlider.$slider();
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

	$colorPalette() {
		return this._colorPalette.$palette();
	}

	$controlForm() {
		return this.$$(CONTROL_FORM_ID);
	}
}
