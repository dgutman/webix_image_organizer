import {JetView} from "webix-jet";
import datatableConfig from "../../../models/datatable";
import authService from "../../../services/authentication";
import helpingFunctions from "../../../models/helpingFunctions";
import constants from "../../../constants";

const WIDTH = 300;

const columnsForDatatableToAdd = datatableConfig.getColumnsForDatatableToAddCollection();
const columnsForDatatableToRemove = datatableConfig.getColumnsForDatatableToRemove();

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
			height: 325,
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

	setSelectFilterOptions(filterType, columnValue) {
		let options = [];
		if (filterType === "select") {
			options = [
				{
					id: "", value: ""
				}
			];
			this.editedDatable.data.order.forEach((itemId) => {
				if (itemId) {
					let datatableItem = this.editedDatable.getItem(itemId);
					let metadataValue = datatableItem.meta.groups[columnValue];
					let index = options.map((obj) => obj.value).indexOf(metadataValue);
					if (index === -1) {
						if (datatableItem.meta.groups) {
							options.push({
								id: datatableItem.meta.groups[columnValue], value: datatableItem.meta.groups[columnValue]
							});
						}
					}
				}
			});
		}
		return options;
	}
	//generating columns config to add to the datatable
	generateColumnConfig(columnValue, headerValue, filterTypeValue) {
		let filterType;
		let header;
		let placeholder = "";
		if (filterTypeValue === constants.FILTER_TYPE_DATE) {
			placeholder = "mm/dd/yyyy";
		}
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
		if (filterType) {
			header = [`${headerValue}<span style='text-align: right; width: 60%;' class="webix_icon fa-pencil"></span>`,
				{content:`${filterType}Filter`, options: this.setSelectFilterOptions(filterType, columnValue), placeholder: placeholder, compare: (value, filter, obj) => {
					if (filterTypeValue === constants.FILTER_TYPE_DATE) {
						return obj.meta.groups[columnValue].toString().indexOf(filter) !== -1;
					} else if (filterType === "text") {
						return obj.meta.groups[columnValue].toString().toLowerCase().indexOf(filter) !== -1;
					} else if (filterType === "select") {
						return obj.meta.groups[columnValue].toString() === filter;
					}
				}}];
		} else {
			header = `${headerValue}<span style='text-align:right; width: 60%;' class="webix_icon fa-pencil"></span>`;
		}
		let columnConfig;
		let initialConfig = false;
		this.initialColumnsConfig.forEach((initialColumnConfig) => {
			if (initialColumnConfig.id === columnValue) {
				initialConfig = true;
				columnConfig = initialColumnConfig;
				if (filterType) {
					let headerText;
					headerText = initialColumnConfig.header[0].text;
					if (!headerText) {
						headerText = initialColumnConfig.header;
					}
					columnConfig.header = [headerText, {content: `${filterType}Filter`, placeholder: placeholder, compare: (value, filter, obj) => {
						if (filterTypeValue === constants.FILTER_TYPE_DATE) {
							let dateValue = value.toString();
							let timeIndex = dateValue.indexOf("T");
							let newDateValue = dateValue.slice(0, timeIndex);
							let yearIndex = newDateValue.search("-");
							let year = newDateValue.slice(0, yearIndex);
							let monthIndex = newDateValue.slice(yearIndex + 1).search("-") + yearIndex + 1;
							let month = newDateValue.slice(yearIndex + 1, monthIndex);
							let day = newDateValue.slice(monthIndex +1);
							let dateToCompare = `${month}/${day}/${year}`;
							return dateToCompare.indexOf(filter) !== -1;
						} else if (filterType === "text") {
							return obj[columnValue].toString().toLowerCase().indexOf(filter) !== -1;
						} else if (filterType === "select") {
							return obj[columnValue].toString().toLowerCase() === filter;
						}
					}}];
				}
			}
		});
		if (!initialConfig) {
			columnConfig = {
				id: columnValue,
				header: header,
				width: 145,
				editor: "text",
				metadataColumn: true,
				template: (obj) => {
					if (obj.meta) {
						const columnValueColor = helpingFunctions.getMetadataColumnColor(obj, columnValue);
						if (obj.meta.groups) {
							return `<span style="color: ${columnValueColor}">${obj.meta.groups[columnValue]}</span>`;
						} else {
							return `<span style="color: ${columnValueColor}">${obj.meta[columnValue]}</span>`;
						}

					} else return "No metadata for item";
				}
			};
		}
		return columnConfig;
	}

	//adding new column to the datatable
	createNewDatatableColumns(configValues) {
		let columnValue = configValues.columnValue;
		let headerValue = configValues.headerValue;
		let filterTypeValue = configValues.filterTypeValue;
		this.existedColumns.insertAt(this.generateColumnConfig(columnValue, headerValue, filterTypeValue));
		this.existedColumns.each((columnConfig) => {
			columnsForDatatableToRemove.data.each((configValues) => {
				if (columnConfig.id === configValues.columnValue) {
					columnsForDatatableToRemove.remove(configValues.id);
				}
			});
		});
		this.editedDatable.refreshColumns();
		datatableConfig.putInLocalStorage(this.existedColumns, this.userInfo._id);
	}

	//removing datatable columns from datatable
	removeOldDatatableColumns(configValues) {
		let columnValue = configValues.columnValue;
		this.existedColumns.each((columnConfig) => {
			if (columnConfig && (columnConfig.id === columnValue)) {
				this.existedColumns.remove(columnConfig);
			}
			columnsForDatatableToAdd.data.each((configValues) => {
				if (columnConfig.id === configValues.columnValue) {
					columnsForDatatableToAdd.remove(configValues.id);
				}
			});
		});

		this.editedDatable.refreshColumns();
		datatableConfig.putInLocalStorage(this.existedColumns, this.userInfo._id);
	}

	createColumnConfigForElements(columnValue, headerValue, hasValue) {
		let columnConfig = {
			columnName: columnValue,
			headerName: headerValue,
			hasValue: hasValue,
		};
		return columnConfig;
	}

	checkForTheReplies(elementsArray, columnConfig, columnsForEdit, buttonIcon, filterValue) {
		if (!helpingFunctions.isObjectEmpty(columnConfig)) {
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
		elementsArray.push(this.createElementForTheForm(columnConfig.columnName, replacedHeaderName, buttonIcon, true, filterValue));
	}

	//filling form view with new dynamic elements
	fillInFormElements(dataToAdd, dataToDelete) {
		const formView = this.getFormView();
		let columnConfig = {};
		let hasValue = false;
		let elementsArray = [];
		let lengthForRemoveColumns = columnsForDatatableToRemove.count();
		dataToAdd.forEach((name) => {
			columnConfig = this.createColumnConfigForElements(name, name, hasValue);
			this.checkForTheReplies(elementsArray, columnConfig, columnsForDatatableToAdd, "plus");
		});
		if (lengthForRemoveColumns > 0) {
			columnsForDatatableToRemove.data.each((deletedColumn) => {
				columnConfig = this.createColumnConfigForElements(deletedColumn.columnValue, deletedColumn.headerValue, hasValue);
				this.checkForTheReplies(elementsArray, columnConfig, columnsForDatatableToAdd, "plus");
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
					this.checkForTheReplies(elementsArray, columnConfig, columnsForDatatableToAdd, "plus");
				}
			});
		}
		dataToDelete.forEach((obj) => {
			let filterValue;
			if (obj.header[1]) {
				if (obj.header[1].placeholder) {
					filterValue = constants.FILTER_TYPE_DATE;
				} else if (obj.header[1].content === "textFilter") {
					filterValue = constants.FILTER_TYPE_TEXT;
				} else if (obj.header[1].content === "selectFilter") {
					filterValue = constants.FILTER_TYPE_SELECT;
				}
			}
			columnConfig = this.createColumnConfigForElements(obj.id, obj.header[0].text, hasValue);
			this.checkForTheReplies(elementsArray, columnConfig, columnsForDatatableToRemove, "minus", filterValue);
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
		return buttonIcon === "minus";
	}

	getFilterTypeField(nameValue) {
		return this.getRoot().queryView({name: `${nameValue}-filterType`});
	}

	//creating element config that will be parsed to the form view
	createElementForTheForm(columnNameValue, headerNameValue, buttonIcon, disabledForHeader, filterValue) {
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
						if (actionButton.config.icon === "minus") {
							columnsForDatatableToRemove.add({columnValue, headerValue});
							this.removeOldDatatableColumns({columnValue, headerValue});
							actionButton.define("icon", "plus");
							actionButton.refresh();
							filterTypeField.enable();
						} else if (actionButton.config.icon === "plus") {
							filterTypeField.disable();
							columnsForDatatableToAdd.add({columnValue, headerValue});
							this.createNewDatatableColumns({columnValue, headerValue, filterTypeValue});
							actionButton.define("icon", "minus");
							actionButton.refresh();
						}

					}
				}
			]
		};
		return element;
	}

	showWindow(metadataKeys, columnsToDelete, datatable) {
		let dataToAdd = [];
		this.editedDatable = datatable;
		this.existedColumns = webix.toArray(this.editedDatable.config.columns);
		this.initialColumnsConfig = datatableConfig.getInitialColumnsForDatatable();
		this.userInfo = authService.getUserInfo();
		metadataKeys.forEach((columnId) => {
			this.existedColumns.forEach((existedColumn) => {
				if (existedColumn.id === columnId) {
					columnId = "existed";
				}
			});
			if (columnId !== "existed") {
				dataToAdd.push(columnId);
			}
		});
		this.fillInFormElements(dataToAdd, columnsToDelete);
		this.getRoot().show();
	}

	close() {
		this.getRoot().hide();
	}
}