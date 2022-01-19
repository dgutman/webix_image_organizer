define([
	"app",
	"helpers/base_jet_view",
	"helpers/openseadragon"
], function(app, BaseJetView, OpenSeadragon) {
	'use strict';
	return class OpenSeadragonViewer extends BaseJetView {
		constructor(app, options = {}) {
			super(app);

			this._options = options;
			this._openseaDragonViewer = null;

			this.$oninit = () => {
				const view = this.getRoot();
				webix.extend(view, webix.OverlayBox);
			};

			this.$ondestroy = () => {
				return this.destroy();
			};
		}
	
		get $ui() {
			return {
				view: "template",
				id: this._rootId,
				css: "io-openseadragon-viewer"
			};
		}
	
		createViewer(options = {}, node = this.getRoot().getNode()) {
			this._openseaDragonViewer = new OpenSeadragon.Viewer({
				...Object.assign({}, this._options, options),
				element: node,
				prefixUrl: "libs/openseadragon/images/"
			});
	
			const viewer = this._openseaDragonViewer;
	
			return new Promise((resolve, reject) => {
				viewer.addOnceHandler("open", () => {
					resolve(viewer);
				});
				viewer.addOnceHandler("open-failed", (error) => {
					reject(error);
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
				this.$viewer().world.removeAll();
				this.$viewer().destroy();
			}
		}
	};
});
