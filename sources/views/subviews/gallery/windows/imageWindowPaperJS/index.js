import JSONFormatter from "json-formatter-js";
import {JetView} from "webix-jet";

import RightPanel from "./components/rightPanel/rightPanel";
// import ToolbarView from "./components/toolbarView";
import ControlsView from "./controlsView";
import { AnnotationToolkit } from "./osd-paperjs-annotation";
// TODO: add rotation control
import { RotationControl } from "./osd-paperjs-annotation";
import annotationApiRequests from "./services/api";
import ControlsEventsService from "./services/controlsEventsService";
// DO NOT MOVE ToolbarView MODULE, it will cause an error
import ToolbarView from "./components/toolbarView";
import galleryImageUrls from "../../../../../models/galleryImageUrls";
import nonImageUrls from "../../../../../models/nonImageUrls";
import ajax from "../../../../../services/ajaxActions";
import auth from "../../../../../services/authentication";
import MakerLayer from "../../../../../services/organizer/makerLayer";
import utils from "../../../../../utils/utils";
import collapser from "../../../../components/collapser";

const HEIGHT = 600;
const WIDTH = 1050;
const LEFT_PANEL_ID = "#left-window-panel-id";
const CONTROLS_PANEL_ID = "#openseadragon-viewer-controls-id";
const RIGHT_PANEL_ID = `right-window-panel-id-${webix.uid()}`;
const RIGHT_PANEL_WITH_COLLAPSER_ID = `right-panel-collapser-id-${webix.uid()}`;
const WINDOW_TITLE_ID = "#window-title-id";
const IMAGE_CONTAINER_ID = "#image-container-id";
const WEBIX_TOOLBAR_BUTTON_ID = `webix-toolbar-button-id-${webix.uid()}`;

const webixToolbarState = {
	webixToolbarShow: true
};

export default class ImageWindowView extends JetView {
	constructor(app, config) {
		super(app, config);

		this._controlsView = new ControlsView(this.app);
		// this._imageWindowViewModel = new ImageWindowViewModel(this);
		this._toolbarView = new ToolbarView(this.app, {}, /* this._imageWindowViewModel, */ this);
		/** @type {RightPanel} */
		this._rightPanel = new RightPanel(this.app);
	}

