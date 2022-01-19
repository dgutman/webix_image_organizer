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
			select: true,
			editaction: "custom",
			editable: true,
			dragColumn: false,
			resizeColumn: false,
			fixedRowHeight: false,
			spans: true,
			tooltip: true,
			columns: [] // init in mainService.js
		};

		const editColumnButton = {
			view: "button",
			name: "editColumnButtonName",
			type: "icon",
			icon: "fa fa-edit",
			css: "metadtable-edit-column-button",
			width: 200,
			height: 30,
			label: "Show or hide columns"
		};

		let exportButton = {
			view: "button",
			name: "exportButton",
			type: "icon",
			icon: "fa fa-share-square",
			css: "metadtable-export-button",
			label: "Export to excel",
			width: 140,
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
							css: "metadatatable-layout",
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

		this.metadataTableService = new MetadataTableService(
			view,
			this.metadataTable,
			editColumnButton,
			exportButton,
			metadataTableThumbnailsTemplate
		);

		if (authService.isLoggedIn()) {
			this.getEditColumnsPanel().show();
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
		const dataOrder = this.metadataTable.data.order;
		if (dataOrder.length) {
			const columns = this.metadataTable.config.columns;
			if (columns.length) {
				webix.toExcel(this.metadataTable, {
					filterHTML: true
				});
			}
			else {
				webix.alert({
					title: "Error!",
					type: "alert-error",
					text: "There are no columns to export"
				});
			}
		}
		else {
			webix.alert({
				title: "Error!",
				type: "alert-error",
				text: "There is no data to export"
			});
		}
	}
}
