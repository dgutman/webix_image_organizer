export default class CaseDataModel {
	constructor(itemCollection) {
		if (!CaseDataModel.instance) {
			this.itemCollection = itemCollection;
			this.dataCollection = new webix.DataCollection();
			CaseDataModel.instance = this;
		}
	}

	static getInstanceModel() {
		return CaseDataModel.instance;
	}
}
