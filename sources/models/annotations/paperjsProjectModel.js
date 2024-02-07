import PaperScope from "./paperjsScopeModel";

export default class Project {
	constructor(tk) {
		this._tk = tk;
		this._paperScopeModel = new PaperScope(tk);
		this._paperScope = this._paperScopeModel.getPaperScope();
		if (!Project.instance) {
			this._project = tk ? tk.overlay.paperScope.project : null;
			Project.instance = this._project ? this : null;
		}
		Project.instance._tk = tk;
		return Project.instance;
	}

	static getInstanceModel() {
		return Project.instance;
	}

	getProject() {
		return this._project;
	}

	isEmpty() {
		return this._project?.isEmpty();
	}

	clearProject() {
		this._project.clear();
	}
}
