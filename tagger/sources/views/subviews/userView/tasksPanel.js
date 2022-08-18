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
			template: (obj) => {
				let status = obj.userStatus ? ` - ${obj.userStatus}` : "";
				return `<div class='ellipsis-text' onmousedown='return false' onselectstart='return false'><i class='icon-btn fas fa-folder'></i> <span class='item-name'>${obj.name}${status}</span></div>`;
			}};

		const toggleTaskView = {
			view: "button",
			css: "btn-contour",
			height: 40,
			width: 120,
			name: "toggleTaskView",
			value: "Show finished tasks"
		};

		const ui = {
			css: "tagger-tasks-accordion-items-body",
			paddingX: 1,
			rows: [
				taskList,
				{
					height: 45,
					padding: 2,
					cols: [

						{},
						toggleTaskView
					]}
			]
		};

		return ui;
	}

	getTaskList() {
		return this.getRoot().queryView({name: "userTasksList"});
	}

	getToggleTaskView() {
		return this.getRoot().queryView({name: "toggleTaskView"});
	}
}
