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

	getItems(folderId) {
		const params = {
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

	downloadItem(itemId) {
		return `${this.getHostApiUrl()}/item/${itemId}/download${this.setTokenIntoUrl(authService.getToken(), "?")}`;
	}

	getImageTiles(itemId) {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item/${itemId}/tiles`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getImageTileUrl(itemId, z, x, y) {
		return `${this.getHostApiUrl()}/item/${itemId}/tiles/zxy/${z}/${x}/${y}?edge=crop${this.setTokenIntoUrl(authService.getToken(), "&")}`;
	}

	getOpenFileUrl(itemId) {
		return `${this.getHostApiUrl()}/item/${itemId}/download?contentDisposition=inline${this.setTokenIntoUrl(authService.getToken(), "&")}`;
	}

	getJSONFileData(itemId, sourceParams) {
		const params = sourceParams || {
			contentDisposition: "inline"
		};
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item/${itemId}/download`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getLinearStucture(folderId, sourceParams) {
		const params = sourceParams ? {
			type: "folder",
			limit: sourceParams.limit || 50,
			offset: sourceParams.offset || 0,
			sort: sourceParams.sort || "lowerName",
			sortdir: sourceParams.sortdir || 1
		} : {};
		return this._ajax()
			.get(`${this.getHostApiUrl()}/resource/${folderId}/items`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	putNewFolderName(folderId, name) {
		const params = {
			name
		};
		return this._ajax()
			.put(`${this.getHostApiUrl()}/folder/${folderId}`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	makeLargeImage(itemId) {
		return this._ajax()
			.post(`${this.getHostApiUrl()}/item/${itemId}/tiles`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	updateItemMetadata(itemId, metadataObject) {
		const metadata = metadataObject ? {
			metadata: metadataObject
		} : {};
		return this._ajax()
			.put(`${this.getHostApiUrl()}/item/${itemId}/metadata`, metadata)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	deleteItemMetadata(itemId, fields) {
		if (!Array.isArray(fields)) {
			fields = [fields];
		}
		const fielsdObj = fields.length ? {
			fields
		} : {};
		return this._ajax()
			.del(`${this.getHostApiUrl()}/item/${itemId}/metadata`, fielsdObj)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	putNewItemName(itemId, name) {
		const params = {
			name
		};
		return this._ajax()
			.put(`${this.getHostApiUrl()}/item/${itemId}`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	updateFolderMetadata(folderId, metadata) {
		return this._ajax()
			.put(`${this.getHostApiUrl()}/folder/${folderId}/metadata`, metadata)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	recognizeOption(idsArray, option) {
		const ids = idsArray.join(",");
		return this._ajax()
			.get(`${constants.RECOGNIZE_SERVICE_PATH}/${option}?ids=${ids}`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	// update when API fixes
	/* updateItemTag(itemId, itemTag) {
		return this._ajax()
			.put(`${this.getHostApiUrl()}/item/${itemId}/aperio?tag=${itemTag}`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	} */

	getItem(id) {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item/${id}`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}
}

const instance = new AjaxActions();
export default instance;
