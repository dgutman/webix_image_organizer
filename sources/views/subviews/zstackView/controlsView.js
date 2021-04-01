import {JetView} from "webix-jet";
import Slider from "../../components/slider";
import BaseSliderTitle from "../../../utils/templates/slider/baseSliderTitle";
import FloatingNumberSliderTitle from "../../../utils/templates/slider/floatingNumberSliderTitle";
import utils from "../../../utils/utils";


export default class ControlsView extends JetView {
	get _sliderCss() {
		return "io-slider-title-with-value";
	}

	get _erosionSelectId() {
		return "erosionSelectViewId";
	}

	constructor(app, config = {}) {
		super(app, config);

		this._opacitySlider = this._createOpacitySlider();
		this._colorizeSlider = this._createColorizeSlider();
		this._hueSlider = this._createHueSlider();
		this._shimXSlider = this._createShimXSlider();
		this._shimYSlider = this._createShimYSlider();
		this._erosionSelect = null;
	}

	config() {
		return {
			width: 250,
			paddingX: 5,
			paddingY: 10,
			margin: 10,
			rows: [
				this._opacitySlider,
				this._colorizeSlider,
				this._hueSlider,
				{
					paddingX: 10,
					cols: [
						this._getErosionSelectConfig()
					]
				},
				this._shimXSlider,
				this._shimYSlider,
				{}
			]
		};
	}

	_createOpacitySlider() {
		return new Slider(this.app, {
			...this._getFloatingNumberSliderBaseConfig("Opacity:"),
			value: 1
		});
	}

	_createColorizeSlider() {
		return new Slider(this.app, {
			...this._getFloatingNumberSliderBaseConfig("Colorize:"),
			value: 0
		});
	}

	_createHueSlider() {
		return new Slider(this.app, {
			css: this._sliderCss,
			min: 0,
			max: 360,
			step: 1,
			title: BaseSliderTitle.getTemplate("Hue:"),
			value: 0,
			moveTitle: false
		});
	}

	_createShimXSlider() {
		return new Slider(this.app, this._getShimSliderBaseConfig("Shim X:"));
	}

	_createShimYSlider() {
		return new Slider(this.app, this._getShimSliderBaseConfig("Shim Y:"));
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

	_getErosionSelectConfig() {
		return {
			view: "richselect",
			localId: this._erosionSelectId,
			icon: utils.getSelectIcon(),
			label: "Erosion:",
			css: "select-field",
			labelPosition: "top",
			value: 1,
			options: [
				{id: 1, value: "None"},
				{id: 3, value: "3x3 Kernel"},
				{id: 5, value: "5x5 Kernel"},
				{id: 7, value: "7x7 Kernel"},
				{id: 9, value: "9x9 Kernel"}
			]
		};
	}

	_getShimSliderBaseConfig(titleText) {
		return {
			css: this._sliderCss,
			min: -92,
			max: 92,
			value: 0,
			step: 1,
			title: BaseSliderTitle.getTemplate(titleText),
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

	$shimXSlider() {
		return this._shimXSlider.$slider();
	}

	$shimYSlider() {
		return this._shimYSlider.$slider();
	}

	$erosionSelect() {
		if (!this._erosionSelect) {
			this._erosionSelect = this.$$(this._erosionSelectId);
		}
		return this._erosionSelect;
	}

	getControlsList() {
		return [
			this.$opacitySlider(),
			this.$colorizeSlider(),
			this.$hueSlider(),
			this.$shimXSlider(),
			this.$shimYSlider(),
			this.$erosionSelect()
		];
	}

	blockControlsEvents() {
		this.getControlsList().forEach(control => control.blockEvent());
	}

	unblockControlsEvents() {
		this.getControlsList().forEach(control => control.unblockEvent());
	}
}
