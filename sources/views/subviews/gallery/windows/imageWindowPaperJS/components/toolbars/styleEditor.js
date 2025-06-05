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
	const fillColor = item.style.fillColor;
	const strokeColor = item.style.strokeColor;
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
		view: "popup",
		id: popupId,
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
										annotationStyleEditorPanel.show();
									}
								}
							}
						},
						{width: 10},
						{
							view: "template",
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
									const popup = $$(popupId);
									if (popup) {
										popup.hide();
										popup.destructor();
									}
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
							value: 1,
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
								const color = colorPicker.getValue();
								if (state.currentState === state.FILL) {
									editorFillButton.define("style", `background-color: ${color}; color: contrast(${color});`);
									editorFillButton.refresh();
								}
								else if (state.currentState === state.STROKE) {
									editorStrokeButton.define("style", `background-color: ${color}; color: contrast(${color});`);
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

function attachEvents(type) {
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
			if (type === "group") {
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

export default {
	getConfig,
	attachEvents,
};
