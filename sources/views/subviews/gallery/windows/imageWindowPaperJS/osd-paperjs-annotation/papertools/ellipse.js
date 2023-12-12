import AnnotationTool from "./annotationTool";

export default class EllipseTool extends AnnotationTool {
	constructor(paperScope, toolControl) {
		super(paperScope, toolControl);
		const self = this;
		let crosshairTool = new paper.Group({visible: false});
		let h1 = new paper.Path({segments: [new paper.Point(0, 0), new paper.Point(0, 0)], strokeScaling: false, strokeWidth: 1, strokeColor: "black"});
		let h2 = new paper.Path({segments: [new paper.Point(0, 0), new paper.Point(0, 0)], strokeScaling: false, strokeWidth: 1, strokeColor: "white", dashArray: [6, 6]});
		let v1 = new paper.Path({segments: [new paper.Point(0, 0), new paper.Point(0, 0)], strokeScaling: false, strokeWidth: 1, strokeColor: "black"});
		let v2 = new paper.Path({segments: [new paper.Point(0, 0), new paper.Point(0, 0)], strokeScaling: false, strokeWidth: 1, strokeColor: "white", dashArray: [6, 6]});
		crosshairTool.addChildren([h1, h2, v1, v2]);
		this.project.toolLayer.addChild(crosshairTool);

		this.mode = null;
		this.creating = null;

		this.setToolbarControl(toolControl);

		this.tool.onMouseDown = function (ev) {
			if (self.itemToCreate) {
				self.itemToCreate.initializeGeoJSONFeature("Point", "Ellipse");
				self.refreshItems();

				const r = new paper.Path.Ellipse(ev.point, ev.point);
				self.creating = r;
				self.item.removeChildren();
				self.item.addChild(r);
				self.mode = "creating";
			}
			else if (self.item && self.item.hitTest(
				ev.point,
				{
					fill: false,
					stroke: false,
					segments: true,
					tolerance: 5 / self.project.getZoom()
				}
			)) {
				const result = self.item.hitTest(
					ev.point,
					{
						fill: false,
						stroke: false,
						segments: true,
						tolerance: 5 / self.project.getZoom()
					}
				);
				if (result) {
					self.mode = "segment-drag";
					const idx = result.segment.path.segments.indexOf(result.segment);
					const oppositeIdx = (idx + 2) % result.segment.path.segments.length;
					self.points = {
						opposite: result.segment.path.segments[oppositeIdx].point.clone(),
						drag: result.segment.point.clone(),
						p1: result.segment.next.point.clone(),
						p2: result.segment.previous.point.clone()
					};
				}
			}
		};

		this.tool.onMouseDrag = function (ev) {
			let currPt;
			let center = self.item.bounds.center;
			if (self.mode === "creating") {
				let angle = -self.item.view.getRotation();

				if (ev.modifiers.command || ev.modifiers.control) {
					let delta = ev.point.subtract(ev.downPoint);
					let axes = [
						[1, 1],
						[1, -1],
						[-1, -1],
						[-1, 1]
					].map(p => new paper.Point(p[0], p[1]).rotate(angle));
					let closestAxis = axes.sort((a, b) => a.dot(delta) - b.dot(delta))[0];
					let proj = delta.project(closestAxis);
					currPt = ev.downPoint.add(proj);
				}
				else {
					currPt = ev.point;
				}
				let r = new paper.Rectangle(
					ev.downPoint.rotate(-angle, center),
					currPt.rotate(-angle, center)
				);
				let ellipse = new paper.Path.Ellipse(r).rotate(angle);
				self.item.children[0].set({segments: ellipse.segments});
				ellipse.remove();
			}
			else if (self.mode === "segment-drag") {
				const dragdelta = ev.point.subtract(self.points.opposite);
				const axis = self.points.drag.subtract(self.points.opposite);
				const proj = dragdelta.project(axis);
				const angle = axis.angle;

				if (ev.modifiers.command || ev.modifiers.control) {
					// scale proportionally
					const scalefactor = proj.length / axis.length;
					const halfproj = proj.divide(2);
					const currentCenter = self.points.opposite.add(halfproj);
					const r1 = halfproj.length;
					const r2 = Math.abs(
						self.points.p1
							.subtract(self.points.opposite)
							.multiply(scalefactor)
							.cross(proj.normalize())
					);
					const ellipse = new paper.Path.Ellipse({center: currentCenter, radius: [r1, r2]})
						.rotate(angle);
					self.item.children[0].set({segments: ellipse.segments});
					ellipse.remove();
				}
				else {
					// scale in one direction only
					const halfproj = proj.divide(2);
					const currentCenter = self.points.opposite.add(halfproj);
					const r1 = halfproj.length;
					const r2 = Math.abs(
						self.points.p1
							.subtract(self.points.opposite)
							.cross(proj.normalize())
					);
					let ellipse = new paper.Path.Ellipse({center: currentCenter, radius: [r1, r2]})
						.rotate(angle);
					self.item.children[0].set({segments: ellipse.segments});
					ellipse.remove();
				}
			}
			else {
				setCursorPosition(this, ev.point);
				return;
			}
			setCursorPosition(this, currPt);
		};

		this.tool.onMouseMove = function (ev) {
			setCursorPosition(this, ev.point);
			if (self.mode === "modifying") {
				let hitResult = self.item.hitTest(
					ev.point,
					{
						fill: false,
						stroke: false,
						segments: true,
						tolerance: 5 / self.project.getZoom()
					}
				);
				if (hitResult) {
					self.project.overlay.addClass("rectangle-tool-resize");
				}
				else {
					self.project.overlay.removeClass("rectangle-tool-resize");
				}
			}
		};

		this.tool.onMouseUp = function () {
			self.mode = "modifying";
			crosshairTool.visible = false;
			self.creating = null;
			// self.toolbarControl.updateInstructions("Point:Ellipse");
		};
		const changeHandler = function () {
			if (self.itemToCreate) {
				self.mode = "creating";
				crosshairTool.visible = true;
				self.creating = null;// reset reference to actively creating item
				// self.toolbarControl.updateInstructions("new");
			}
			else if (self?.creating?.parent === self.item) {
				self.mode = "creating";
				crosshairTool.visible = true;
				// self.toolbarControl.updateInstructions("new");
			}
			else if (self.item) {
				self.creating = null;// reset reference to actively creating item
				self.mode = "modifying";
				crosshairTool.visible = false;
				// self.toolbarControl.updateInstructions("Point:Ellipse");
			}
			else {
				self.creating = null;// reset reference to actively creating item
				self.mode = null;
				crosshairTool.visible = false;
				// self.toolbarControl.updateInstructions("Point:Ellipse");
			}
		};
		this.extensions.onActivate = changeHandler;
		this.onSelectionChanged = changeHandler;
		this.extensions.onDeactivate = function (finished) {
			if (finished) self.creating = null;
			crosshairTool.visible = false;
			self.mode = null;
			self.project.overlay.removeClass("rectangle-tool-resize");
		};
		function setCursorPosition(tool, point) {
			// to do: account for view rotation
			// let viewBounds=tool.view.bounds;
			let pt = tool.view.projectToView(point);
			let left = tool.view.viewToProject(new paper.Point(0, pt.y));
			let right = tool.view.viewToProject(new paper.Point(tool.view.viewSize.width, pt.y));
			let top = tool.view.viewToProject(new paper.Point(pt.x, 0));
			let bottom = tool.view.viewToProject(new paper.Point(pt.x, tool.view.viewSize.height));
			// console.log(viewBounds)
			h1.segments[0].point = left;
			h2.segments[0].point = left;
			h1.segments[1].point = right;
			h2.segments[1].point = right;
			v1.segments[0].point = top;
			v2.segments[0].point = top;
			v1.segments[1].point = bottom;
			v2.segments[1].point = bottom;
		}
	}
}
