import {JetView} from "webix-jet";
import groupsCollection from "../../models/groups";
import transitionalAjax from "../../services/transitionalAjaxService";

export default class GroupTasksWindow extends JetView {
	config() {
		const groupTasks = {
			view: "window",
			name: "groupTasks",
			css: "tagger-window",
			position: "center",
			modal: true,
			width: 500,
			height: 700,
			type: "clean",
			head: {
				cols: [
					{
						template: "Task grouping",
						name: "header",
						css: "main-subtitle2 ellipsis-text",
						borderless: true
					},
					{
						view: "button",
						name: "closeButton",
						type: "icon",
						icon: "fas fa-times",
						hotkey: "esc",
						width: 30,
						height: 30,
						click: () => this.close()
					}
				]
			},
			body: {
				view: "form",
				name: "groupForm",
				type: "clean",
				padding: 10,
				elements: [
					{height: 30},
					{
						view: "editCombo",
						name: "groupNameField",
						css: "text-field",
						labelWidth: 120,
						label: "Group name",
						placeholder: "Choose or type group name",
						invalidMessage: "Please, specify group name"
					},
					{height: 30},
					{
						cols: [
							{},
							{
								view: "button",
								name: "saveButton",
								css: "btn",
								width: 80,
								value: "Save"
							}
						]
					}
				],
				rules: {
					groupNameField: value => value
				}
			}
		};

		return groupTasks;
	}

	init(view) {
		this._view = view;
		const list = this.getCombo().getPopupList();
		list.sync(groupsCollection);
	}

	async showWindow() {
		this.getRoot().show();

		return new Promise((resolve, reject) => {
			const saveButton = this.getSaveButton();
			const closeButton = this.getCloseButton();
			let closeEventId;

			const saveEventId = saveButton.attachEvent("onItemClick", () => {
				const list = this.getCombo().getPopupList();
				const selectedItem = list.getSelectedItem();
				const value = this.getCombo().getValue();

				if (this.getForm().validate()) {
					saveButton.detachEvent(saveEventId);
					closeButton.detachEvent(closeEventId);

					if (selectedItem) {
						resolve(selectedItem);
					}
					else {
						transitionalAjax.createGroup(value)
							.then((response) => {
								const groupId = groupsCollection.add(response.data);
								resolve(groupsCollection.getItem(groupId));
							});
					}
					this.close();
				}
				else return false;
			});

			closeEventId = closeButton.attachEvent("onItemClick", () => {
				saveButton.detachEvent(saveEventId);
				closeButton.detachEvent(closeEventId);
				this.close();
				reject();
			});
		});
	}

	getForm() {
		return this.getRoot().queryView({name: "groupForm"});
	}

	getCombo() {
		return this.getRoot().queryView({name: "groupNameField"});
	}

	getSaveButton() {
		return this.getForm().queryView({name: "saveButton"});
	}

	getCloseButton() {
		return this.getRoot().queryView({name: "closeButton"});
	}

	close() {
		this.getRoot().hide();
	}
}
