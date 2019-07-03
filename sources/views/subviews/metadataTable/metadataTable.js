import {JetView} from "webix-jet";
import "../../components/activeDataview";
import constants from "../../../constants";
import collapser from "../../components/collapser";
import thumbnailsPanel from "./parts/thumbnailsPanel";
import authService from "../../../services/authentication";
import MetadataTableService from "../../../services/metadataTable/metadataTable";

const collapserName = "tableTemplateCollapser";

export default class MetadataTableCellClass extends JetView {
	config() {
		const tableCollapser = collapser.getConfig(constants.ID_DATATABLE_IMAGES_TEMPLATE, {type: "right", closed: true}, collapserName);

		const itemsDataTable = {
			view: "datatable",
			drag: true,
			select: true,
			editaction: "custom",
			css: "metadata-table",
			editable: true,
			dragColumn: false,
			resizeColumn: false,
			tooltip: true,
			columns: [] //init in mainService.js
		};

		const editColumnButton = {
			view: "button",
			name: "editColumnButtonName",
			type: "icon",
			icon: "fa fa-edit",
			width: 170,
			height: 30,
			label: "Show or hide columns"
		};

		let exportButton = {
			view: "button",
			name: "exportButton",
			type: "icon",
			icon: "fa fa-share-square",
			label: "Export to excel",
			width: 130,
			height: 30
		};

		const datatableCell = {
			name: "metadataTableCell",
			rows: [
				{
					hidden: true,
					name: "editColumnsPanel",
					cols: [
						{
							css: {"border-top": "1px solid #BDC4D4"},
							cols: [
								editColumnButton,
								{},
								exportButton
							]
						}
					]
				},
				{
					cols: [
						itemsDataTable,
						tableCollapser,
						thumbnailsPanel
					]
				}
			]
		};

		return datatableCell;
	}

	ready(view) {
		this.metadataTable = this.getDataTableView();
		const editColumnButton = this.getEditColumnButton();
		const exportButton = this.getExportButton();
		const metadataTableThumbnailsTemplate = this.getMetadataTableThumbnailsTemplate();

		this.metadataTableService =  new MetadataTableService(
			view,
			this.metadataTable,
			editColumnButton,
			exportButton,
			metadataTableThumbnailsTemplate
		);

		if (authService.isLoggedIn()) {
			return this.getEditColumnsPanel().show();
		}
	}

	getEditColumnsPanel() {
		return this.getRoot().queryView({name: "editColumnsPanel"});
	}

	getDataTableView() {
		return this.getRoot().queryView({view: "datatable"});
	}

	getEditColumnButton() {
		return this.getRoot().queryView({name: "editColumnButtonName"});
	}

	getExportButton() {
		return this.getRoot().queryView({name: "exportButton"});
	}

	getMetadataTableThumbnailsTemplate() {
		return this.getRoot().queryView({name: "thumbnailsPanelTemplateName"});
	}

	getTableTemplateCollapser() {
		return this.getRoot().queryView({name: collapserName});
	}

	exportToExcel() {
		let dataOrder = this.datatable.data.order;
		if (dataOrder.length === 0) {
			webix.alert({
				title: "Error!",
				type: "alert-error",
				text: "There is nothing to export",
			});
		} else {
			webix.toExcel(this.datatable, {
				filterHTML: true
			});
		}
	}

}