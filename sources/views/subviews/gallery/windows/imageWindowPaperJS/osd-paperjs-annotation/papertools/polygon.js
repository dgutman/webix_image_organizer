import AnnotationTool from "./annotationTool";

export default class PolygonTool extends AnnotationTool {
	constructor(paperScope, toolControl) {
		super(paperScope, toolControl);
		const self = this;
		const tool = this.tool;
		let lastClickTime = 0;
		this.drawingGroup = new paper.Group();
		self.project.toolLayer.addChild(self.drawingGroup);
		self.drawingGroup.visible = false;
		this.draggingSegment = null;
		this.eraseMode = false;
		this.simplifying = null;
		this.simplifier = new SimplifyJS();

		this.extensions.onActivate = () => {
			tool.minDistance = 4 / self.project.getZoom();
			tool.maxDistance = 20 / self.project.getZoom();
			self.drawingGroup.visible = true;
			self.drawingGroup.selected = true;
		};

		this.extensions.onDeactivate = (finished) => {
			if (finished) {
				// TODO: implement finished
				// self.finished();
			}
		};

		tool.onMouseDown = (ev) => {
			self.draggingSegment = null;
			const now = Date.now();
			const interval = now - lastClickTime;
			const dblClick = interval < 300;
			lastClickTime = now;

			if (self.simplifying) {
				self.cancelSimplify();
			}

			if (self.itemToCreate) {
				self.itemToCreate.initializeGeoJSONFeature("MultiPolygon");
				self.refreshItems();
				self.saveHistory();
			}

			const dr = self.drawing();
			if (dr && dblClick) {
				self.finishCurrentPath();
				self.draggingSegment = null;
				return;
			}

			const hitResult = (dr?.path || self.item)
				.hitTest(
					ev.point,
					{
						fill: false,
						stroke: true,
						segments: true,
						tolerance: 5 / self.project.getZoom()
					}
				);

			if (hitResult) {
				if (hitResult.type === "segment" && self.eraseMode) {
					hitResult.segment.remove();
				}
				else if (hitResult.type === "segment") {
					self.draggingSegment = hitResult.segment;
				}
				else if (hitResult.type === "stroke") {
					const insertIndex = hitResult.location.index + 1;
					hitResult.item.insert(insertIndex, ev.point);
				}
			}
			else if (dr) {
				if (ev.point.subtract(dr.path.lastSegment).length < (5 / self.project.getZoom())) return;
				dr.path.add(ev.point);
			}
			else {
				self.drawingGroup.removeChildren();
				self.drawingGroup.addChild(new paper.Path([ev.point]));
				self.drawingGroup.visible = true;
				self.drawingGroup.selected = true;
				self.drawingGroup.selectedColor = self.eraseMode ? "red" : null;
			}
		};

		tool.onMouseDrag = (ev) => {
			const dr = self.drawing();
			if (dr) {
				dr.path.add(ev.point);
			}
			else if (self.draggingSegment) {
				self.draggingSegment.point = self.draggingSegment.point.add(ev.delta);
			}
		};

		tool.onMouseMove = (ev) => {
			const dr = self.drawing();
			const hitResult = self.item && (dr?.path || self.item)
				.hitTest(
					ev.point,
					{
						fill: false,
						stroke: true,
						segments: true,
						tolerance: 5 / self.project.getZoom()
					}
				);
			if (hitResult) {
				const action = `${hitResult.type}${self.eraseMode ? "-erase" : ""}`;
				self.project.overlay.addClass("tool-action").setAttribute("data-tool-action", action);
			}
			else {
				self.project.overlay.removeClass("tool-action").setAttribute("data-tool-action", "");
			}
		};

		tool.onMouseUp = (ev) => {
			let dr = self.drawing();
			if (dr?.path?.segments?.length > 1) {
				const hitResult = dr?.path?.hitTest(
					ev.point,
					{
						fill: false,
						stroke: false,
						segments: true,
						tolerance: 5 / self.project.getZoom()
					}
				);
				if (hitResult && hitResult.segment === dr.path.firstSegment) {
					self.finishCurrentPath();
				}
			}
			else if (self.draggingSegment) {
				self.draggingSegment = null;
				if (!self.item.isBoundingElement) {
					let boundingItems = self.item.parent.children.filter(i => i.isBoundingElement);
					self.item.applyBounds(boundingItems);
				}
			}
			self.saveHistory();
			self.project.paperScope.project.emit("item-created");
		};

		tool.extensions.onKeyDown = (ev) => {
			if (ev.key === "e") {
				if (self.eraseMode === false) {
					self.setEraseMode(true);
				}
				else if (self.eraseMode === true) {
					self.eraseMode = "keyhold";
				}
			}

			if ((ev.event.metaKey || ev.event.ctrlKey) && !ev.event.shiftKey && ev.event.key === "z") {
				console.log("Undo!");
				self.undo();
			}
			if ((ev.event.metaKey || ev.event.ctrlKey) && ev.event.shiftKey && ev.event.key === "z") {
				console.log("Redo!");
				self.redo();
			}
		};

		tool.extensions.onKeyUp = (ev) => {
			if (ev.key === "e" && self.eraseMode === "keyhold") {
				self.setEraseMode(false);
			}
		};
	}

