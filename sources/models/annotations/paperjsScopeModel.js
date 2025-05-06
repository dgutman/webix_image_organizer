export default class PaperScope {
	constructor(tk) {
		this._tk = tk;
		if (!PaperScope.instance) {
			this._paperScope = tk?.overlay.paperScope;
			PaperScope.instance = this._paperScope ? this : null;
		}
		PaperScope.instance._tk = tk;
		return PaperScope.instance;
	}

	getPaperScope() {
		return this._paperScope;
	}
}
