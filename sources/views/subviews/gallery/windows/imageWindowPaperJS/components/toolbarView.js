import {JetView} from "webix-jet";

import constants from "../../../../../../constants";
import { Placeholder } from "../osd-annotation/js/paperitems/placeholder.mjs";
import { BrushTool } from "../osd-annotation/js/papertools/brush.mjs";
import { DefaultTool } from "../osd-annotation/js/papertools/default.mjs";
import { EllipseTool } from "../osd-annotation/js/papertools/ellipse.mjs";
import { LinestringTool } from "../osd-annotation/js/papertools/linestring.mjs";
import { PointTool } from "../osd-annotation/js/papertools/point.mjs";
import { PointTextTool } from "../osd-annotation/js/papertools/pointtext.mjs";
import { PolygonTool } from "../osd-annotation/js/papertools/polygon.mjs";
import { RasterTool } from "../osd-annotation/js/papertools/raster.mjs";
import { RectangleTool } from "../osd-annotation/js/papertools/rectangle.mjs";
import { SelectTool } from "../osd-annotation/js/papertools/select.mjs";
// style tool will be implemented in right panel
// import { StyleTool } from "../osd-annotation/js/papertools/style.mjs";
// import { TransformTool } from "../osd-annotation/js/papertools/transform.mjs";
import { WandTool } from "../osd-annotation/js/papertools/wand.mjs";

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
		const drawingToolbar = {
			view: "toolbar",
			name: "drawing_toolbar",
			cols: [
				{
					cols: [
						// TODO: enable after implement
						// {
						// 	view: "button",
						// 	type: "icon",
						// 	localId: "line",
						// 	icon: "fa fa-pencil-alt",
						// 	tooltip: "Line",
						// 	css: "drawing_buttons",
						// 	inputWidth: 40,
						// 	inputHeight: 40,
						// 	width: 40,
						// 	height: 40,
						// 	// click: () => {
						// 	// 	let deleteBool = this.organizeButtonsAction("line");
						// 	// 	this.enableSwitch(deleteBool);
						// 	// 	if (!deleteBool) {
						// 	// 		window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["line"]));
						// 	// 	}
						// 	// 	else this.app.callEvent("disabledDrawingPointer", []);
						// 	// 	this.setFullpageButtonHandle();
						// 	// }
						// },
						{
							view: "button",
							type: "icon",
							localId: "default",
							icon: "fas fa-hand-paper",
							tooltip: "Default",
							css: "drawing_buttons",
							inputWidth: 40,
							inputHeight: 40,
							width: 40,
							height: 40,
							// click: () => {
							// 	let deleteBool = this.organizeButtonsAction("line");
							// 	this.enableSwitch(deleteBool);
							// 	if (!deleteBool) {
							// 		window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["line"]));
							// 	}
							// 	else this.app.callEvent("disabledDrawingPointer", []);
							// 	this.setFullpageButtonHandle();
							// }
						},
						{
							view: "button",
							type: "icon",
							localId: "polygon",
							icon: "fab fa-connectdevelop",
							tooltip: "Polygon",
							css: "drawing_buttons",
							inputWidth: 40,
							inputHeight: 40,
							width: 40,
							height: 40
							// click: () => {
							// 	let deleteBool = this.organizeButtonsAction("polygon");
							// 	this.enableSwitch(deleteBool);
							// 	if (!deleteBool) {
							// 		window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["polygon"]));
							// 	}
							// 	else this.app.callEvent("disabledDrawingPointer", []);
							// 	this.setFullpageButtonHandle();
							// }
						},
						{
							view: "button",
							type: "icon",
							localId: "rectangle",
							icon: "far fa-square",
							tooltip: "Rectangle",
							css: "drawing_buttons",
							inputWidth: 40,
							inputHeight: 40,
							width: 40,
							height: 40,
							// click: () => {
							// 	let deleteBool = this.organizeButtonsAction("rectangle");
							// 	this.enableSwitch(deleteBool);
							// 	if (!deleteBool) {
							// 		window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["rectangle"]));
							// 	}
							// 	else this.app.callEvent("disabledDrawingPointer", []);
							// 	this.setFullpageButtonHandle();
							// }
						},
						// TODO: enable after implement
						// {
						// 	view: "button",
						// 	type: "icon",
						// 	localId: "point",
						// 	icon: "fa fa-map-marker",
						// 	tooltip: "Point",
						// 	css: "drawing_buttons",
						// 	inputWidth: 40,
						// 	inputHeight: 40,
						// 	width: 40,
						// 	height: 40,
						// 	// click: () => {
						// 	// 	let deleteBool = this.organizeButtonsAction("point");
						// 	// 	this.enableSwitch(deleteBool);
						// 	// 	if (!deleteBool) {
						// 	// 		window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["point"]));
						// 	// 	}
						// 	// 	else this.app.callEvent("disabledDrawingPointer", []);
						// 	// 	this.setFullpageButtonHandle();
						// 	// }
						// },
						// TODO: enable after implement
						{
							view: "button",
							type: "icon",
							localId: "select",
							icon: "fas fa-hand-pointer",
							tooltip: "Select",
							css: "drawing_buttons",
							inputWidth: 40,
							inputHeight: 40,
							width: 40,
							height: 40
						},
						{
							view: "button",
							type: "icon",
							localId: "ellipse",
							icon: "far fa-circle",
							tooltip: "Ellipse",
							css: "drawing_buttons",
							inputWidth: 40,
							inputHeight: 40,
							width: 40,
							height: 40
							// click: () => {
							// 	let deleteBool = this.organizeButtonsAction("polygon");
							// 	this.enableSwitch(deleteBool);
							// 	if (!deleteBool) {
							// 		window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["polygon"]));
							// 	}
							// 	else this.app.callEvent("disabledDrawingPointer", []);
							// 	this.setFullpageButtonHandle();
							// }
						},
						// TODO: enable after implement
						// {
						// 	view: "button",
						// 	type: "icon",
						// 	localId: "text",
						// 	icon: "fas fa-font",
						// 	tooltip: "Text",
						// 	css: "drawing_buttons",
						// 	inputWidth: 40,
						// 	inputHeight: 40,
						// 	width: 40,
						// 	height: 40
						// 	// click: () => {
						// 	// 	let deleteBool = this.organizeButtonsAction("polygon");
						// 	// 	this.enableSwitch(deleteBool);
						// 	// 	if (!deleteBool) {
						// 	// 		window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["polygon"]));
						// 	// 	}
						// 	// 	else this.app.callEvent("disabledDrawingPointer", []);
						// 	// 	this.setFullpageButtonHandle();
						// 	// }
						// },
						// TODO: enable after implement
						// {
						// 	view: "button",
						// 	type: "icon",
						// 	localId: "brush",
						// 	icon: "fas fa-paint-brush",
						// 	tooltip: "Brush",
						// 	css: "drawing_buttons",
						// 	inputWidth: 40,
						// 	inputHeight: 40,
						// 	width: 40,
						// 	height: 40
						// 	// click: () => {
						// 	// 	let deleteBool = this.organizeButtonsAction("polygon");
						// 	// 	this.enableSwitch(deleteBool);
						// 	// 	if (!deleteBool) {
						// 	// 		window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["polygon"]));
						// 	// 	}
						// 	// 	else this.app.callEvent("disabledDrawingPointer", []);
						// 	// 	this.setFullpageButtonHandle();
						// 	// }
						// },
						{
							view: "button",
							type: "icon",
							localId: "wand",
							icon: "fas fa-magic",
							tooltip: "Magic wand",
							css: "drawing_buttons",
							inputWidth: 40,
							inputHeight: 40,
							width: 40,
							height: 40
						},
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

		const polygonControl = this.getRoot().queryView({localId: "polygon"});
		const lineControl = this.getRoot().queryView({localId: "line"});
		const rectangleControl = this.getRoot().queryView({localId: "rectangle"});
		const pointControl = this.getRoot().queryView({localId: "point"});
		const selectControl = this.getRoot().queryView({localId: "select"});
		const ellipseControl = this.getRoot().queryView({localId: "ellipse"});
		const textControl = this.getRoot().queryView({localId: "text"});
		const brushControl = this.getRoot().queryView({localId: "brush"});

		const toolbarControl = [
			polygonControl,
			lineControl,
			rectangleControl,
			pointControl,
			selectControl,
			ellipseControl,
			textControl,
			brushControl
		];

		toolbarControl.forEach((control) => {
			if (control) {
				control.deactivate = (id) => {
					this.organizeButtonsAction(id);
				};
				control.activate = (id) => {
					this.organizeButtonsAction(id);
				};
			}
		});

		rectangleControl?.attachEvent("onClick", () => {
			let deleteBool = this.organizeButtonsAction("rectangle");
			this.enableSwitch(deleteBool);
			this.setFullpageButtonHandle();
		});

		// TODO: Disable if necessary
		// let buttonLayout = this.getRoot().queryView({name: "drawing_buttons_layout"}).getChildViews();
		// for (let i = 0; i < buttonLayout.length; i++) {
		// 	if (buttonLayout[i].isEnabled()) {
		// 		buttonLayout[i].disable();
		// 	}
		// }
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
		const defaultControl = this.getRoot().queryView({localId: "default"});
		const polygonControl = this.getRoot().queryView({localId: "polygon"});
		const lineControl = this.getRoot().queryView({localId: "line"});
		const rectangleControl = this.getRoot().queryView({localId: "rectangle"});
		const pointControl = this.getRoot().queryView({localId: "point"});
		const selectControl = this.getRoot().queryView({localId: "select"});
		const ellipseControl = this.getRoot().queryView({localId: "ellipse"});
		const textControl = this.getRoot().queryView({localId: "text"});
		const brushControl = this.getRoot().queryView({localId: "brush"});
		const wandControl = this.getRoot().queryView({localId: "wand"});
		const toolbarControls = {};
		toolbarControls[constants.ANNOTATION_TOOL_IDS.default] = defaultControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.polygon] = polygonControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.rectangle] = rectangleControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.ellipse] = ellipseControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.linestring] = lineControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.point] = pointControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.select] = selectControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.text] = textControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.brush] = brushControl;
		toolbarControls[constants.ANNOTATION_TOOL_IDS.wand] = wandControl;
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
		return this.toolConstructors;
	}

	updatePaperJSToolkit(tk) {
		this._tk = tk;
		this.updateToolsAndControls();
		const paperScope = this._tk.paperScope;
		paperScope.project.on({
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

	updateToolsAndControls() {
		const toolsControls = this.getToolbarControls();
		const toolsConstructors = this.getToolsConstructors();
		const paperScope = this._tk.paperScope;
		const toolIdsKeys = Object.keys(constants.ANNOTATION_TOOL_IDS);
		toolIdsKeys.forEach((key) => {
			const toolId = constants.ANNOTATION_TOOL_IDS[key];
			const toolObj = new toolsConstructors[toolId](paperScope);
			this._tools[key] = toolObj;
			const control = toolsControls[toolId];
			if (control) {
				control.detachEvent(this._toolControlEvents[toolId]);
				this._toolControlEvents[toolId] = control.attachEvent("onItemClick", () => {
					const group = this._tk.addEmptyFeatureCollectionGroup();
					let props = group.defaultStyle;
					let clonedProperties = {
						fillColor: new paper.Color(props.fillColor),
						strokeColor: new paper.Color(props.strokeColor),
						rescale: OpenSeadragon.extend(true, {}, props.rescale),
						fillOpacity: props.fillOpacity,
						strokeOpacity: props.strokeOpacity,
						strokeWidth: props.strokeWidth,
					};
					const placeHolder = new Placeholder(clonedProperties);
					const item = placeHolder.paperItem;
					item.select();
					group.addChild(placeHolder.paperItem);
					toolObj.activate();
				});
			}
			toolObj.addEventListener("deactivated", (ev) => {
				// If deactivation is triggered by another tool being activated, this condition will fail
				if (ev.target === paperScope.getActiveTool()) {
					this._tools.default.activate();
				}
			});
		});
	}

	setMode() {
		const self = this;
		const paperScope = this._tk.paperScope;
		if (this.setModeTimeout) {
			clearTimeout(this.setModeTimeout);
		}
		this.setModeTimeout = setTimeout(() => {
			this.setModeTimeout = null;
			let selection = paperScope.findSelectedItems();
			let activeTool = paperScope.getActiveTool();
			if (selection.length === 0) {
				this._currentMode = "select";
			}
			else if (selection.length === 1) {
				const item = selection[0];
				const def = item.annotationItem || {};
				let type = def.type;
				if (def.subtype) type += `:${def.subtype}`;
				const mode = type === null ? "new" : type;
				this._currentMode = mode;
			}
			else {
				this._currentMode = "multiselection";
			}

			if (activeTool.getToolbarControl().isEnabledForMode(this._currentMode) === false) {
				activeTool.deactivate(true);
				this._tools.default.activate();
			}

			Object.values(this._tools).forEach((toolObj) => {
				let t = toolObj.getToolbarControl();
				if (t.isEnabledForMode(self.currentMode)) {
					t.button.enable();
				}
				else {
					t.button.disable();
				}
			});

			activeTool.selectionChanged();
		}, 0);
	}
}
