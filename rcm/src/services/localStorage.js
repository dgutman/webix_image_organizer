import * as webix from "webix";

const AUTH_TOKEN = "authToken";
const USER = "user";
const Z_STACK_SPEED = "zStackSped";

function getToken() {
  const authToken = webix.storage.local.get(AUTH_TOKEN);
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

function setZStackSpeed(speed) {
  webix.storage.local.put(Z_STACK_SPEED, speed);
}

function getZStackSpeed() {
  webix.storage.local.get(Z_STACK_SPEED)
}

const localStorageService = {
  getToken,
  setToken,
  getUserInfo,
  setUserInfo,
  deleteUserInfo,
  getZStackSpeed,
  setZStackSpeed,
}

export default localStorageService;
