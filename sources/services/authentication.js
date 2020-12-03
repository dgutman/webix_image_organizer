import state from "../models/state";
import ajax from "./ajaxActions";

function getHostId() {
	let hostId = webix.storage.local.get("hostId");
	if (!hostId) {
		hostId = "1";
	}
	return hostId;
}

function login(params, afterLoginPage) {
	return ajax.login(params).then((data) => {
		webix.storage.local.put(`authToken-${getHostId()}`, data.authToken);
		webix.storage.local.put(`user-${getHostId()}`, data.user);
		// trigger event
		state.app.callEvent("login");
		// path that we should show after login. it can be set in any place of app
		if (afterLoginPage) {
			state.app.show(afterLoginPage);
		}
		else {
			state.app.refresh();
		}
	});
}

function logout() {
	ajax.logout().then(() => {
		webix.storage.local.remove(`user-${getHostId()}`);
		webix.storage.local.remove(`authToken-${getHostId()}`);
		state.app.refresh();
	});
	// state.app.callEvent("logout");
}

function getToken() {
	const authToken = webix.storage.local.get(`authToken-${getHostId()}`);
	if (!authToken) {
		return null;
	}
	return authToken.token;
}

function getUserInfo() {
	return webix.storage.local.get(`user-${getHostId()}`);
}

function isLoggedIn() {
	return getToken() && getUserInfo();
}

function showMainPage() {
	window.location = "/";
}

function getUserId() {
	const userInfo = getUserInfo();
	return userInfo && userInfo._id;
}

export default {
	login,
	logout,
	getToken,
	showMainPage,
	getUserInfo,
	isLoggedIn,
	getHostId,
	getUserId
};

