import {JetView} from "webix-jet";
import OpenSeadragon from "openseadragon";
import "openseadragon-filtering";
import "../../libs/openseadragon-svg-overlay/openseadragon-svg-overlay";

export default class OpenSeadragonViewer extends JetView {
	constructor(app, config = {}) {
		super(app, config);

		this._options = config;
		this._openseaDragonViewer = null;
	}

	config() {
		return {
			view: "template",
			css: "io-openseadragon-viewer"
		};
	}

	init(view) {
		webix.extend(view, webix.OverlayBox);
	}

	createViewer(options) {
		this._openseaDragonViewer = new OpenSeadragon.Viewer({
			...Object.assign({}, this._options, options),
			element: this.getRoot().getNode(),
			prefixUrl: "sources/images/images/"
		});

		const viewer = this._openseaDragonViewer;

		return new Promise((resolve, reject) => {
			viewer.addOnceHandler("open", () => {
				resolve();
			});
			viewer.addOnceHandler("open-failed", () => {
				reject();
			});
		});
	}

	svgOverlay() {
		return this.$viewer().svgOverlay();
	}

	$viewer() {
		return this._openseaDragonViewer;
	}

	getItemByIndex(index) {
		return this.$viewer().world.getItemAt(index);
	}

	showOverlay(text) {
		this.getRoot().showOverlay(
			`<div class='data-subview-overlay'>
				<div class='overlay-text'>${text || "Loading..."}</div>
			</div>`
		);
	}

	hideOverlay() {
		this.getRoot().hideOverlay();
	}

	destroy() {
		if (this.$viewer()) {
			this.$viewer().destroy();
		}
	}
}
