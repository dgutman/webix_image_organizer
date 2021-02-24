
const CONNECTION_ERROR_MESSAGE = "Server connection error.<br /> Please check the connection.";

function getHostId() {
	const hostId = webix.storage.local.get("hostId") || "1";
	return hostId;
}

define(["constants"], function (constants) {
	const LOCAL_API = constants.LOCAL_API;

	class AjaxActions {
		constructor() {
			webix.attachEvent("onBeforeAjax", (mode, url, data, request, headers, files, promise) => {
				let toSearchInUrl = "cdn.webix.com";
				let searchedInUrl = url.search(toSearchInUrl);
				if (searchedInUrl === -1) {
					const tokenObj = webix.storage.local.get(`authToken-${getHostId()}`);
					headers["Girder-Token"] = tokenObj ? tokenObj.token : null;
				}
				if (url.search(LOCAL_API) !== -1) {
					headers["Local-JWT"] = webix.storage.local.get(`localJWT-${getHostId()}`);
				}
			});
		}
	
		getHostApiUrl() {
			return webix.storage.local.get("hostAPI") || constants.HOSTS_LIST[0].hostAPI;
		}
	
		_ajax() {
			return webix.ajax();
		}
	
		_parseData(data) {
			return data ? data.json() : data;
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
						let response = JSON.parse(xhr.response);
						message = response.message;
					}
					catch (e) {
						message = xhr.response || CONNECTION_ERROR_MESSAGE;
						if (xhr.responseURL) console.log(`Not JSON response for request to ${xhr.responseURL}`);
					}
					if (Array.isArray(message)) {
						showValidationErrors(message);
					}
					else if (!webix.message.pull[message]) {
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
			}
			catch (e) {
				console.log("Invalid character in password or login");
			}
			return this._ajax()
				.headers({
					Authorization: `Basic ${hash}`
				})
				.get(`${LOCAL_API}/auth`, {redirect_url: this.getHostApiUrl()})
				.fail(this._parseError)
				.then(result => this._parseData(result));
		}
	
		logout() {
			const params = {
				host: this.getHostApiUrl()
			};
	
			return webix.ajax().del(`${LOCAL_API}/auth`, params)
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

		downloadFolder(id) {
			return this._ajax()
			.response("blob")
			.get(`${this.getHostApiUrl()}/folder/${id}/download`)
			.fail(this._parseError)
		}

		getResourceItems(id, type) {
			const params = {
				type: type || "folder"
			};

			return this._ajax()
			.response("blob")
			.get(`${this.getHostApiUrl()}/resource/${id}/items`, params)
			.fail(this._parseError)
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
	return instance;
});