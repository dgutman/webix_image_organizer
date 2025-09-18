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
	oldStrokeColor: null,
	oldFillColor: null,
};

function getConfig(item, type) {
	const fillColor = getFillColor(item, type);
	const strokeColor = getStrokeColor(item, type);
	const opacity = item?.opacity || 1;
	const elementName = item
		? item?.displayName || "Unnamed element"
		: "Default style";
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
								"annotation-fill-button": (/* ev, id */) => {
									const annotationStyleEditorPanel = webix.$$(annotationStyleEditorPanelId);
									if (annotationStyleEditorPanel) {
										state.currentState = state.FILL;
										switch (type) {
											case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.FEATURE: {
												state.oldFillColor = item.style.fillColor.clone();
												break;
											}
											case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
												state.oldFillColor = item.defaultStyle.fillColor.clone();
												break;
											}
											case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
												const project = annotationAppState.project;
												state.oldFillColor = project.defaultStyle.fillColor.clone();
												break;
											}
											default:
												break;
										}
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
								"annotation-style-button": (/* ev, id */) => {
									const annotationStyleEditorPanel = webix.$$(annotationStyleEditorPanelId);
									if (annotationStyleEditorPanel) {
										state.currentState = state.STROKE;
										switch (type) {
											case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.FEATURE: {
												state.oldStrokeColor = item.style.strokeColor.clone();
												break;
											}
											case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
												state.oldStrokeColor = item.defaultStyle.strokeColor.clone();
												break;
											}
											case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
												const project = annotationAppState.project;
												state.oldStrokeColor = project.defaultStyle.strokeColor.clone();
												break;
											}
											default:
												break;
										}
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
							moveTitle: false,
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
									state.oldFillColor = null;
								}
								else if (state.currentState === state.STROKE) {
									editorStrokeButton.define("template", `<button class="annotation-style-button annotation-stroke-button" style="width: 100%; height: 100%; background-color: ${backgroundColor};">
								<span style="font-weight: bold; color: ${fontColor};">Stroke Color</span>
							</button>`);
									editorStrokeButton.refresh();
									state.oldStrokeColor = null;
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
		closeEvent: null,
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
							item.style.fillOpacity = newValue;
						}
						else if (state.currentState === state.STROKE) {
							item.style.strokeOpacity = newValue;
						}
						if (item.isGeoJSONFeature) {
							item.updateFillOpacity();
							item.updateStrokeOpacity();
						}
						item.emit("item-updated");
						break;
					}
					case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
						if (state.currentState === state.FILL) {
							item.defaultStyle.fillOpacity = newValue;
						}
						else if (state.currentState === state.STROKE) {
							item.defaultStyle.strokeOpacity = newValue;
						}
						if (item.isGeoJSONFeature) {
							item.updateFillOpacity();
							item.updateStrokeOpacity();
						}
						item.emit("item-updated");
						break;
					}
					case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
						const project = annotationAppState.project;
						if (state.currentState === state.FILL) {
							project.defaultStyle.fillOpacity = newValue;
						}
						else if (state.currentState === state.STROKE) {
							project.defaultStyle.strokeOpacity = newValue;
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
							const alpha = getAlpha(item, type, state.FILL);
							item.style.fillColor = newColor;
							item.style.fillColor.setAlpha(alpha);
						}
						else if (state.currentState === state.STROKE) {
							const opacity = getAlpha(item, type, state.STROKE);
							item.style.strokeColor = newColor;
							item.style.strokeColor.setAlpha(opacity);
						}
						break;
					}
					case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
						if (state.currentState === state.FILL) {
							const opacity = getAlpha(item, type, state.FILL);
							item.defaultStyle.fillColor = newColor;
							item.defaultStyle.fillColor.setAlpha(opacity);
						}
						else if (state.currentState === state.STROKE) {
							const opacity = getAlpha(item, type, state.STROKE);
							item.defaultStyle.strokeColor = newColor;
							item.defaultStyle.strokeColor.setAlpha(opacity);
						}
						break;
					}
					case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
						const project = annotationAppState.project;
						if (state.currentState === state.FILL) {
							const opacity = getAlpha(item, type, state.FILL);
							project.defaultStyle.fillColor = newColor;
							project.defaultStyle.fillColor.setAlpha(opacity);
						}
						else if (state.currentState === state.STROKE) {
							const opacity = getAlpha(item, type, state.STROKE);
							project.defaultStyle.strokeColor = newColor;
							project.defaultStyle.strokeColor.setAlpha(opacity);
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
		if (state.oldFillColor) {
			switch (type) {
				case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.FEATURE: {
					item.style.fillColor = state.oldFillColor;
					break;
				}
				case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
					item.defaultStyle.fillColor = state.oldFillColor;
					break;
				}
				case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
					const project = annotationAppState.project;
					project.defaultStyle.fillColor = state.oldFillColor;
					break;
				}
				default:
					break;
			}
			state.oldFillColor = null;
		}
		if (state.oldStrokeColor) {
			switch (type) {
				case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.FEATURE: {
					item.style.strokeColor = state.oldStrokeColor;
					break;
				}
				case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
					item.defaultStyle.strokeColor = state.oldStrokeColor;
					break;
				}
				case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
					const project = annotationAppState.project;
					project.defaultStyle.strokeColor = state.oldStrokeColor;
					break;
				}
				default:
					break;
			}
			state.oldStrokeColor = null;
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
		const opacity = getAlpha(
			item,
			type,
			state.FILL
		);
		colorPicker.setValue(hexColor);
		opacitySlider.setValue(opacity);
	}
	else if (currentState === state.STROKE) {
		const strokeColor = getStrokeColor(item, type);
		const hexColor = strokeColor.toCSS(true);
		const opacity = getAlpha(
			item,
			type,
			state.STROKE
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

function getAlpha(item, type, style) {
	switch (type) {
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.GROUP: {
			switch (style) {
				case state.FILL: {
					return item.defaultStyle.fillOpacity;
				}
				case state.STROKE: {
					return item.defaultStyle.strokeOpacity;
				}
				default:
					return null;
			}
		}
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.FEATURE: {
			switch (style) {
				case state.FILL: {
					return item.style.fillOpacity;
				}
				case state.STROKE: {
					return item.style.strokeOpacity;
				}
				default:
					return null;
			}
		}
		case annotationConstants.ANNOTATION_PAPERJS_ELEMENTS.DEFAULT: {
			switch (style) {
				case state.FILL: {
					const project = annotationAppState.project;
					return project ? project.defaultStyle.fillOpacity : null;
				}
				case state.STROKE: {
					const project = annotationAppState.project;
					return project ? project.defaultStyle.strokeOpacity : null;
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
