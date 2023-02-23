import SlideEventsService from "../../../../../services/scenesView/slidesService";
import collapser from "../../../../components/collapser";
import BaseSlideView from "../baseSlideView";

const METADATA_PANEL_ID = "scenes-view-metadata-panel";
const CONTROLS_VIEW_ID = "scenes-view-controls";

export default class SingleSlideView extends BaseSlideView {
	constructor(app, config) {
		super(app, config);

		this._cnf = config || {};
		this._metadataPanelId = `${METADATA_PANEL_ID}-${webix.uid()}`;
		this._controlsPanelId = `${CONTROLS_VIEW_ID}-${webix.uid()}`;
		this._osdViewer = this.createOsdViewer();
		this._controlsView = this.createControlsView();
		this._metadataPanel = this.createMetadataPanel();
	}

	config() {
		const rightCollapserView = collapser.getConfig(this._metadataPanelId, {closed: false, type: "right"}, "metadataPanelCollapser");
		const leftCollapserView = collapser.getConfig(this._controlsPanelId, {closed: false, type: "left"}, "controlsViewCollapser");

		return {
			...this._cnf,
			name: "scenesViewerWithControlsCell",
			margin: 8,
			rows: [
				{
					cols: [
						{
							id: this._controlsPanelId,
							rows: [
								this._controlsView
							]
						},
						leftCollapserView,
						{
							gravity: 3,
							rows: [
								this._osdViewer
							]
						},
						rightCollapserView,
						{
							id: this._metadataPanelId,
							rows: [
								this._metadataPanel
							]
						}
					]
				}
			]
		};
	}

	ready() {
		this._slideLayersService = new SlideEventsService(
			this,
			this._osdViewer,
			this._controlsView,
			this._metadataPanel
		);
		this._slideLayersService.attachControlsEvents();
	}

	_getCurrentTiledImage() {
		return this._getTiledImageByIndex(0);
	}

	async onImageSelect(images, layers) {
		const image = images[0];
		this.toggleViewState(image);
		if (!image) return;

		const rootView = this.getRoot();
		if (rootView.isVisible()) {
			this._metadataPanel.setItem(image);

			layers = await Promise.all(layers.map(async (mapLayer, i) => {
				const tileSources = mapLayer.tileSources ||
					await this._getTileSources(images[i]);
				mapLayer.tileSources = tileSources;
				return mapLayer;
			}));
			const layer = layers[0];

			this._osdViewer.destroy();
			await this._osdViewer.createViewer({tileSources: layer.tileSources});
			this._slideLayersService.setLayers(layers, layer);
			this._controlsView.$controlForm().setValues(layer);
		}
		else {
			const eventId = rootView.attachEvent("onAfterRender", () => {
				this.onImageSelect(images, layers);
				rootView.detachEvent(eventId);
			});
		}
	}

	toggleViewState(enable) {
		if (enable) {
			this._controlsView.getRoot().enable();
			this._osdViewer.getRoot().enable();
		}
		else {
			this._controlsView.getRoot().disable();
			this._osdViewer.destroy();
			this._osdViewer.getRoot().disable();
			this._metadataPanel.setItem();
		}
	}
}
