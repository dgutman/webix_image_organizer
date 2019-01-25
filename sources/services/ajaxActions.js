import authService from "./authentication";

function parseError(xhr) {
	let message;
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
				message = xhr.response;
				console.log("Not JSON response for request to " + xhr.responseURL);
			}
			webix.message({type: "error", text: message, expire: 5000});
			break;
		}
	}
	return Promise.reject(xhr);
}

webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers, files, promise) => {
	let toSearchInUrl = "cdn.webix.com";
	let searchedInUrl = url.search(toSearchInUrl);
	if (searchedInUrl === -1) {
		headers["Girder-Token"] = authService.getToken();
	}
});

class AjaxActions {

	getHostApiUrl() {
		return webix.storage.local.get("hostAPI");
	}

	setTokenIntoUrl(token, symbol) {
		return token ? `${symbol}token=${token}` : "";
	}


	_ajax() {
		return webix.ajax();
	}

	_parseData(data) {
		return data ? data.json() : data;
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
				"Authorization": `Basic ${hash}`
			})
			.get(`${this.getHostApiUrl()}/user/authentication`)
			.then(result => this._parseData(result));
	}

	logout() {
		return webix.ajax().del(`${this.getHostApiUrl()}/user/authentication`)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	getUserInfo() {
		return this._ajax().get(`${this.getHostApiUrl()}/user/me`)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	getCollection() {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/collection`)
			.then(result => this._parseData(result));
	}

	getFolder(parentType, parentId) {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/folder?parentType=${parentType}&parentId=${parentId}`)
			.then(result => this._parseData(result));
	}

	getItems(folderId) {
		const params = {
			limit: 0
		};
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item?folderId=${folderId}`, params)
			.then(result => this._parseData(result));
	}

	getImage(imageId, height, width, imageType) {
		const params = {};
		if (height) {
			params.height = height;
		}
		if (width) {
			params.width = width;
		}

		return webix.ajax().response("blob").get(`${this.getHostApiUrl()}/item/${imageId}/tiles/${imageType}`, params)
			.fail(parseError);
	}

	downloadItem(itemId) {
		return `${this.getHostApiUrl()}/item/${itemId}/download${this.setTokenIntoUrl(authService.getToken(), "?")}`;
	}

	getImageTiles(itemId) {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item/${itemId}/tiles`)
			.then(result => this._parseData(result));
	}

	getImageTileUrl(itemId, z, x, y) {
		return `${this.getHostApiUrl()}/item/${itemId}/tiles/zxy/${z}/${x}/${y}?edge=crop${this.setTokenIntoUrl(authService.getToken(), "&")}`;
	}

	getOpenFileUrl(itemId) {
		return `${this.getHostApiUrl()}/item/${itemId}/download?contentDisposition=inline${this.setTokenIntoUrl(authService.getToken(), "&")}`;
	}

	getJSONFileData(itemId, sourceParams) {
		const params = sourceParams ? sourceParams : {
			contentDisposition: "inline"
		};
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item/${itemId}/download`, params)
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
			.then(result => this._parseData(result));
	}

	putNewFolderName(folderId, name) {
		const params = {
			name: name
		};
		return this._ajax()
			.put(`${this.getHostApiUrl()}/folder/${folderId}`, params)
			.then(result => this._parseData(result));
	}

	makeLargeImage(itemId) {
		return this._ajax()
			.post(`${this.getHostApiUrl()}/item/${itemId}/tiles`)
			.then(result => this._parseData(result));
	}

	putNewMetadata(itemId, metadataObject) {
		let objectToPut = {
			metadata: metadataObject
		};
		return this._ajax()
			.put(`${this.getHostApiUrl()}/item/${itemId}/metadata`, objectToPut)
			.then(result => this._parseData(result));
	}

	putNewItemName(itemId, name) {
		const params = {
			name: name
		};
		return this._ajax()
			.put(`${this.getHostApiUrl()}/item/${itemId}`, params)
			.then(result => this._parseData(result));
	}

}

const instance = new AjaxActions();
export default instance;
