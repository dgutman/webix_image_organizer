import * as webix from "webix";

const AUTH_TOKEN = "authToken";
const USER = "user";

function getToken() {
  const authToken = webix.storage.local.get("authToken");
  return authToken ?? null;
}

function setToken(authToken) {
  webix.storage.local.put(AUTH_TOKEN, authToken);
}

function getUserInfo() {
  return webix.storage.local.get(USER);
}

function setUserInfo(user) {
  webix.storage.local.put(USER, user)
}

function deleteUserInfo() {
  webix.storage.local.remove(USER);
  webix.storage.local.remove(AUTH_TOKEN);
}

const localStorageService = {
  getToken,
  setToken,
  getUserInfo,
  setUserInfo,
  deleteUserInfo,
}

export default localStorageService;
