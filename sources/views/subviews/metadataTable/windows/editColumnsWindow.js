import {JetView} from "webix-jet";
import dot from "dot-object";
import metadataTableModel from "../../../../models/metadataTableModel";
import authService from "../../../../services/authentication";
import NewColumnsService from "../../../../services/metadataTable/newColumnsService";
import ImageColumnService from "../../../../services/metadataTable/imageColumnService";
import constants from "../../../../constants";
import patientsDataModel from "../../../../models/patientsDataModel";

const WIDTH = 600;
const buttonMinusIcon = "fas fa-minus";
const buttonPlusIcon = "fas fa-plus";

export default class EditColumnsWindow extends JetView {
	config() {
		const addButton = {
			view: "button",
			css: "btn",
			name: "addButton",
			label: "Add new",
			height: 30,
			width: 100,
			click: () => this.newColumnsService.addNewColumn()
		};

		const saveButton = {
			view: "button",
			css: "btn-contour",
			name: "saveButton",
			value: "Save",
			height: 30,
			width: 100,
			click: () => this.newColumnsService.saveNewColumns()
		};

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
			template: () => "<center>Click \"plus\" button to choose a column or \"minus\" button to hide it.</center>"
		};

		const windowForm = {
			view: "form",
			name: "windowFormView",
			borderless: true,
			elements: []
		};

		const newColumnsForm = {
			view: "form",
			name: "newColumnsFormView",
			borderless: true,
			elements: []
		};

		const newColumnsLayout = {
			name: "newColumnsLayoutView",
			hidden: true,
			rows: [
				{
					css: "new-columns-header new-columns-header-main",
					template: "<i class='fas fa-info-circle'></i> New columns:",
					tooltip: `This form allows to define columns for nested fields by "Dot Notation".
								<br />Column header will be filled by the value of the last specified property
								<br /> <b class='strong-font'>For example:</b> 
								<br /> If you specify "<b class='strong-font'>my.test.data.field</b>" column
								<br /> the column header will be filled by "<b class='strong-font'>field</b>" value
								`,
					height: 30
				},
				{
					height: 30,
					cols: [
						{
							template: "Item field",
							name: "fieldHeader",
							borderless: true,
							css: "new-columns-header"
						},
						{
							template: "Column header",
							borderless: true,
							css: "new-columns-header"
						}
					]
				},
				newColumnsForm
			]
		};

		const scrollWindowView = {
			view: "scrollview",
			height: 330,
			scroll: true,
			body: {
				rows: [windowForm, newColumnsLayout]
			}
		};

