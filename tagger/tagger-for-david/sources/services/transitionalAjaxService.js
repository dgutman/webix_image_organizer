import constants from "../constants";

const TRANSITIONAL_API = constants.TRANSITIONAL_TAGGER_SERVER_PARH;

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
				console.log(`Not JSON response for request to ${xhr.responseURL}`);
			}
			webix.message({text: message, expire: 5000});
			break;
		}
	}
	return Promise.reject(xhr);
}

class TransitionalAjaxService {
	getHostApiUrl() {
		return webix.storage.local.get("hostAPI");
	}

	_ajax() {
		return webix.ajax();
	}

	_parseData(data) {
		return data ? data.json() : data;
	}

	getTagsByCollection(collectionIds) {
		const params = {
			collectionIds: collectionIds || []
		};
		return this._ajax().get(`${TRANSITIONAL_API}/tags/collection`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	createTags(tags, collectionIds) {
		const params = {
			tags,
			collectionIds
		};
		return this._ajax().post(`${TRANSITIONAL_API}/tags`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	updateTags(tags) {
		const params = {
			tags
		};
		return this._ajax().put(`${TRANSITIONAL_API}/tags/many`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	deleteTags(tagIds) {
		const params = {
			tagIds
		};
		return this._ajax().del(`${TRANSITIONAL_API}/tags`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	getResourceImages(collectionId) {
		const hostApi = this.getHostApiUrl();
		const params = {
			collectionId,
			hostApi
		};

		return this._ajax().post(`${TRANSITIONAL_API}/images/resource`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	getImagesByCollection({collectionIds, tag, offset, limit, value, confidence, latest, s}) {
		const params = {
			ids: collectionIds || [],
			offset: offset || 0,
			limit: limit || 50,
			value: value || undefined,
			confidence: confidence || undefined,
			latest: latest || undefined,
			s: s || undefined
		};

		return this._ajax().get(`${TRANSITIONAL_API}/images/tag/${tag}/collections`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	updateImages(addIds, removeIds, tagId, valueId, confidence) {
		const params = {
			addIds: addIds || [],
			removeIds: removeIds || [],
			tagId: tagId || undefined,
			valueId: valueId || undefined,
			confidence: confidence || undefined
		};

		return this._ajax().put(`${TRANSITIONAL_API}/images/many`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	createValues(values) {
		const params = {
			values
		};

		return this._ajax().post(`${TRANSITIONAL_API}/values`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	getValuesByTags(tagIds) {
		const params = {
			tagIds: tagIds || []
		};

		return this._ajax().get(`${TRANSITIONAL_API}/values/tag`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	updateValues(values) {
		const params = {
			values
		};
		return this._ajax().put(`${TRANSITIONAL_API}/values/many`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	getConfidenceLevels() {
		return this._ajax().get(`${TRANSITIONAL_API}/confidence`)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	getNotesByUser(userId) {
		return this._ajax().get(`${TRANSITIONAL_API}/notes/${userId}`)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	createNote(note, userId) {
		const params = {
			created: note.created || Date.now(),
			content: note.content || "",
			userId
		};
		return this._ajax().post(`${TRANSITIONAL_API}/notes`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	updateNote(id, content) {
		const params = {
			content: content || ""
		};
		return this._ajax().put(`${TRANSITIONAL_API}/notes/${id}`, params)
			.fail(parseError)
			.then(result => this._parseData(result));
	}

	removeNote(id) {
		return this._ajax().del(`${TRANSITIONAL_API}/notes/${id}`)
			.fail(parseError)
			.then(result => this._parseData(result));
	}
}

const instance = new TransitionalAjaxService();
export default instance;
