import PaperScope from "./paperjsScopeModel";

export default class PaperItemsModel {
	constructor(tk) {
		this._paperScopeModel = new PaperScope(tk);
		this._paperScope = this._paperScopeModel.getPaperScope();
		this._tk = tk;
		if (!PaperItemsModel.instance) {
			this._items = this._paperScope?.project.getItems();
			PaperItemsModel.instance = this._items ? this : null;
		}
		PaperItemsModel.instance._tk = tk;
		return PaperItemsModel.instance;
	}

	getItems() {
		return this._items;
	}

	updateItems() {
		const items = this._paperScope?.project.getItems();
		this._items.length = 0;
		this._items.push(...items);
	}
}
