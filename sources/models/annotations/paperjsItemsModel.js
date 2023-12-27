export default class PaperItemsModel {
	constructor(paperScope) {
		if (!PaperItemsModel.instance) {
			this._paperScope = paperScope;
			this._items = paperScope?.project.getItems();
			PaperItemsModel.instance = this._items ? this : null;
		}
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
