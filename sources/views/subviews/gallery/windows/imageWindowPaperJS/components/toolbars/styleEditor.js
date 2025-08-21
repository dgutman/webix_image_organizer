import annotationConstants from "../../constants";
import annotationAppState from "../../models/state";

const popupId = "annotationStyleEditorId";
const annotationStyleEditorFillButtonId = "annotationStyleEditorFillButton";
const annotationStyleEditorStrokeButtonId = "annotationStyleEditorStrokeButton";
const annotationStyleEditorColorPickerId = "annotationStyleEditorColorPicker";
const annotationStyleEditorOpacitySliderId = "annotationStyleEditorOpacitySlider";
const annotationStyleEditorApplyButtonId = "annotationStyleEditorApplyButton";
const annotationStyleEditorPanelId = "annotationStyleEditorPanel";
const state = {
	FILL: "fill",
	STROKE: "stroke",
	currentState: null,
	oldStrokeStyle: null,
	oldFillStyle: null,
};

function getConfig(item, type) {
	const fillColor = getFillColor(item, type);
	const strokeColor = getStrokeColor(item, type);
	const opacity = item?.opacity || 1;
	const elementName = item ? item?.displayName || "Unnamed element" : "Default style";
	const contrastingFillColor = getContrastFromRGB(
		fillColor.red,
		fillColor.green,
		fillColor.blue,
	);
	const contrastingStrokeColor = getContrastFromRGB(
		strokeColor.red,
		strokeColor.green,
		strokeColor.blue,
	);
	const config = {
		view: "window",
		id: popupId,
		head: {height: 1},
		height: 100,
		width: 700,
		body: {
			height: 80,
			rows: [
				{
					cols: [
						{
							width: 100,
							view: "label",
							label: elementName,
						},
						{width: 10},
						{
							view: "template",
							id: annotationStyleEditorFillButtonId,
							width: 120,
							height: 30,
							template: `<button class="annotation-style-button annotation-fill-button" style="width: 100%; height: 100%; background-color: ${fillColor.toCSS(true)};">
								<span style="font-weight: bold; color: ${contrastingFillColor};">Fill Color</span>
							</button>`,
							onClick: {
								"annotation-fill-button": (ev, id) => {
									const annotationStyleEditorPanel = webix.$$(annotationStyleEditorPanelId);
									if (annotationStyleEditorPanel) {
										state.currentState = state.FILL;
										updateColors(item, type);
										annotationStyleEditorPanel.show();
									}
								}
							}
						},
						{width: 10},
						{
							view: "template",
							id: annotationStyleEditorStrokeButtonId,
							width: 120,
							height: 30,
							template: `<button class="annotation-style-button annotation-stroke-button" style="width: 100%; height: 100%; background-color: ${strokeColor.toCSS(true)};">
								<span style="font-weight: bold; color: ${contrastingStrokeColor};">Stroke Color</span>
							</button>`,
							onClick: {
								"annotation-style-button": (ev, id) => {
									const annotationStyleEditorPanel = webix.$$(annotationStyleEditorPanelId);
									if (annotationStyleEditorPanel) {
										state.currentState = state.STROKE;
										updateColors(item, type);
										annotationStyleEditorPanel?.show();
									}
								}
							}
						},
						{width: 10},
						{
							view: "button",
							label: "Close",
							width: 120,
							height: 30,
							on: {
								onItemClick() {
									destructPopup();
								},
								onHide() {
									destructPopup();
								}
							}
						}
					]
				},
				{
					id: annotationStyleEditorPanelId,
					hidden: true,
					cols: [
						{
							id: annotationStyleEditorColorPickerId,
							view: "colorpicker",
							value: "#FFFFFF",
							name: "colorPicker",
						},
						{
							id: annotationStyleEditorOpacitySliderId,
							view: "slider",
							name: "opacity",
							title: webix.template("#value#"),
							min: 0,
							max: 1,
							step: 0.01,
							value: opacity,
						},
						{
							id: annotationStyleEditorApplyButtonId,
							view: "button",
							label: "Apply",
							width: 110,
							height: 30,
							click: () => {
								const colorPicker = webix.$$(annotationStyleEditorColorPickerId);
								if (!colorPicker) {
									webix.message("Color picker not found");
									return;
								}
								const opacitySlider = webix.$$(annotationStyleEditorOpacitySliderId);
								if (!opacitySlider) {
									webix.message("Opacity slider not found");
									return;
								}
								const editorFillButton = webix.$$(annotationStyleEditorFillButtonId);
								if (!editorFillButton) {
									webix.message("Fill button not found");
									return;
								}
								const editorStrokeButton = webix.$$(annotationStyleEditorStrokeButtonId);
								if (!editorStrokeButton) {
									webix.message("Stroke button not found");
									return;
								}
								const backgroundColor = colorPicker.getValue();
								const fontColor = getContrastFromHex(backgroundColor);
								if (state.currentState === state.FILL) {
									editorFillButton.define("template", `<button class="annotation-style-button annotation-fill-button" style="width: 100%; height: 100%; background-color: ${backgroundColor};">
								<span style="font-weight: bold; color: ${fontColor};">Fill Color</span>
							</button>`);
									editorFillButton.refresh();
								}
								else if (state.currentState === state.STROKE) {
									editorStrokeButton.define("template", `<button class="annotation-style-button annotation-stroke-button" style="width: 100%; height: 100%; background-color: ${backgroundColor};">
								<span style="font-weight: bold; color: ${fontColor};">Stroke Color</span>
							</button>`);
									editorStrokeButton.refresh();
								}
								const annotationStyleEditorPanel = webix.$$(annotationStyleEditorPanelId);
								if (annotationStyleEditorPanel) {
									annotationStyleEditorPanel.hide();
								}
							}
						}
					]
				}
			]
		},
		borderless: true,
	};
	return config;
}

