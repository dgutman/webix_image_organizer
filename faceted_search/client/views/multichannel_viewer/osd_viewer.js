define([
	"views/components/osd_viewer"
], function(OpenSeadragonViewer) {
	'use strict';
	const OSD_VIEWER_TEMPLATE = "osd-template";

	return class MultichannelOSDViewer extends OpenSeadragonViewer {
		constructor(app, options = {}, config = {}) {
			super(app, options);
			this._cnf = config;

			this.$oninit = () => {
				webix.TooltipControl.addTooltip(this.getViewerTemplate().$view);
			}
		}
	
		get $ui() {
			return {
				id: this._rootId,
				rows: [
					{
						...this._cnf,
						view: "template",
						localId: OSD_VIEWER_TEMPLATE,
						template: () => `<div class="icons">
							<span title="home" class="icon home mdi mdi-home"></span>
							<span title="zoom in" class="icon zoomin mdi mdi-plus-circle-outline"></span>
							<span title="zoom out" class="icon zoomout mdi mdi-minus-circle-outline"></span>
							<span title="make a group with selected channels" class="icon addgroup mdi mdi-plus"></span>
							<span title="reset main slide" class="icon reset mdi mdi-redo"></span>
						</div>
						<div class="osd-container"></div>`,
						css: "multichannel-openseadragon-viewer",
						onClick: {
							home: () => {
								this.zoomHome();
							},
							zoomin: () => {
								this.zoomIn();
							},
							zoomout: () => {
								this.zoomOut();
							},
							reset: () => {
								this.reset();
							},
							addgroup: () => {
								this.addGroup();
							}
						}
					}
				]
			};
		}

	
		createViewer(options) {
			const osdTemplateNode = this.getRoot().getNode();
			const osdContainer = osdTemplateNode.querySelector(".osd-container");
			return super.createViewer(options, osdContainer);
		}
	
		zoomHome() {
			const viewer = this.$viewer();
			this.zoomTo(viewer.viewport.getHomeZoom());
			viewer.viewport.panTo(viewer.viewport.getCenter());
		}
	
		zoomIn() {
			const viewer = this.$viewer();
			const zoomValue = viewer.viewport.getZoom();
			if (zoomValue * 2 < viewer.viewport.getMaxZoom()) {
				this.zoomTo(zoomValue * 2);
			}
			else {
				this.zoomTo(viewer.viewport.getMaxZoom());
			}
		}
	
		zoomOut() {
			const viewer = this.$viewer();
			let zoomValue = viewer.viewport.getZoom();
			if (zoomValue / 2 > viewer.viewport.getMinZoom()) {
				this.zoomTo(zoomValue / 2);
			}
			else {
				this.zoomTo(viewer.viewport.getMinZoom());
			}
		}
	
		zoomTo(value) {
			this.$viewer().viewport.zoomTo(value);
		}
	
		reset() {
			this.getRoot().callEvent("resetMainFrameBtnClick");
		}
	
		addGroup() {
			this.getRoot().callEvent("addGroupBtnClick");
		}
	
		replaceTile(tileSource, index = 0) {
			const viewer = this.$viewer();
			const tileToReplace = viewer.world.getItemAt(index);
	
			viewer.addTiledImage({
				tileSource,
				opacity: 1,
				index,
				success() {
					viewer.world.removeItem(tileToReplace);
				}
			});
		}
	
		addNewTile(tileSource, opacity = 1) {
			const viewer = this.$viewer();
	
			viewer.addTiledImage({
				tileSource,
				opacity
			});
		}
	
		flipTiles(firstIndex, secondIndex) {
			const tileIndexes = [firstIndex, secondIndex];
			const viewer = this.$viewer();
			const [firstItem, secondItem] = tileIndexes.map((tileIndex) => {
				const tile = viewer.world.getItemAt(tileIndex);
				if (tileIndex === 0) {
					const anotherTileIndex = tileIndexes.find(index => index !== tileIndex);
					const anotherTile = viewer.world.getItemAt(anotherTileIndex);
	
					tile.setCompositeOperation("difference");
					anotherTile.setCompositeOperation();
				}
				return tile;
			});
	
			viewer.world.setItemIndex(firstItem, secondIndex);
			viewer.world.setItemIndex(secondItem, firstIndex);
		}
	
		removeAllTiles() {
			const viewer = this.$viewer();
			if (viewer) {
				viewer.world.removeAll();
			}
		}
	
		setTileOpacity(index, opacity = 1) {
			const viewer = this.$viewer();
			viewer.world.getItemAt(index).setOpacity(opacity);
		}
	
		getViewerTemplate() {
			return this.$$(OSD_VIEWER_TEMPLATE);
		}
	}
});
