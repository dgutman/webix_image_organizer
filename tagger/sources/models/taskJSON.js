class TaskJSONCollection {
	add(obj) {
		this.JSON = obj;
	}

	get() {
		return this.JSON;
	}

	remove() {
		this.JSON = null;
	}
}
export default new TaskJSONCollection();
