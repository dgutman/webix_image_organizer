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
};

function getConfig(item, elementName, fill, stroke) {
	const config = {
		view: "popup",
		id: popupId,
		height: 80,
		width: 700,
		body: {
			height: 60,
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
							id: annotationStyleEditorFillButtonId,
							width: 100,
							view: "button",
							label: "Fill",
							style: `background-color: ${fill}; color: contrast(${fill});`,
							on: {
								onItemClick() {
									// TODO: implement
									state.currentState = state.FILL;
								}
							}
						},
						{
							id: annotationStyleEditorStrokeButtonId,
							width: 100,
							view: "button",
							label: "Stroke",
							style: `background-color: ${stroke}; color: contrast(${stroke});`,
							on: {
								onItemClick() {
									// TODO: implement
									state.currentState = state.STROKE;
									const annotationStyleEditorPanel = $$(annotationStyleEditorPanelId);
									if (annotationStyleEditorPanel) {
										annotationStyleEditorPanel.show();
									}
								}
							}
						},
						{
							view: "button",
							label: "Close",
							width: 100,
							on: {
								onItemClick() {
									const popup = $$(popupId);
									if (popup) {
										popup.hide();
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
							min: 0,
							max: 1,
							step: 0.01,
							value: 1,
						},
						{
							id: annotationStyleEditorApplyButtonId,
							view: "button",
							label: "Apply",
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
								const opacity = opacitySlider.getValue();
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

export default {
	getConfig,
};
