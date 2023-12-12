export default class PaperScope {
	constructor(tk) {
		if (!PaperScope.instance) {
			this._paperScope = tk?.overlay.paperScope;
			PaperScope.instance = this._paperScope ? this : null;
		}
		return PaperScope.instance;
	}

	getPaperScope() {
		return this._paperScope;
	}
}
