import collapser from "../../../../components/collapser";
import BaseSlideView from "../baseSlideView";
import SlideEventsService from "../../../../../services/scenesView/slidesService";

const METADATA_PANEL_ID = "scenes-view-metadata-panel";

export default class SingleSlideView extends BaseSlideView {
	constructor(app, config) {
		super(app, config);

		this._cnf = config || {};
		this._osdViewer = this.createOsdViewer();
		this._controlsView = this.createControlsView();
		this._metadataPanel = this.createMetadataPanel();
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
						{
							id: METADATA_PANEL_ID,
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
}
