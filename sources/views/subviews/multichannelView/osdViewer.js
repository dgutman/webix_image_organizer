import OpenSeadragonViewer from "../../components/openSeadragonViewer";

export default class MultichannelOSDViewer extends OpenSeadragonViewer {
	constructor(app, options = {}, config = {}) {
		super(app, options);
		this._cnf = config;
	}

	config() {
		return {
			...this._cnf,
			view: "template",
			template: () => `<div class="icons">
				<span class="icon home fas fa-home"></span>
				<span class="icon zoomin fas fa-search-plus"></span>
				<span class="icon zoomout fas fa-search-minus"></span>
				<span class="icon addgroup fas fa-plus-circle"></span>
				<span class="icon reset fas fa-redo"></span>
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
		};
	}

	createViewer(options) {
		const osdTemplateNode = this.getRoot().getNode();
		const osdContainer = osdTemplateNode.querySelector(".osd-container");
		super.createViewer(options, osdContainer);
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

	flipSlides(firstIndex, secondIndex) {
		const viewer = this.$viewer();
		const firstItem = viewer.world.getItemAt(firstIndex);
		const secondItem = viewer.world.getItemAt(secondIndex);

		viewer.world.setItemIndex(firstItem, secondIndex);
		viewer.world.setItemIndex(secondItem, firstIndex);
	}

	removeAllTiles() {
		const viewer = this.$viewer();
		viewer.world.removeAll();
	}

	setTileOpacity(index, opacity = 1) {
		const viewer = this.$viewer();
		viewer.world.getItemAt(index).setOpacity(opacity);
	}
}
