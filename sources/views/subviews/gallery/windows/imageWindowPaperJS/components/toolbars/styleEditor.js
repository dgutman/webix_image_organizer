import annotationConstants from "../../constants";

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
	const fillColor = type === annotationConstants.ANNOTATION_PAPERJS_TYPES.GROUP
		? item.defaultStyle.fillColor
		: item.style.fillColor;
	const strokeColor = type === annotationConstants.ANNOTATION_PAPERJS_TYPES.GROUP
		? item.defaultStyle.strokeColor
		: item.style.strokeColor;
	const opacity = item.opacity;
	const elementName = item.displayName;
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
							borderless: true,
							template: `<button class="annotation-style-button annotation-fill-button" style="width: 120px; height: 30px; background-color: rgb(${fillColor.red}, ${fillColor.green}, ${fillColor.blue});">
								<span style="font-weight: bold; color: ${contrastingFillColor};">Fill Color</span>
							</button>`,
							onClick: {
								"annotation-fill-button": (ev, id) => {
									const annotationStyleEditorPanel = $$(annotationStyleEditorPanelId);
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
							borderless: true,
							template: `<button class="annotation-style-button annotation-stroke-button" style="width: 120px; height: 30px; background-color: rgb(${strokeColor.red}, ${strokeColor.green}, ${strokeColor.blue});">
								<span style="font-weight: bold; color: ${contrastingStrokeColor};">Stroke Color</span>
							</button>`,
							onClick: {
								"annotation-style-button": (ev, id) => {
									const annotationStyleEditorPanel = $$(annotationStyleEditorPanelId);
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
							width: 120,
							height: 30,
							click: () => {
								const colorPicker = $$(annotationStyleEditorColorPickerId);
								if (!colorPicker) {
									webix.message("Color picker not found");
									return;
								}
								const opacitySlider = $$(annotationStyleEditorOpacitySliderId);
								if (!opacitySlider) {
									webix.message("Opacity slider not found");
									return;
								}
								const editorFillButton = $$(annotationStyleEditorFillButtonId);
								if (!editorFillButton) {
									webix.message("Fill button not found");
									return;
								}
								const editorStrokeButton = $$(annotationStyleEditorStrokeButtonId);
								if (!editorStrokeButton) {
									webix.message("Stroke button not found");
									return;
								}
								const backgroundColor = colorPicker.getValue();
								const fontColor = getContrastFromHex(backgroundColor);
								if (state.currentState === state.FILL) {
									editorFillButton.define("template", `<button class="annotation-style-button annotation-fill-button" style="width: 120px; height: 30px; background-color: ${backgroundColor};">
								<span style="font-weight: bold; color: ${fontColor};">Fill Color</span>
							</button>`);
									editorFillButton.refresh();
								}
								else if (state.currentState === state.STROKE) {
									editorStrokeButton.define("template", `<button class="annotation-style-button annotation-stroke-button" style="width: 120px; height: 30px; background-color: ${backgroundColor};">
								<span style="font-weight: bold; color: ${fontColor};">Stroke Color</span>
							</button>`);
									editorStrokeButton.refresh();
								}
								const annotationStyleEditorPanel = $$(annotationStyleEditorPanelId);
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
	const popup = $$(popupId);
	if (!popup) {
		webix.message("Popup not found");
		return;
	}
	const events = {
		opacitySliderChangeEvent: null,
	};

	popup.attachEvent("onShow", () => {
		const colorPicker = $$(annotationStyleEditorColorPickerId);
		if (!colorPicker) {
			webix.message("Color picker not found");
			return;
		}
		const opacitySlider = $$(annotationStyleEditorOpacitySliderId);
		if (!opacitySlider) {
			webix.message("Opacity slider not found");
			return;
		}
		events.opacitySliderChangeEvent = opacitySlider.attachEvent("onChange", (newValue) => {
			if (type === annotationConstants.ANNOTATION_PAPERJS_TYPES.GROUP) {
				if (state.currentState === state.FILL) {
					item.defaultStyle.fillColor.opacity = newValue;
				}
				item.defaultStyle.strokeColor.opacity = newValue;
			}
			else if (type === annotationConstants.ANNOTATION_PAPERJS_TYPES.FEATURE) {
				if (state.currentState === state.FILL) {
					item.style.fillColor.opacity = newValue;
				}
				item.style.strokeColor.opacity = newValue;
			}
		});
		events.colorChangeEvent = colorPicker.attachEvent("onChange", (newColor) => {
			const rgb = hexToRgb(newColor);
			if (type === annotationConstants.ANNOTATION_PAPERJS_TYPES.GROUP) {
				if (state.currentState === state.FILL) {
					item.defaultStyle.fillColor.red = rgb;
					item.defaultStyle.fillColor.green = rgb.g;
					item.defaultStyle.fillColor.blue = rgb.b;
				}
				else if (state.currentState === state.STROKE) {
					item.defaultStyle.strokeColor.red = rgb.r;
					item.defaultStyle.strokeColor.green = rgb.g;
					item.defaultStyle.strokeColor.blue = rgb.b;
				}
			}
			else if (type === annotationConstants.ANNOTATION_PAPERJS_TYPES.FEATURE) {
				if (state.currentState === state.FILL) {
					item.style.fillColor.red = rgb.r;
					item.style.fillColor.green = rgb.g;
					item.style.fillColor.blue = rgb.b;
				}
				else if (state.currentState === state.STROKE) {
					item.style.strokeColor.red = rgb.r;
					item.style.strokeColor.green = rgb.g;
					item.style.strokeColor.blue = rgb.b;
				}
			}
		});
	});
	popup.attachEvent("onDestruct", () => {
		if (events.opacitySliderChangeEvent) {
			const opacitySlider = $$(annotationStyleEditorOpacitySliderId);
			opacitySlider?.detachEvent(events.opacitySliderChangeEvent);
		}
	});
}

function getContrastFromRGB(r, g, b) {
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? "black" : "white";
}

function getContrastFromHex(hex) {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return getContrastFromRGB(r, g, b);
}

function hexToRgb(hex) {
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return {r, g, b};
}

function updateColors(item, type) {
	const colorPicker = $$(annotationStyleEditorColorPickerId);
	if (!colorPicker) {
		webix.message("Color picker not found");
		return;
	}
	const opacitySlider = $$(annotationStyleEditorOpacitySliderId);
	if (!opacitySlider) {
		webix.message("Opacity slider not found");
		return;
	}
	const currentState = state.currentState;
	if (type === annotationConstants.ANNOTATION_PAPERJS_TYPES.GROUP) {
		if (currentState === state.FILL) {
			const {r, g, b} = {
				r: item.defaultStyle.fillColor.red,
				g: item.defaultStyle.fillColor.green,
				b: item.defaultStyle.fillColor.blue,
			};
			const hexColor = rgbToHex(r, g, b);
			colorPicker.setValue(hexColor);
			opacitySlider.setValue(item.defaultStyle.fillColor.opacity);
		}
		else if (currentState === state.STROKE) {
			const {r, g, b} = {
				r: item.defaultStyle.strokeColor.red,
				g: item.defaultStyle.strokeColor.green,
				b: item.defaultStyle.strokeColor.blue,
			};
			const hexColor = rgbToHex(r, g, b);
			colorPicker.setValue(hexColor);
			opacitySlider.setValue(item.defaultStyle.strokeColor.opacity);
		}
	}
	else if (type === annotationConstants.ANNOTATION_PAPERJS_TYPES.FEATURE) {
		if (currentState === state.FILL) {
			const {r, g, b} = {
				r: item.style.fillColor.red,
				g: item.style.fillColor.green,
				b: item.style.fillColor.blue,
			};
			const hexColor = rgbToHex(r, g, b);
			colorPicker.setValue(hexColor);
			opacitySlider.setValue(item.style.fillColor.opacity);
		}
		else if (currentState === state.STROKE) {
			const {r, g, b} = {
				r: item.style.strokeColor.red,
				g: item.style.strokeColor.green,
				b: item.style.strokeColor.blue,
			};
			const hexColor = rgbToHex(r, g, b);
			colorPicker.setValue(hexColor);
			opacitySlider.setValue(item.style.strokeColor.opacity);
		}
	}
	else {
		webix.message("Unknown type");
	}
}

function componentToHex(c) {
	const hex = c.toString(16);
	return hex.length === 1 ? `0${hex}` : hex;
}

function rgbToHex(r, g, b) {
	return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function destructPopup() {
	const popup = $$(popupId);
	if (popup) {
		popup.destructor();
		console.log("styleEditor destructed");
	}
	else {
		console.log("styleeditor destruction failed");
	}
}

function isOpened() {
	const popup = $$(popupId);
	if (popup) {
		return popup.isVisible();
	}
	return false;
}

export default {
	getConfig,
	attachEvents,
	destructPopup,
	isOpened,
};
