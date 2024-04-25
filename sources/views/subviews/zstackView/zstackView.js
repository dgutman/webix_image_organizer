import {JetView} from "webix-jet";

import ControlsView from "./controlsView";
import ajax from "../../../services/ajaxActions";
import MakerLayer from "../../../services/organizer/makerLayer";
import OrganizerFilters from "../../../services/organizer/organizerFilters";
import TimedOutBehavior from "../../../utils/timedOutBehavior";
import OpenSeadragonViewer from "../../components/openSeadragonViewer";
import Slider from "../../components/slider";


export default class ZstackView extends JetView {
	constructor(app, config) {
		super(app, config);

		this._imagesSlider = this._createImagesSlider();
		this._controlsView = new ControlsView(this.app);
		this._openSeadragonViewer = new OpenSeadragonViewer(this.app, {
			maxZoomPixelRatio: 5
		});

		this.viewerFilter = new OrganizerFilters();

		this._collection = new webix.DataCollection();
		this._collectionArray = [];
		this._layers = [];
		this._activeTiledImage = null;
		this._activeLayerIndex = 0;

		this._timedOutBehavior = new TimedOutBehavior();
	}

	config() {
		return {
			name: "zStackCell",
			margin: 8,
			rows: [
				this._imagesSlider,
				{
					cols: [
						this._controlsView,
						this._openSeadragonViewer
					]
				}
			]
		};
	}

	init() {
		this.on(this.getRoot(), "onViewShow", () => {
			this._timedOutBehavior.execute(this._updateViewer, this);
		});
		this._collection.data.attachEvent("onSyncApply", () => {
			if (this.getRoot().isVisible()) {
				this._timedOutBehavior.execute(this._updateViewer, this);
			}
		});
	}

	ready() {
		this._setImagesControlEvents();
		this._setOpacityControlEvents();
		this._setColorizeControlEvents();
		this._setHueControlEvents();
		this._setShimXControlEvents();
		this._setShimYControlEvents();
		this._setErosionControlEvents();
	}

	async _updateViewer() {
		this._collectionArray = this._collection.serialize();
		this._layers = await this.makeLayers(this._collectionArray);

		if (this._layers.length) {
			this._openSeadragonViewer.destroy();
			this._openSeadragonViewer.createViewer({
				tileSources: this._layers.reverse(),
				crossOriginPolicy: "Anonymous",
				loadTilesWithAjax: true
			}).then(() => {
				this._layers.forEach((layer, i) => {
					layer.tiledImage = this._openSeadragonViewer.getItemByIndex(i);
				});

				const lastIndex = this._layers.length - 1;
				this._activeLayerIndex = lastIndex;
				this._activeTiledImage = this.getTiledImageByIndex(lastIndex);
				this._changeImagesSliderTitleByIndex(lastIndex);
				this._setImagesSliderMax(lastIndex);
				this._$imagesSlider().setValue(0);
				this.refreshControls();
			});
		}
	}

	_createImagesSlider() {
		return new Slider(this.app, {
			css: "io-slider-title-px-2",
			min: 0,
			step: 1
		});
	}

	_setImagesControlEvents() {
		this.on(
			this._imagesSlider.$slider(),
			"onSliderDragging",
			value => this._onImagesControlHandler(value)
		);
	}

	_setOpacityControlEvents() {
		this.on(
			this._controlsView.$opacitySlider(),
			"onSliderDragging",
			value => this._onOpacityControlHandler(value)
		);
	}

	_setColorizeControlEvents() {
		this.on(
			this._controlsView.$colorizeSlider(),
			"onSliderDragging",
			value => this._onColorizeControlHandler(value)
		);
	}

	_setHueControlEvents() {
		this.on(
			this._controlsView.$hueSlider(),
			"onSliderDragging",
			value => this._onHueControlHandler(value)
		);
	}

	_setShimXControlEvents() {
		this.on(
			this._controlsView.$shimXSlider(),
			"onSliderDragging",
			value => this._onShimXControlHandler(value)
		);
	}

	_setShimYControlEvents() {
		this.on(
			this._controlsView.$shimYSlider(),
			"onSliderDragging",
			value => this._onShimYControlHandler(value)
		);
	}

	_setErosionControlEvents() {
		this.on(
			this._controlsView.$erosionSelect(),
			"onChange",
			value => this._onErosionControlHandler(value)
		);
	}

