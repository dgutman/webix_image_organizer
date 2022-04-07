import npdataTableModel from "../../models/npdataTableModel";

export default class NPCaseViewService {
	constructor(view, npCaseTable, npCaseViewThumbnailsTemplate) {
		this.view = view;
		this._npCaseTable = npCaseTable;
		this._npCaseViewThumbnailsTemplate = npCaseViewThumbnailsTemplate;
		this._ready();
	}

	_ready() {
		this.npDataCollection = npdataTableModel.getNPDataCollection();
		this._npCaseTable.sync(this.npDataCollection);
		const caseTable = this._npCaseTable;
		this.npDataCollection.attachEvent("onAfterLoad", () => {
			if (caseTable.data) {
				caseTable.refreshColumns([]);
				caseTable.config.columns.forEach((column, index) => {
					column.css = index !== 0 ? "npdataviewCell" : "npFirstColumn";
					column.fillspace = false;
				});
				caseTable.adjustRowHeight();
				caseTable.refreshColumns();
			}
		});
	}
}
