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
					template: obj => (obj.viewportPoint ? `
					<div class=viewport-coordinates-container>
						<div>Web:<div>
						<div class="viewport-coordinates-web">(${obj?.webPoint?.x?.toFixed(2) ?? ""}, ${obj?.webPoint?.y?.toFixed(2) ?? ""})</div>
						<div class="viewport-coordinates-empty-row"/>
						<div>Viewport:</div>
						<div class="viewport-coordinates-viewport">(${obj?.viewportPoint?.x?.toFixed(2) ?? ""}, ${obj?.viewportPoint?.y?.toFixed(2) ?? ""})</div>
						<div class="viewport-coordinates-empty-row"/>
						<div class="viewport-coordinates-empty-row"/>
						<div>Image:</div>
						<div class="viewport-coordinates-image">(${obj?.imagePoint?.x?.toFixed(2) ?? ""}, ${obj?.imagePoint?.y?.toFixed(2)})</div>
						<div class="viewport-coordinates-empty-row"/>
					</div>
					` : "")
				},
				{
					view: "template",
					localId: VIEWPORT_ZOOM_ID,
					template: obj => (obj.zoom ? `
					<div class=viewport-zoom-container>
						<div>Zoom:</div>
						<div class="viewport-coordinates-zoom">${obj?.zoom?.toFixed(2)}</div>
						<div class="viewport-coordinates-empty-row"/>
						<div>Image Zoom:</div>
						<div class="viewport-coordinates-viewport">${obj?.imageZoom?.toFixed(2)}</div>
					</div>
					` : "")
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
