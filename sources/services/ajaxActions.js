import authService from "./authentication";
import constants from "../constants";

const connectionMessage = "Server connection error.<br /> Please check the connection.";

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
				message = xhr.response || connectionMessage;
				if (xhr.responseURL) console.log(`Not JSON response for request to ${xhr.responseURL}`);
			}
			if (!webix.message.pull[message]) {
				const expire = message === connectionMessage ? -1 : 5000;
				webix.message({text: message, expire, id: message});
			}
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
				Authorization: `Basic ${hash}`
			})
			.get(`${this.getHostApiUrl()}/user/authentication`)
			.then(result => this._parseData(result));
	}

	logout() {
		return webix.ajax().del(`${this.getHostApiUrl()}/user/authentication`)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	getUserInfo() {
		return this._ajax().get(`${this.getHostApiUrl()}/user/me`)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	getCollection() {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/collection`)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	getFolders(parentType, parentId, offset, limit) {
		limit = typeof limit === "number" ? limit : constants.FOLDERS_LIMIT;
		return this._ajax()
			.get(`${this.getHostApiUrl()}/folder?parentType=${parentType}&parentId=${parentId}&limit=${limit}`)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	getFolderById(id) {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/folder/${id}`)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	getItems(folderId) {
		const params = {
			limit: 0
		};
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item?folderId=${folderId}`, params)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	getImage(imageId, imageType, params) {
		const token = authService.getToken();
		params = params || {};
		params.token = token;
		const paramsArray = Object.entries(params);
		const searchParams = new URLSearchParams("");
		paramsArray.forEach((item) => { searchParams.append(...item); });
		const queryString = searchParams.toString();
		const url = `${this.getHostApiUrl()}/item/${imageId}/tiles/${imageType}?${queryString || ""}`;

		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = url;
			img.addEventListener("error", () => {
				reject();
			});
			img.addEventListener("load", () => {
				resolve(url);
			});
		});
	}

	downloadItem(itemId) {
		return `${this.getHostApiUrl()}/item/${itemId}/download${this.setTokenIntoUrl(authService.getToken(), "?")}`;
	}

	getImageTiles(itemId) {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item/${itemId}/tiles`)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	getImageTilesHistogram(itemId, frame, binsSettings) {
		const settings = {
			width: 2048,
			height: 2048,
			bins: 256,
			...binsSettings
		};
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.append("frame", frame);
		Object.entries(settings).forEach(([paramKey, param]) => {
			if (param != null) {
				urlSearchParams.append(paramKey, param);
			}
		});
		const query = urlSearchParams.toString();
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item/${itemId}/tiles/histogram?${query}`)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	getImageTileUrl(itemId, z, x, y) {
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.append("edge", "crop");
		urlSearchParams.append("token", authService.getToken());
		return `${this.getHostApiUrl()}/item/${itemId}/tiles/zxy/${z}/${x}/${y}?${urlSearchParams.toString()}`;
	}

	getImageFrameTileUrl(itemId, frame, z, x, y) {
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.append("edge", "crop");
		urlSearchParams.append("token", authService.getToken());
		return `${this.getHostApiUrl()}/item/${itemId}/tiles/fzxy/${frame}/${z}/${x}/${y}?${urlSearchParams.toString()}`;
	}

	getImageColoredFrameTileUrl(itemId, frame, coords, colorSettings) {
		const {x, y, z} = coords;
		const {
			palette1 = "rgb(0,0,0)",
			palette2 = "rgb(204,240,0)",
			min = 100,
			max = 65000
		} = colorSettings;
		const style = {
			min,
			max,
			palette: [palette1, palette2]
		};
		const urlSearchParams = new URLSearchParams();
		urlSearchParams.append("edge", "crop");
		urlSearchParams.append("frame", frame);
		urlSearchParams.append("token", authService.getToken());
		urlSearchParams.append("style", JSON.stringify(style));

		return `${this.getHostApiUrl()}/item/${itemId}/tiles/zxy/${z}/${x}/${y}?${urlSearchParams.toString()}`;
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
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	getLinearStructure(folderId, sourceParams) {
		const params = sourceParams ? {
			type: "folder",
			limit: sourceParams.limit || constants.LINEAR_STRUCTURE_LIMIT,
			offset: sourceParams.offset || 0,
			sort: sourceParams.sort || "lowerName",
			sortdir: sourceParams.sortdir || 1
		} : {};
		return this._ajax()
			.get(`${this.getHostApiUrl()}/resource/${folderId}/items`, params)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	putNewFolderName(folderId, name) {
		const params = {
			name
		};
		return this._ajax()
			.put(`${this.getHostApiUrl()}/folder/${folderId}`, params)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	makeLargeImage(itemId) {
		return this._ajax()
			.post(`${this.getHostApiUrl()}/item/${itemId}/tiles`)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	updateItemMetadata(itemId, metadataObject, type = "item") {
		const metadata = metadataObject ? {
			metadata: metadataObject
		} : {};
		return this._ajax()
			.put(`${this.getHostApiUrl()}/${type}/${itemId}/metadata`, metadata)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	updatePatientMetadata(patientId, metadataObject, type = "item") {
		// Patient data store in the same endpoint as item
		return this.updateItemMetadata(patientId, metadataObject, type);
	}

	deleteItemMetadata(itemId, fields, type) {
		const modelType = type || "item";
		fields = fields || [];
		const params = {
			fields
		};

		return this._ajax()
			.del(`${this.getHostApiUrl()}/${modelType}/${itemId}/metadata`, params)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	putNewItemName(itemId, name) {
		const params = {
			name
		};
		return this._ajax()
			.put(`${this.getHostApiUrl()}/item/${itemId}`, params)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	createNewItem(folderId, name) {
		const params = {
			folderId,
			name
		};
		return this._ajax()
			.post(`${this.getHostApiUrl()}/item`, params)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	updateFolderMetadata(folderId, metadata) {
		return this._ajax()
			.headers({
				"Content-type": "application/json"
			})
			.put(`${this.getHostApiUrl()}/folder/${folderId}/metadata`, metadata)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	recognizeOption(idsArray, option) {
		const ids = idsArray.join(",");
		return this._ajax()
			.get(`${constants.RECOGNIZE_SERVICE_PATH}/${option}?ids=${ids}&apiUrl=${this.getHostApiUrl()}`)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	// update when API fixes
	/* updateItemTag(itemId, itemTag) {
		return this._ajax()
			.put(`${this.getHostApiUrl()}/item/${itemId}/aperio?tag=${itemTag}`)
			.catch(parseError)
			.then(result => this._parseData(result));
	} */

	getItem(id) {
		return this._ajax()
			.get(`${this.getHostApiUrl()}/item/${id}`)
			.catch(parseError)
			.then(result => this._parseData(result));
	}

	getBlobFile(id) {
		return this._ajax()
			.get(this.getOpenFileUrl(id))
			.catch(parseError);
	}

	postNewFolder(folder) {
		const params = {
			name: folder.name,
			parentId: folder.parentId,
			parentType: folder.parentType
		};
		return this._ajax()
			.post(`${this.getHostApiUrl()}/folder`, params)
			.catch(parseError)
			.then(result => this._parseData(result));
	}
}

const instance = new AjaxActions();
export default instance;
