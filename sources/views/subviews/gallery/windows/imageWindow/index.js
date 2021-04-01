import {JetView} from "webix-jet";
import JSONFormatter from "json-formatter-js";
import OpenSeadragon from "openseadragon";
import ajax from "../../../../../services/ajaxActions";
import galleryImageUrl from "../../../../../models/galleryImageUrls";
import nonImageUrls from "../../../../../models/nonImageUrls";
import collapser from "../../../../components/collapser";
import ControlsView from "./controlsView";
import MakerLayer from "../../../../../services/organizer/makerLayer";
import ControlsEventsService from "./controlsEventsService";

const HEIGHT = 600;
const WIDTH = 1050;
const LEFT_PANEL_ID = "#left-window-panel-id";
const CONTROLS_PANEL_ID = "#openseadragon-viewer-controls-id";
const WINDOW_TITLE_ID = "#window-title-id";
const IMAGE_CONTAINER_ID = "#image-container-id";

export default class ImageWindowView extends JetView {
	constructor(app, config) {
		super(app, config);

		this._controlsView = new ControlsView(this.app);
	}

	config() {
		const controlsCollapser = collapser
			.getConfig(
				CONTROLS_PANEL_ID,
				{type: "left", closed: false},
				"controlsCollapserName"
			);

		return {
			view: "window",
			css: "metadata-window-body",
			paddingX: 35,
			width: WIDTH,
			height: HEIGHT,
			move: true,
			modal: true,
			position: "center",
			type: "clean",
			head: {
				cols: [
					{
						view: "template",
						css: "large-image-name",
						localId: WINDOW_TITLE_ID,
						template: obj => obj.name,
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "fas fa-times",
						width: 30,
						height: 30,
						click: () => this.close()
					}
				]
			},
			body: {
				rows: [
					{
						type: "clean",
						cols: [
							{
								localId: LEFT_PANEL_ID,
								cols: [
									{
										id: CONTROLS_PANEL_ID,
										width: 250,
										cols: [
											this._controlsView
										]
									},
									controlsCollapser
								]
							},
							{
								view: "template",
								css: "absolute-centered-image-template",
								localId: IMAGE_CONTAINER_ID,
								template: (obj) => {
									let imageType = "thumbnail";
									let getPreviewUrl = galleryImageUrl.getNormalImageUrl;
									let setPreviewUrl = galleryImageUrl.setNormalImageUrl;

									if (obj.label) {
										imageType = "images/label";
										getPreviewUrl = galleryImageUrl.getLabelPreviewImageUrl;
										setPreviewUrl = galleryImageUrl.setPreviewLabelImageUrl;
									}

									if (obj._id && !obj.emptyObject) {
										const previewImageUrl = getPreviewUrl(obj._id);
										if (previewImageUrl === undefined) {
											this.view.showProgress();
											ajax.getImage(obj._id, imageType, {width: WIDTH, height: HEIGHT})
												.then((url) => {
													setPreviewUrl(obj._id, url);
													this.$imageContainer.refresh();
												})
												.catch(() => setPreviewUrl(obj._id, false))
												.finally(() => this.view.hideProgress());
										}

										const imageSrc = getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj);
										return `<div class="image-container">
											<img src="${imageSrc}" alt="${obj.name}">
										</div>`;
									}

									return "";
								},
								borderless: true
							}
						]
					}
				]
			}
		};
	}

	init(view) {
		this.view = view;
		webix.extend(this.view, webix.ProgressBar);
	}

	ready() {
		this._controlsEventsService = new ControlsEventsService(this, this._controlsView);
	}

	get $leftPanel() {
		if (!this._$leftPanel) {
			this._$leftPanel = this.$$(LEFT_PANEL_ID);
		}

		return this._$leftPanel;
	}

	get $imageContainer() {
		if (!this._$imageContainer) {
			this._$imageContainer = this.$$(IMAGE_CONTAINER_ID);
		}

		return this._$imageContainer;
	}

	get $windowTitle() {
		if (!this._$windowTitle) {
			this._$windowTitle = this.$$(WINDOW_TITLE_ID);
		}

		return this._$windowTitle;
	}

	get $controlsPanel() {
		if (!this._$controlsPanel) {
			this._$controlsPanel = this.$$(CONTROLS_PANEL_ID);
		}
		return this._$controlsPanel;
	}

	showWindow(obj, viewerType) {
		this.$leftPanel.hide();
		this.$windowTitle.parse(obj);

		if (viewerType === "standard") {
			this.$imageContainer.parse(obj);
			this.$imageContainer.define("scroll", false);
			this.$imageContainer.define("move", true);
		}

		this.getRoot().show();
		const templateNode = this.$imageContainer.getNode();

		if (viewerType === "seadragon") {
			this.view.showProgress();
			ajax.getImageTiles(obj._id)
				.then((data) => {
					this.$leftPanel.show();
					this.$controlsPanel.show();
					const layerOfViewer = this.createOpenSeadragonLayer(obj, data);
					this.createOpenSeadragonViewer(obj, layerOfViewer, templateNode.firstChild)
						.then(() => {
							this._controlsEventsService
								.init(this._openSeadragonViewer, layerOfViewer);
						});
				})
				.finally(() => this.view.hideProgress());
		}
		else if (viewerType === "jsonviewer") {
			this.view.showProgress();
			ajax.getJSONFileData(obj._id)
				.then((data) => {
					this.createJSONViewer(data, templateNode.firstChild);
				})
				.finally(() => this.view.hideProgress());
		}
	}

	// Initializing Seadragon, setting needed options
	createOpenSeadragonLayer(obj, data) {
		return MakerLayer.makeLayer({
			tileSource: {
				width: data.sizeX,
				height: data.sizeY,
				tileWidth: data.tileWidth,
				tileHeight: data.tileHeight,
				minLevel: 0,
				maxLevel: data.levels - 1,
				getTileUrl(level, x, y) {
					return ajax.getImageTileUrl(obj._id, level, x, y);
				}
			}
		});
	}

	createOpenSeadragonViewer(obj, layer, templateNode) {
		this._openSeadragonViewer = new OpenSeadragon.Viewer({
			element: templateNode,
			crossOriginPolicy: "Anonymous",
			loadTilesWithAjax: true,
			prefixUrl: "sources/images/images/",
			imageLoaderLimit: 1,
			tileSources: layer
		});

		return new Promise((resolve, reject) => {
			this._openSeadragonViewer.addOnceHandler("open", resolve);
			this._openSeadragonViewer.addOnceHandler("open-failed", reject);
		});
	}

	createJSONViewer(data, templateNode) {
		const formatter = new JSONFormatter(data);
		templateNode.appendChild(formatter.render());
	}

	close() {
		// to clear setted template
		// to destroy Open Seadragon viewer
		if (this._openSeadragonViewer) {
			this._openSeadragonViewer.destroy();
		}
		this.$imageContainer.parse({emptyObject: true});
		this.getRoot().hide();
		this._controlsView.reset();
	}
}
