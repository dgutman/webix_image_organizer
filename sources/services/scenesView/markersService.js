import OpenSeadragon from "openseadragon";

export default class MarkerService {
	constructor(osdView, controlView, layer) {
		this._xmlns = "http://www.w3.org/2000/svg";
		this._oldMarkers = null;
		this._osdView = osdView;
		this._markersInfo = [];
		this._controlView = controlView;
		this._layer = layer;
		this.attachEvents();
	}

	attachEvents() {
		const rotationSlider = this._controlView.$rotationSlider();
		rotationSlider.attachEvent("onSliderDragging", (val) => {
			this._rotateMarkers(val);
		});
	}

	createSVGElement(type, parent, attrs) {
		const node = document.createElementNS(this._xmlns, type);

		if (parent) {
			parent.appendChild(node);
		}

		if (attrs) {
			Object.keys(attrs).forEach((key) => {
				node.setAttribute(key, attrs[key]);
			});
		}

		return node;
	}

	updateMarkers(layer) {
		const osdView = this._osdView;

		if (!this._oldMarkers || !this._stringifyCompareArrays(this._oldMarkers, layer.markers)) {
			this._oldMarkers = webix.copy(layer.markers);

			const svgNode = osdView.svgOverlay().node();

			this._markersInfo.forEach((info) => {
				info.group.remove();
			});

			// Add markers
			this._markersInfo = layer.markers.map((marker, index) => {
				const pos = marker;
				const scaleFactor = 0.001;
				const size = 30;
				const halfSize = size * 0.5 * scaleFactor;
				const stroleWidth = 2 * scaleFactor;

				const group = this.createSVGElement("g", svgNode);

				this.createSVGElement("line", group, {
					x1: pos.x - halfSize,
					x2: pos.x + halfSize,
					y1: pos.y,
					y2: pos.y,
					stroke: "red",
					"stroke-width": stroleWidth
				});

				this.createSVGElement("line", group, {
					x1: pos.x,
					x2: pos.x,
					y1: pos.y - halfSize,
					y2: pos.y + halfSize,
					stroke: "red",
					"stroke-width": stroleWidth
				});

				const text = this.createSVGElement("text", group, {
					x: pos.x + halfSize * 0.5,
					y: pos.y - halfSize * 0.5,
					fill: "red",
					"font-size": halfSize
				});

				text.innerHTML = index + 1;

				const output = {
					group,
					pos
				};

				return output;
			});
		}
	}

	_stringifyCompareArrays(array1, array2) {
		return array1.length === array2.length && array1
			.every(item1 => array2.find(item2 => JSON.stringify(item1) === JSON.stringify(item2)));
	}

	_rotateMarkers(value) {
		const osdView = this._osdView;
		const svgNode = osdView.svgOverlay().node();

		this._markersInfo.forEach((info) => {
			info.group.remove();
		});

		this._markersInfo = this._layer.markers.map((marker, index) => {
			const pos = marker;
			const scaleFactor = 0.001;
			const size = 30;
			const halfSize = size * 0.5 * scaleFactor;
			const stroleWidth = 2 * scaleFactor;

			const group = this.createSVGElement("g", svgNode);

			const point = new OpenSeadragon.Point(pos.x, pos.y);
			const tiledImageBounds = this._layer.tiledImage.getBoundsNoRotate();
			const newPoint = point.rotate(
				value,
				{
					x: (tiledImageBounds.width - tiledImageBounds.x) / 2,
					y: (tiledImageBounds.height - tiledImageBounds.y) / 2
				}
			);
			const newPos = {x: newPoint.x, y: newPoint.y};

			this.createSVGElement("line", group, {
				x1: newPos.x - halfSize,
				x2: newPos.x + halfSize,
				y1: newPos.y,
				y2: newPos.y,
				stroke: "red",
				"stroke-width": stroleWidth
			});

			this.createSVGElement("line", group, {
				x1: newPos.x,
				x2: newPos.x,
				y1: newPos.y - halfSize,
				y2: newPos.y + halfSize,
				stroke: "red",
				"stroke-width": stroleWidth
			});

			const text = this.createSVGElement("text", group, {
				x: newPos.x + halfSize * 0.5,
				y: newPos.y - halfSize * 0.5,
				fill: "red",
				"font-size": halfSize
			});
			text.innerHTML = index + 1;

			const output = {
				group,
				newPos
			};

			return output;
		});
	}
}
