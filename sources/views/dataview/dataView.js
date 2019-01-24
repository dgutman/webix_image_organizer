import {JetView} from "webix-jet";
import "../components/activeDataview";
import DataviewService from "../../services/dataview/dataview";
import authService from "../../services/authentication";
import constants from "../../constants";
import selectedDataviewItems from "../../models/selectDataviewItems";
import collapser from "../components/collapser";
import tableRightPanel from "./tableRightPanel";
import dataViews from "../../models/dataViews";

const collapserName = "tableTemplateCollapser";

export default class DataTableView extends JetView {

	config() {
		const tableCollapser = collapser.getConfig(constants.ID_DATATABLE_IMAGES_TEMPLATE, {type: "right", closed: true}, collapserName);

		const itemsDataTable = {
			view: "datatable",
			drag: true,
			select: true,
			editaction: "custom",
			editable: true,
			dragColumn: false,
			resizeColumn: false,
			columns: [] //init in mainService.js
		};

		const galleryHeaderTemplate = {
			css: "gallery-header-template",
			view: "template",
			name: "selectImagesTemplateName",
			height: 30,
			hidden: true,
			template() {
				let text = `<span class='gallery-select-all-images link'> Select All on the Page</span> or
								<span class='gallery-select-first-count-images link'> Select the First</span> ${constants.MAX_COUNT_IMAGES_SELECTION} images. You can select maximum ${constants.MAX_COUNT_IMAGES_SELECTION} images.`;
				const selectedImagesCount = selectedDataviewItems.count();
				if (selectedImagesCount) {
					return `${text} <span class='unselect-images-link link'>Unselect ${selectedImagesCount} ${selectedImagesCount === 1 ? "image" : "images"}</span>`;
				}
				return text;
			}
		};

		const itemsDataView = {
			view: "activeDataview",
			tooltip: (obj) => obj.name,
			css: "gallery-images-dataview",
			select: true,
			datathrottle: 500,
			minWidth: 860,
			onContext: {},
			type: {
				width: 150,
				height: 135
			},
			activeContent: {
				markCheckbox: {
					view: "checkbox",
					css: "checkbox-ctrl",
					width: 20,
					height: 30,
					on: {
						onChange(value, oldValue) {
							if (value !== oldValue) {
								const item = dataViews.getDataview().getItem(this.config.$masterId);
								item.markCheckbox = value;
								selectedDataviewItems.add(item.id);
								dataViews.getDataview().callEvent("onCheckboxClicked", [item, value]);
							}
						}
					}
				}
			}
		};

		const editColumnButton = {
			view: "button",
			name: "editColumnButtonName",
			type: "icon",
			icon: "pencil-square-o",
			width: 170,
			height: 30,
			label: "Show or hide columns"
		};

		let exportButton = {
			view: "button",
			name: "exportButton",
			type: "icon",
			icon: "share-square-o",
			label: "Export to excel",
			width: 130,
			height: 30
		};

		const datatableCell = {
			name: "datatableCell",
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
						tableRightPanel
					]
				}
			]
		};

		const dataviewCell = {
			name: "dataviewCellName",
			rows: [
				galleryHeaderTemplate,
				itemsDataView
			]
		};

		const multiDataView = {
			view: "multiview",
			cells: [
				dataviewCell,
				datatableCell
			]
		};

		return {
			name: "multiDataviewClass",
			rows: [
				multiDataView
			]
		};
	}

	ready(view) {
		const dataview = this.getDataView();
		this.datatable = this.getDataTableView();
		const editColumnButton = this.getEditColumnButton();
		const exportButton = this.getExportButton();
		const selectImagesTemplate = this.getSelectImagesTemplate();
		this.datatableImagesTemplate = this.getDatatableImagesTemplate();

		this.dataviewService =  new DataviewService(
			view,
			dataview,
			this.datatable,
			editColumnButton,
			exportButton,
			selectImagesTemplate,
			this.datatableImagesTemplate
		);

		if (authService.isLoggedIn()) {
			return this.getEditColumnsPanel().show();
		}

	}

	getEditColumnsPanel() {
		return this.getRoot().queryView({name: "editColumnsPanel"});
	}

	getDatatableCell() {
		return this.getRoot().queryView({name: "datatableCell"});
	}

	getDataView() {
		return this.getRoot().queryView({view: "activeDataview"});
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

	getDataviewCell() {
		return this.getRoot().queryView({name: "dataviewCellName"});
	}

	getSelectImagesTemplate() {
		return this.getRoot().queryView({name: "selectImagesTemplateName"});
	}

	getDatatableImagesTemplate() {
		return this.getRoot().queryView({name: "datatableImagesTemplate"});
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