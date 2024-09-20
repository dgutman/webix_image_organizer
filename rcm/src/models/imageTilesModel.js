import ajaxActions from "../services/ajaxActions";
import imagesModel from "./imagesModel";

const imageTiles = new Map();

async function getTileSources(image, incomeTilesOptions = {}, useSourceOptions, frame, isFrame) {
  const imageID = imagesModel.getImageYamlID(image);
  if (imageTiles.get(imageID) && !isFrame) {
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