	config() {
		const controlsCollapser = collapser
			.getConfig(
				CONTROLS_PANEL_ID,
				{type: "left", closed: true},
				"controlsCollapserName"
			);
		const rightPanelCollapser = collapser
			.getConfig(
				RIGHT_PANEL_ID,
				{type: "right", closed: false},
				"rightPanelCollapserName"
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
			fullscreen: false,
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
						width: 150,
						view: "button",
						label: `Webix toolbar ${webixToolbarState.webixToolbarShow ? "ON" : "OFF"}`,
						id: WEBIX_TOOLBAR_BUTTON_ID,
						click: () => {
							this.changeState();
						},
					},
					{
						view: "icon",
						icon: "fas fa-expand",
						tooltip: "enable fullscreen mode",
						click: function changeWindowMode() {
							const win = this.$scope.getRoot();
							const state = utils.getAnnotationWindowState();
							if (win?.config.fullscreen) {
								win.define({
									fullscreen: false,
									width: state.width ?? WIDTH,
									height: state.height ?? HEIGHT,
									move: true,
								});
								win.setPosition(state.position.left, state.position.top);
								this.define({icon: "fas  fa-expand", tooltip: "Enable fullscreen mode"});
							}
							else if (win) {
								win.define({
									fullscreen: true,
									width: window.innerWidth,
									height: window.innerHeight,
									move: false,
								});
								state.position.left = win.config.left;
								state.position.top = win.config.top;
								win.setPosition(0, 0);
								utils.setAnnotationWindowState(state);
								this.define({icon: "fas fa-compress", tooltip: "Disable fullscreen mode"});
							}
							win.resize();
							this.refresh();
						},
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
										],
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
											let getPreviewUrl = galleryImageUrls.getNormalImageUrl;
											let setPreviewUrl = galleryImageUrls.setNormalImageUrl;

											if (obj.label) {
												imageType = "images/label";
												getPreviewUrl = galleryImageUrls.getLabelPreviewImageUrl;
												setPreviewUrl = galleryImageUrls.setPreviewLabelImageUrl;
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
							},
							{
								id: RIGHT_PANEL_WITH_COLLAPSER_ID,
								cols: [
									rightPanelCollapser,
									{
										id: RIGHT_PANEL_ID,
										width: 250,
										cols: [
											this._rightPanel
										]
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
			// if (window.annotationLayer.annotations().length
			// 	=== this._imageWindowViewModel.annotationsLength
			// 	&& this._imageWindowViewModel.currentShape) {
			// 	this.app.callEvent("drawFigure", [this._imageWindowViewModel.currentShape]);
			// }
		});

		imageTemplate.addEventListener("click", () => {
			// if (this._imageWindowViewModel.isAnnotationAdd) {
			// 	this.app.callEvent("drawFigure", [this._imageWindowViewModel.currentShape]);
			// }
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
			// this._toolbarEventService =
			// 	new ToolbarEventServices(this, this._toolbarView, this._imageWindowViewModel);
			// this._toolbarEventService.init();
		}

		if (this.getRoot().queryView({name: "imageTemplate"})) {
			// this._imageTemplateEventServices =
			// 	new ImageTemplateEventsService(this, this._imageWindowViewModel);
			// this._imageTemplateEventServices.init();
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

	/** @type {ControlsView} */
	get $controlsPanel() {
		if (!this._$controlsPanel) {
			this._$controlsPanel = this.$$(CONTROLS_PANEL_ID);
		}
		return this._$controlsPanel;
	}

	async showWindow(obj, viewerType) {
		this.$leftPanel.hide();
		this.$windowTitle.parse(obj);

		// this._imageWindowViewModel.setItem(obj);
		if (viewerType === "standard") {
			this.$imageContainer.parse(obj);
			this.$imageContainer.define("scroll", false);
			this.$imageContainer.define("move", true);
		}

		this.getRoot().show();
		const templateNode = this.$imageContainer.getNode().querySelector("#image_viewer");

		if (viewerType === "seadragon") {
			this.view.showProgress();
			try {
				const data = await ajax.getImageTiles(obj._id);
				if (data) {
					this.tiles = data; // for geojs
					// this.$leftPanel.show();
					this.$controlsPanel.show();
					const layerOfViewer = this.createOpenSeadragonLayer(obj, data);
					await this.createOpenSeadragonViewer(layerOfViewer, templateNode);
					this._tk = new AnnotationToolkit(this._openSeadragonViewer);
					// TODO: avoid this
					window.project = this._tk.overlay.paperScope.project;
					this._tk.addAnnotationUI({autoOpen: true});
					this._controlsView.updatePaperJSToolkit(this._tk);
					this._toolbarView.updatePaperJSToolkit(this._tk);
					this._rightPanel.updatePaperJSToolkit(this._tk);
					this._rightPanel.updateOSDViewer(this._openSeadragonViewer);
					this._rightPanel.setItemId(obj._id);
					const annotations = await annotationApiRequests.getAnnotations(obj._id);
					if (annotations) {
						annotations.forEach((a) => {
							this._rightPanel.addAnnotation(a);
						});
					}

					// put annotations without annotation panel
					/*
					const featureCollectionsArray = annotations.map((a) => {
						const fc = adapter.annotationToFeatureCollections(a);
						return fc;
					});
					featureCollectionsArray.forEach((fc) => {
						this._tk.addFeatureCollections(
							fc,
							true,
							this._openSeadragonViewer.world.getItemAt(0)
						);
					});
					*/
				}
			}
			catch (err) {
				console.error(err);
			}
			finally {
				this.view.hideProgress();
			}
		}
		else if (viewerType === "jsonviewer") {
			this.view.showProgress();
			ajax.getJSONFileData(obj._id)
				.then((data) => {
					this.createJSONViewer(data, templateNode);
				})
				.finally(() => this.view.hideProgress());
		}
		this.changeState(false);
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

	createOpenSeadragonViewer(layer, templateNode) {
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
		this._controlsView.reset();
		this._rightPanel.reset();
		// to clear setted template
		// to destroy Open Seadragon viewer
		if (this._openSeadragonViewer) {
			this._tk.close();
			this._openSeadragonViewer.destroy();
		}
		this.$imageContainer.parse({emptyObject: true});
		this.getRoot().hide();
	}

	changeState(state) {
		webixToolbarState.webixToolbarShow = state ?? !webixToolbarState.webixToolbarShow;
		const rightPanelWithCollapser = this.$$(RIGHT_PANEL_WITH_COLLAPSER_ID);
		if (webixToolbarState.webixToolbarShow) {
			this._toolbarView.getRoot().show();
			rightPanelWithCollapser.show();
		}
		else {
			this._toolbarView.getRoot().hide();
			rightPanelWithCollapser.hide();
		}
		const webixToolbarButton = this.getRoot().queryView({id: WEBIX_TOOLBAR_BUTTON_ID});
		webixToolbarButton.define("label", `Webix toolbar ${webixToolbarState.webixToolbarShow ? "ON" : "OFF"}`);
		webixToolbarButton.refresh();
	}
}
