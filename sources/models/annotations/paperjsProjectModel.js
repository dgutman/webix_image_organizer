export default class Project {
	constructor(tk) {
		if (!Project.instance) {
			this._project = tk ? tk.overlay.paperScope.project : null;
			Project.instance = this._project ? this : null;
		}
		return Project.instance;
	}

	static getInstanceModel() {
		return Project.instance;
	}

	getProject() {
		return this._project;
	}
}
