import {JetView} from "webix-jet";
import metadataTableModel from "../../../../models/metadataTableModel";
import authService from "../../../../services/authentication";
import constants from "../../../../constants";

const WIDTH = 600;
const buttonMinusIcon = "fas fa-minus";
const buttonPlusIcon = "fas fa-plus";

export default class EditColumnsWindow extends JetView {
	config() {
		const cancelButton = {
			view: "button",
			css: "btn-contour",
			name: "cancelButton",
			value: "Close",
			height: 30,
			width: 100,
			click: () => this.close()
		};

		const hintTemplate = {
			view: "template",
			height: 45,
			name: "hintTemplateName",
			borderless: true,
			template: () => "<center>Click \"plus\" button to add new column or \"minus\" button to hide it.</center>"
		};
		const windowForm = {
			view: "form",
			name: "windowFormView",
			borderless: true,
			elements: []
		};

		const scrollWindowView = {
			view: "scrollview",
			height: 330,
			scroll: true,
			body: windowForm
		};

		const window = {
			view: "window",
			scroll: true,
			paddingX: 35,
			width: WIDTH,
			move: true,
			modal: true,
			position: "center",
			type: "clean",
			head: {
				cols: [
					{
						view: "template",
						css: "edit-window-header",
						name: "headerTemplateName",
						template: () => "Show or hide columns",
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
			body: {
				rows: [
					{
						margin: 10,
						type: "clean",
						cols: [
							{
								borderless: true,
								rows: [
									hintTemplate,
									scrollWindowView,
									{height: 10},
									{
										cols: [
											{},
											cancelButton,
											{width: 10}
										]
									},
									{height: 10}
								]
							}
						]
					}
				]
			}
		};

		return window;
	}

	getWindowForm() {
		return this.getRoot().queryView({name: "windowFormView"});
	}

	getActionButton(nameValue) {
		return this.getRoot().queryView({actionButtonName: `${nameValue}-button`});
	}

	getFilterTypeField(nameValue) {
		return this.getRoot().queryView({name: `${nameValue}-filterType`});
	}

	removeOldDatatableColumns(columnConfig) {
		const existedColumns = metadataTableModel.getLocalStorageColumnsConfig() || metadataTableModel.getInitialColumnsForDatatable();
		const newDatatableColumns = existedColumns.filter((existedColumn) => {
			if (existedColumn.initial && existedColumn.id === columnConfig.id) {
				existedColumn.hidden = true;
				delete existedColumn.filterType;
				delete existedColumn.filterTypeValue;
				return existedColumn;
			}
			return existedColumn.id !== columnConfig.id;
		});

		metadataTableModel.putInLocalStorage(newDatatableColumns, this.userInfo._id);
	}

	createNewDatatableColumns(columnConfig, filterTypeValue) {
		let filterType;
		const existedColumns = metadataTableModel.getLocalStorageColumnsConfig() || metadataTableModel.getInitialColumnsForDatatable();

		switch (filterTypeValue) {
			case constants.FILTER_TYPE_TEXT: {
				filterType = "text";
				break;
			}
			case constants.FILTER_TYPE_DATE: {
				filterType = "text";
				break;
			}
			case constants.FILTER_TYPE_SELECT: {
				filterType = "select";
				break;
			}
			default: {
				break;
			}
		}

		columnConfig.filterType = filterType;
		columnConfig.filterTypeValue = filterTypeValue;
		if (columnConfig.initial) {
			existedColumns.forEach((existedColumn) => {
				if (existedColumn.id === columnConfig.id) {
					existedColumn.hidden = false;
					existedColumn.filterType = filterType;
					existedColumn.filterTypeValue = filterTypeValue;
				}
			});
		}
		else existedColumns.push(columnConfig);

		metadataTableModel.putInLocalStorage(existedColumns, this.userInfo._id);
	}


	createFormElement(columnConfig, buttonIcon) {
		const columnTextValue = columnConfig.id;
		const headerTextValue = metadataTableModel.getHeaderTextValue(columnConfig);

		const element = {
			cols: [
				{
					view: "text",
					css: "text-field",
					disabled: true,
					columnConfig,
					value: columnTextValue,
					height: 27
				},
				{width: 10},
				{
					view: "text",
					css: "text-field",
					disabled: true,
					value: headerTextValue,
					height: 20
				},
				{width: 10},
				{
					view: "select",
					name: `${columnTextValue}-filterType`,
					css: "select-field",
					disabled: buttonIcon === "fas fa-minus",
					height: 20,
					value: columnConfig.filterTypeValue || constants.FILTER_TYPE_NONE,
					options: [
						constants.FILTER_TYPE_NONE,
						constants.FILTER_TYPE_SELECT,
						constants.FILTER_TYPE_DATE,
						constants.FILTER_TYPE_TEXT
					]
				},
				{
					view: "button",
					type: "icon",
					actionButtonName: `${columnTextValue}-button`,
					icon: buttonIcon,
					width: 30,
					click: () => {
						const actionButton = this.getActionButton(columnTextValue);
						const filterTypeField = this.getFilterTypeField(columnTextValue);
						const filterTypeValue = filterTypeField.getValue();

						if (actionButton.config.icon === buttonMinusIcon) {
							this.removeOldDatatableColumns(columnConfig);
							actionButton.define("icon", buttonPlusIcon);
							actionButton.refresh();
							filterTypeField.enable();
						}
						else if (actionButton.config.icon === buttonPlusIcon) {
							this.createNewDatatableColumns(columnConfig, filterTypeValue);
							actionButton.define("icon", buttonMinusIcon);
							actionButton.refresh();
							filterTypeField.disable();
						}
					}
				}
			]
		};
		return element;
	}

	// filling form view with new dynamic elements
	fillInFormElements(columnsToAdd, columnsToDelete) {
		const elements = [];
		const windowForm = this.getWindowForm();

		columnsToAdd.forEach((configToAdd) => {
			elements.push(this.createFormElement(configToAdd, buttonPlusIcon));
		});

		columnsToDelete.forEach((configToDelete) => {
			elements.push(this.createFormElement(configToDelete, buttonMinusIcon));
		});

		webix.ui(elements, windowForm);
	}


	showWindow(columnsToAdd, columnsToDelete, datatable) {
		this.metadataTable = datatable;
		this.userInfo = authService.getUserInfo();
		this.fillInFormElements(columnsToAdd, columnsToDelete);
		this.getRoot().show();
	}

	close() {
		this.getRoot().hide();
	}
}
