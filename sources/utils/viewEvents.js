import downloadFiles from "../models/downloadFiles";
import webixViews from "../models/webixViews";

function setDataviewEvent(dataview, action, event) {
	dataview.detachEvent(event);
	switch (action) {
		case "open": {
			dataview.attachEvent(event, (id) => {
				let item = dataview.getItem(id);
				const imageWindow = webixViews.getImageWindow();
				downloadFiles.openOrDownloadFiles(item, imageWindow);
			});
			break;
		}
	}
}

function setDatatableEvent(datatable, action, event) {
	if (event === "onItemClick") {
		datatable.define("select", "false");
	}
	console.log(datatable)
	datatable.detachEvent(event);
	switch (action) {
		case "open": {
			datatable.attachEvent(event, (object) => {
				const item = datatable.getItem(object.row);
				const imageWindow = webixViews.getImageWindow();
				downloadFiles.openOrDownloadFiles(item, imageWindow);
			});
			break;
		}
		case "edit": {
			datatable.attachEvent(event, (object) => {
				const columnConfig = this._metadataTable.getColumnConfig(object.column);
				if (!columnConfig.editor) {
					return false;
				}
				datatable.edit({
					column: object.column,
					row: object.row
				});
			});
			break;
		}
		case "select": {
			datatable.define("select", true);
			datatable.attachEvent(event, (object) => {
				datatable.select(object.row);
				return false;
			});
			break;
		}
	}

}

export default {
	setDatatableEvent,
	setDataviewEvent,
}