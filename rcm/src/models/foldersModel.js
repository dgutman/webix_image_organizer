const folders = [];
let selectedFolder = null;

const IMG_STACK_DICT = {
  CONFOCAL_IMAGES: "Confocal Images",
  MACROSCOPIC_IMAGES: "Macroscopic Images",
  VIVA_BLOCK: "VivaBlock",
  VIVA_STACK: "VivaStack",
}

function getSelectedFolder() {
  return selectedFolder;
}

function setSelectedFolder(folder) {
  if (folder) {
    selectedFolder = folder;
  }
  else {
    debugger;
  }
}

function getFolders() {
  return folders;
}

function setFolders(fldrs) {
  if (!fldrs) {
    debugger;
  }
  folders.length = 0;
  folders.push(...fldrs)
}

function getFolderName(f) {
  return f?.name;
}

function getFolderConfocalImages(f) {
  return f?.meta?.imgStackDict[IMG_STACK_DICT.CONFOCAL_IMAGES];
}

function getFolderMacroscopicImages(f) {
  // TODO: double nested macroscopic images object
  return f?.meta?.imgStackDict[IMG_STACK_DICT.MACROSCOPIC_IMAGES][IMG_STACK_DICT.MACROSCOPIC_IMAGES];
}

function getVivaBlockImages(f) {
  return f?.meta?.imgStackDict[IMG_STACK_DICT.VIVA_BLOCK];
}

function getVivaStackImages(f) {
  return f?.meta?.imgStackDict[IMG_STACK_DICT.VIVA_STACK];
}

function getFolderRegistrationData(f) {
  return f?.meta?.registrationData;
}

function getYamlData(f) {
  return f?.meta?.yamlData;
}

const foldersModel = {
  getSelectedFolder,
  setSelectedFolder,
  getFolders,
  setFolders,
  getFolderName,
  getFolderConfocalImages,
  getFolderMacroscopicImages,
  getVivaBlockImages,
  getVivaStackImages,
  getFolderRegistrationData,
  getYamlData,
}

export default foldersModel;
