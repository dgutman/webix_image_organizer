import authService from "./authentication";
import constants from "../constants";
import AjaxClass from "./ajaxClass";

const TRANSITIONAL_API = constants.TRANSITIONAL_TAGGER_SERVER_PARH;

webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers, files, promise) => {
	let toSearchInUrl = "cdn.webix.com";
	let searchedInUrl = url.search(toSearchInUrl);
	if (searchedInUrl === -1) {
		headers["Girder-Token"] = authService.getToken();
	}
	if (url.search(TRANSITIONAL_API) !== -1) {
		headers["Tagger-JWT"] = authService.getTaggerJWT();
	}
});

class AjaxActions extends AjaxClass {
	setTokenIntoUrl(token, symbol) {
		return token ? `${symbol}token=${token}` : "";
	}

	login(sourceParams) {
		const params = sourceParams ? {
			username: sourceParams.username || 0,
			password: sourceParams.password || 0
		} : {};
		const tok = `${params.username}:${params.password}`;
		let hash;
		try {
			hash = btoa(tok);
		}
		catch (e) {
			console.log("Invalid character in password or login");
		}
		return this._ajax()
			.headers({
				Authorization: `Basic ${hash}`
			})
			.get(`${this.getHostApiUrl()}/user/authentication`)
			.then(result => this._parseData(result));
	}

	logout() {
		return webix.ajax().del(`${this.getHostApiUrl()}/user/authentication`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getUserInfo() {
		return this._ajax().get(`${this.getHostApiUrl()}/user/me`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getCollection() {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/collection`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getFolder(parentType, parentId) {
		const params = {
			limit: 0,
			parentType,
			parentId
		};
		return this._ajax()
			.get(`${this.getHostApiUrl()}/folder`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getFolderDetails(id) {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/folder/${id}/details`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getItems(folderId, options) {
		const params = options || {
			limit: 0
		};

		return this._ajax()
			.get(`${this.getHostApiUrl()}/item?folderId=${folderId}`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getImage(imageId, imageType, params) {
		return webix.ajax().response("blob").get(`${this.getHostApiUrl()}/item/${imageId}/tiles/${imageType}`, params);
	}

	updateFolderMetadata(folderId, metadata) {
		return this._ajax()
			.put(`${this.getHostApiUrl()}/folder/${folderId}/metadata`, metadata)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getItem(id) {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item/${id}`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getUsers() {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/user?limit=0&sort=lastName&sortdir=1`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}
}

const instance = new AjaxActions();
export default instance;
