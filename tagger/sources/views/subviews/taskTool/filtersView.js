import {JetView} from "webix-jet";

function getFolderTemplate(obj, isOpen) {
	const openState = isOpen ? "-open" : "";
	const icon = obj._modelType === "folder" ? "far" : "fas";
	const count = obj._count ? `<b class='strong-font'>(${obj._count})</b>` : "";
	return `<div class='task-tool-folder-name ellipsis-text'><i class='${icon} fa-folder${openState}'></i> ${obj.name} ${count}</div>`;
}

export default class TaggerTaskToolFiltersView extends JetView {
	config() {
		const grouplist = {
			view: "grouplist",
			name: "foldersGroupList",
			borderless: true,
			animate: false,
			templateBack: obj => getFolderTemplate(obj, true),
			templateGroup: obj => getFolderTemplate(obj, false),
			templateItem: obj => getFolderTemplate(obj, true)
		};

		const ui = {
			name: "filtersLayout",
			minWidth: 200,
			borderless: true,
			rows: [
				grouplist
			]
		};

		return ui;
	}
}
