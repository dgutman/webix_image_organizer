import ajaxActions from "../services/ajaxActions";

const imageTiles = new Map();

async function getTileSources(imageID, incomeTilesOptions = {}, useSourceOptions, frame, isFrame) {
  const imageTileID = `${imageID}${isFrame ? "/" + frame : ""}`
  if (imageTiles.get(imageTileID)) {
    return imageTiles.get(imageTileID);
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

  imageTiles.set(imageTileID, tileSources);
  return tileSources;
}

function getDZITileSource(itemId, frame) {
  return ajaxActions.getImageDeepZoomCompatibleMetadataURL(itemId, frame);
}

const imageTilesModel = {
  getTileSources,
  getDZITileSource,
};

export default imageTilesModel
