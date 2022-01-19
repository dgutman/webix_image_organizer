import {JetView} from "webix-jet";
import PathologyReportPopup from "./pathologyReportWindow/pathologyReportWindow";
import MetadataPopup from "./metadataWindow/metadataWindow";
import AnnotationView from "./annotationWindow/annotation";
import ApplyFiltersView from "./applyFiltersWindow/applyFilters";

export default class ToolbarView extends JetView {
	constructor(app, config = {}, imageWindowView) {
		super(app, config);

		this._imageWindowView = imageWindowView;
		this._cnf = config;
	}

	config() {
		const topToolbar = {
			view: "toolbar",
			name: "top_toolbar",
			cols: [
				{
					view: "button",
					value: "Metadata",
					name: "metadata",
					click: () => {
						let item = this._imageWindowView.getItem();
						this._metadataPopup.showWindow(item);
					}
				},
				{
					view: "button",
					value: "Apply Filters",
					name: "applyFilter",
					click: () => {
						const item = this._imageWindowView.getItem();
						this._applyFiltersPopup.showWindow(item);
					}
				},
				{
					view: "button",
					name: "pathologyReport",
					value: "Pathology Report",
					click: async () => {
						let item = this._imageWindowView.getItem();
						const button = this.getRoot().queryView({name: "pathologyReport"});
						button.showProgress();
						await this._pathologyPopup.showWindow(item);
						button.hideProgress();
					}
				},
				{view: "button", value: "Aperio Annotations", name: "aperioAnnotations"}
			],
			borderless: true,
			disabled: true
		};

		const drawingToolbar = {
			view: "toolbar",
			name: "drawing_toolbar",
			cols: [
				{
					cols: [
						{
							view: "button",
							type: "icon",
							localId: "line",
							icon: "fa fa-pencil-alt",
							tooltip: "Line",
							css: "drawing_buttons",
							inputWidth: 40,
							inputHeight: 40,
							width: 40,
							height: 40,
							click: () => {
								let deleteBool = this.organizeButtonsAction("line");
								this.enableSwitch(deleteBool);
								if (!deleteBool) {
									window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["line"]));
								}
								else this.app.callEvent("disabledDrawingPointer", []);
								this.setFullpageButtonHandle();
							}
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
							height: 40,
							click: () => {
								let deleteBool = this.organizeButtonsAction("polygon");
								this.enableSwitch(deleteBool);
								if (!deleteBool) {
									window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["polygon"]));
								}
								else this.app.callEvent("disabledDrawingPointer", []);
								this.setFullpageButtonHandle();
							}
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
							click: () => {
								let deleteBool = this.organizeButtonsAction("rectangle");
								this.enableSwitch(deleteBool);
								if (!deleteBool) {
									window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["rectangle"]));
								}
								else this.app.callEvent("disabledDrawingPointer", []);
								this.setFullpageButtonHandle();
							}
						},
						{
							view: "button",
							type: "icon",
							localId: "point",
							icon: "fa fa-map-marker",
							tooltip: "Point",
							css: "drawing_buttons",
							inputWidth: 40,
							inputHeight: 40,
							width: 40,
							height: 40,
							click: () => {
								let deleteBool = this.organizeButtonsAction("point");
								this.enableSwitch(deleteBool);
								if (!deleteBool) {
									window.showAttentionPopup(() => this.app.callEvent("drawFigure", ["point"]));
								}
								else this.app.callEvent("disabledDrawingPointer", []);
								this.setFullpageButtonHandle();
							}
						}
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
								onAfterRender: function() {
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
				{},
				{
					view: "richselect",
					width: 200,
					label: "Layer:",
					labelAlign: "right",
					align: "right",
					labelWidth: 50,
					inputWidth: 200,
					inputHeight: 40,
					value: 1,
					options: {
						body: {
							template: "#value#",
							data: this._imageWindowView.layouts,
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
					click: () => {
						this._annotationPopup.showPopup();
					}
				}
			],
			css: "drawing_toolbar",
			height: 60,
			borderless: true,
			disabled: true
		};
		return {
			rows: [
				topToolbar,
				drawingToolbar
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

		this._pathologyPopup = this.ui(PathologyReportPopup);
		this._metadataPopup = this.ui(MetadataPopup);
		this._annotationPopup = this.ui(AnnotationView);
		this._applyFiltersPopup = this.ui(ApplyFiltersView);

		this._pathologyReportButton = this.getRoot().queryView({name: "pathologyReport"});
		webix.extend(this._pathologyReportButton, webix.ProgressBar);

		let buttonLayout = this.getRoot().queryView({name: "drawing_buttons_layout"}).getChildViews();
		for (let i = 0; i < buttonLayout.length; i++) {
			if (buttonLayout[i].isEnabled()) {
				buttonLayout[i].disable();
			}
		}
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
}
