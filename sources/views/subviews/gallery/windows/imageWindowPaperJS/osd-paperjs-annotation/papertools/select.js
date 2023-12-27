import AnnotationTool from "./annotationTool";

export default class SelectTool extends AnnotationTool {
	constructor(paperScope, toolControl) {
		super(paperScope, toolControl);
		const self = this;
		this.ps = this.project.paperScope;
		this.setToolbarControl(toolControl);

		let selectionRectangle = new paper.Path.Rectangle({
			strokeWidth: 1,
			rescale: {strokeWidth: 1},
			strokeColor: "black"
		});
		let sr2 = new paper.Path.Rectangle({
			strokeWidth: 1,
			dashArray: [10, 10],
			rescale: {strokeWidth: 1, dashArray: [10, 10]},
			strokeColor: "white"
		});
		this.project.toolLayer.addChild(selectionRectangle);
		this.project.toolLayer.addChild(sr2);
		selectionRectangle.applyRescale();
		sr2.applyRescale();
		selectionRectangle.visible = false;
		sr2.visible = false;

		this.extensions.onActivate = function () {
			self.tool.onMouseMove = ev => self.onMouseMove(ev);
		};
		this.extensions.onDeactivate = function (/* shouldFinish */) {
			self.project.overlay.removeClass("selectable-layer");
			self.tool.onMouseMove = null;
		};
		this.tool.extensions.onKeyUp = function (ev) {
			if (ev.key === "escape") {
				self.project.paperScope.findSelectedItems().forEach(item => item.deselect());
			}
		};

		this.tool.onMouseUp = function (ev) {
			selectionRectangle.visible = false;
			sr2.visible = false;
			if (ev.downPoint.subtract(ev.point).length === 0) {
				let hitResult = self.hitTestPoint(ev);
				if (hitResult) {
					hitResult.item.toggle(ev.modifiers.control || ev.modifiers.meta);
				}
			}
			else {
				let hitResults = self.hitTestArea(ev);
				let keepExistingSelection = ev.modifiers.control || ev.modifiers.meta;
				if (!keepExistingSelection) {
					self.project.paperScope.findSelectedItems().forEach(item => item.deselect());
				}
				hitResults.forEach(item => item.select(true));
			}
		};

		this.tool.onMouseDrag = function (ev) {
			selectionRectangle.visible = true;
			sr2.visible = true;
			let r = new paper.Rectangle(ev.downPoint, ev.point);
			selectionRectangle.set({
				segments: [
					r.topLeft,
					r.topRight,
					r.bottomRight,
					r.bottomLeft
				]
			});
			sr2.set({segments: [r.topLeft, r.topRight, r.bottomRight, r.bottomLeft]});
			// console.log(selectionRectangle.visible, selectionRectangle.segments)
		};
	}

	getSelectedItems() {
		return this.ps.project.selectedItems.filter(i => i.isGeoJSONFeature);
	}

	doAnnotationItemsExist() {
		return this.ps.project.getItems({match: i => i.isGeoJSONFeature}).length > 0;
	}

	onMouseMove(ev) {
		if (ev.item) {
			if (this.currentItem !== ev.item) ev.item.emit("selection:mouseenter");
			if (this.currentLayer !== ev.item.layer) ev.item.layer.emit("selection:mouseenter");
			this.currentItem = ev.item;
			this.currentLayer = this.currentItem.layer;
			this.project.overlay.addClass("selectable-layer");
		}
		else {
			if (this.currenItem) {
				this.currentItem.emit("selection:mouseleave", ev);
			}
			if (this.currentLayer) {
				this.currentLayer.emit("selection:mouseleave", ev);
			}
			this.project.overlay.removeClass("selectable-layer");
			this.currentItem = null;
			this.currentLayer = null;
		}
	}

	hitTestPoint(ev) {
		let hitResult = this.ps.project.hitTest(ev.point, {
			fill: true,
			stroke: true,
			segments: true,
			tolerance: 5 / this.project.getZoom(),
			match: i => i.item.isGeoJSONFeature || i.item.parent.isGeoJSONFeature
		});
		if (hitResult && !hitResult.item.isGeoJSONFeature) {
			hitResult.item = hitResult.item.parent;
		}
		return hitResult;
	}

	hitTestArea(ev, onlyFullyContained) {
		let options = {
			match: item => item.isGeoJSONFeature
		};
		let testRectangle = new paper.Rectangle(ev.point, ev.downPoint);
		if (onlyFullyContained) {
			options.inside = testRectangle;
		}
		else {
			options.overlapping = testRectangle;
		}
		let hitResult = this.ps.project.getItems(options);
		return hitResult;
	}
}
