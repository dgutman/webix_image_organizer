import PaperScopeModel from "../../../../../../models/annotations/paperjsScopeModel";
import OrganizerFilters from "../../../../../../services/organizer/organizerFilters";
import TimedOutBehavior from "../../../../../../utils/timedOutBehavior";

export default class ControlsEventsService {
	constructor(rootScope, controlsView) {
		this._rootScope = rootScope;
		this._controlsView = controlsView;

		this._viewFilters = new OrganizerFilters();

		this._viewLayer = null;
		this._openSeadragonViewer = null;
	}

	init(openSeadragonViewer, viewLayer, paperScope) {
		this._openSeadragonViewer = openSeadragonViewer;
		this._viewLayer = viewLayer;
		this._viewLayer.tiledImage = this._openSeadragonViewer
			.world
			.getItemAt(0);
		this._attachControlsEvents();
		this._paperScope = paperScope;
	}

	get _getTiledImage() {
		return this._viewLayer.tiledImage;
	}

	async _changeRotation(value, immediately) {
		this._viewLayer.rotation = value;
		this._openSeadragonViewer.viewport.setRotation(value, immediately);
		this._paperScope.view.setRotation(value);
	}

	_changeColorize(value) {
		this._viewLayer.colorize = value;
		this._viewFilters.updateFilters([this._viewLayer], this._openSeadragonViewer);
	}

	_changeHue(value) {
		this._viewLayer.hue = value;
		this._viewFilters.updateFilters([this._viewLayer], this._openSeadragonViewer);
	}

	_changeBrightness(value) {
		this._viewLayer.brightness = value;
		this._viewFilters.updateFilters([this._viewLayer], this._openSeadragonViewer);
	}

	_changeContrast(value) {
		this._viewLayer.contrast = value;
		this._viewFilters.updateFilters([this._viewLayer], this._openSeadragonViewer);
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

			this._viewLayer.colorItem = item;
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
