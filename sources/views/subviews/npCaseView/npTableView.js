import NPCaseViewService from "../../../services/npCaseView/npCaseView";
import MetadataTableCellClass from "../metadataTable/metadataTable";

export default class NPCaseViewClass extends MetadataTableCellClass {
	config() {
		const itemsDataTable = {
			view: "datatable",
			name: "npTable",
			select: true,
			editaction: "custom",
			editable: true,
			dragColumn: false,
			resizeColumn: false,
			fixedRowHeight: false,
			spans: true,
			header: false,
			tooltip: true,
			columnWidth: 280,
			// columns: [] // init in mainService.js
			autoConfig: true
		};

		const datatableCell = {
			name: "npCaseTableCell",
			rows: [
				itemsDataTable
			]
		};

		return datatableCell;
	}

	ready(view) {
		this.npCaseTable = this.getNPCaseTable();
		this.npCaseViewService = new NPCaseViewService(
			view,
			this.npCaseTable,
			this.npCaseViewThumbnailsTemplate
		);
	}

	getNPCaseTable() {
		return this.getRoot().queryView({name: "npTable"});
	}
}
