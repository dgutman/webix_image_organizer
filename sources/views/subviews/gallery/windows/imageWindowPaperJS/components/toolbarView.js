import {JetView} from "webix-jet";

import constants from "../../../../../../constants";
import {
	DefaultTool,
	SelectTool,
	TransformTool,
	StyleTool,
	RectangleTool,
	EllipseTool,
	PolygonTool,
	LinestringTool,
	PointTool,
	PointTextTool,
	BrushTool,
	WandTool,
	RasterTool,
} from "../osd-paperjs-annotation";
import magicWandToolBar from "./toolbars/magicWand";

export default class ToolbarView extends JetView {
	constructor(app, config = {}, /* imageWindowViewModel, */ imageWindowView) {
		super(app, config);

		// this._imageWindowViewModel = imageWindowViewModel;
		this._imageWindowView = imageWindowView;
		this._cnf = config;
		this._toolControlEvents = {};
		this._tools = {};
		this._currentMode = null;
	}

	config() {
		const defaultButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.default,
			"fas fa-hand-paper",
			"Image Navigation Tool",
		);
		const selectButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.select,
			"fas fa-mouse-pointer",
			"Selection Tool",
		);
		const transformButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.transform,
			"fas fa-arrows-alt",
			"Transform Tool",
		);
		const styleButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.style,
			"fas fa-palette",
			"Style",
		);
		const rectangleButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.rectangle,
			"fa fa-square",
			"Rectangle",
		);
		const ellipseButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.ellipse,
			"far fa-circle",
			"Ellipse",
		);
		const pointButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.point,
			"fa fa-map-marker",
			"Point",
		);
		const textButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.text,
			"fas fa-font",
			"Text",
		);
		const polygonButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.polygon,
			"fab fa-connectdevelop",
			"Polygon",
		);
		const brushButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.brush,
			"fas fa-paint-brush",
			"Brush",
		);
		const wandButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.wand,
			"fas fa-magic",
			"Magic wand",
		);
		const lineStringButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.linestring,
			"fas fa-pen-nib",
			"Linestring Tool",
		);
		const rasterButton = this.getDrawingButton(
			constants.ANNOTATION_TOOL_IDS.raster,
			"fas fa-image",
			"Raster tool",
		);
		const drawingToolbar = {
			view: "toolbar",
			name: "drawing_toolbar",
			cols: [
				{
					cols: [
						defaultButton,
						selectButton,
						transformButton,
						styleButton,
						rectangleButton,
						ellipseButton,
						pointButton,
						textButton,
						polygonButton,
						brushButton,
						wandButton,
						lineStringButton,
						rasterButton,
					],
					name: "drawing_buttons_layout"
				},
				{width: 10},
				{
					cols: [
						{
							view: "switch",
							bottomLabel: "No Labels",
							switch: "label",
							inputHeight: 35,
							height: 40,
							width: 75,
							labelWidth: 0,
							hidden: true,
							checkValue: true,
							uncheckValue: false,
							on: {
								onChange: (newValue) => {
									let switchElement = this.getRoot().queryView({switch: "label"});
									window.switchLabel = newValue;
									if (newValue) {
										this.refreshRightLabel(switchElement, "Labels");
										this.app.callEvent("toggleLabel", [newValue]);
									}
									else {
										this.refreshRightLabel(switchElement, "No Labels");
										this.app.callEvent("toggleLabel", [newValue]);
									}
								},
								onAfterRender() {
									window.switchLabel = this.getValue();
								}
							}
						},
						{
							view: "switch",
							bottomLabel: "Drawing Disabled",
							switch: "drawing",
							inputHeight: 35,
							height: 40,
							width: 120,
							labelWidth: 0,
							checkValue: true,
							hidden: true,
							uncheckValue: false,
							on: {
								onChange: (newValue) => {
									let switchElement = this.getDrawingSwitch();
									if (newValue) {
										this.refreshRightLabel(switchElement, "Drawing Enabled");
									}
									else {
										let fullPageButton = document.querySelector(".fullpageButton");
										if (fullPageButton) {
											fullPageButton.style.display = "none";
										}
										this.refreshRightLabel(switchElement, "Drawing Disabled");
										this.organizeButtonsAction(this.getCurrentButton());
										this.app.callEvent("disabledDrawingPointer", []);
									}
								}
							}
						}
					],
					css: "switchButtonsLayout"
				},
				{gravity: 1},
				{
					view: "richselect",
					width: 200,
					label: "Layer:",
					labelAlign: "right",
					align: "right",
					labelWidth: 50,
					inputWidth: 200,
					hidden: true,
					inputHeight: 40,
					value: 1,
					css: "layer-combo",
					options: {
						body: {
							template: "#value#",
							// data: this._imageWindowViewModel.layouts,
							tooltip: "#value#"
						}
					},
					on: {
						onChange: (newV) => {
							this.app.callEvent("richselectChanged", [newV]);
						}
					}
				},
				{
					view: "button",
					align: "right",
					type: "icon",
					icon: "fa fa-bars",
					tooltip: "Annotations",
					css: "blue_button",
					inputWidth: 40,
					inputHeight: 40,
					width: 40,
					height: 40,
					hidden: true,
					click: () => {
						this._annotationPopup.showPopup();
					}
				}
			],
			css: "drawing_toolbar",
			height: 60,
			borderless: true,
			// disabled: true
			// hidden: true,
		};
		const dropdownContainer = {
			view: "template",
			template: "<div class=\"dropdowns-container\"></div>",
			height: 1,
		};
		return {
			rows: [
				// TODO: hide toolbar at David's request
				drawingToolbar,
				dropdownContainer,
			]
		};
	}

	init() {
		document.onkeydown = (evt) => {
			evt = evt || window.event;
			if (evt.keyCode !== 27 && !window.fullScreenImage) return;
			let switchElement = this.getRoot().queryView({switch: "drawing"});
			if (switchElement && switchElement.getValue()) {
				switchElement.setValue(false);
			}
		};
	}

	ready(view) {
		this.view = view;
		this.disableControls();
		const toolbarControls = this.getToolbarControls();

		Object.entries(toolbarControls).forEach(([, control]) => {
			if (control) {
				control.deactivate = (id) => {
					this.organizeButtonsAction(id);
				};
				control.activate = (id) => {
					this.organizeButtonsAction(id);
				};
			}
		});

		toolbarControls[constants.ANNOTATION_TOOL_IDS.rectangle].attachEvent("onClick", () => {
			let deleteBool = this.organizeButtonsAction("rectangle");
			this.enableSwitch(deleteBool);
			this.setFullpageButtonHandle();
		});
	}

	attachAnnotationToolkitEvents() {
		this._tk.paperScope.project.on({
			"item-replaced": () => {
				this.setMode();
			},
			"item-selected": () => {
				this.setMode();
			},
			"item-deselected": () => {
				this.setMode();
			},
			"item-removed": () => {
				this.setMode();
			},
			"items-changed": () => {
				this.setMode();
			}
		});
	}

	attachControlsEvents() {
		const controls = this.getToolbarControls();
		Object.entries(controls).forEach(([k, c]) => {
			if (this._toolControlEvents[k]) {
				webix.detachEvent(this._toolControlEvents[k]);
			}
			this._toolControlEvents[k] = c.attachEvent("onItemClick", () => {
				this._tools[k].activate();
			});
		});
	}

	refreshRightLabel(obj, label) {
		obj.config.bottomLabel = label;
		obj.refresh();
	}

	enableSwitch(deleteBool) {
		let switchElement = this.getRoot().queryView({switch: "drawing"});
		switchElement.setValue(!deleteBool);
		let fullPageButton = document.querySelector(".fullpageButton");
		if ((!fullPageButton.style.display || fullPageButton.style.display === "none") && !deleteBool) {
			setTimeout(() => {
				fullPageButton.style.display = "inline-block";
			}, 0);
		}
		else if (deleteBool) {
			fullPageButton.style.display = "none";
		}
	}

	setCurrentButton(buttonId) {
		this.currentButtonId = buttonId;
	}

	getCurrentButton() {
		return this.currentButtonId;
	}

	getDrawingSwitch() {
		return this.getRoot().queryView({switch: "drawing"});
	}

	setFullpageButtonHandle() {
		let fullPageButton = document.querySelector(".fullpageButton");
		if (fullPageButton) {
			fullPageButton.onclick = () => {
				let osd = document.querySelector(".openseadragon-canvas canvas");
				this.openFullscreen(osd);
				window.fullScreenImage = true;
			};

			let fullpageButton = document.querySelector(".fullpageButton");
			let fullpageGrouphover = document.querySelector(".fullpageButton .fullpage_grouphover");
			let fullpageHover = document.querySelector(".fullpageButton .fullpage_hover");
			fullpageButton.addEventListener("mouseenter", () => {
				fullpageGrouphover.style.display = "none";
				fullpageHover.style.display = "block";
			});
			fullpageButton.addEventListener("mouseleave", () => {
				fullpageGrouphover.style.display = "block";
				fullpageHover.style.display = "none";
			});
		}
	}

	/* Open fullscreen */
	openFullscreen(elem) {
		let fullpageGrouphover = document.querySelector(".fullpageButton .fullpage_grouphover");
		let fullpageHover = document.querySelector(".fullpageButton .fullpage_hover");
		fullpageGrouphover.style.display = "block";
		fullpageHover.style.display = "none";
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		}
		else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		}
		else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
		else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		}
	}

	organizeButtonsAction(localId) {
		let drawingToolbar = this._imageWindowView.getRoot().queryView({name: "drawing_buttons_layout"});
		let buttons = drawingToolbar.getChildViews();
		if (!localId) {
			for (let i = 0; i < buttons.length; i++) {
				let buttonNode = buttons[i].getNode().querySelector("button");
				if (buttonNode.classList.contains("button_selected")) {
					buttonNode.classList.remove("button_selected");
				}
			}
			return;
		}
		let buttonNode = this.$$(localId).getNode().querySelector("button");
		let del = true;
		if (!buttonNode.classList.contains("button_selected")) {
			del = false;
		}
		for (let i = 0; i < buttons.length; i++) {
			const buttonElement = buttons[i].getNode().querySelector("button");
			if (buttonElement.classList.contains("button_selected")) {
				buttonElement.classList.remove("button_selected");
			}
		}
		this.setCurrentButton("");
		if (!buttonNode.classList.contains("button_selected") && !del) {
			buttonNode.classList.add("button_selected");
			this.setCurrentButton(localId);
		}
		return del; // return true/false: delete class or not
	}

	getToolbarControls() {
		const defaultControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.default);
		const selectControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.select);
		const styleControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.style);
		const transformControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.transform);
		const rectangleControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.rectangle);
		const ellipseControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.ellipse);
		const pointControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.point);
		const textControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.text);
		const polygonControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.polygon);
		const brushControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.brush);
		const wandControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.wand);
		const lineControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.linestring);
		const rasterControl = this.getControlById(constants.ANNOTATION_TOOL_IDS.raster);
		const toolbarControls = {};
		toolbarControls[constants.ANNOTATION_TOOL_IDS.default] = defaultControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.select] = selectControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.transform] = transformControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.style] = styleControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.polygon] = polygonControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.rectangle] = rectangleControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.ellipse] = ellipseControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.linestring] = lineControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.point] = pointControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.text] = textControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.brush] = brushControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.wand] = wandControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.raster] = rasterControl;
		return toolbarControls;
	}

	getToolsConstructors() {
		this.toolConstructors = {};
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.default] = DefaultTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.rectangle] = RectangleTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.ellipse] = EllipseTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.polygon] = PolygonTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.select] = SelectTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.wand] = WandTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.brush] = BrushTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.linestring] = LinestringTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.point] = PointTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.text] = PointTextTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.raster] = RasterTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.transform] = TransformTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.style] = StyleTool;
		return this.toolConstructors;
	}

	/**
	 * Update annotation paperjs toolkit
	 *
	 * @param {AnnotationToolkit} tk 
	 */
	updatePaperJSToolkit(tk) {
		this._tk = tk;
		this.updateToolsAndControls();
		this.attachAnnotationToolkitEvents();
		this.attachControlsEvents();
	}

	updateToolsAndControls() {
		const toolsControls = this.getToolbarControls();
		const toolsConstructors = this.getToolsConstructors();
		const paperScope = this._tk.paperScope;
		const toolIdsKeys = Object.keys(constants.ANNOTATION_TOOL_IDS);
		toolIdsKeys.forEach((key) => {
			const toolId = constants.ANNOTATION_TOOL_IDS[key];
			const annotationUI = this._tk.annotationUI;
			const annotationToolbar = annotationUI._toolbar;
			const annotationTools = annotationToolbar.tools;
			const annotationToolsKeys = Object.keys(annotationTools);
			annotationToolsKeys.find((tKey) => {
				if (annotationTools[tKey] instanceof toolsConstructors[toolId]) {
					this._tools[toolId] = annotationTools[tKey];
					return true;
				}
				return false;
			});
			const control = toolsControls[toolId];
			if (control) {
				control.detachEvent(this._toolControlEvents[toolId]);
				this._toolControlEvents[toolId] = control.attachEvent("onItemClick", () => {
					// TODO: implement
				});
			}
			const toolObj = this._tools[toolId];
			toolObj?.addEventListener("deactivated", (ev) => {
				// TODO: implement
			});
		});
		this.setMode();
	}

	setMode() {
		const paperScope = this._tk.paperScope;
		const selection = paperScope.findSelectedItems();
		const activeTool = paperScope.getActiveTool();
		const toolbarControls = this.getToolbarControls();
		if (selection.length === 0) {
			this._currentMode = "select";
		}
		else if (selection.length === 1) {
			const item = selection[0];
			const def = item.annotationItem || {};
			let type = def.type;
			if (def.subtype) {
				type += `:${def.subtype}`;
			}
			const mode = type === null ? "new" : type;
			this._currentMode = mode;
		}
		else {
			this._currentMode = "multiselection";
		}

		this.setControlsState(this._currentMode);
	}

	disableControls() {
		const controls = this.getToolbarControls();
		Object.entries(controls).forEach(([, c]) => {
			if (c) {
				c.disable();
			}
		});
	}

	enableControls() {
		const controls = this.getToolbarControls();
		Object.entries(controls).forEach(([, c]) => {
			if (c) {
				c.enable();
			}
		});
	}

	setControlsState(mode) {
		const controls = this.getToolbarControls();
		Object.entries(controls).forEach(([k, c]) => {
			switch (k) {
				case constants.ANNOTATION_TOOL_IDS.default: {
					c.enable();
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.select: {
					if (
						[
							constants.ANNOTATION_MODE.default,
							constants.ANNOTATION_MODE.select,
							constants.ANNOTATION_MODE.multiSelection,
							constants.ANNOTATION_MODE.polygon,
							constants.ANNOTATION_MODE.multiPolygon,
							constants.ANNOTATION_MODE.pointRectangle,
							constants.ANNOTATION_MODE.pointEllipse,
							constants.ANNOTATION_MODE.point,
							constants.ANNOTATION_MODE.lineString,
							constants.ANNOTATION_MODE.multiLineString,
							constants.ANNOTATION_MODE.geometryCollectionRaster,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.transform: {
					if (
						[
							constants.ANNOTATION_MODE.select,
							constants.ANNOTATION_MODE.multiSelection,
							constants.ANNOTATION_MODE.polygon,
							constants.ANNOTATION_MODE.multiPolygon,
							constants.ANNOTATION_MODE.pointRectangle,
							constants.ANNOTATION_MODE.pointEllipse,
							/* Note from Tom
							disable for Point because neither resize nor scaling work for that object type
							*/
							// constants.ANNOTATION_MODE.point,
							constants.ANNOTATION_MODE.lineString,
							constants.ANNOTATION_MODE.geometryCollectionRaster,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.style: {
					c.enable();
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.rectangle: {
					if (
						[
							constants.ANNOTATION_MODE.new,
							constants.ANNOTATION_MODE.pointRectangle,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.ellipse: {
					if (
						[
							constants.ANNOTATION_MODE.new,
							constants.ANNOTATION_MODE.pointEllipse,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.point: {
					if (
						[
							constants.ANNOTATION_MODE.new,
							constants.ANNOTATION_MODE.point,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.text: {
					if (
						[
							constants.ANNOTATION_MODE.new,
							constants.ANNOTATION_MODE.pointText,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.polygon: {
					if (
						[
							constants.ANNOTATION_MODE.new,
							constants.ANNOTATION_MODE.polygon,
							constants.ANNOTATION_MODE.multiPolygon,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.brush: {
					if (
						[
							constants.ANNOTATION_MODE.new,
							constants.ANNOTATION_MODE.polygon,
							constants.ANNOTATION_MODE.multiPolygon,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.wand: {
					if (
						[
							constants.ANNOTATION_MODE.new,
							constants.ANNOTATION_MODE.polygon,
							constants.ANNOTATION_MODE.multiPolygon,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.linestring: {
					if (
						[
							constants.ANNOTATION_MODE.new,
							constants.ANNOTATION_MODE.lineString,
							constants.ANNOTATION_MODE.multiLineString,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				case constants.ANNOTATION_TOOL_IDS.raster: {
					if (
						[
							constants.ANNOTATION_MODE.new,
							constants.ANNOTATION_MODE.polygon,
							constants.ANNOTATION_MODE.multiPolygon,
							constants.ANNOTATION_MODE.pointRectangle,
							constants.ANNOTATION_MODE.pointEllipse,
						].includes(mode)
					) {
						c.enable();
					}
					else {
						c.disable();
					}
					break;
				}
				default: {
					c.disable();
					break;
				}
			}
		});
	}

	getControlById(controlId) {
		return this.getRoot().queryView({localId: controlId});
	}

	getDrawingButton(id, icon, tooltip) {
		return {
			view: "button",
			type: "icon",
			localId: id,
			icon,
			tooltip,
			css: "drawing_buttons",
			inputWidth: 40,
			inputHeight: 40,
			width: 40,
			height: 40
		};
	}
}
