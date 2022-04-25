import constants from "../constants";

function showValidationErrors(arr) {
	arr.forEach((err) => {
		const dataPathString = err.dataPath ? `<strong class='strong-font'>${err.dataPath.replace(".", "")}</strong>: <br>` : "";
		const text = `${dataPathString} ${err.message}`;
		webix.message({text, expire: 5000, id: text});
	});
}

export default class AjaxClass {
	getHostApiUrl() {
		return webix.storage.local.get("hostAPI");
	}

	_ajax() {
		return webix.ajax();
	}

	_parseData(data) {
		return data ? data.json() : data;
	}

	async _parseError(xhr) {
		let message;
		switch (xhr.status) {
			case 404: {
				message = "Not found";
				webix.message({type: "error", text: message});
				break;
			}
			default: {
				try {
					let jsonResponse = xhr.response;
					if (xhr.response instanceof Blob) {
						jsonResponse = await xhr.response.text();
					}
					let response = JSON.parse(jsonResponse);
					message = response.message;
				}
				catch (e) {
					message = xhr.response || constants.CONNECTION_ERROR_MESSAGE;
					if (xhr.responseURL) console.log(`Not JSON response for request to ${xhr.responseURL}`);
				}
				if (Array.isArray(message)) {
					showValidationErrors(message);
				}
				else if (!webix.message.pull[message]) {
					const expire = message === constants.CONNECTION_ERROR_MESSAGE ? -1 : 5000;
					webix.message({text: message, expire, id: message});
				}
				break;
			}
		}
		return Promise.reject(xhr);
	}
}
