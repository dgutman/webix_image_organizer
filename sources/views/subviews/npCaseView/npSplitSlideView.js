import getImageInfo from "./parts/imageInfo";
import collapser from "../../components/collapser";
import Mode from "../scenesView/slideViews/mode";
import SplitSlideView from "../scenesView/slideViews/splitSlideView/splitSlideView";

export default class NPSplitSlideView extends SplitSlideView {
	constructor(app, config) {
		super(app, config);
		this.leftImageInfoName = "left-image-info-name";
		this.rightImageInfoName = "right-image-info-name";
		this.imagesLayoutID = `imagesLayoutID-${webix.uid()}`;
		this._metadataCollapserName = "metadataPanelCollapser";
		this._controlsPanelCollapserName = "controlsViewCollapser";
	}

	config() {
		const metadataCollapserView = collapser.getConfig(this._metadataPanelID, {closed: false, type: "right"}, this._metadataCollapserName, "Metadata");
		const controlsCollapserView = collapser.getConfig(this._controlsPanelID, {closed: false, type: "left"}, this._controlsPanelCollapserName, "Controls");
		const [topSlideKeeper, bottomSlideKeeper] = this._slideKeepers;
		const osdOrientationMode = Mode.getOrientationMode();
		const osdViews = osdOrientationMode
			? {
				gravity: 3,
				id: this.imagesLayoutID,
				rows: [
					{
						rows: [
							getImageInfo(this.leftImageInfoName),
							topSlideKeeper.osdView,
						]
					},
					{
						rows: [
							getImageInfo(this.rightImageInfoName),
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
							getImageInfo(this.leftImageInfoName),
							topSlideKeeper.osdView,
						]
					},
					{
						rows: [
							getImageInfo(this.rightImageInfoName),
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
						getImageInfo(this.leftImageInfoName),
						topSlideKeeper.controlsView,
						getImageInfo(this.rightImageInfoName),
						bottomSlideKeeper.controlsView
					]
				},
				controlsCollapserView,
				osdViews,
				metadataCollapserView,
				{
					id: this._metadataPanelID,
					rows: [
						getImageInfo(this.leftImageInfoName),
						topSlideKeeper.metadataPanel,
						getImageInfo(this.rightImageInfoName),
						bottomSlideKeeper.metadataPanel
					]
				}
			]
		};
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
				if (i === 0) {
					this.updateLeftImageInfo(images[i]);
				}
				else {
					this.updateRightImageInfo(images[i]);
				}
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

	updateLeftImageInfo(obj) {
		const leftImageInfoTemplates = this.getRoot().queryView({name: this.leftImageInfoName}, "all");
		leftImageInfoTemplates.forEach(t => t.parse(obj));
	}

	updateRightImageInfo(obj) {
		const leftImageInfoTemplates = this.getRoot().queryView({name: this.rightImageInfoName}, "all");
		leftImageInfoTemplates.forEach(t => t.parse(obj));
	}

	closeCollapsers() {
		this.getRoot().queryView({name: this._metadataCollapserName}).config.setClosedState();
		this.getRoot().queryView({name: this._controlsPanelCollapserName}).config.setClosedState();
	}

	getImagesLayout() {
		return this.getRoot().queryView({id: this.imagesLayoutID});
	}

	getImageInfoConfig(name) {
		return getImageInfo(name);
	}

	getSlideKeepers() {
		return this._slideKeepers;
	}

	getLeftImageInfoName() {
		return this.leftImageInfoName;
	}

	getRightImageInfoName() {
		return this.rightImageInfoName;
	}
}
