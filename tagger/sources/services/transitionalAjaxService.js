import constants from "../constants";
import AjaxClass from "./ajaxClass";

const TRANSITIONAL_API = constants.TRANSITIONAL_TAGGER_SERVER_PARH;

class TransitionalAjaxService extends AjaxClass {
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
			.get(`${TRANSITIONAL_API}/auth`, {redirect_url: this.getHostApiUrl()})
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	logout() {
		const params = {
			host: this.getHostApiUrl()
		};

		return webix.ajax().del(`${TRANSITIONAL_API}/auth`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getTagsByCollection(collectionIds) {
		const params = {
			collectionIds: collectionIds || []
		};
		return this._ajax().get(`${TRANSITIONAL_API}/tags/collection`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getTagTemplates() {
		return this._ajax().get(`${TRANSITIONAL_API}/tags`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getTagTemplatesWithValues() {
		return this._ajax().get(`${TRANSITIONAL_API}/tags/template`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	createTags(tags, collectionIds) {
		const params = {
			tags,
			collectionIds
		};
		return this._ajax().post(`${TRANSITIONAL_API}/tags`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	updateTags(tags, onlyTags) {
		const params = {
			tags,
			onlyTags
		};
		return this._ajax().put(`${TRANSITIONAL_API}/tags/many`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	deleteTags(tagIds) {
		const params = {
			tagIds
		};
		return this._ajax().del(`${TRANSITIONAL_API}/tags`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getResourceImages(resourceId, type) {
		const hostApi = this.getHostApiUrl();
		const params = {
			resourceId,
			hostApi,
			type
		};

		return this._ajax().post(`${TRANSITIONAL_API}/images/resource`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getResourceFolders(collectionId) {
		const hostApi = this.getHostApiUrl();
		const params = {
			collectionId,
			hostApi
		};

		return this._ajax().post(`${TRANSITIONAL_API}/folders/resource`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getImagesByCollection({ids, tag, offset, limit, value, confidence, latest, s}) {
		const params = {
			ids: ids || [],
			offset: offset || 0,
			limit: limit || 50,
			value: value || undefined,
			confidence: confidence || undefined,
			latest: latest || undefined,
			s: s || undefined
		};

		return this._ajax().get(`${TRANSITIONAL_API}/images/tag/${tag}/collections`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getImagesByFolder({ids, tag, offset, limit, value, confidence, latest, s}) {
		const params = {
			ids: ids || [],
			offset: offset || 0,
			limit: limit || 50,
			value: value || undefined,
			confidence: confidence || undefined,
			latest: latest || undefined,
			s: s || undefined
		};

		return this._ajax().get(`${TRANSITIONAL_API}/images/tag/${tag}/folders`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getImagesByTask({ids, offset, limit, filters}) {
		const params = {
			ids: ids || [],
			offset: offset || 0,
			limit: limit || 50
		};
		if (filters) params.filters = filters;

		return this._ajax().get(`${TRANSITIONAL_API}/images/task`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	reviewImages(images, taskIds, preliminarily) {
		const params = {
			images: images || [],
			taskIds: taskIds || [],
			preliminarily
		};

		return this._ajax().put(`${TRANSITIONAL_API}/images/review`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	unreviewImages(taskIds) {
		const params = {
			taskIds: taskIds || []
		};

		return this._ajax().put(`${TRANSITIONAL_API}/images/unreview`, params)
			.fail(this._parseError)
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
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	createValues(values) {
		const params = {
			values
		};

		return this._ajax().post(`${TRANSITIONAL_API}/values`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getValuesByTags(tagIds) {
		const params = {
			tagIds: tagIds || []
		};

		return this._ajax().get(`${TRANSITIONAL_API}/values/tag`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	updateValues(values, onlyValues) {
		const params = {
			values,
			onlyValues
		};
		return this._ajax().put(`${TRANSITIONAL_API}/values/many`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getConfidenceLevels() {
		return this._ajax().get(`${TRANSITIONAL_API}/confidence`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getNotesByUser(userId) {
		return this._ajax().get(`${TRANSITIONAL_API}/notes/${userId}`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	createNote(note, userId) {
		const params = {
			created: note.created || Date.now(),
			content: note.content || "",
			userId
		};
		return this._ajax().post(`${TRANSITIONAL_API}/notes`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	updateNote(id, content) {
		const params = {
			content: content || ""
		};
		return this._ajax().put(`${TRANSITIONAL_API}/notes/${id}`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	removeNote(id) {
		return this._ajax().del(`${TRANSITIONAL_API}/notes/${id}`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getTasks(collectionId) {
		const hostApi = this.getHostApiUrl();
		const params = {
			collectionId: collectionId || constants.TAGGER_TASKS_COLLECTION_ID,
			host: hostApi
		};

		return this._ajax().get(`${TRANSITIONAL_API}/tasks`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getTagsWithValuesByTask(taskId) {
		const params = {
			taskId
		};

		return this._ajax().get(`${TRANSITIONAL_API}/tags/task`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	createTask(taskData, imageIds) {
		const params = {
			task: taskData,
			imageIds,
			hostApi: this.getHostApiUrl()
		};

		return this._ajax().post(`${TRANSITIONAL_API}/tasks`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	checkTask(taskId) {
		const hostApi = this.getHostApiUrl();
		const params = {
			hostApi
		};

		return this._ajax().put(`${TRANSITIONAL_API}/tasks/check/${taskId}`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getTaskData(collectionId, group) {
		const hostApi = this.getHostApiUrl();
		const params = {
			collectionId: collectionId || constants.TAGGER_TASKS_COLLECTION_ID,
			group,
			host: hostApi,
			type: "default" // to filter girder tasks
		};

		return this._ajax().get(`${TRANSITIONAL_API}/tasks/data`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getTaskResults(taskId) {
		return this._ajax().get(`${TRANSITIONAL_API}/tasks/results/${taskId}`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	deleteTask(id, force) {
		const params = {
			force: force || false
		};

		return this._ajax().del(`${TRANSITIONAL_API}/tasks/${id}`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getTaskJSON(id) {
		const hostApi = this.getHostApiUrl();
		const params = {
			host: hostApi
		};

		return this._ajax().get(`${TRANSITIONAL_API}/tasks/json/${id}`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	groupTasks(ids, groupId) {
		const params = {
			ids: ids || [],
			groupId
		};

		return this._ajax().put(`${TRANSITIONAL_API}/tasks/group`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	updateTask(id, task, imageIds) {
		const host = this.getHostApiUrl();
		const params = {
			task,
			imageIds
		};

		return this._ajax().put(`${TRANSITIONAL_API}/tasks/edit/${id}?host=${host}`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getNotifications() {
		return this._ajax().get(`${TRANSITIONAL_API}/notifications`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	sendNotifications(text, userIds) {
		const params = {
			userIds: userIds || [],
			text: text || ""
		};

		return this._ajax().post(`${TRANSITIONAL_API}/notifications`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	readNotifications(ids) {
		const params = {
			ids: ids || []
		};

		return this._ajax().put(`${TRANSITIONAL_API}/notifications`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	removeNotification(id) {
		return this._ajax().del(`${TRANSITIONAL_API}/notifications/${id}`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	getGroups() {
		return this._ajax().get(`${TRANSITIONAL_API}/groups`)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}

	createGroup(name) {
		const params = {
			name
		};

		return this._ajax().post(`${TRANSITIONAL_API}/groups`, params)
			.fail(this._parseError)
			.then(result => this._parseData(result));
	}
}

const instance = new TransitionalAjaxService();
export default instance;
