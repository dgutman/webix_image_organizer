import {JetView} from "webix-jet";
import metadataTableModel from "../../../../models/metadataTableModel";
import authService from "../../../../services/authentication";
import utils from "../../../../utils/utils";
import constants from "../../../../constants";

const WIDTH = 330;

const columnsForDatatableToAdd = metadataTableModel.getColumnsForDatatableToAddCollection();
const columnsForDatatableToRemove = metadataTableModel.getColumnsForDatatableToRemove();
let headerValueForDataToDelete;

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
			height: 40,
			name: "hintTemplateName",
			borderless: true,
			template: () => {
				return "<center>Click \"plus\" button to add new column or \"minus\" button to hide it.</center>";
			}
		};
		const windowForm = {
			view: "form",
			name: "topFormViewName",
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
						template: () => {
							return "Show or hide columns";
						},
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "times",
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
											{width: 10},
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

	//generating columns config to add to the datatable
	generateColumnConfig(columnValue, headerValue, filterTypeValue, metadataColumnConfig) {
		let filterType;
		let header = metadataColumnConfig.header;
		const columnId = metadataColumnConfig.id;

		switch(filterTypeValue) {
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
		}

		if (header) {
			if (!Array.isArray(header)) {
				header = [header];
			}

			if (header.length === 0) {
				header.push("");
			}

			header[header.length - 1] = `${headerValue}<span style='float: right; padding-top: 12px; width:17px;' class="webix_icon fas fa-pencil-alt"></span>`;
			if (filterType) {
				header.push({content:`${filterType}Filter`});
			}
		}

		let columnConfig;
		let initialConfig = false;
		this.initialColumnsConfig.find((initialColumnConfig) => {
			if (initialColumnConfig.id === columnValue) {
				initialConfig = true;
				columnConfig = initialColumnConfig;
				if (filterType) {
					if (!Array.isArray(columnConfig.header)) {
						columnConfig.header = [columnConfig.header];
					}
					columnConfig.header.push({content: `${filterType}Filter`});
					columnConfig.filterType = filterType;
					columnConfig.filterTypeValue = filterTypeValue;
				}
				return true;
			}
		});
		if (!initialConfig) {
			columnConfig = {
				id: columnId,
				header: header,
				width: 145,
				editor: "text",
				filterType: filterType,
				filterTypeValue: filterTypeValue,
				metadataColumn: true
			};
		}
		return columnConfig;
	}

	//adding new column to the datatable
	createNewDatatableColumns(columnValue, headerValue, filterTypeValue, metadataColumnHeader) {
		this.existedColumns.push(this.generateColumnConfig(columnValue, headerValue, filterTypeValue, metadataColumnHeader));
		this.existedColumns.forEach((columnConfig) => {
			columnsForDatatableToRemove.data.each((configValues) => {
				if (columnConfig.id === configValues.columnValue) {
					columnsForDatatableToRemove.remove(configValues.id);
				}
			});
		});

		metadataTableModel.clearColumnsInLocalStorage(this.userInfo._id);
		metadataTableModel.putInLocalStorage(this.existedColumns, this.userInfo._id);
	}

	//removing datatable columns from datatable
	removeOldDatatableColumns(columnValue) {
		this.existedColumns.forEach((columnConfig, columnsIndex) => {
			if (columnConfig && (columnConfig.id === columnValue)) {
				this.existedColumns.splice(columnsIndex, 1);
			}

			columnsForDatatableToAdd.data.each((configValues) => {
				if (columnConfig.id === configValues.columnValue) {
					columnsForDatatableToAdd.remove(configValues.id);
				}
			});
		});
		metadataTableModel.clearColumnsInLocalStorage(this.userInfo._id);
		metadataTableModel.putInLocalStorage(this.existedColumns, this.userInfo._id);
	}

	createColumnConfigForElements(columnValue, headerValue, hasValue) {
		let columnConfig = {
			columnName: columnValue,
			headerName: headerValue,
			hasValue: hasValue,
		};
		return columnConfig;
	}

	checkForTheReplies(elementsArray, columnConfig, columnsForEdit, buttonIcon, filterValue, metadataColumnConfig) {
		if (!utils.isObjectEmpty(columnConfig)) {
			columnsForEdit.data.each((column) => {
				if (column.columnValue === columnConfig.columnName) {
					columnConfig.hasValue = true;
				}
			});
			elementsArray.forEach((element) => {
				if (element.cols[0].rows[0].name === columnConfig.columnName) {
					columnConfig.hasValue = true;
				}
			});
		}
		if (columnConfig.hasValue) {
			columnConfig.hasValue = false;
			return false;
		}
		let regExp = /<.*$/;
		let replacedHeaderName = columnConfig.headerName.replace(regExp, "");
		elementsArray.push(this.createElementForTheForm(columnConfig.columnName, replacedHeaderName, buttonIcon, true, filterValue, metadataColumnConfig));
	}

	//filling form view with new dynamic elements
	fillInFormElements(dataToAdd, dataToDelete) {
		const formView = this.getFormView();
		let columnConfig = {};
		let hasValue = false;
		let elementsArray = [];
		let lengthForRemoveColumns = columnsForDatatableToRemove.count();
		dataToAdd.forEach((metadataColumnConfig) => {
			columnConfig = this.createColumnConfigForElements(metadataColumnConfig.id, metadataColumnConfig.header[metadataColumnConfig.header.length - 1], hasValue);
			this.checkForTheReplies(elementsArray, columnConfig, columnsForDatatableToAdd, "fas fa-plus", "", metadataColumnConfig);
		});
		if (lengthForRemoveColumns > 0) {
			columnsForDatatableToRemove.data.each((deletedColumn) => {
				columnConfig = this.createColumnConfigForElements(deletedColumn.columnValue, deletedColumn.headerValue, hasValue);
				this.checkForTheReplies(elementsArray, columnConfig, columnsForDatatableToAdd, "fas fa-plus");
			});
		}
		if (this.initialColumnsConfig.length > 0) {
			this.initialColumnsConfig.forEach((initialColumn) => {
				this.existedColumns.forEach((existedColumn) => {
					if (initialColumn.id === existedColumn.id) {
						initialColumn.wasAdded = true;
					}
				});
				if (!initialColumn.wasAdded) {
					columnConfig = this.createColumnConfigForElements(initialColumn.id, initialColumn.header, hasValue);
					this.checkForTheReplies(elementsArray, columnConfig, columnsForDatatableToAdd, "fas fa-plus");
				}
			});
		}
		dataToDelete.forEach((obj) => {
			let filterValue;
			let metadataColumnConfig;
			let penultimateItemIndex;
			const objHeaderLength = obj.header.length !== 0 ? obj.header.length : 0;
			if (obj.header[objHeaderLength - 1] && obj.header[objHeaderLength - 1].hasOwnProperty("content")) {
				penultimateItemIndex = objHeaderLength - 2;
				if (obj.header[objHeaderLength - 1].placeholder) {
					filterValue = constants.FILTER_TYPE_DATE;
				} else if (obj.header[objHeaderLength - 1].content === "textFilter") {
					filterValue = constants.FILTER_TYPE_TEXT;
				} else if (obj.header[objHeaderLength - 1].content === "selectFilter") {
					filterValue = constants.FILTER_TYPE_SELECT;
				}
			} else {
				penultimateItemIndex = objHeaderLength !== 0 ? objHeaderLength - 1 : 0;
			}

			this.getHeaderValueForElement(obj.header, penultimateItemIndex);
			columnConfig = this.createColumnConfigForElements(obj.id, headerValueForDataToDelete, hasValue);

			if (obj.metadataColumn) {
				metadataColumnConfig = {
					id: obj.id,
					header: obj.header
				};
			}
			this.checkForTheReplies(elementsArray, columnConfig, columnsForDatatableToRemove, "fas fa-minus", filterValue, metadataColumnConfig);
		});
		webix.ui(elementsArray, formView);
	}

	getFormView() {
		return this.getRoot().queryView({view: "form"});
	}

	getActionButton(nameValue) {
		return this.getRoot().queryView({actionButtonName: `${nameValue}-button`});
	}

	getHeaderForColumn(nameValue) {
		return this.getRoot().queryView({name: `${nameValue}-header`});
	}

	getColumnFiled(nameValue) {
		return this.getRoot().queryView({name: nameValue});
	}

	disableFilterTypeField(buttonIcon) {
		return buttonIcon === "fas fa-minus";
	}

	getFilterTypeField(nameValue) {
		return this.getRoot().queryView({name: `${nameValue}-filterType`});
	}

	//creating element config that will be parsed to the form view
	createElementForTheForm(columnNameValue, headerNameValue, buttonIcon, disabledForHeader, filterValue, metadataColumnConfig) {
		let element = {
			cols: [
				{
					rows: [
						{
							name: columnNameValue,
							view: "text",
							css: "text-field",
							label: "Column",
							labelAlign: "right",
							disabled: true,
							metadataColumnConfig: metadataColumnConfig ? metadataColumnConfig : "",
							value: columnNameValue,
							height: 25,
						},
						{
							name: `${headerNameValue}-header`,
							view: "text",
							css: "text-field",
							label: "Header",
							labelAlign: "right",
							disabled: disabledForHeader,
							value: headerNameValue,
							height: 25,
						},
						{
							view: "select",
							name: `${columnNameValue}-filterType`,
							label: "Filter type",
							labelAlign: "right",
							disabled: this.disableFilterTypeField(buttonIcon),
							height: 25,
							value: filterValue,
							options: [
								constants.FILTER_TYPE_NONE,
								constants.FILTER_TYPE_SELECT,
								constants.FILTER_TYPE_DATE,
								constants.FILTER_TYPE_TEXT
							]
						}
					]
				},
				{
					view: "button",
					type: "icon",
					actionButtonName: `${columnNameValue}-button`,
					icon: buttonIcon,
					width: 30,
					click: () => {
						let actionButton = this.getActionButton(columnNameValue);
						let columnField = this.getColumnFiled(columnNameValue);
						let headerField = this.getHeaderForColumn(headerNameValue);
						let filterTypeField = this.getFilterTypeField(columnNameValue);
						let columnValue = columnField.getValue();
						let headerValue = headerField.getValue();
						let filterTypeValue = filterTypeField.getValue();
						if (actionButton.config.icon === "fas fa-minus") {
							columnsForDatatableToRemove.add({columnValue, headerValue});
							this.removeOldDatatableColumns(columnValue);
							actionButton.define("icon", "fas fa-plus");
							actionButton.refresh();
							filterTypeField.enable();
						} else if (actionButton.config.icon === "fas fa-plus") {
							filterTypeField.disable();
							columnsForDatatableToAdd.add({columnValue, headerValue});
							this.createNewDatatableColumns(columnValue, headerValue, filterTypeValue, columnField.config.metadataColumnConfig);
							actionButton.define("icon", "fas fa-minus");
							actionButton.refresh();
						}

					}
				}
			]
		};
		return element;
	}

	getHeaderValueForElement(header, itemIndex) {
		if (header[itemIndex]) {
			if (header[itemIndex].hasOwnProperty("text")) {
				headerValueForDataToDelete = header[itemIndex].text;
			} else {
				headerValueForDataToDelete = header[itemIndex];
			}
		} else {
			this.getHeaderValueForElement(header, itemIndex - 1);
		}
	}

	showWindow(datatableColumnsConfig, columnsToDelete) {
		let dataToAdd = [];
		this.existedColumns = metadataTableModel.getLocalStorageColumnsConfig();
		this.initialColumnsConfig = metadataTableModel.getInitialColumnsForDatatable();
		if (!this.existedColumns) {
			this.existedColumns = webix.copy(this.initialColumnsConfig);
		}
		this.userInfo = authService.getUserInfo();
		datatableColumnsConfig.forEach((columnConfig) => {
			this.existedColumns.forEach((existedColumn) => {
				if (existedColumn.id === columnConfig.id) {
					columnConfig.existed = true;
				}
			});
			if (!columnConfig.existed) {
				dataToAdd.push(columnConfig);
			}
		});
		this.fillInFormElements(dataToAdd, columnsToDelete);
		this.getRoot().show();
	}

	close() {
		this.getRoot().hide();
	}
}