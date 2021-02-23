import {JetView} from "webix-jet";
import Slider from "../../components/slider";
import ControlsView from "./controlsView";
import OpenSeadragonViewer from "../../components/openSeadragonViewer";
import MakerLayer from "../../../services/organizer/makerLayer";
import ajax from "../../../services/ajaxActions";
import authService from "../../../services/authentication";
import OrganizerFilters from "../../../services/organizer/organizerFilters";


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
		this._collection.data.attachEvent("onSyncApply", async () => {
			this._collectionArray = this._collection.serialize();

			this._layers = await this.makeLayers(this._collectionArray);

			if (this._layers.length) {
				this._openSeadragonViewer.destroy();
				this._openSeadragonViewer.createViewer({
					tileSources: this._layers.reverse(),
					crossOriginPolicy: "Anonymous",
					loadTilesWithAjax: true
				});

				this._$viewer().addHandler("open", () => {
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
		this.on(
			this._imagesSlider.$slider(),
			"onChange",
			value => this._onImagesControlHandler(value)
		);
	}

	_setOpacityControlEvents() {
		this.on(
			this._controlsView.$opacitySlider(),
			"onSliderDragging",
			value => this._onOpacityControlHandler(value)
		);
		this.on(
			this._controlsView.$opacitySlider(),
			"onChange",
			value => this._onOpacityControlHandler(value)
		);
	}

	_setColorizeControlEvents() {
		this.on(
			this._controlsView.$colorizeSlider(),
			"onSliderDragging",
			value => this._onColorizeControlHandler(value)
		);
		this.on(
			this._controlsView.$colorizeSlider(),
			"onChange",
			value => this._onColorizeControlHandler(value)
		);
	}

	_setHueControlEvents() {
		this.on(
			this._controlsView.$hueSlider(),
			"onSliderDragging",
			value => this._onHueControlHandler(value)
		);
		this.on(
			this._controlsView.$hueSlider(),
			"onChange",
			value => this._onHueControlHandler(value)
		);
	}

	_setShimXControlEvents() {
		this.on(
			this._controlsView.$shimXSlider(),
			"onSliderDragging",
			value => this._onShimXControlHandler(value)
		);
		this.on(
			this._controlsView.$shimXSlider(),
			"onChange",
			value => this._onShimXControlHandler(value)
		);
	}

	_setShimYControlEvents() {
		this.on(
			this._controlsView.$shimYSlider(),
			"onSliderDragging",
			value => this._onShimYControlHandler(value)
		);
		this.on(
			this._controlsView.$shimYSlider(),
			"onChange",
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

	_onImagesControlHandler(index) {
		const currentLayerIndex = this._layers.length - 1 - index;
		const currentTiledImage = this.getTiledImageByIndex(currentLayerIndex);

		this._changeImagesSliderTitleByIndex(currentLayerIndex);

		if (this._activeLayerIndex < currentLayerIndex) {
			for (let i = this._activeLayerIndex; i <= currentLayerIndex; i++) {
				const layer = this._layers[i];
				layer.shown = true;
				this.getTiledImageByIndex(i).setOpacity(layer.opacity);
			}
		}
		else if (this._activeLayerIndex > currentLayerIndex) {
			for (let i = currentLayerIndex; i <= this._activeLayerIndex; i++) {
				this._layers[i].shown = false;
				this.getTiledImageByIndex(i).setOpacity(0);
			}
		}

		this._activeLayerIndex = currentLayerIndex;
		this._activeTiledImage = currentTiledImage;
		this.refreshControls();
	}

	_onOpacityControlHandler(value) {
		this.getActiveLayer().opacity = value;
		this._activeTiledImage.setOpacity(value);
	}

	_onColorizeControlHandler(value) {
		this.getActiveLayer().colorize = value;
		this.viewerFilter.updateFilters(this._layers, this._$viewer());
	}

	_onHueControlHandler(value) {
		this.getActiveLayer().hue = value;
		this.viewerFilter.updateFilters(this._layers, this._$viewer());
	}

	_onShimXControlHandler(value) {
		console.log("Shim X:", value);
	}

	_onShimYControlHandler(value) {
		console.log("Shim Y:", value);
	}

	_onErosionControlHandler(value) {
		this.getActiveLayer().erosionKernel = value;
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
		return this._layers[index].tiledImage;
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
