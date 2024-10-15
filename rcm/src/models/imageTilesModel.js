import ajaxActions from "../services/ajaxActions";

const imageTiles = new Map();

async function getTileSources(imageID, incomeTilesOptions = {}, useSourceOptions, frame, isFrame) {
  if (imageTiles.get(`${imageID}${isFrame ? "/" + frame : ""}`)) {
    return imageTiles.get(imageID);
  }
  const tileSourceOptions = await ajaxActions.getImageTiles(imageID);
  const tilesOptions = useSourceOptions
    ? tileSourceOptions
    : {...tileSourceOptions, ...incomeTilesOptions};
  const tileSources = isFrame 
  ? {
    crossOriginPolicy: "Anonymous",
    loadTilesWithAjax: true,
    width: tilesOptions.sizeX,
    height: tilesOptions.sizeY,
    tileWidth: tilesOptions.tileWidth,
    tileHeight: tilesOptions.tileHeight,
    minLevel: 0,
    maxLevel: tilesOptions.levels - 1,
    getTileUrl(level, x, y) {
      return ajaxActions.getImageTileUrlWithFrameNumber(imageID, frame, level, x, y);
    }
  }
  : {
    crossOriginPolicy: "Anonymous",
    loadTilesWithAjax: true,
    width: tilesOptions.sizeX,
    height: tilesOptions.sizeY,
    tileWidth: tilesOptions.tileWidth,
    tileHeight: tilesOptions.tileHeight,
    minLevel: 0,
    maxLevel: tilesOptions.levels - 1,
    getTileUrl(level, x, y) {
      return ajaxActions.getImageTileUrl(imageID, level, x, y);
    }
  };

  imageTiles.set(imageID, tileSources);
  return tileSources;
}

const imageTilesModel = {
  getTileSources,
};

export default imageTilesModel
