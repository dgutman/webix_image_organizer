// import BrushTool from "./osd-paperjs-annotation/papertools/brush";
import DefaultTool from "./osd-paperjs-annotation/papertools/default";
import EllipseTool from "./osd-paperjs-annotation/papertools/ellipse";
// import LinestringTool from "./osd-paperjs-annotation/papertools/linestring";
// import PointTool from "./osd-paperjs-annotation/papertools/point";
// import PointTextTool from "./osd-paperjs-annotation/papertools/pointtext";
import PolygonTool from "./osd-paperjs-annotation/papertools/polygon";
// import {RasterTool} from "./osd-paperjs-annotation/papertools/raster";
import RectangleTool from "./osd-paperjs-annotation/papertools/rectangle";
import SelectTool from "./osd-paperjs-annotation/papertools/select";
// import {StyleTool} from "./osd-paperjs-annotation/papertools/style";
// import {TransformTool} from "./osd-paperjs-annotation/papertools/transform";
// import {WandTool} from "./osd-paperjs-annotation/papertools/wand";
import constants from "../../../../../constants";


export default class PaperJSTools {
	constructor(app, tk, toolbarControls) {
		this.paperScope = tk?.overlay.paperScope;
		this.currentMode = null;
		this.setModelTimeout = null;
		this.tools = {};

		this.toolConstructors = {};
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.default] = DefaultTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.rectangle] = RectangleTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.ellipse] = EllipseTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.polygon] = PolygonTool;
		this.toolConstructors[constants.ANNOTATION_TOOL_IDS.select] = SelectTool;
		// TODO: implement other tools
		// this.toolConstructors[constants.ANNOTATION_TOOLS_IDS.brush] = Brush;
		// this.toolConstructors[constants.ANNOTATION_TOOLS_IDS.linestring] = LinestringTool;
		// this.toolConstructors[constants.ANNOTATION_TOOLS_IDS.point] = PointTool;
		// this.toolConstructor[constants.ANNOTATION_TOOLS_IDS.text] = PointTextTool;
		// this.toolConstructors[constants.ANNOTATION_TOOLS_IDS.raster] = RasterTool;
		let toolsToUse = Object.keys(this.toolConstructors);
		toolsToUse.forEach((toolName) => {
			if (!this.toolConstructors[toolName]) {
				console.warn(`The requested tool is invalid: ${toolName}. No constructor found for that name.`);
				return;
			}

			const toolbarControl = toolbarControls[toolName];
			let toolObj = new this.toolConstructors[toolName](this.paperScope, toolbarControl);
			this.tools[toolName] = toolObj;
		});

		// this.setMode();

		// items emit events on the paper project; add listeners to update the toolbar status as needed
		this.paperScope.project.on({
			"item-replaced": () => {
				app.callEvent("rightPanelEvents-updateLayer");
				console.log("item-replaced");
				this.setMode();
			},

			"item-selected": () => {
				app.callEvent("rightPanelEvents-updateLayer");
				console.log("item-selected");
				this.setMode();
			},

			"item-deselected": () => {
				app.callEvent("rightPanelEvents-updateLayer");
				console.log("item-deselected");
				this.setMode();
			},

			"item-removed": () => {
				app.callEvent("rightPanelEvents-updateLayer");
				console.log("item-removed");
				this.setMode();
			},

			"items-changed": () => {
				app.callEvent("rightPanelEvents-updateLayer");
				console.log("item-changed");
				this.setMode();
			},

			"item-created": () => {
				app.callEvent("rightPanelEvents-updateLayer");
				console.log("item-created");
			}
		});
	}

	setMode() {
		let self = this;
		if (this.setModeTimeout) {
			clearTimeout(this.setTimeout);
		}
		this.setModeTimeout = setTimeout(() => {
			this.setModeTimeout = null;
			let selection = this.paperScope.project ? this.paperScope.findSelectedItems() : [];
			let activeTool = this.paperScope.getActiveTool();
			if (selection.length === 0) {
				this.currentMode = "select";
			}
			else if (selection.length === 1) {
				const item = selection[0];
				const def = item.annotationItem || {};
				let type = def.type;
				if (def.subtype) type += `:${def.subtype}`;
				let mode = type === null ? "new" : type;
				this.currentMode = mode;
			}
			else {
				this.currentMode = "multiselection";
			}

			if (activeTool) {
				activeTool.selectionChanged();
			}
		}, 0);
	}

	detachEvents() {
		const toolsNames = Object.keys(this.tools);
		toolsNames.forEach((name) => {
			this.tools[name].detachEvents();
		});
	}
}
