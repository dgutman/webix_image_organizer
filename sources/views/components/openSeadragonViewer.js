import {JetView} from "webix-jet";
import OpenSeadragon from "openseadragon";
import "openseadragon-filtering";


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

	createViewer(options) {
		this._openseaDragonViewer = new OpenSeadragon.Viewer({
			...Object.assign({}, this._options, options),
			element: this.getRoot().getNode(),
			prefixUrl: "sources/images/images/"
		});

		return new Promise((resolve, reject) => {
			this._openseaDragonViewer.addOnceHandler("open", () => {
				resolve();
			});
			this._openseaDragonViewer.addOnceHandler("open-failed", () => {
				reject();
			});
		});
	}

	$viewer() {
		return this._openseaDragonViewer;
	}

	getItemByIndex(index) {
		return this.$viewer().world.getItemAt(index);
	}

	destroy() {
		if (this.$viewer()) {
			this.$viewer().destroy();
		}
	}
}
