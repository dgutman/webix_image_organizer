define([
    "app",
    "helpers/ajax"
], function (app, ajax) {
    function login(params) {
        return ajax.login(params).then((data) => {
            webix.storage.local.put(`authToken-${getHostId()}`, data.authToken);
            webix.storage.local.put(`localJWT-${getHostId()}`, data.localJWT);
            webix.storage.local.put(`user-${getHostId()}`, data.user);

            window.location.reload();
        });
    }

    function logout() {
        ajax.logout().then(() => {
            webix.storage.local.remove(`user-${getHostId()}`);
            webix.storage.local.remove(`localJWT-${getHostId()}`);
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

    function getLocalJWT() {
    	return webix.storage.local.get(`localJWT-${getHostId()}`);
	}

	function isLoggedIn() {
		return getToken() && getUserInfo() && getLocalJWT();
	}

	function showMainPage() {
		window.location = "/";
	}

	function getUserInfo() {
		return webix.storage.local.get(`user-${getHostId()}`);
	}

	function getHostId() {
		const hostId = webix.storage.local.get("hostId") || "1";
		return hostId;
	}

	function isAdmin() {
		return !!(getUserInfo() && getUserInfo().admin);
	}

	function getUserId() {
		const user = getUserInfo();
		return user ? user._id : null;
	}

	return {
		login,
		logout,
		getToken,
		showMainPage,
		getUserInfo,
		isLoggedIn,
		getHostId,
		isAdmin,
		getUserId,
		getLocalJWT
	};
});
