import ajax from "./ajaxActions";
import localStorageService from "./localStorage";

async function login({username = 0, password = 0}) {
  const data = await ajax.login({username, password});
  localStorageService.setToken(data.authToken.token);
  localStorageService.setUserInfo(data.user);
}

async function logout() {
  await ajax.logout()
  localStorageService.deleteUserInfo();
}

function getUserInfo() {
  const userInfo = localStorageService.getUserInfo();
  return userInfo;
}

function getToken() {
  const token = localStorageService.getToken();
  return token;
}

function isLoggedIn() {
  return !!getToken() && !!getUserInfo();
}

const authService = {
  login,
  logout,
  getToken,
  getUserInfo,
  isLoggedIn,
}

export default authService;