	_onImagesControlHandler(slideIndex) {
		const currentLayerIndex = this._layers.length - 1 - slideIndex;
		const currentTiledImage = this.getTiledImageByIndex(currentLayerIndex);

		if (currentTiledImage) {
			this._changeImagesSliderTitleByIndex(currentLayerIndex);

			if (this._activeLayerIndex < currentLayerIndex) {
				this._loopLayers(this._activeLayerIndex, currentLayerIndex, (index) => {
					const layer = this._layers[index];
					layer.shown = true;
					this.getTiledImageByIndex(index)?.setOpacity(layer.opacity);
				});
			}
			else if (this._activeLayerIndex > currentLayerIndex) {
				this._loopLayers(currentLayerIndex, this._activeLayerIndex, (index) => {
					this._layers[index].shown = false;
					this.getTiledImageByIndex(index)?.setOpacity(0);
				});
			}
			this._activeLayerIndex = currentLayerIndex;
			this._activeTiledImage = currentTiledImage;
			this.refreshControls();
		}
	}

	_loopLayers(from, to, handler) {
		for (let i = from + 1; i <= to; i++) {
			handler(i);
		}
	}

	_onOpacityControlHandler(value) {
		this.getActiveLayer().opacity = value;
		this._activeTiledImage.setOpacity(value);
	}

	_onColorizeControlHandler(value) {
		this.getActiveLayer().colorize = value;
		this._updateFilters();
	}

	_onHueControlHandler(value) {
		this.getActiveLayer().hue = value;
		this._updateFilters();
	}

	_onShimXControlHandler(value) {
		this.getActiveLayer().shimX = value;
		this._updateShim();
	}

	_onShimYControlHandler(value) {
		this.getActiveLayer().shimY = value;
		this._updateShim();
	}

	_onErosionControlHandler(value) {
		this.getActiveLayer().erosionKernel = value;
		this._updateFilters();
	}

	_updateShim() {
		this.viewerFilter.setLayerPixelOffset(this.getActiveLayer());
	}

	_updateFilters() {
		this.viewerFilter.updateFilters(this._layers, this._$viewer());
	}

	async _makeLayer(image) {
		const tileSourceOptions = await ajax.getImageTiles(image._id);
		return MakerLayer.makeLayer({
			tileSource: {
				width: tileSourceOptions.sizeX,
				height: tileSourceOptions.sizeY,
				tileWidth: tileSourceOptions.tileWidth,
				tileHeight: tileSourceOptions.tileHeight,
				minLevel: 0,
				maxLevel: tileSourceOptions.levels - 1,
				getTileUrl(level, x, y) {
					return ajax.getImageTileUrl(image._id, level, x, y);
				}
			},
			name: image.name,
			offset: {
				x: 0,
				y: 0
			}
		});
	}

	makeLayers(collection) {
		const layers = collection.map(item => this._makeLayer(item));
		return Promise.all(layers);
	}

	setCollection(collection) {
		this._collection.sync(collection, function () {
			this.filter(item => item.hasOwnProperty("largeImage"));
		});
	}

	_$imagesSlider() {
		return this._imagesSlider.$slider();
	}

	_$viewer() {
		return this._openSeadragonViewer.$viewer();
	}

	_setImagesSliderMax(maxSize) {
		this._$imagesSlider().define("max", maxSize);
		this._$imagesSlider().refresh();
	}

	_changeImagesSliderTitleByIndex(index) {
		this._$imagesSlider().define("title", this._layers[index].name);
		this._$imagesSlider().refresh();
	}

	getActiveLayer() {
		return this._layers[this._activeLayerIndex];
	}

	getTiledImageByIndex(index) {
		if (
			index > 0
			&& this._layers.length > index
		) {
			return this._layers[index]?.tiledImage;
		}
		return null;
	}

	refreshControls() {
		const {opacity, colorize, hue, erosionKernel, shimX, shimY} = this.getActiveLayer();

		this._controlsView.blockControlsEvents();
		this._controlsView.$opacitySlider().setValue(opacity);
		this._controlsView.$colorizeSlider().setValue(colorize);
		this._controlsView.$hueSlider().setValue(hue);
		this._controlsView.$erosionSelect().setValue(erosionKernel);
		this._controlsView.$shimXSlider().setValue(shimX);
		this._controlsView.$shimYSlider().setValue(shimY);
		this._controlsView.unblockControlsEvents();
	}

	destroy() {
		this._collection.destructor();
	}
}
