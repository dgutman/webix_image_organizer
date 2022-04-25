import state from "../models/state";
import transitionalAjax from "./transitionalAjaxService";

class Auth {
	login(params) {
		return transitionalAjax.login(params).then((data) => {
			webix.storage.local.put(`authToken-${this.getHostId()}`, data.authToken);
			webix.storage.local.put(`taggerJWT-${this.getHostId()}`, data.taggerJWT);
			webix.storage.local.put(`user-${this.getHostId()}`, data.user);

			state.app.refresh();
		});
	}

	logout() {
		transitionalAjax.logout().then(() => {
			webix.storage.local.remove(`user-${this.getHostId()}`);
			webix.storage.local.remove(`taggerJWT-${this.getHostId()}`);
			webix.storage.local.remove(`authToken-${this.getHostId()}`);

			state.app.refresh();
		});
	}

	getHostId() {
		const hostId = webix.storage.local.get("hostId") ? webix.storage.local.get("hostId") : "1";
		return hostId;
	}

	getToken() {
		const authToken = webix.storage.local.get(`authToken-${this.getHostId()}`);
		if (!authToken) {
			return null;
		}
		return authToken.token;
	}

	getTaggerJWT() {
		return webix.storage.local.get(`taggerJWT-${this.getHostId()}`);
	}

	isLoggedIn() {
		return this.getToken() && this.getUserInfo() && this.getTaggerJWT();
	}

	showMainPage() {
		window.location = "/";
	}

	getUserInfo() {
		return webix.storage.local.get(`user-${this.getHostId()}`);
	}

	isAdmin() {
		return !!(this.getUserInfo() && this.getUserInfo().admin);
	}

	getUserId() {
		const user = this.getUserInfo();
		return user ? user._id : null;
	}
}

const instance = new Auth();

export default instance;

