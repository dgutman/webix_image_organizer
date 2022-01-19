import ajaxActions from "../ajaxActions";
import tilesCollection from "../../models/imageTilesCollection";

export default class TilesSourcesService {
	constructor() {
		this._image = null;
		this._imageTileSources = null;
	}

	async getTileSources(image) {
		if (this._imageTileSources && image === this._image) {
			return Promise.resolve(this._imageTileSources);
		}

		this._image = image;

		const tileSourceOptions = await tilesCollection.getImageTileInfo(image);

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

		this._imageTileSources = tileSources;

		return tileSources;
	}

	async getChannelTileSources(image = this._image, frameIndex) {
		if (!this._imageTileSources) {
			return false;
		}
		const tileSourceOptions = webix.copy(this._imageTileSources);
		return {
			...tileSourceOptions,
			getTileUrl(level, x, y) {
				return ajaxActions.getImageFrameTileUrl(image._id, frameIndex, level, x, y);
			}
		};
	}

	async getColoredChannelTileSource(image = this._image, frameIndex, colorSettings) {
		if (!this._imageTileSources) {
			return false;
		}
		const tileSourceOptions = webix.copy(this._imageTileSources);
		return {
			...tileSourceOptions,
			getTileUrl(level, x, y) {
				const coords = {z: level, x, y};
				return ajaxActions
					.getImageColoredFrameTileUrl(image._id, frameIndex, coords, colorSettings);
			}
		};
	}

	async getColoredTileSources(channels) {
		return Promise.all(channels.map((channel) => {
			const colorSettings = {
				palette2: channel.color,
				min: channel.min || 500, // default value
				max: channel.max || 30000 // default value
			};
			return this.getColoredChannelTileSource(this._image, channel.index, colorSettings);
		}));
	}
}
