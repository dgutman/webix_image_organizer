define([
	"helpers/organizer_filters"
], function(
	OrganizerFilters
) {
	return class ControlsEventsService {
		constructor(controlsView) {
			this._controlsView = controlsView;
	
			this._viewFilters = new OrganizerFilters();
	
			this._layer = null;
			this._openSeadragonViewer = null;
			this._isEventsAttached = false;
		}
	
		init(openSeadragonViewer, layer) {
			this._openSeadragonViewer = openSeadragonViewer;
			this._layer = layer;
			this._layer.tiledImage = this._openSeadragonViewer
				.world
				.getItemAt(0);

			if (!this._isEventsAttached) {
				this._attachControlsEvents();
				this._isEventsAttached = true;
			}
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

			rotationSlider.attachEvent("onSliderDragging", (val) => {
				this._changeRotation(val);
			});

			colorizeSlider.attachEvent("onSliderDragging", (val) => {
				this._changeColorize(val);
			});
	
			hueSlider.attachEvent("onSliderDragging", (val) => {
				colorPalette.unselectAll();
				this._changeHue(val);
			});
	
			brightnessSlider.attachEvent("onSliderDragging", (val) => {
				this._changeBrightness(val);
			});
	
			contrastSlider.attachEvent("onSliderDragging", (val) => {
				this._changeContrast(val);
			});
	
			colorPalette.attachEvent("onSelectChange", () => {
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
	};
});