	drawing() {
		return this.drawingGroup.lastChild && {
			path: this.drawingGroup.lastChild
		};
	}

	finish() {
		this.finishCurrentPath();
		this.setEraseMode(false);
		this.draggingSegment = null;
		this.project.overlay.removeClass("tool-action").setAttribute("data-tool-action", "");
		this.deactivate();
		this.drawingGroup.selected = false;
		this.drawingGroup.visible = false;
	}

	doSimplify() {
		if (!this.item) return;

		const lengthThreshold = 10 / this.project.getZoom();
		const tol = 2.5 / this.project.getZoom();
		this.simplifying = this.simplifying || this.item.clone();
		this.simplifying.item = this.item;
		this.drawingGroup.insertChild(this.simplifying, 0);
		const pathsToRemove = [];
		this.simplifying.children.forEach((path) => {
			const pts = path.segments.map((s) => {
				if (
					s.point.subtract(s.previous.point).length < lengthThreshold
					&& s.point.subtract(s.next.point).length < lengthThreshold
				) {
					s.point.x = (s.point.x + s.previous.point.x + s.next.point.x) / 3;
					s.point.y = (s.point.y + s.previous.point.y + s.next.point.y) / 3;
				}
				return s.point;
			});
			pts.push(pts[0]);//
			let newpts = this.simplifier.simplify(pts, tol, true);
			path.segments = newpts;
			if (path.segments.length < 3 || Math.abs(path.area) < tol * tol) {
				pathsToRemove.push(path);
			}
		});
		pathsToRemove.forEach(p => p.remove());
		let united = this.simplifying
			.unite(this.simplifying, {insert: false})
			.reduce()
			.toCompoundPath();
		this.simplifying.removeChildren();
		this.simplifying.addChildren(united.children);
		if (!this.item.isBoundingElement) {
			let boundingItems = this.item.parent.children.filter(i => i.isBoundingElement);
			this.simplifying.applyBounds(boundingItems);
		}
		united.remove();
		this.simplifying.item.removeChildren();
		this.simplifying.item.addChildren(this.simplifying.children);
		this.simplifying.remove();
		this.simplifying = null;
		this.saveHistory();
	}

	setEraseMode(erase) {
		this.eraseMode = erase;
		if (this.item) {
			this.item.selectedColor = erase ? "red" : null;
		}
		this.drawingGroup.selectedColor = erase ? "red" : null;
		// TODO: write function
		this.toolbarControl.setEraseMode(erase);
	}

	finishCurrentPath() {
		let dr = this.drawing();
		if (!dr || !this.item) return;
		dr.path.closed = true;
		let result = this.eraseMode
			? this.item.subtract(dr.path, {insert: false})
			: this.item.unite(dr.path, {insert: false});
		if (result) {
			result = result.toCompoundPath();
			if (!this.item.isBoundingElement) {
				let boundingItems = this.item.parent.children.filter(i => i.isBoundingElement);
				result.applyBounds(boundingItems);
			}
			this.item.removeChildren();
			this.item.addChildren(result.children);
			this.item.children.forEach((child) => {
				child.selected = false;
			});
			result.remove();
		}
		this.drawingGroup.removeChildren();
	}

	saveHistory() {
		const historyLength = 10;
		let idx = (this.item.history || []).position || 0;
		this.item.history = [{
			children: this.item.children.map(x => x.clone({insert: false, deep: true})),
			drawingGroup: this.drawingGroup.children.map(x => x.clone({insert: false, deep: true}))
		}].concat((this.item.history || []).slice(idx, historyLength));
	}

