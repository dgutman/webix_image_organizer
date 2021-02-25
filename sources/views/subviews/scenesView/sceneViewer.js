import {JetView} from "webix-jet";
import OpenSeadragonViewer from "../../components/openSeadragonViewer";
import MetadataPanel from "../../components/metadataJSONViewer";
import collapser from "../../components/collapser";
import ControlsView from "./controlsView";
import ajaxActions from "../../../services/ajaxActions";
import MakerLayer from "../../../services/organizer/makerLayer";
import OrganizerFilters from "../../../services/organizer/organizerFilters";

const METADATA_PANEL_ID = "scenes-view-metadata-panel";

export default class ScenesViewerWithControls extends JetView {
	constructor(app, config) {
		super(app, config);

		this._cnf = config || {};
		this._osdViewer = new OpenSeadragonViewer(app);
		this._controlsView = new ControlsView(app, {width: 250});
		this._metadataPanel = new MetadataPanel(
			app,
			{id: METADATA_PANEL_ID, minWidth: 300},
			{mode: "view"}
		);

		this._viewFilters = new OrganizerFilters();

		this._layer = null;
	}

	config() {
		const collapserView = collapser.getConfig(METADATA_PANEL_ID, {closed: false, type: "right"}, "metadataPanelCollapser");

		return {
			...this._cnf,
			name: "scenesViewerWithControlsCell",
			margin: 8,
			rows: [
				{
					cols: [
						this._controlsView,
						{
							gravity: 3,
							rows: [
								this._osdViewer
							]
						},
						collapserView,
						this._metadataPanel
					]
				}
			]
		};
	}

	ready() {
		this._attachControlsEvents();
	}

	_changeRotation(value) {
		const tiledImage = this._getCurrentTiledImage();
		this._layer.rotation = value;
		tiledImage.setRotation(value);
	}

	_changeOpacity(value) {
		const tiledImage = this._getCurrentTiledImage();
		this._layer.opacity = value;
		tiledImage.setOpacity(value);
	}

	_changeColorize(value) {
		this._layer.colorize = value;
		this._viewFilters.updateFilters([this._layer], this._osdViewer.$viewer());
	}

	_changeHue(value) {
		this._layer.hue = value;
		this._viewFilters.updateFilters([this._layer], this._osdViewer.$viewer());
	}

	_changeBrightness(value) {
		this._layer.brightness = value;
		this._viewFilters.updateFilters([this._layer], this._osdViewer.$viewer());
	}

	_changeContrast(value) {
		this._layer.contrast = value;
		this._viewFilters.updateFilters([this._layer], this._osdViewer.$viewer());
	}

	_attachControlsEvents() {
		const opacitySlider = this._controlsView.$opacitySlider();
		const colorizeSlider = this._controlsView.$colorizeSlider();
		const hueSlider = this._controlsView.$hueSlider();
		const brightnessSlider = this._controlsView.$brightnessSlider();
		const contrastSlider = this._controlsView.$contrastSlider();
		const rotationSlider = this._controlsView.$rotationSlider();
		const colorPalette = this._controlsView.$colorPalette();

		this.on(rotationSlider, "onSliderDragging", (val) => {
			this._changeRotation(val);
		});

		this.on(opacitySlider, "onSliderDragging", (val) => {
			this._changeOpacity(val);
		});

		this.on(colorizeSlider, "onSliderDragging", (val) => {
			this._changeColorize(val);
		});

		this.on(hueSlider, "onSliderDragging", (val) => {
			colorPalette.unselectAll();
			this._changeHue(val);
		});

		this.on(brightnessSlider, "onSliderDragging", (val) => {
			this._changeBrightness(val);
		});

		this.on(contrastSlider, "onSliderDragging", (val) => {
			this._changeContrast(val);
		});

		this.on(colorPalette, "onSelectChange", () => {
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

	_getCurrentTiledImage() {
		return this._osdViewer.getItemByIndex(0);
	}

	async onImageSelect(image) {
		const osdViewerTemplate = this._osdViewer.getRoot();
		if (osdViewerTemplate.isVisible()) {
			this._metadataPanel.setItem(image);

			this._layers[image._id].tileSources = this._layers[image._id].tileSources ||
				await this._getTileSources(image);

			this._layer = this._layers[image._id];

			this._osdViewer.destroy();
			await this._osdViewer.createViewer({tileSources: this._layer.tileSources});
			this._controlsView.$controlForm().setValues(this._layer);
		}
		else {
			const eventId = osdViewerTemplate.attachEvent("onAfterRender", () => {
				this.onImageSelect(image);
				osdViewerTemplate.detachEvent(eventId);
			});
		}
	}

	async _getTileSources(image) {
		const tileSourceOptions = await ajaxActions.getImageTiles(image._id);
		const tileSources = {
			crossOriginPolicy: "Anonymous",
			loadTilesWithAjax: true,
			width: tileSourceOptions.sizeX,
			height: tileSourceOptions.sizeY,
			tileWidth: tileSourceOptions.tileWidth,
			tileHeight: tileSourceOptions.tileHeight,
			minLevel: 0,
			maxLevel: tileSourceOptions.levels - 1,
			getTileUrl(level, x, y) {
				return ajaxActions.getImageTileUrl(image._id, level, x, y);
			}
		};

		return tileSources;
	}

	setLayers(images) {
		this._layers = images.reduce((acc, image) => {
			acc[image._id] = MakerLayer.makeLayer({
				name: image.name,
				colorItem: null
			});
			return acc;
		}, {});
	}
}
