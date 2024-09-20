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


function getTilesOptions(imageRegistrationData, isMacroscopic) {
  if (isMacroscopic) {
    startCoords.startX = Number(JSON.parse(imageRegistrationData.d)[0]);
    startCoords.startY = Number(JSON.parse(imageRegistrationData.d)[1]);
  }
  const sizeX = JSON.parse(imageRegistrationData.b)[0] - JSON.parse(imageRegistrationData.a)[0];
  const sizeY = JSON.parse(imageRegistrationData.b)[1] - JSON.parse(imageRegistrationData.c)[1];
  const tileWidth = JSON.parse(imageRegistrationData.b)[0] - JSON.parse(imageRegistrationData.a)[0];
  const tileHeight = JSON.parse(imageRegistrationData.b)[1] - JSON.parse(imageRegistrationData.c)[1];
  return {sizeX, sizeY, tileWidth, tileHeight};
}

function getOverlayOptions(imageRegistrationData) {
  const x = JSON.parse(imageRegistrationData.d)[0] - startCoords.startX;
  const y = JSON.parse(imageRegistrationData.d)[1] - startCoords.startY;
  const width = JSON.parse(imageRegistrationData.b)[0] - JSON.parse(imageRegistrationData.a)[0];
  const height = JSON.parse(imageRegistrationData.b)[1] - JSON.parse(imageRegistrationData.c)[1];
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
