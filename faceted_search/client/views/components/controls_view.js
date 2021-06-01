define([
	"app",
	"helpers/base_jet_view",
	"helpers/math_calculations",
	"views/components/slider",
	"views/components/color_palette",
	"templates/slider/base_slider_title",
	"templates/slider/floating_number_slider_title"
], function(
	app,
	BaseJetView,
	MathCalculations,
	Slider,
	ColorPalette,
	BaseSliderTitle,
	FloatingNumberSliderTitle
) {
	'use strict';
	const CONTROL_FORM_ID = "control-form-id";
	const PALETTE_COLORS_COUNT = 12;

	return class ControlsView extends BaseJetView {
		constructor(app, config = {}) {
			super(app, config);

			this._cnf = config;
			this._colorizeSlider = this._createColorizeSlider();
			this._hueSlider = this._createHueSlider();
			this._brightnessSlider = this._createBrightnessSlider();
			this._contrastSlider = this._createContrastSlider();
			this._rotationSlider = this._createRotationSlider();
			this._colorPalette = this._createColorPalette(PALETTE_COLORS_COUNT);
		}

		get $ui() {
			return {
				...this._cnf,
				id: this._rootId,
				view: "form",
				localId: CONTROL_FORM_ID,
				type: "clean",
				padding: 5,
				margin: 5,
				elements: [
					this._colorizeSlider,
					this._hueSlider,
					this._brightnessSlider,
					this._contrastSlider,
					this._rotationSlider,
					{
						padding: 10,
						cols: [
							this._colorPalette
						]
					},
					{gravity: 1}
				]
			};
		}

		get _sliderCss() {
			return "io-slider-title-with-value";
		}

		get _defaultFormValues() {
			return {
				colorize: 0,
				hue: 0,
				brightness: 0,
				contrast: 0,
				rotation: 0
			};
		}

		_createColorizeSlider() {
			return new Slider(this.app, {
				css: this._sliderCss,
				min: 0,
				max: 1,
				step: 0.01,
				title: FloatingNumberSliderTitle.getTemplate("Colorize:"),
				moveTitle: false,
				name: "colorize",
				value: this._defaultFormValues.colorize
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
				value: this._defaultFormValues.hue,
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

		_createRotationSlider() {
			return new Slider(this.app, {
				name: "rotation",
				css: this._sliderCss,
				min: -180,
				max: 180,
				step: 0.1,
				title: BaseSliderTitle.getTemplate("Rotation:"),
				value: this._defaultFormValues.rotation,
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

		get _controls() {
			return [
				this.$colorizeSlider(),
				this.$hueSlider(),
				this.$brightnessSlider(),
				this.$contrastSlider(),
				this.$rotationSlider(),
				this.$colorPalette()
			];
		}

		_blockControlsEvents() {
			this._controls
				.forEach((control) => control.blockEvent());
		}

		_unblockControlsEvents() {
			this._controls
				.forEach((control) => control.unblockEvent());
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
			if (!this._$controlForm) {
				this._$controlForm = this.$$(CONTROL_FORM_ID);
			}

			return this._$controlForm;
		}

		reset() {
			this._blockControlsEvents();
			this.$controlForm().setValues(this._defaultFormValues);
			this.$colorPalette().unselectAll();
			this._unblockControlsEvents();
		}
	};
});
