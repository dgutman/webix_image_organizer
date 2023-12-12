export default class PaperItemsModel {
	constructor(paperScope) {
		if (!PaperItemsModel.instance) {
			this._items = paperScope?.project.getItems();
			PaperItemsModel.instance = this._items ? this : null;
		}
		return PaperItemsModel.instance;
	}
}
