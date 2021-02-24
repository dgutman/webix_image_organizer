import state from "../models/state";
// import ajax from "./ajaxActions";
import transitionalAjax from "./transitionalAjaxService";

function login(params) {
	return transitionalAjax.login(params).then((data) => {
		webix.storage.local.put(`authToken-${getHostId()}`, data.authToken);
		webix.storage.local.put(`taggerJWT-${getHostId()}`, data.taggerJWT);
		webix.storage.local.put(`user-${getHostId()}`, data.user);
		window.location.reload();
	});
}

function logout() {
	transitionalAjax.logout().then(() => {
		webix.storage.local.remove(`user-${getHostId()}`);
		webix.storage.local.remove(`taggerJWT-${getHostId()}`);
		webix.storage.local.remove(`authToken-${getHostId()}`);
		window.location.reload();
	});
}

function getToken() {
	const authToken = webix.storage.local.get(`authToken-${getHostId()}`);
	if (!authToken) {
		return null;
	}
	return authToken.token;
}

function getTaggerJWT() {
	return webix.storage.local.get(`taggerJWT-${getHostId()}`);
}

function isLoggedIn() {
	return getToken() && getUserInfo() && getTaggerJWT();
}

function showMainPage() {
	window.location = "/";
}

function getUserInfo() {
	return webix.storage.local.get(`user-${getHostId()}`);
}

function getHostId() {
	const hostId = webix.storage.local.get("hostId") ? webix.storage.local.get("hostId") : "1";
	return hostId;
}

function isAdmin() {
	return !!(getUserInfo() && getUserInfo().admin);
}

function getUserId() {
	const user = getUserInfo();
	return user ? user._id : null;
}

export default {
	login,
	logout,
	getToken,
	showMainPage,
	getUserInfo,
	isLoggedIn,
	getHostId,
	isAdmin,
	getUserId,
	getTaggerJWT
};

