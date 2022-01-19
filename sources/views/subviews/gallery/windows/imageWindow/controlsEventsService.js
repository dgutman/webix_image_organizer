import OrganizerFilters from "../../../../../services/organizer/organizerFilters";

export default class ControlsEventsService {
	constructor(rootScope, controlsView) {
		this._rootScope = rootScope;
		this._controlsView = controlsView;

		this._viewFilters = new OrganizerFilters();

		this._layer = null;
		this._openSeadragonViewer = null;
	}

	init(openSeadragonViewer, layer) {
		this._openSeadragonViewer = openSeadragonViewer;
		this._layer = layer;
		this._layer.tiledImage = this._openSeadragonViewer
			.world
			.getItemAt(0);

		this._attachControlsEvents();
	}

	get _getTiledImage() {
		return this._layer.tiledImage;
	}

	_changeRotation(value, immediately) {
		this._layer.rotation = value;
		this._getTiledImage.setRotation(value, immediately);
	}

	_changeColorize(value) {
		this._layer.colorize = value;
		this._viewFilters.updateFilters([this._layer], this._openSeadragonViewer);
	}

	_changeHue(value) {
		this._layer.hue = value;
		this._viewFilters.updateFilters([this._layer], this._openSeadragonViewer);
	}

	_changeBrightness(value) {
		this._layer.brightness = value;
		this._viewFilters.updateFilters([this._layer], this._openSeadragonViewer);
	}

	_changeContrast(value) {
		this._layer.contrast = value;
		this._viewFilters.updateFilters([this._layer], this._openSeadragonViewer);
	}

	_attachControlsEvents() {
		const colorizeSlider = this._controlsView.$colorizeSlider();
		const hueSlider = this._controlsView.$hueSlider();
		const brightnessSlider = this._controlsView.$brightnessSlider();
		const contrastSlider = this._controlsView.$contrastSlider();
		const rotationSlider = this._controlsView.$rotationSlider();
		const colorPalette = this._controlsView.$colorPalette();

		this._rootScope.on(rotationSlider, "onSliderDragging", (val) => {
			this._changeRotation(val);
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
