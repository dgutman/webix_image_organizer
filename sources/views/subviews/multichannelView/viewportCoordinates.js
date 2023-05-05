import {JetView} from "webix-jet";

const VIEWPORT_COORDINATES_ID = `viewport-coordinates-id-${webix.uid()}`;
const VIEWPORT_ZOOM_ID = `viewport-coordinates-id-${webix.uid()}`;

export default class ViewportCoordinates extends JetView {
	constructor(app, config = {}) {
		super(app);

		this._cnf = config;
		this._template = null;
	}

	config() {
		return {
			rows: [
				{
					view: "template",
					localId: VIEWPORT_COORDINATES_ID,
					template: (obj) => {
						const objViewportPointX = typeof obj?.viewportPoint?.x === "number"
							? obj.viewportPoint.x.toFixed(2)
							: "Nan";
						const objViewportPointY = typeof obj?.viewportPoint?.y === "number"
							? obj.viewportPoint.y.toFixed(2)
							: "Nan";
						const objWebPointX = typeof obj?.webPoint?.x === "number"
							? obj.webPoint.x.toFixed(2)
							: "Nan";
						const objWebPointY = typeof obj?.webPoint?.y === "number"
							? obj.webPoint.y.toFixed(2)
							: "Nan";
						const objImagePointX = typeof obj?.imagePoint?.x === "number"
							? obj.imagePoint.x.toFixed(2)
							: "Nan";
						const objImagePointY = typeof obj?.imagePoint?.y === "number"
							? obj.imagePoint.y.toFixed(2)
							: "Nan";
						return `<div class=viewport-coordinates-container>
							<div>Web:<div>
							<div class="viewport-coordinates-web">(${objWebPointX}, ${objWebPointY})</div>
							<div class="viewport-coordinates-empty-row"/>
							<div>Viewport:</div>
							<div class="viewport-coordinates-viewport">(${objViewportPointX}, ${objViewportPointY})</div>
							<div class="viewport-coordinates-empty-row"/>
							<div class="viewport-coordinates-empty-row"/>
							<div>Image:</div>
							<div class="viewport-coordinates-image">(${objImagePointX}, ${objImagePointY})</div>
							<div class="viewport-coordinates-empty-row"/>
						</div>`;
					}
				},
				{
					view: "template",
					localId: VIEWPORT_ZOOM_ID,
					template: (obj) => {
						const objZoom = typeof obj?.zoom === "number" ? obj?.zoom?.toFixed(2) : "Nan";
						const objImageZoom = typeof obj?.imageZoom === "number" ? obj.zoom.toFixed(2) : "Nan";
						return `<div class=viewport-zoom-container>
							<div>Zoom:</div>
							<div class="viewport-coordinates-zoom">${objZoom}</div>
							<div class="viewport-coordinates-empty-row"/>
							<div>Image Zoom:</div>
							<div class="viewport-coordinates-viewport">${objImageZoom}</div>
						</div>`;
					}
				}
			]
		};
	}

	ready() {
		this.attachEvents();
	}

	attachEvents() {
		const coordinatesTemplate = this.$$(VIEWPORT_COORDINATES_ID);
		const zoomTemplate = this.$$(VIEWPORT_ZOOM_ID);
		this.on(this.app, "app:update-viewer-coordinates", (webPoint, viewportPoint, imagePoint) => {
			coordinatesTemplate.setValues({
				webPoint,
				viewportPoint,
				imagePoint
			});
		});
		this.on(this.app, "app:update-viewer-zoom", (zoom, imageZoom) => {
			zoomTemplate.setValues({
				zoom,
				imageZoom
			});
		});
	}
}
