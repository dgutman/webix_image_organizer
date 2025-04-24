import MarkersService from "../../../../../services/scenesView/markersService";
import SlideEventsService from "../../../../../services/scenesView/slidesService";
import collapser from "../../../../components/collapser";
import BaseSlideView from "../baseSlideView";
import Mode from "../mode";


const METADATA_PANEL_ID = "scenes-view_metadata-panel";
const CONTROLS_PANEL_ID = "scenes-view_collapser-panel";

export default class SplitSlideView extends BaseSlideView {
	constructor(app, config) {
		super(app, config);

		this._cnf = config || {};

		this._mode = "split";
		this._pointsMode = "off";
		this._syncProcess = false;
		this._layers = [];
		this._slideKeepers = [
			this._createSlideViewElementsAndService(),
			this._createSlideViewElementsAndService()
		];
		this._metadataPanelID = `${METADATA_PANEL_ID}-${webix.uid()}`;
		this._controlsPanelID = `${CONTROLS_PANEL_ID}-${webix.uid()}`;
		this._metadataCollapserName = "metadataPanelCollapser";
		this._controlsPanelCollapserName = "controlsViewCollapser";
	}

	config() {
		const metadataCollapserView = collapser.getConfig(this._metadataPanelID, {closed: false, type: "right"}, this._metadataCollapserName, "Metadata");
		const controlsCollapserView = collapser.getConfig(this._controlsPanelID, {closed: false, type: "left"}, this._controlsPanelCollapserName, "Controls");
		const [topSlideKeeper, bottomSlideKeeper] = this._slideKeepers;
		const osdOrientation = Mode.getOrientationMode();
		const osdViews = osdOrientation
			? {
				gravity: 3,
				rows: [
					{
						rows: [
							topSlideKeeper.osdView,
						]
					},
					{
						rows: [
							bottomSlideKeeper.osdView
						]
					}
				]
			}
			: {
				gravity: 3,
				cols: [
					{
						rows: [
							topSlideKeeper.osdView,
						]
					},
					{
						rows: [
							bottomSlideKeeper.osdView
						]
					}
				]
			};
		return {
			...this._cnf,
			name: "scenesViewerWithControlsCell",
			cols: [
				{
					id: this._controlsPanelID,
					rows: [
						topSlideKeeper.controlsView,
						bottomSlideKeeper.controlsView
					]
				},
				controlsCollapserView,
				osdViews,
				metadataCollapserView,
				{
					id: this._metadataPanelID,
					rows: [
						topSlideKeeper.metadataPanel,
						bottomSlideKeeper.metadataPanel
					]
				}

			]
		};
	}

	ready() {
		this._slideKeepers.forEach((slideKeeper) => {
			slideKeeper.service.attachControlsEvents();
		});
	}

	_getCurrentTiledImage() {
		return this._osdViewer.getItemByIndex(0);
	}

	async onImageSelect(images, layers) {
		const rootView = this.getRoot();

		if (rootView.isVisible()) {
			this._layers = await Promise.all(this._slideKeepers.map(async (keeper, i) => {
				const mapLayer = layers[i];
				if (mapLayer) {
					const tileSources = mapLayer.tileSources ||
					await this._getTileSources(images[i]);
					mapLayer.tileSources = tileSources;
				}

				this._slideKeepers[i].metadataPanel.setItem(images[i]);
				return mapLayer;
			}));
			this._layers = this._layers.filter(layer => layer);

			switch (this._mode) {
				case "sync": {
					await this.splitSlides();
					this.syncSlides();
					break;
				}
				case "split": {
					await this.splitSlides();
					break;
				}
				case "combine": {
					await this.combineSlides();
					break;
				}
				default: {
					break;
				}
			}
		}
		else {
			const eventId = rootView.attachEvent("onAfterRender", () => {
				this.onImageSelect(images, this._layers);
				rootView.detachEvent(eventId);
			});
		}
	}

	_createSlideViewElementsAndService() {
		const osdView = this.createOsdViewer();
		const metadataPanel = this.createMetadataPanel();
		const controlsView = this.createControlsView();
		return {
			osdView,
			metadataPanel,
			controlsView,
			service: new SlideEventsService(
				this,
				osdView,
				controlsView,
				metadataPanel
			)
		};
	}

	async combineSlides() {
		if (this._mode === "sync") {
			this.unsyncSlides();
		}
		this._mode = "combine";
		const [first, ...extra] = this._slideKeepers;

		extra.forEach((keeper) => {
			keeper.osdView.getRoot().hide();
			keeper.service.setOsdViewer(first.osdView);
		});

		const mainOsdView = first.osdView;
		const layers = this._layers.map((layer) => {
			layer.tileSource = layer.tileSources;
			return layer;
		});
		await this.createNewOSDViewer(mainOsdView, [...layers].reverse());

		this._slideKeepers.forEach((keeper, i) => {
			const layer = this._layers[i];
			if (layer) {
				keeper.markerService = new MarkersService(mainOsdView, keeper.controlsView, layer);
				keeper.markerService.updateMarkers(layer);
			}
			keeper.controlsView.$opacitySlider().show();
			this._setLayerToViewAndService(keeper, layer, layers);
		});
	}

