
const CONNECTION_ERROR_MESSAGE = "Server connection error.<br /> Please check the connection.";

function getHostId() {
	const hostId = webix.storage.local.get("hostId") || "1";
	return hostId;
}

function getToken() {
	const tokenObj = webix.storage.local.get(`authToken-${getHostId()}`);
	return tokenObj ? tokenObj.token : null;
}

function getStyleParam(params) {
	let styleParam = "";
	if (params.style) {
		styleParam = `&style=${params.style}`;
		delete params.style;
	}
	return styleParam;
}

define(["app", "constants"], function(app, constants) {
	const LOCAL_API = constants.LOCAL_API;

	class AjaxActions {
		constructor() {
			webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers, files, promise) => {
				const toSearchInUrl = "cdn.webix.com";
				const searchedInUrl = url.search(toSearchInUrl);
				if (searchedInUrl === -1) {
					headers["Girder-Token"] = getToken();
				}
				if (url.search(LOCAL_API) !== -1) {
					headers["Local-JWT"] = webix.storage.local.get(`localJWT-${getHostId()}`);
				}
			});
		}

		getHostApiUrl() {
			return webix.storage.local.get("hostAPI") || app.config.hostsList[0].hostAPI;
		}

		_ajax() {
			return webix.ajax();
		}

		_parseData(data) {
			return typeof data.json === 'function' ? data.json() : data;
		}

		_parseError(xhr) {
			let message;
			switch (xhr.status) {
				case 404: {
					message = "Not found";
					webix.message({type: "error", text: message});
					break;
				}
				default: {
					try {
						const response = JSON.parse(xhr.response);
						message = response.message;
					} catch (e) {
						message = xhr.response || CONNECTION_ERROR_MESSAGE;
						if (xhr.responseURL) console.log(`Not JSON response for request to ${xhr.responseURL}`);
					}
					if (Array.isArray(message)) {
						showValidationErrors(message);
					} else if (!webix.message.pull[message]) {
						const expire = message === CONNECTION_ERROR_MESSAGE ? -1 : 5000;
						webix.message({text: message, expire, id: message});
					}
					break;
				}
			}
			return Promise.reject(xhr);
		}

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
			} catch (e) {
				console.log("Invalid character in password or login");
			}
			return this._ajax()
				.headers({
					Authorization: `Basic ${hash}`
				})
				.get(`${LOCAL_API}/auth`, {redirect_url: this.getHostApiUrl()})
				.fail(this._parseError)
				.then((result) => this._parseData(result));
		}

		logout() {
			const params = {
				host: this.getHostApiUrl()
			};

			return webix.ajax().del(`${LOCAL_API}/auth`, params)
				.fail(this._parseError)
				.then((result) => this._parseData(result));
		}

		getUserInfo() {
			return this._ajax().get(`${this.getHostApiUrl()}/user/me`)
				.fail(this._parseError)
				.then((result) => this._parseData(result));
		}

		getCollection() {
			return this._ajax()
				.get(`${this.getHostApiUrl()}/collection`)
				.fail(this._parseError)
				.then((result) => this._parseData(result));
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
				.then((result) => this._parseData(result));
		}

		getFolderDetails(id) {
			return this._ajax()
				.get(`${this.getHostApiUrl()}/folder/${id}/details`)
				.fail(this._parseError)
				.then((result) => this._parseData(result));
		}

		downloadFolder(id) {
			return this._ajax()
			.response("blob")
			.get(`${this.getHostApiUrl()}/folder/${id}/download`)
			.fail(this._parseError);
		}

		getResourceItems(id, type) {
			const params = {
				type: type || "folder"
			};

			return this._ajax()
			.response("blob")
			.get(`${this.getHostApiUrl()}/resource/${id}/items`, params)
			.fail(this._parseError);
		}

		getItems(folderId, options) {
			const params = options || {
				limit: 0
			};

			return this._ajax()
				.get(`${this.getHostApiUrl()}/item?folderId=${folderId}`, params)
				.fail(this._parseError)
				.then((result) => this._parseData(result));
		}

		getImage(imageId, imageType, params) {
			return webix.ajax().response("blob").get(`${this.getHostApiUrl()}/item/${imageId}/tiles/${imageType}`, params);
		}

		updateFolderMetadata(folderId, metadata) {
			return this._ajax()
				.put(`${this.getHostApiUrl()}/folder/${folderId}/metadata`, metadata)
				.fail(this._parseError)
				.then((result) => this._parseData(result));
		}

		getItem(id) {
			return this._ajax()
				.get(`${this.getHostApiUrl()}/item/${id}`)
				.fail(this._parseError)
				.then((result) => this._parseData(result));
		}

		getImageTiles(imageId) {
			return this._ajax()
				.get(`${this.getHostApiUrl()}/item/${imageId}/tiles`)
				.fail(this._parseError)
				.then((result) => this._parseData(result));
		}

		getImageTileUrl(itemId, z, x, y, params = {}) {
			// HACK
			// TO DO: style parameter not working. message from server: "Style is not a valid json object."
			// const styleParam = getStyleParam(params);
			const urlSearchParams = new URLSearchParams();
			urlSearchParams.set("edge", "crop");
			urlSearchParams.set("token", getToken());

			const paramsArray = Object.entries(params);
			paramsArray.forEach(([key, value]) => {
				urlSearchParams.set(key, value);
			});

			return `${this.getHostApiUrl()}/item/${itemId}/tiles/zxy/${z}/${x}/${y}?${urlSearchParams.toString()}`;
		}

		getImageUrl(imageId, imageType = 'thumbnail', params = {}) {
			// HACK
			// TO DO: style parameter not working. message from server: "Style is not a valid json object."
			// const styleParam = getStyleParam(params);
			const searchParams = new URLSearchParams();
			searchParams.set("token", getToken());

			const paramsArray = Object.entries(params);
			paramsArray.forEach(([key, value]) => {
				searchParams.set(key, value);
			});
			return `${this.getHostApiUrl()}/item/${imageId}/tiles/${imageType}?${searchParams.toString()}`;
		}

		getUsers() {
			return this._ajax()
				.get(`${this.getHostApiUrl()}/user?limit=0&sort=lastName&sortdir=1`)
				.fail(this._parseError)
				.then((result) => this._parseData(result));
		}

		// FOR MULTICHANNEL VIEWER
		getImageTilesHistogram(itemId, frame, binsSettings = {}) {
			const settings = {
				width: 2048,
				height: 2048,
				bins: 256,
				resample: false,
				...binsSettings
			};
			const urlSearchParams = new URLSearchParams();
			if(frame) {
				urlSearchParams.append("frame", frame);
			}
			Object.keys(settings).forEach((paramKey) => {
				if (settings[paramKey] != null) {
					urlSearchParams.append(paramKey, settings[paramKey]);
				}
			});
			const query = urlSearchParams.toString();
			return this._ajax()
				.get(`${this.getHostApiUrl()}/item/${itemId}/tiles/histogram?${query}`)
				.catch(this._parseError)
				.then((result) => this._parseData(result));
		}

		getImageFrameTileUrl(itemId, frame, z, x, y) {
			const urlSearchParams = new URLSearchParams();
			urlSearchParams.append("edge", "crop");
			urlSearchParams.append("token", getToken());
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
			urlSearchParams.append("token", getToken());
			urlSearchParams.append("style", JSON.stringify(style));

			return `${this.getHostApiUrl()}/item/${itemId}/tiles/zxy/${z}/${x}/${y}?${urlSearchParams.toString()}`;
		}

		updateItemMetadata(itemId, metadataObject, type = "item") {
			const metadata = metadataObject ? {
				metadata: metadataObject
			} : {};
			return this._ajax()
				.put(`${this.getHostApiUrl()}/${type}/${itemId}/metadata`, metadata)
				.catch(this._parseError)
				.then((result) => this._parseData(result));
		}

		getDownloadedResources() {
			return this._ajax()
				.get(`${LOCAL_API}/resources/downloaded-resources`)
				.fail(this._parseError)
				.then((result) => this._parseData(result));
		}

		deleteResource(id) {
			const promises = [
				this._ajax().del(`${LOCAL_API}/resources/${id}`)
			];
			Promise.all(promises)
				.then((results) => this._parseData(results));
		}
	}

	const instance = new AjaxActions();
	return instance;
});
