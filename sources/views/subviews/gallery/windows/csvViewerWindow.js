import papaparse from "papaparse";
import {JetView} from "webix-jet";

import ajaxActions from "../../../../services/ajaxActions";
import utils from "../../../../utils/utils";

const windowWidth = Math.max(window.innerWidth / 100 * 80, 900);
const windowHeight = Math.max(window.innerHeight / 100 * 80, 700);

export default class CsvViewerWindowView extends JetView {
	config() {
		const csvViewerWindowView = {
			view: "window",
			head: {
				cols: [
					{
						view: "template",
						name: "windowHeaderTemplate",
						css: "large-image-name",
						template: obj => obj.name,
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "fas fa-times",
						width: 30,
						height: 30,
						click: () => this.close()
					}
				]
			},
			modal: true,
			position: "center",
			resize: true,
			width: windowWidth,
			height: windowHeight,
			body: {
				rows: [
					{
						view: "datatable",
						name: "csvDatatable",
						select: "row",
						navigation: true,
						css: "upload-metadatatable",
						resizeColumn: true,
						tooltip: true,
						borderless: true,
						data: [],
						onClick: {
							"adjust-icon": (e, obj) => {
								const columnId = obj.column;
								this.getCsvViewerTable().adjustColumn(columnId, "all");
								return false;
							}
						}
					},
					{
						padding: 10,
						cols: [
							{},
							{
								view: "button",
								css: "btn",
								value: "Download",
								width: 100,
								click: () => {
									const item = this.getWindowHeaderTemplate().getValues();
									let url = ajaxActions.downloadItem(item._id);
									utils.downloadByLink(url, item.name);
								}
							}
						]
					}
				]
			}
		};
		return csvViewerWindowView;
	}

	getCsvViewerTable() {
		return this.getRoot().queryView({name: "csvDatatable"});
	}

	getWindowHeaderTemplate() {
		return this.getRoot().queryView({name: "windowHeaderTemplate"});
	}

	showWindow(obj) {
		this.getWindowHeaderTemplate().parse(obj);
		this.parseFile(obj)
			.then((fileData) => {
				this.fillDatatable(fileData);
				this.getRoot().show();
			});
	}

	async parseFile(item) {
		let file = await ajaxActions.getBlobFile(item._id);
		const text = file.text();
		const json = papaparse.parse(text, {header: true, skipEmptyLines: true});
		return json;
	}

	fillDatatable(fileData) {
		const datatable = this.getCsvViewerTable();
		datatable.clearAll();
		const fields = fileData.meta.fields;
		datatable.refreshColumns([]);
		const columns = this.getColumnConfig(fields);
		datatable.parse(fileData.data);
		datatable.refreshColumns(columns);
	}

	getColumnConfig(fields) {
		const columnConfig = fields.map((field, i) => {
			if (!field) return null;

			const config = {
				id: field,
				header: this.getDatatableHeaderTemplate(field, i),
				tooltip: obj => obj[field] || "",
				sort: "raw",
				width: 150,
				minWidth: 20
			};

			if (i === 0) {
				delete config.width;
				Object.assign(config, {
					adjust: true,
					fillspace: true,
					minWidth: 250
				});
			}

			return config;
		});
		return columnConfig.filter(column => column);
	}

	getDatatableHeaderTemplate(field, adjust) {
		const name = field.charAt(0).toUpperCase() + field.slice(1);
		const adjustIcon = adjust ? "<i title='Adjust column' class='adjust-icon fas fa-arrows-alt-h'></i>" : "";
		return `<div class='upload-metadata-column-header'>
			<span title='${name}' class='column-header-name ellipsis-text'>${name}</span>
			${adjustIcon}
		</div>`;
	}

	close() {
		this.getWindowHeaderTemplate().parse({emptyObject: true});
		this.getRoot().hide();
	}
}

