import {JetView} from "webix-jet";
import OpenSeadragonViewer from "../../../components/openSeadragonViewer";
import MetadataPanel from "../../../components/metadataJSONViewer";
import ControlsView from "./parts/controlsView";
import ajaxActions from "../../../../services/ajaxActions";

export default class BaseSlideView extends JetView {
	onImageSelect() {}

	async _getTileSources(image) {
		const tileSourceOptions = await ajaxActions.getImageTiles(image._id);
		const tileSources = {
			crossOriginPolicy: "Anonymous",
			loadTilesWithAjax: true,
			width: tileSourceOptions.sizeX,
			height: tileSourceOptions.sizeY,
			tileWidth: tileSourceOptions.tileWidth,
			tileHeight: tileSourceOptions.tileHeight,
			minLevel: 0,
			maxLevel: tileSourceOptions.levels - 1,
			getTileUrl(level, x, y) {
				return ajaxActions.getImageTileUrl(image._id, level, x, y);
			}
		};

		return tileSources;
	}

	createOsdViewer() {
		return new OpenSeadragonViewer(this.app);
	}

	createMetadataPanel() {
		return new MetadataPanel(this.app, {minWidth: 300, css: "scenes-view__slide-metadata"}, {mode: "view"});
	}

	createControlsView() {
		return new ControlsView(this.app, {width: 250});
	}
}
