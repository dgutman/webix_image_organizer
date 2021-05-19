import OpenSeadragonViewer from "../../components/openSeadragonViewer";

const OSD_VIEWER_TEMPLATE = "osd-template";

export default class MultichannelOSDViewer extends OpenSeadragonViewer {
	constructor(app, options = {}, config = {}) {
		super(app, options);
		this._cnf = config;
	}

	config() {
		return {
			rows: [
				{
					...this._cnf,
					view: "template",
					localId: OSD_VIEWER_TEMPLATE,
					template: () => `<div class="icons">
						<span webix_tooltip="home" class="icon home fas fa-home"></span>
						<span webix_tooltip="zoom in" class="icon zoomin fas fa-search-plus"></span>
						<span webix_tooltip="zoom out" class="icon zoomout fas fa-search-minus"></span>
						<span webix_tooltip="make a group with selected channels" class="icon addgroup fas fa-plus-circle"></span>
						<span webix_tooltip="reset main slide" class="icon reset fas fa-redo"></span>
						<span webix_tooltip="upload groups" class="icon upload fas fa-upload"></span>
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
						},
						upload: () => {
							this.uploadGroups();
						}
					}
				}
			]
		};
	}

	ready() {
		webix.TooltipControl.addTooltip(this.getViewerTemplate().$view);
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

	uploadGroups() {
		this.getRoot().callEvent("uploadGroupBtnClick");
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
