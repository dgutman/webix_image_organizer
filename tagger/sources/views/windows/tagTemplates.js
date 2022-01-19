import {JetView} from "webix-jet";
import TagTemplatesService from "../../services/dashboard/tagTemplatesService";

function getListColumn(name, listTemplate, label, editValue) {
	return {
		padding: 10,
		name,
		rows: [
			{
				view: "search",
				css: "search-field",
				label,
				height: 34
			},
			{
				view: "editableList",
				editor: "text",
				editaction: "dblclick",
				editValue,
				editable: true,
				select: true,
				css: "tagger-editable-list",
				scroll: "auto",
				borderless: true,
				template: listTemplate,
				data: [
					{name: "tag1"},
					{name: "tag2"},
					{name: "tag3"},
					{name: "tag4"}
				]
			},
			{
				cols: [
					{
						view: "button",
						name: "saveButton",
						value: "Save"
					},
					{},
					{
						view: "button",
						name: "addButton",
						value: "Add new"
					}
				]
			}
		]
	};
}

export default class TagTemplatesWindow extends JetView {
	config() {
		const tagTemplatesWindow = {
			view: "window",
			name: "tagTemplatesWindow",
			css: "tagger-window",
			position: "center",
			modal: true,
			width: 800,
			height: 400,
			type: "clean",
			head: {
				cols: [
					{
						template: "Tag template",
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
				cols: [
					getListColumn(
						"tagListColumn",
						obj => `<div class='list-item'><span class='list-item-name'>${obj.name}</span><i class='icon-btn delete-item-icon fas fa-times'></i></div>`,
						"Tag",
						"name"
					),
					getListColumn(
						"valueListColumn",
						obj => `<div class='list-item'><span class='list-item-name'>${obj.value}</span><i class='icon-btn delete-item-icon fas fa-times'></i></div>`,
						"Value",
						"value"
					)
				]
			}
		};

		return tagTemplatesWindow;
	}

	ready(view) {
		this._view = view;
		this._service = new TagTemplatesService(view);
	}

	showWindow() {
		this.getRoot().show();
	}

	get tagListColumn() {
		return this.getRoot().queryView({name: "tagListColumn"});
	}

	get valueListColumn() {
		return this.getRoot().queryView({name: "valueListColumn"});
	}

	getColumnControls(column) {
		const saveButton = column.queryView({name: "saveButton"});
		const addButton = column.queryView({name: "addButton"});
		const list = column.queryView({view: "editableList"});
		const searchField = column.queryView({view: "search"});
		return {saveButton, addButton, list, searchField};
	}

	close() {
		this._service.closeWindow();
		this.getRoot().hide();
	}
}