	undo() {
		console.log("undoing");
		const history = (this.item.history || []);
		let idx = (history.position || 0) + 1;
		if (idx < history.length) {
			this.drawingGroup.removeChildren();
			this.item.removeChildren();
			this.item.children = history[idx].children.map(
				x => x.clone({insert: true, deep: true})
			);
			this.drawingGroup.children = history[idx].drawingGroup.map(
				x => x.clone({insert: true, deep: true})
			);
			history.position = idx;
		}
	}

	redo() {
		console.log("redoing");
		let history = (this.item.history || []);
		let idx = (history.position || 0) - 1;
		if (idx >= 0) {
			this.drawingGroup.removeChildren();
			this.item.removeChildren();
			this.item.children = history[idx].children.map(
				x => x.clone({insert: true, deep: true})
			);
			this.drawingGroup.children = history[idx].drawingGroup.map(
				x => x.clone({insert: true, deep: true})
			);
			history.position = idx;
		}
	}
}

class SimplifyJS {
	/*
	Based on:
		Simplify.js, a high-performance JS polyline simplification library
		mourner.github.io/simplify-js
		License: BSD
		Copyright (c) 2017, Vladimir Agafonkin
		All rights reserved.

		Redistribution and use in source and binary forms, with or without modification, are
		permitted provided that the following conditions are met:

		1. Redistributions of source code must retain the above copyright notice, this list of
			conditions and the following disclaimer.

		2. Redistributions in binary form must reproduce the above copyright notice, this list
			of conditions and the following disclaimer in the documentation and/or other materials
			provided with the distribution.

		THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
		EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
		MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
		COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
		EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
		SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
		HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
		TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
		SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	getSqDist(p1, p2) {
		// square distance between 2 points
		let dx = p1.x - p2.x;
		let dy = p1.y - p2.y;

		return dx * dx + dy * dy;
	}

	getSqSegDist(p, p1, p2) {
		// square distance from a point to a segment
		let x = p1.x;
		let y = p1.y;
		let dx = p2.x - x;
		let dy = p2.y - y;

		if (dx !== 0 || dy !== 0) {
			let t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

			if (t > 1) {
				x = p2.x;
				y = p2.y;
			// eslint-disable-next-line brace-style
			} else if (t > 0) {
				x += dx * t;
				y += dy * t;
			}
		}

		dx = p.x - x;
		dy = p.y - y;

		return dx * dx + dy * dy;
	}

	simplifyRadialDist(points, sqTolerance) {
		// basic distance-based simplification
		let prevPoint = points[0];
		let newPoints = [prevPoint];
		let point;

		for (let i = 1, len = points.length; i < len; i++) {
			point = points[i];

			if (this.getSqDist(point, prevPoint) > sqTolerance) {
				newPoints.push(point);
				prevPoint = point;
			}
		}

		if (prevPoint !== point) newPoints.push(point);

		return newPoints;
	}

	simplifyDPStep(points, first, last, sqTolerance, simplified) {
		let maxSqDist = sqTolerance;
		let index;

		for (let i = first + 1; i < last; i++) {
			let sqDist = this.getSqSegDist(points[i], points[first], points[last]);

			if (sqDist > maxSqDist) {
				index = i;
				maxSqDist = sqDist;
			}
		}

		if (maxSqDist > sqTolerance) {
			if (index - first > 1) this.simplifyDPStep(points, first, index, sqTolerance, simplified);
			simplified.push(points[index]);
			if (last - index > 1) this.simplifyDPStep(points, index, last, sqTolerance, simplified);
		}
	}

	// simplification using Ramer-Douglas-Peucker algorithm
	simplifyDouglasPeucker(points, sqTolerance) {
		let last = points.length - 1;

		let simplified = [points[0]];
		this.simplifyDPStep(points, 0, last, sqTolerance, simplified);
		simplified.push(points[last]);

		return simplified;
	}

	// both algorithms combined for awesome performance
	simplify(points, tolerance, highestQuality) {
		if (points.length <= 2) return points;

		let sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

		points = highestQuality ? points : this.simplifyRadialDist(points, sqTolerance);
		points = this.simplifyDouglasPeucker(points, sqTolerance);

		return points;
	}
}