		const window = {
			view: "window",
			css: "edit-column-window",
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
						template: () => "Columns settings",
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
											{width: 10},
											addButton,
											{width: 10},
											saveButton,
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

	ready(view) {
		this.userInfo = authService.getUserInfo();
		this.newColumnsService = new NewColumnsService(view, this.userInfo);
		this.imageColumnService = new ImageColumnService(view);
	}

	getWindowForm() {
		return this.getRoot().queryView({name: "windowFormView"});
	}

	getFormForNewColumns() {
		return this.getRoot().queryView({name: "newColumnsFormView"});
	}

	getLayoutForNewColumns() {
		return this.getRoot().queryView({name: "newColumnsLayoutView"});
	}

	getActionButton(nameValue, isInitial) {
		return this.getRoot().queryView({actionButtonName: `${nameValue}-button${isInitial ? "" : "-meta"}`});
	}

	getFilterTypeField(nameValue, isInitial) {
		return this.getRoot().queryView({name: `${nameValue}-filterType${isInitial ? "" : "-meta"}`});
	}

	removeOldDatatableColumns(columnConfig) {
		const existedColumns = metadataTableModel.getLocalStorageColumnsConfig()
			|| metadataTableModel.getInitialColumnsForDatatable();
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

		const patientColumns = metadataTableModel.getLocalStoragePatientsFields()
			|| [];
		const newPatientColumns = patientColumns.filter((patientColumn) => {
			if (patientColumn.patientColumn) {
				return columnConfig.id !== patientColumn.id;
			}
			return false;
		});
		metadataTableModel.putPatientsFieldsToStorage(newPatientColumns, this.userInfo._id);
	}

	createNewDatatableColumns(columnConfig, filterTypeValue) {
		let filterType;
		const existedColumns = metadataTableModel.getLocalStorageColumnsConfig()
			|| metadataTableModel.getInitialColumnsForDatatable();
		const patientColumns = metadataTableModel.getLocalStoragePatientsFields()
			|| [];

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
		else if (columnConfig.patientColumn) {
			patientColumns.push(columnConfig);
			const patientColumnsCount = patientColumns.length;
			patientColumns.forEach((patientColumn, index) => {
				const patientHeader = index === 0 ? "Patient data" : null;
				if (patientColumn.header.length > 1) patientColumn.header.shift();
				patientColumn.header.unshift(patientHeader
					? {text: patientHeader, colspan: patientColumnsCount}
					: {text: patientHeader});
			});
		}
		else existedColumns.push(columnConfig);

		metadataTableModel.putInLocalStorage(existedColumns, this.userInfo._id);
		metadataTableModel.putPatientsFieldsToStorage(patientColumns, this.userInfo._id);
	}

	createFormElement(columnConfig, buttonIcon) {
		const newFields = metadataTableModel.getLocalStorageNewItemFields() || [];
		const patientsFields = metadataTableModel.getLocalStorageNewPatientFields() || [];
		const isNew = newFields.includes(columnConfig.id);
		const isPatient = patientsFields.includes(columnConfig.id);
		const isInitial = columnConfig.initial;

		const columnTextValue = columnConfig.id;
		const headerTextValue = metadataTableModel.getHeaderTextValue(columnConfig);

		const usersColId = webix.uid();
		const deleteButton = {
			view: "button",
			type: "icon",
			icon: "fas fa-times",
			width: 30,
			click: () => {
				this.removeOldDatatableColumns(columnConfig);

				const localNewItemFields = metadataTableModel.getLocalStorageNewItemFields() || [];
				const remainingItemFields = localNewItemFields.filter(id => id !== columnConfig.id);
				metadataTableModel.putNewItemFieldsToStorage(remainingItemFields, this.userInfo._id);
				const localNewPatientsFields = metadataTableModel.getLocalStorageNewPatientFields() || [];
				const remainingPatientFields = localNewPatientsFields.filter(id => id !== columnConfig.id);
				metadataTableModel.putNewPatientFieldsToStorage(remainingPatientFields, this.userInfo._id);
				const usersSection = $$("users-section");
				if (!remainingItemFields.length && usersSection) {
					this.getWindowForm().removeView(usersSection.config.id);
				}
				this.getWindowForm().removeView(usersColId);
			}
		};

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
					name: `${columnTextValue}-filterType${isInitial ? "" : "-meta"}`,
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
					actionButtonName: `${columnTextValue}-button${isInitial ? "" : "-meta"}`,
					icon: buttonIcon,
					width: 30,
					click: () => {
						const actionButton = this.getActionButton(columnTextValue, isInitial);
						const filterTypeField = this.getFilterTypeField(columnTextValue, isInitial);
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

		if (isNew || isPatient) {
			element.id = usersColId;
			element.cols.push(deleteButton);
		}
		return element;
	}

	// filling form view with new dynamic elements
	fillInFormElements(columnsToAdd, columnsToDelete, patientsColumnsToAdd, patientsColumnsToDelete) {
		let elements = [];
		const windowForm = this.getWindowForm();

		const newItemFields = metadataTableModel.getLocalStorageNewItemFields() || [];
		const newPatientFields = metadataTableModel.getLocalStorageNewPatientFields() || [];

		const columns = {
			users: [],
			initial: [],
			generated: [],
			image: [],
			patients: []
		};

		columnsToAdd.forEach((config) => {
			const formElement = config.columnType === "image" ? this.imageColumnService.getFormElementForImageColumn(false) : this.createFormElement(config, buttonPlusIcon);
			if (newItemFields.includes(config.id)) columns.users.push(formElement);
			else if (newPatientFields.includes(config.id)) columns.patients.push(formElement);
			else if (config.initial) columns.initial.push(formElement);
			else if (config.columnType === "image") columns.image.push(formElement);
			else columns.generated.push(formElement);
		});

		columnsToDelete.forEach((config) => {
			const formElement = config.columnType === "image" ? this.imageColumnService.getFormElementForImageColumn(true, config) : this.createFormElement(config, buttonMinusIcon);
			if (newItemFields.includes(config.id)) columns.users.push(formElement);
			else if (newPatientFields.includes(config.id)) columns.patients.push(formElement);
			else if (config.initial) columns.initial.push(formElement);
			else if (config.columnType === "image") columns.image.push(formElement);
			else columns.generated.push(formElement);
		});

		patientsColumnsToAdd.forEach((config) => {
			const formElement = this.createFormElement(config, buttonPlusIcon);
			columns.patients.push(formElement);
		});

		patientsColumnsToDelete.forEach((config) => {
			const formElement = this.createFormElement(config, buttonMinusIcon);
			columns.patients.push(formElement);
		});

		Object.keys(columns).forEach((k) => {
			if (columns[k].length) {
				let template = "";
				switch (k) {
					case "users": {
						template = "USER'S COLUMNS";
						break;
					}
					case "initial": {
						template = "INITIAL COLUMNS";
						break;
					}
					case "image": {
						template = "IMAGE COLUMN";
						elements.unshift(...columns[k]);
						elements.unshift({type: "section", template, id: `${k}-section`});
						return;
					}
					case "generated": {
						template = "GENERATED COLUMNS";
						break;
					}
					case "patients": {
						template = "PATIENT COLUMNS";
						break;
					}
					default: {
						template = "GENERATED COLUMNS";
						break;
					}
				}
				elements.push({type: "section", template, id: `${k}-section`});
				elements.push(...columns[k]);
			}
		});

		webix.ui(elements, windowForm);
	}

	buildColumnsConfig(metadataTable) {
		const promise = new Promise((success) => {
			const existedColumns
				= metadataTableModel.getLocalStorageColumnsConfig()
				|| metadataTableModel.getInitialColumnsForDatatable();
			const columnsToAdd = [];
			const patientsColumnsToAdd = [];
			const patientsColumnsToDelete = metadataTableModel.getLocalStoragePatientsFields() || [];
			metadataTableModel.metadataDotObject = {};
			metadataTableModel.patientsDataDotObject = {};
			const patientsData = patientsDataModel.getPatientsData();
			let newPatients = [];
			metadataTable.find((obj) => {
				let found = false;
				if (obj.hasOwnProperty("meta")) {
					const copy = webix.copy(obj.meta);
					dot.remove(constants.IGNORED_METADATA_COLUMNS, copy);
					metadataTableModel.metadataDotObject
						= Object.assign(metadataTableModel.metadataDotObject, dot.dot(copy));
					found = true;
					if (copy.hasOwnProperty("subject")) {
						const subject = copy.subject;
						const foundPatient = this.findPatientData(patientsData, subject);
						if (!foundPatient) {
							newPatients.push(subject);
						}
					}
				}
				return found ? obj : false;
			});

			if (newPatients.length > 0) {
				patientsDataModel.createNewPatientRecord(newPatients);
			}

			const columnsToDelete = existedColumns.filter((columnConfig) => {
				if (columnConfig.hidden) columnsToAdd.push(columnConfig);
				return !columnConfig.hidden;
			});

			if (!existedColumns.find(col => col.columnType === "image")) {
				columnsToAdd.unshift(constants.METADATA_TABLE_IMAGE_COLUMN_CONFIG);
			}

			// add columns of not existing item fields to window form
			this.newColumnsService.addNewColumnsFromLS();
			this.newColumnsService.addNewPatientsColumnsFromLS();

			this.createColumnsConfig(
				columnsToAdd,
				columnsToDelete,
				patientsColumnsToAdd,
				patientsColumnsToDelete
			);

			return success([
				columnsToAdd,
				columnsToDelete,
				patientsColumnsToAdd,
				patientsColumnsToDelete
			]);
		});
		return promise;
	}

	findPatientData(patientsData, subject) {
		let foundPatient = false;
		patientsData.forEach((patient) => {
			if (patient.name === subject && patient.hasOwnProperty("meta")) {
				metadataTableModel.patientsDataDotObject
					= Object.assign(metadataTableModel.patientsDataDotObject, dot.dot(patient.meta));
				foundPatient = true;
			}
		});
		return foundPatient;
	}

	createColumnsConfig(
		columnsToAdd,
		columnsToDelete,
		patientsColumnsToAdd,
		patientsColumnsToDelete
	) {
		const keys = Object.keys(metadataTableModel.metadataDotObject);
		const patientsKeys = Object.keys(metadataTableModel.patientsDataDotObject);
		keys.forEach((key) => {
			const dotNotation = key.split(".");
			const header = dotNotation.map(text => ({text}));
			const toDelete = columnsToDelete.find(columnToDelete => columnToDelete.id === key);
			if (!toDelete && !columnsToAdd.find(columnToAdd => columnToAdd.id === key)) {
				columnsToAdd.push({
					id: key,
					header
				});
			}
		});
		patientsKeys.forEach((patientsKey) => {
			const dotNotation = patientsKey.split(".");
			const header = dotNotation.map(text => ({text}));
			const toDelete = patientsColumnsToDelete
				.find(patientColumnToDelete => patientColumnToDelete.id === patientsKey);
			if (!toDelete
				&& !patientsColumnsToAdd.find(patientColumn => patientColumn.id === patientsKey)) {
				patientsColumnsToAdd.push({
					id: patientsKey,
					header,
					patientColumn: true
				});
			}
		});
	}

	showWindow(
		columnsToAdd,
		columnsToDelete,
		patientsColumnsToAdd,
		patientsColumnsToDelete,
		datatable
	) {
		this.metadataTable = datatable;
		this.fillInFormElements(
			columnsToAdd,
			columnsToDelete,
			patientsColumnsToAdd,
			patientsColumnsToDelete
		);
		this.getRoot().show();
	}

	close() {
		this.newColumnsService.clearNewColumnsForm();
		this.getRoot().hide();
	}
}
