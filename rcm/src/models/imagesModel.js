/** @type {Map} */
const images = new Map();
const startCoords = {};
let selectedImage = null;

function getSelectedImage() {
  return selectedImage;
}

function setSelectedImage(image) {
  if (image) {
    selectedImage = image;
  }
}

function getImagesByFolderID(folderID) {
  return images.get(folderID);
}

function setImages(imgs, folderID) {
  images.set(folderID, imgs);
}

function getImageID(image) {
  return image._id;
}

function getImageName(image) {
  return image.name
}


function getTilesOptions(newImageRegistrationData) {
  const sizeX = newImageRegistrationData.x_max - newImageRegistrationData.x_min;
  const sizeY = newImageRegistrationData.y_max - newImageRegistrationData.y_min;
  const tileWidth = sizeX;
  const tileHeight = sizeY;
  return {sizeX, sizeY, tileWidth, tileHeight};
}

function getOverlayOptions(newImageRegistrationData) {
  const x = newImageRegistrationData.x_min;
  const y = newImageRegistrationData.y_min;
  const width = newImageRegistrationData.x_max - newImageRegistrationData.x_min;
  const height = newImageRegistrationData.y_max - newImageRegistrationData.y_min;
  return {x, y, width, height};
}

function getImageType(image) {
  return image.type;
}

function getImageYamlID(image) {
  return image.yamlId;
}

const imagesModel = {
  getSelectedImage,
  setSelectedImage,
  getImagesByFolderID,
  setImages,
  getImageID,
  getImageName,
  getTilesOptions,
  getImageType,
  getImageYamlID,
  getOverlayOptions,
}

export default imagesModel;
