import AnnotationTool from "./annotationTool";
import {Point} from "../paperitems/point";

export default class PointTool extends AnnotationTool {
	constructor(paperScope, toolControl) {
		super(paperScope, toolControl);
		let tool = this.tool;
		let self = this;
		let dragging = false;

		let cursor = new Point({geometry: {type: "Point", coordinates: [0, 0]}, properties: {label: "Point Tool"}}).paperItem;
		cursor.fillColor = null;
		cursor.strokeColor = "grey";
		cursor.visible = false;
		// remove this field since this isn't really part of the GeoJSON structure
		delete cursor.isGeoJSONFeature;

		this.project.toolLayer.addChild(cursor);

		this.setToolbarControl(toolControl);

		this.extensions.onActivate = function () {
			// self.project.paperScope.project.activeLayer.addChild(cursor);
			self.project.toolLayer.bringToFront();
			if (self.itemToCreate) cursor.visible = true;
		};

		this.extensions.onDeactivate = function () {
			self.project.toolLayer.sendToBack();
			// self.project.toolLayer.addChild(cursor);
			cursor.visible = false;
			self.project.overlay.removeClass("point-tool-grab", "point-tool-grabbing");
		};

		this.onSelectionChanged = function () {
			cursor.visible = !!this.itemToCreate;
		};

		tool.onMouseMove = function (ev) {
			cursor.position = ev.point;
			if (ev.item && self.item.hitTest(ev.point)) {
				self.project.overlay.addClass("point-tool-grab");
			}
			else {
				self.project.overlay.removeClass("point-tool-grab");
			}
		};

		tool.onMouseDown = function (ev) {
			if (self.itemToCreate) {
				self.itemToCreate.initializeGeoJSONFeature("Point");
				self.refreshItems();
				self.item.position = ev.point;
				cursor.visible = false;
				// self.toolbarControl.updateInstructions("Point");
			}
			else if (self.item && self.item.hitTest(ev.point)) {
				dragging = true;
				self.project.overlay.addClass("point-tool-grabbing");
			}
		};

		tool.onMouseDrag = function (ev) {
			if (dragging) {
				if (self.item) {
					self.item.position = self.item.position.add(ev.delta);
				}
			}
		};

		tool.onMouseUp = function (/* ev */) {
			dragging = false;
			self.project.overlay.removeClass("point-tool-grabbing");
			self.project.paperScope.project.emit("item-created");
		};
	}
}