	async splitSlides() {
		this._mode = "split";
		await Promise.all(this._slideKeepers.map(async (keeper, i) => {
			const layer = this._layers[i];
			keeper.osdView.getRoot().show();
			keeper.service.setOsdViewer(keeper.osdView);
			await this.createNewOSDViewer(keeper.osdView, layer && layer.tileSources);

			if (layer) {
				layer.opacity = 1;

				this._addSplitSlideHandlers(keeper.osdView, i);

				if (keeper.markerService) {
					keeper.markerService.detachEvents();
				}

				keeper.markerService = new MarkersService(keeper.osdView, keeper.controlsView, layer);
				keeper.markerService.updateMarkers(layer);
			}
			keeper.controlsView.$opacitySlider().hide();
			this._setLayerToViewAndService(keeper, layer);
		}));
	}

	_setLayerToViewAndService(keeper, layer, layers = [layer]) {
		if (layer) {
			keeper.service.setLayers(layers, layer);
			keeper.osdView.hideOverlay();
			keeper.controlsView.getRoot().enable();
			keeper.controlsView.$controlForm().setValues(layer);
			keeper.service.setStateToSlide(layer);
		}
		else {
			keeper.osdView.showOverlay("Please select the image");
			keeper.controlsView.getRoot().disable();
		}
	}

	async createNewOSDViewer(osdView, tileSources) {
		osdView.destroy();
		if (tileSources) {
			await osdView.createViewer({tileSources});
		}
	}

	syncSlides() {
		this._mode = "sync";
		this._slideKeepers.forEach((keeper) => {
			const osdViewRoot = keeper.osdView.getRoot();
			keeper.syncZoomId = keeper.osdView.on(osdViewRoot, "viewerZoom", () => {
				this._syncPanZoom(keeper);
			});
			keeper.syncPanId = keeper.osdView.on(osdViewRoot, "viewerPan", () => {
				this._syncPanZoom(keeper);
			});
		});
		this._syncPanZoom(this._slideKeepers[0]);
	}

	unsyncSlides() {
		if (this._mode === "sync") {
			this._mode = "split";
			this._slideKeepers.forEach((keeper) => {
				const osdViewRoot = keeper.osdView.getRoot();
				if (keeper.syncZoomId) {
					osdViewRoot.detachEvent(keeper.syncZoomId);
					delete keeper.syncZoomId;
				}
				if (keeper.syncPanId) {
					osdViewRoot.detachEvent(keeper.syncPanId);
					delete keeper.syncPanId;
				}
			});
		}
	}

	_syncPanZoom(keeper) {
		if (this._syncProcess || this._mode !== "sync") {
			return;
		}
		this._syncProcess = true;
		const masterOsdViewer = keeper.osdView.$viewer();
		this._slideKeepers.forEach((slaveKeeper) => {
			const slaveOsdViewer = slaveKeeper.osdView.$viewer();
			if (slaveOsdViewer === masterOsdViewer || !slaveOsdViewer) {
				return;
			}

			const pan = masterOsdViewer.viewport.getCenter();
			const zoom = masterOsdViewer.viewport.getZoom();

			slaveOsdViewer.viewport.panTo(pan.clone());
			slaveOsdViewer.viewport.zoomTo(zoom);
		});
		this._syncProcess = false;
	}

	changePointsMode(mode) {
		this._pointsMode = mode;
	}

	_addSplitSlideHandlers(osdView, i) {
		const viewer = osdView.$viewer();
		if (viewer) {
			this._addClickHandlerToOSDViewer(viewer, i);
			this._addPanZoomHandlersToOSDViewer(osdView, viewer);
		}
	}

	_addPanZoomHandlersToOSDViewer(osdView, viewer) {
		viewer.addHandler("zoom", () => {
			osdView.getRoot().callEvent("viewerZoom", [viewer.viewport.getZoom()]);
		});

		viewer.addHandler("pan", () => {
			osdView.getRoot().callEvent("viewerPan", [viewer.viewport.getCenter()]);
		});
	}

	_addClickHandlerToOSDViewer(osdViewer, i) {
		osdViewer.addHandler("canvas-click", (event) => {
			if (!event.quick || this._pointsMode === "off") {
				return;
			}
			const pos = osdViewer.viewport.pointFromPixel(event.position);
			this._handleClick(pos, i);

			event.preventDefaultAction = true;
		});
	}

	_handleClick(pos, i) {
		if (this._pointsMode === "add") {
			this._onAddMarker(i, pos);
		}
		else if (this._pointsMode === "remove") {
			this._onRemoveMarker(i, pos);
		}
	}

	_onAddMarker(i, pos) {
		const markerService = this._slideKeepers[i].markerService;
		const layer = this._layers[i];
		layer.markers.push(pos);
		markerService.updateMarkers(layer);
	}

	_onRemoveMarker(i, pos) {
		const markerService = this._slideKeepers[i].markerService;
		const layer = this._layers[i];

		let best;
		layer.markers.forEach((marker, index) => {
			const distance = Math.abs(pos.x - marker.x) + Math.abs(pos.y - marker.y);
			if (!best || best.distance > distance) {
				best = {
					marker,
					distance,
					index
				};
			}
		});

		if (best && best.distance < 0.030) {
			layer.markers.splice(best.index, 1);
			markerService.updateMarkers(layer);
		}
	}
}
