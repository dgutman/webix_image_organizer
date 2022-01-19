import OrganizerFilters from "../organizer/organizerFilters";

export default class SlideLayersService {
	constructor(rootScope, osdViewer, controlsView, metadataPanel) {
		this._rootScope = rootScope;
		this._osdViewer = osdViewer;
		this._controlsView = controlsView;
		this._metadataPanel = metadataPanel;

		this._viewFilters = new OrganizerFilters();

		this._layer = null;
		this._layers = []; // need if more than 1 layer in OSD viewer
	}

	setLayers(layers, mainLayer) {
		this._layers = layers;
		layers.forEach((layer, i) => {
			layer.tiledImage = this._getTiledImageByIndex(i);
		});
		this._layer = mainLayer || layers[0];
		return this._layers;
	}

	setMainLayer(mainLayer) {
		this._layer = mainLayer;
	}

	getMainLayer() {
		return this._layer;
	}

	setOsdViewer(osdViewer) {
		this._osdViewer = osdViewer;
	}

	_getCurrentTiledImage() {
		return this._layer.tiledImage;
	}

	_getTiledImageByIndex(i) {
		const tiledImageIndex = this._layers.length - 1 - i;
		return this._osdViewer.getItemByIndex(tiledImageIndex);
	}

	_changeRotation(value, immediately) {
		const tiledImage = this._getCurrentTiledImage();
		this._layer.rotation = value;
		tiledImage.setRotation(value, immediately);
	}

	_changeOpacity(value) {
		const tiledImage = this._getCurrentTiledImage();
		this._layer.opacity = value;
		tiledImage.setOpacity(value);
	}

	_changeColorize(value) {
		this._layer.colorize = value;
		this._viewFilters.updateFilters(this._layers, this._osdViewer.$viewer());
	}

	_changeHue(value) {
		this._layer.hue = value;
		this._viewFilters.updateFilters(this._layers, this._osdViewer.$viewer());
	}

	_changeBrightness(value) {
		this._layer.brightness = value;
		this._viewFilters.updateFilters(this._layers, this._osdViewer.$viewer());
	}

	_changeContrast(value) {
		this._layer.contrast = value;
		this._viewFilters.updateFilters(this._layers, this._osdViewer.$viewer());
	}

	setStateToSlide(layer) {
		const {
			rotation,
			hue,
			brightness,
			colorize,
			contrast,
			opacity
		} = layer;
		this._changeRotation(rotation, true);
		this._changeHue(hue);
		this._changeBrightness(brightness);
		this._changeColorize(colorize);
		this._changeContrast(contrast);
		this._changeOpacity(opacity);
	}

	attachControlsEvents() {
		const opacitySlider = this._controlsView.$opacitySlider();
		const colorizeSlider = this._controlsView.$colorizeSlider();
		const hueSlider = this._controlsView.$hueSlider();
		const brightnessSlider = this._controlsView.$brightnessSlider();
		const contrastSlider = this._controlsView.$contrastSlider();
		const rotationSlider = this._controlsView.$rotationSlider();
		const colorPalette = this._controlsView.$colorPalette();

		this._rootScope.on(rotationSlider, "onSliderDragging", (val) => {
			this._changeRotation(val);
		});

		this._rootScope.on(opacitySlider, "onSliderDragging", (val) => {
			this._changeOpacity(val);
		});

		this._rootScope.on(colorizeSlider, "onSliderDragging", (val) => {
			this._changeColorize(val);
		});

		this._rootScope.on(hueSlider, "onSliderDragging", (val) => {
			colorPalette.unselectAll();
			this._changeHue(val);
		});

		this._rootScope.on(brightnessSlider, "onSliderDragging", (val) => {
			this._changeBrightness(val);
		});

		this._rootScope.on(contrastSlider, "onSliderDragging", (val) => {
			this._changeContrast(val);
		});

		this._rootScope.on(colorPalette, "onSelectChange", () => {
			const item = colorPalette.getSelectedItem();

			this._layer.colorItem = item;
			if (item) {
				this._changeColorize(1);
				this._changeHue(item.hue);

				// set sliders state by palette
				hueSlider.blockEvent();
				hueSlider.setValue(item.hue);
				hueSlider.unblockEvent();
				colorizeSlider.blockEvent();
				colorizeSlider.setValue(1);
				colorizeSlider.unblockEvent();
			}
		});
	}
}
