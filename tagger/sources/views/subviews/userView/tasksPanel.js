import {JetView} from "webix-jet";

export default class TaggerFilterPanel extends JetView {
	config() {
		const taskList = {
			view: "list",
			name: "userTasksList",
			css: "ellipsis-text user-collection-list",
			borderless: true,
			select: true,
			scroll: "auto",
			tooltip: obj => obj.name,
			template: obj => `<div class='ellipsis-text' onmousedown='return false' onselectstart='return false'><i class='icon-btn fas fa-folder'></i> <span class='item-name'>${obj.name}</span></div>`
		};

		const ui = {
			css: "tagger-tasks-accordion-items-body",
			paddingX: 1,
			rows: [taskList]
		};

		return ui;
	}

	getTaskList() {
		return this.getRoot().queryView({name: "userTasksList"});
	}
}
