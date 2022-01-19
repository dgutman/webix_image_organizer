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
import ToolbarView from "./toolbarView";
import ToolbarEventServices from "./toolbarEventService";
import ImageTemplateEventsService from "./imageTemplateEventService";
import auth from "../../../../../services/authentication";
import ImageWindowViewModel from "../../../../../models/imageWindowViewModel";

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
		this._toolbarView = new ToolbarView(this.app, {}, this);
		this._imageWindowViewModel = new ImageWindowViewModel(this);
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
						click: () => {
							const switchElement = this._toolbarView.getDrawingSwitch();
							let switchElementValue = switchElement.getValue();
							if (switchElementValue) {
								switchElement.toggle();
							}
							this.close();
						}
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
								rows: [
									this._toolbarView,
									{
										view: "template",
										css: "absolute-centered-image-template",
										name: "imageTemplate",
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

											// return "";

											return `
											<div class="viewer-container" id="geo_osd" style="width:100%;height:100%;">
												<div class="viewer" style="width:100%;height:100%;position:absolute;">
													<div class="container" id="image_viewer" style="width:100%; height:100%;position: relative">
													</div>
												</div>
												<!--GEO JS layer for drawing-->
												<div class="viewer">
													<div class="container" id="geojs" style="width:100%; height:100%;position: relative">
													</div>
												</div>
												<div class = "fullpageButton">
													<img src="sources/images/images/fullpage_grouphover.png" style="width:100%" class = "fullpage_grouphover">
													<img src="sources/images/images/fullpage_hover.png" style="width:100%; display:none;" class = "fullpage_hover">
												</div>
											</div>
											`;
										},
										borderless: true
									}
								]
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

		let imageTemplate = document.querySelector(".absolute-centered-image-template");
		imageTemplate.addEventListener("dblclick", () => {
			if (window.annotationLayer.annotations().length
				=== this._imageWindowViewModel.annotationsLength
				&& this._imageWindowViewModel.currentShape) {
				this.app.callEvent("drawFigure", [this._imageWindowViewModel.currentShape]);
			}
		});

		imageTemplate.addEventListener("click", () => {
			if (this._imageWindowViewModel.isAnnotationAdd) {
				this.app.callEvent("drawFigure", [this._imageWindowViewModel.currentShape]);
			}
		});

		window.showAttentionPopup = (callBack) => {
			if (!auth.getToken()) {
				webix.alert({
					title: "Attention",
					ok: "OK",
					type: "confirm-warning",
					text: "In order to save your changes, please, log in application. Changes of not logged in users can not be saved."
				}).then(() => {
					if (callBack) {
						callBack();
					}
				});
			}
			else if (callBack) callBack();
		};
	}

	ready() {
		this._controlsEventsService = new ControlsEventsService(this, this._controlsView);

		if (this.getRoot().queryView({name: "drawing_toolbar"})) {
			this._toolbarEventService =
				new ToolbarEventServices(this, this._toolbarView, this._imageWindowViewModel);
			this._toolbarEventService.init();
		}

		if (this.getRoot().queryView({name: "imageTemplate"})) {
			this._imageTemplateEventServices =
				new ImageTemplateEventsService(this, this._imageWindowViewModel);
			this._imageTemplateEventServices.init();
		}

		this.app.callEvent("enableButtons", [true]);
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

		this._imageWindowViewModel.setItem(obj);
		if (viewerType === "standard") {
			this.$imageContainer.parse(obj);
			this.$imageContainer.define("scroll", false);
			this.$imageContainer.define("move", true);
		}

		this.getRoot().show();
		const templateNode = this.$imageContainer.getNode().querySelector("#image_viewer");

		if (viewerType === "seadragon") {
			this.view.showProgress();
			ajax.getImageTiles(obj._id)
				.then((data) => {
					this.tiles = data; // for geojs
					this.$leftPanel.show();
					this.$controlsPanel.show();
					const layerOfViewer = this.createOpenSeadragonLayer(obj, data);
					this.createOpenSeadragonViewer(obj, layerOfViewer, templateNode)
						.then(() => {
							// for setBound()
							window.viewer = this._openSeadragonViewer;
							const slide = this;
							this.refreshSlide(window.viewer, slide);
							this._controlsEventsService
								.init(this._openSeadragonViewer, layerOfViewer);
						});
				})
				.finally(() => {
					this.view.hideProgress();
				});
		}
		else if (viewerType === "jsonviewer") {
			this.view.showProgress();
			ajax.getJSONFileData(obj._id)
				.then((data) => {
					this.createJSONViewer(data, templateNode);
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

		this._openSeadragonViewer.svgOverlay();

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

	getOSDViewer() {
		return this._openSeadragonViewer;
	}

	refreshSlide(viewer, sd) {
		if (viewer && sd) {
			this.app.callEvent("setSlide", [sd]);
			window.viewer.viewport.zoomTo(3);
			window.viewer.viewport.goHome(true);
		}
		this.app.callEvent("setBounds", []);
	}
}
