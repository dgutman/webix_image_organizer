import * as webix from "webix";
import localStorageService from "./localStorage";

// const HOST_API = process.env.REACT_APP_HOST_API ?? "";
const HOST_API = process.env.REACT_APP_NEW_HOST_API ?? "";

function parseError(xhr) {
  let message;
  const connectionMessage = "Server connection error.<br /> Please check the connection.";
  switch (xhr.status) {
    case 404: {
      message = "Not found";
      webix.message({type: "error", text: message});
      break;
    }
    default: {
      try {
        let response = JSON.parse(xhr.response);
        message = response.message;
      }
      catch (e) {
        message = xhr.response || connectionMessage;
        if (xhr.responseURL) console.log(`Not JSON response for request to ${xhr.responseURL}`);
      }
      if (!webix.message.pull[message]) {
        const expire = message === connectionMessage ? -1 : 5000;
        webix.message({text: message, expire, id: message});
      }
      break;
    }
  }
  return Promise.reject(xhr);
}

webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers, files, promise) => {
  const token = localStorageService.getToken();
  if (token) {
    headers["Girder-Token"] = token;
  }
})

function getHostAPI() {
  return HOST_API;
  // return process.env.HOST_API;
}

async function login({username = 0, password = 0}) {
  let hash
  try {
    // TODO: change to argon2
    const tok = `${username}:${password}`;
    hash = btoa(tok);
  }
  catch(e) {
    console.log("Invalid character in password or login");
  }

  try {
    const response = await webix.ajax()
      .headers({
        Authorization: `Basic ${hash}`,
      })
      .get(`${getHostAPI()}/user/authentication`)
    const data = response.json();
    return data;
  }
  catch(error) {
    parseError(error);
  }
}

async function logout() {
  try {
    const response = await webix.ajax()
      .del(`${getHostAPI}/user/authentication`);
    return response.json();
  }
  catch(error) {
    parseError(error);
  }
}

async function getUserInfo() {
  try {
    const response = await webix.ajax()
      .get(`${getHostAPI()}/user/me`);
    return response.json();
  }
  catch(error) {
    parseError(error);
  }
}

async function getItem(itemID) {
  try {
    const response = await webix.ajax()
      .get(`${getHostAPI()}/item/${itemID}`);
    const data = response.json();
    return data;
  }
  catch(error) {
    parseError(error);
  }
}

async function getItems(folderId) {
  try {
    const response = await webix.ajax()
      .get(`${getHostAPI()}/item?folderId=${folderId}`)
    const data = response.json()
    return data;
  }
  catch(error) {
    parseError(error);
  }
}

async function getImageTiles(itemID) {
  try {
    const response = await webix.ajax()
      .get(`${getHostAPI()}/item/${itemID}/tiles`);
    const data = response.json();
    return data;
  }
  catch(error) {
    parseError(error);
  }
}

async function getFolder(folderId) {
  try {
    const response = await webix.ajax()
      .get(`${getHostAPI()}/folder/${folderId}`);
    const data = response.json();
    return data;
  }
  catch(error) {
    parseError(error);
  }
}

async function getSubFolders(parentType, parentId) {
  const params = {
    limit: 0,
    parentType,
    parentId
  };
  try {
    const response = await webix.ajax()
      .get(`${getHostAPI()}/folder`, params);
    const data = response.json();
    return data;
  }
  catch(error) {
    parseError(error);
  }
}

function getImageFrameTileUrl(itemId, frame, z, x, y) {
  const token = localStorageService.getToken()
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("edge", "crop");
  if (token) {
    urlSearchParams.append("token", localStorageService.getToken());
  }
  return `${getHostAPI()}/item/${itemId}/tiles/fzxy/${frame}/${z}/${x}/${y}?${urlSearchParams.toString()}`;
}

function getImageTileUrl(itemId, z, x, y) {
  const token = localStorageService.getToken()
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("edge", "crop");
  if (token) {
    urlSearchParams.append("token", localStorageService.getToken());
  }
  return `${getHostAPI()}/item/${itemId}/tiles/zxy/${z}/${x}/${y}?${urlSearchParams.toString()}`;
}

async function getTileFrameInfo(itemID) {
  try {
    const response = await webix.ajax()
      .get(`${getHostAPI()}/item/${itemID}/tiles/tile_frames/quad_info`);
    const data = response.json();
    return data;
  }
  catch(error) {
    parseError(error);
  }
}

async function getImageTileUrlWithFrameNumber(itemID, frame, z, x, y) {
  const token = localStorageService.getToken()
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("edge", "crop");
  if (token) {
    urlSearchParams.append("token", localStorageService.getToken());
  }
  return `${getHostAPI()}/item/${itemID}/tiles/fzxy/${frame}/${z}/${x}/${y}?${urlSearchParams.toString()}`;
}

const ajax = {
  login,
  logout,
  getUserInfo,
  getItem,
  getItems,
  getFolder,
  getImageTiles,
  getSubFolders,
  getImageFrameTileUrl,
  getImageTileUrl,
  getTileFrameInfo,
  getImageTileUrlWithFrameNumber,
}

export default ajax;
