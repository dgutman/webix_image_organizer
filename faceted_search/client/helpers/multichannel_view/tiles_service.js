define([
	"helpers/ajax",
	"models/multichannel_view/tiles_collection",
	"constants"
], function(ajaxActions, tilesCollection, constants) {
	'use strict';
	return class TilesSourcesService {
		constructor() {
			this._image = null;
			this._imageTileSources = null;
		}
	
		async getTileSources(image, params = {}) {
			if (this._imageTileSources && image === this._image) {
				return Promise.resolve(this._imageTileSources);
			}
	
			this._image = image;
	
			const tileSourceOptions = await tilesCollection.getImageTileInfo(image);

			const tileSources = {
				crossOriginPolicy: "Anonymous",
				loadTilesWithAjax: true,
				width: tileSourceOptions.sizeX ?? 1,
				height: tileSourceOptions.sizeY ?? 1,
				tileWidth: tileSourceOptions.tileWidth ?? 1,
				tileHeight: tileSourceOptions.tileHeight ?? 1,
				minLevel: 0,
				maxLevel: tileSourceOptions.levels - 1 ?? 0,
				getTileUrl(level, x, y) {
					return ajaxActions.getImageTileUrl(image._id, level, x, y, {...params});
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
				const {max, min} = constants.DEFAULT_16_BIT_CHANNEL_SETTINGS;
				const colorSettings = {
					palette2: channel.color,
					min: channel.min || min,
					max: channel.max || max
				};
				return this.getColoredChannelTileSource(this._image, channel.index, colorSettings);
			}));
		}
	};
});