function attachEvents(item, type) {
	const popup = webix.$$(popupId);
	if (!popup) {
		webix.message("Popup not found");
		return;
	}
	const events = {
		opacitySliderChangeEvent: null,
		colorChangeEvent: null,
	};

	popup.attachEvent("onShow", () => {
		const colorPicker = webix.$$(annotationStyleEditorColorPickerId);
		if (!colorPicker) {
			webix.message("Color picker not found");
			return;
		}
		const opacitySlider = webix.$$(annotationStyleEditorOpacitySliderId);
		if (!opacitySlider) {
			webix.message("Opacity slider not found");
			return;
		}
		if (!events.opacitySliderChangeEvent) {
			events.opacitySliderChangeEvent = opacitySlider.attachEvent("onChange", (newValue) => {
				switch (type) {
					case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.FEATURE: {
						if (state.currentState === state.FILL) {
							item.style.fillColor.setAlpha(newValue);
						}
						else if (state.currentState === state.STROKE) {
							item.style.strokeColor.setAlpha(newValue);
						}
						break;
					}
					case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
						if (state.currentState === state.FILL) {
							item.defaultStyle.fillColor.setAlpha(newValue);
						}
						else if (state.currentState === state.STROKE) {
							item.defaultStyle.strokeColor.setAlpha(newValue);
						}
						break;
					}
					case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
						const project = annotationAppState.project;
						if (state.currentState === state.FILL) {
							project.defaultStyle.fillColor.setAlpha(newValue);
						}
						else if (state.currentState === state.STROKE) {
							project.defaultStyle.strokeColor.setAlpha(newValue);
						}
						break;
					}
					default:
						break;
				}
			});
		}

		if (!events.colorChangeEvent) {
			events.colorChangeEvent = colorPicker.attachEvent("onChange", (newColor) => {
				switch (type) {
					case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.FEATURE: {
						if (state.currentState === state.FILL) {
							item.style.fillColor = newColor;
						}
						else if (state.currentState === state.STROKE) {
							item.style.strokeColor = newColor;
						}
						break;
					}
					case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
						if (state.currentState === state.FILL) {
							item.defaultStyle.fillColor = newColor;
						}
						else if (state.currentState === state.STROKE) {
							item.defaultStyle.strokeColor = newColor;
						}
						break;
					}
					case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
						const project = annotationAppState.project;
						if (state.currentState === state.FILL) {
							project.defaultStyle.fillColor = newColor;
						}
						else if (state.currentState === state.STROKE) {
							project.defaultStyle.strokeColor = newColor;
						}
						break;
					}
					default:
						break;
				}
			});
		}
	});
	popup.attachEvent("onDestruct", () => {
		if (events.opacitySliderChangeEvent) {
			const opacitySlider = webix.$$(annotationStyleEditorOpacitySliderId);
			opacitySlider?.detachEvent(events.opacitySliderChangeEvent);
		}
		if (events.colorChangeEvent) {
			const colorPicker = webix.$$(annotationStyleEditorColorPickerId);
			colorPicker?.detachEvent(events.colorChangeEvent);
		}
	});
}

