import {JetView} from "webix-jet";
import ajax from "../../../../../../services/ajaxActions";

const serverUrl = ajax.getHostApiUrl;

export default class MetadataTableView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "combo",
					name: "tablesCombo",
					borderless: true,
					options: {
						body: {
							template: "#name#"
						}
					},
					on: {
						onChange: (id) => {
							const table = this.getRoot().queryView({name: "tablesCombo"}).getList().getItem(id);
							let caseId;
							if (this.getRoot().getParentView().config
							&& this.getRoot().getParentView().config.$scope
							&& this.getRoot().getParentView().config.$scope.caseId) {
								caseId = this.getRoot().getParentView().config.$scope.caseId;
							}
							else if (this.getRoot().getParentView().getChildViews()[0]) {

								const mainImageViewLayout = this.getRoot().getParentView().getChildViews()[0];
								if (mainImageViewLayout.$scope.item && mainImageViewLayout.$scope.item.tcga) {
									caseId = mainImageViewLayout.$scope.item.tcga.caseId;
								}
							}
							const datatable = this.getRoot().queryView({view: "datatable"});
							datatable.clearAll();
							if (table && table.name !== "clinical metadata") {
								webix.ajax(`${serverUrl}/tcga/case/${caseId}/metadata/${table.name}`).then(data => data.json())
									.then((data) => {
										this.parseDataToDatatable(data);
									});
							}
							else if (table && table.name === "clinical metadata") {
								this.parseDataToDatatable(this.currentSlide.meta.clinicalMetaData);
							}
						},
						onAfterRender: () => {
							let caseId;
							if (this.getRoot().getParentView().config
							&& this.getRoot().getParentView().config.$scope
							&& this.getRoot().getParentView().config.$scope.caseId) {
								caseId = this.getRoot().getParentView().config.$scope.caseId;
							}
							else if (this.getRoot().getParentView().getChildViews()[0]) {
								const mainImageViewLayout = this.getRoot().getParentView().getChildViews()[0];
								if (mainImageViewLayout.$scope.item && mainImageViewLayout.$scope.item.tcga) {
									caseId = mainImageViewLayout.$scope.item.tcga.caseId;
								}
							}
							const combo = this.getRoot().queryView({name: "tablesCombo"});
							combo.setValue();
							const datatable = this.getRoot().queryView({view: "datatable"});
							datatable.clearAll();
							let comboList = combo.getList();
							comboList.clearAll();
							if (this.currentSlide
							&& this.currentSlide.meta
							&& this.currentSlide.meta.clinicalMetaData) {
								comboList.add({name: "clinical metadata"});
								const firstId = comboList.getFirstId();
								combo.setValue(firstId);
							}
							if (caseId) {
								webix.ajax(`${serverUrl}/tcga/case/${caseId}/metadata/tables`).then((data) => {
									data = data.json();
									if (data.length != 0) {
										let comboData = [];
										data.forEach((obj) => {
											let comboObj = {};
											comboObj.name = obj;
											comboObj.value = obj;
											comboData.push(comboObj);
										});
										comboList.parse(comboData);
										const firstId = comboList.getFirstId();
										combo.setValue(firstId);
									}
									else {
										webix.message({type: "debug", text: "This case doesn't have metadata tables."});
										this.getRoot().queryView({view: "datatable"}).clearAll();
										this.getRoot().queryView({name: "tablesCombo"}).setValue(data);
										this.getRoot().queryView({name: "tablesCombo"}).getPopup().getList().clearAll();
									}
								});
							}
						}
					}
				},
				{
					view: "datatable",
					select: "row",
					columns: [
						{id: "key", header: "Key"},
						{id: "value", header: "Value"},
						{id: "fillspace", header: "", fillspace: true}
					]
				}
			],
			name: "metadataView"
		};
	}

	setItemId(itemId) {
		this.itemId = itemId;
	}

	getItemId() {
		return this.itemId;
	}

	init() {
		this.on(this.app, "setMetadataToDatatable", (itemId, item) => {
			if (item) {
				this.currentSlide = item;
				this.getRoot().queryView({name: "tablesCombo"}).render();
			}
			if (this.getItemId() !== itemId && this.getItemId !== undefined) {
				this.setItemId(itemId);
				this.getRoot().queryView({name: "tablesCombo"}).render();
			}
		});
	}

	parseDataToDatatable(data) {
		const datatable = this.getRoot().queryView({view: "datatable"});
		const meta = [];

		for (let i = 0; i < Object.keys(data).length; i++) {
			let obj = {};
			obj.key = Object.keys(data)[i];
			obj.value = Object.values(data)[i];
			meta.push(obj);
		}

		datatable.parse(meta);
		datatable.adjustColumn("key");
		datatable.adjustColumn("value");
		datatable.adjustColumn("fillspace");
		datatable.refreshColumns();
	}
}
