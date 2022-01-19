export default class MarkerService {
	constructor(osdView) {
		this._xmlns = "http://www.w3.org/2000/svg";
		this._oldMarkers = null;
		this._osdView = osdView;
		this._markersInfo = [];
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
}
