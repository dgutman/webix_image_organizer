/** @type {Map} */
const images = new Map();
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

const imagesModel = {
  getSelectedImage,
  setSelectedImage,
  getImagesByFolderID,
  setImages,
  getImageID,
  getImageName,
}

export default imagesModel;
