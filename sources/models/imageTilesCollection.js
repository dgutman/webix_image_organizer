import ajaxActions from "../services/ajaxActions";

class ImageTileInfoCollection {
	constructor() {
		this.tilesInfo = {};
	}

	addImageTile(id, tile) {
		this.tilesInfo[id] = tile;
	}

	async getImageTileInfo(image) {
		const id = image._id;
		let tile = this.tilesInfo[id];
		if (tile == null) {
			return ajaxActions.getImageTiles(id)
				.then((fetchedTile) => {
					tile = fetchedTile;
					this.addImageTile(id, fetchedTile);
					this.addImageChannels(image, fetchedTile);
					return this.tilesInfo[id];
				})
				.catch(() => {
					this.addImageTile(id, false);
					this.addImageChannels(image, false);
				});
		}
		return tile;
	}

	addImageChannels(image, tile) {
		const id = image._id;
		let channels = (tile && tile.channels) ||
			(image.meta && image.meta.omeSceneDescription);
		if (!channels || !Array.isArray(channels)) {
			return;
		}
		channels = channels
			.map((channel, index) => {
				const channelName = typeof channel === "string" ? channel : channel.channel_name;
				return {
					index: channel.channel_number || index,
					name: channelName
				};
			});
		this.tilesInfo[id] = {...this.tilesInfo[id] || {}, ...{channels}};
	}

	async getImageChannels(image) {
		const tileInfo = await this.getImageTileInfo(image);
		return tileInfo && tileInfo.channels;
	}
}

export default new ImageTileInfoCollection();
