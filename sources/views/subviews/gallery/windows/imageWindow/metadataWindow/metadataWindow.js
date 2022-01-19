import {JetView} from "webix-jet";
import MetadataTableView from "./metadataTable";

export default class MetadataPopup extends JetView {
	config() {
		const popup = {
			view: "window",
			height: 500,
			width: 700,
			resize: true,
			position: "center",
			move: true,
			head: {
				view: "toolbar",
				borderless: true,
				padding: 10,
				cols: [
					{view: "label", label: "Metadata"},
					{
						view: "icon",
						icon: "fa fa-times",
						click: () => {
							this.hideWindow();
						}
					}
				]
			},
			body: MetadataTableView,
			on: {
				onViewResize: () => {
					const comboPopup = this.getRoot().queryView({name: "tablesCombo"}).getPopup();
					if (comboPopup.isVisible()) {
						comboPopup.hide();
					}
				}
			}
		};

		return popup;
	}

	setCaseId(caseId) {
		this.caseId = caseId;
	}

	getCaseId() {
		return this.caseId;
	}

	showWindow(item) {
		if (item.tcga && item.tcga.caseId) {
			let caseId = item.tcga.caseId;
			this.setCaseId(caseId);
		}
		let datatableView = this.getRoot().getBody();
		if (datatableView) {
			this.app.callEvent("setMetadataToDatatable", [item._id, item]);
			datatableView.queryView({view: "combo"}).render();
		}
		this.getRoot().show();
	}

	hideWindow() {
		this.setCaseId();
		this.getRoot().hide();
	}
}
