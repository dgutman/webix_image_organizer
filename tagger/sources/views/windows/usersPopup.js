import {JetView} from "webix-jet";
import taskUsers from "../../models/taskUsers";

export default class UsersPopup extends JetView {
	config() {
		this.included = [];

		const usersPopup = {
			view: "popup",
			name: "usersPopup",
			css: "tagger-window",
			width: 200,
			type: "clean",
			body: {
				view: "list",
				name: "usersList",
				css: "users-list",
				borderless: true,
				template: (obj, common) => `<div class='user-item'>${common.item(obj, common)} ${obj.name}</div>`,
				tooltip: obj => obj.name,
				type: {
					item: (obj) => {
						let checkbox = "<div class='ellipsis-text user-item unchecked'><i class='checkbox unchecked far fa-square'>";
						if (this.included.find(id => obj._id === id)) {
							checkbox = "<div class='ellipsis-text user-item checked'><i class='checkbox checked fas fa-check-square'>";
						}
						return `${checkbox}</i> ${obj.name}</div>`;
					}
				}
			}
		};

		return usersPopup;
	}

	init(view) {
		this._view = view;
		this.getList().sync(taskUsers);

		this.getRoot().attachEvent("onHide", () => {
			this.included = [];
			this.task = null;
			this.columnId = null;
		});
	}

	showWindow(task, columnId, node, pos) {
		this.task = task;
		this.columnId = columnId;
		this.included = task[columnId] || [];
		this.getRoot().show(node, {pos});
		this.getList().refresh();
	}

	getPopup() {
		return this.getRoot();
	}

	getList() {
		return this.getRoot().queryView({name: "usersList"});
	}

	close() {
		this.getRoot().hide();
	}
}
