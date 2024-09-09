import ajaxActions from "../services/ajaxActions";
import imagesModel from "./imagesModel";

const imageTiles = new Map();

// function getImageTiles(imageID) {
//   return imageTiles.get(imageID);
// }

async function getTileSources(image) {
  const imageID = imagesModel.getImageID(image);
  if (imageTiles.get(imageID)) {
    return imageTiles.get(imageID);
  }
  const tileSourceOptions = await ajaxActions.getImageTiles(imageID);
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