function getContrastFromRGB(r, g, b) {
	const yiq = ((r * 255) * 299 + (g * 255) * 587 + (b * 255) * 114) / 1000;
	return yiq >= 128 ? "black" : "white";
}

function getContrastFromHex(hex) {
	const r = parseInt(hex.slice(1, 3), 16) / 255;
	const g = parseInt(hex.slice(3, 5), 16) / 255;
	const b = parseInt(hex.slice(5, 7), 16) / 255;
	return getContrastFromRGB(r, g, b);
}

function updateColors(item, type) {
	const colorPicker = webix.$$(annotationStyleEditorColorPickerId);
	if (!colorPicker) {
		webix.message("Color picker not found");
		return;
	}
	const opacitySlider = webix.$$(annotationStyleEditorOpacitySliderId);
	if (!opacitySlider) {
		webix.message("Opacity slider not found");
		return;
	}
	const currentState = state.currentState;
	if (currentState === state.FILL) {
		const fillColor = getFillColor(item, type);
		const hexColor = fillColor.toCSS(true);
		const opacity = getOpacity(
			item,
			type,
			annotationConstants.ANNOTATION_PAPERJS_STYLE_ELEMENTS.FILL
		);
		colorPicker.setValue(hexColor);
		opacitySlider.setValue(opacity);
	}
	else if (currentState === state.STROKE) {
		const strokeColor = getStrokeColor(item, type);
		const hexColor = strokeColor.toCSS(true);
		const opacity = getOpacity(
			item,
			type,
			annotationConstants.ANNOTATION_PAPERJS_STYLE_ELEMENTS.STROKE
		);
		colorPicker.setValue(hexColor);
		opacitySlider.setValue(opacity);
	}
	else {
		webix.message("Unknown type");
	}
}

function destructPopup() {
	const popup = webix.$$(popupId);
	if (popup) {
		popup.destructor();
	}
}

function isOpened() {
	const popup = webix.$$(popupId);
	if (popup) {
		return popup.isVisible();
	}
	return false;
}

function getFillColor(item, type) {
	switch (type) {
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
			return item.defaultStyle.fillColor.clone();
		}
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.FEATURE: {
			return item.style.fillColor.clone();
		}
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
			const project = annotationAppState.project;
			return project ? project.defaultStyle.fillColor.clone() : null;
		}
		default:
			return null;
	}
}

function getStrokeColor(item, type) {
	switch (type) {
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
			return item.defaultStyle.strokeColor.clone();
		}
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.FEATURE: {
			return item.style.strokeColor.clone();
		}
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
			const project = annotationAppState.project;
			return project ? project.defaultStyle.strokeColor.clone() : null;
		}
		default:
			return null;
	}
}

function getOpacity(item, type, style) {
	switch (type) {
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
			switch (style) {
				case annotationConstants.ANNOTATION_PAPERJS_STYLE_ELEMENTS.FILL: {
					return item.defaultStyle.fillColor.alpha;
				}
				case annotationConstants.ANNOTATION_PAPERJS_STYLE_ELEMENTS.STROKE: {
					return item.defaultStyle.strokeColor.alpha;
				}
				default:
					return null;
			}
		}
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.FEATURE: {
			switch (style) {
				case annotationConstants.ANNOTATION_PAPERJS_STYLE_ELEMENTS.FILL: {
					return item.style.fillColor.alpha;
				}
				case annotationConstants.ANNOTATION_PAPERJS_STYLE_ELEMENTS.STROKE: {
					return item.style.strokeColor.alpha;
				}
				default:
					return null;
			}
		}
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
			switch (style) {
				case annotationConstants.ANNOTATION_PAPERJS_STYLE_ELEMENTS.FILL: {
					const project = annotationAppState.project;
					return project ? project.defaultStyle.fillColor.alpha : null;
				}
				case annotationConstants.ANNOTATION_PAPERJS_STYLE_ELEMENTS.STROKE: {
					const project = annotationAppState.project;
					return project ? project.defaultStyle.strokeColor.alpha : null;
				}
				default:
					return null;
			}
		}
		default:
			return null;
	}
}

export default {
	getConfig,
	attachEvents,
	destructPopup,
	isOpened,
};
