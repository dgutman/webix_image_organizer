import EditColumnsWindow from "../../views/parts/datatableWindow/editColumnsWindow";
import datatableModel from "../../models/datatable";
import authService from "../authentication";
import UniqueValuesWindow from "../../views/dataview/windows/uniqueValuesWindow";
import constants from "../../constants";
import selectedDataviewItems from "../../models/selectDataviewItems";

let columnsConfigForDelete = [];
let datatableColumnsConfig = [];

class DataviewService {
	constructor(view, dataview, datatable, addColumnButton, exportButton, selectImagesTemplate, datatableImagesTemplate) {
		this._view = view;
		this._dataview = dataview;
		this._datatable = datatable;
		this._addColumnButton = addColumnButton;
		this._exportButton = exportButton;
		this._selectImagesTemplate = selectImagesTemplate;
		this._datatableImagesTemplate = datatableImagesTemplate;
		this._ready();
	}

	_ready() {
		if (authService.isLoggedIn()) {
			this._datatable.define("dragColumn", "true");
			this._datatable.define("resizeColumn", "true");
			this.userInfo = authService.getUserInfo();
		}
		webix.extend(this._view, webix.ProgressBar);

		this._editColumnsWindow = this._view.$scope.ui(EditColumnsWindow);
		this._uniqueValuesWindow = this._view.$scope.ui(UniqueValuesWindow);
		this._addColumnButton.attachEvent("onItemClick", () => {
			let addButtonPromise = new Promise((success) => {
				let existedColumns = webix.toArray(this._datatable.config.columns);
				this._datatable.find((obj) => {
					if (obj.hasOwnProperty("meta")) {
						this._createColumnsConfig(obj.meta);
						return obj;
					}
				}, true);
				existedColumns.each((columnConfig) => {
					this._checkColumnsForDelete(columnConfig);
				});
				return success();
			});
			addButtonPromise.then(() => {
				this._editColumnsWindow.showWindow(datatableColumnsConfig, columnsConfigForDelete, this._datatable);
				datatableColumnsConfig = [];
				columnsConfigForDelete = [];
			});
		});

		this._editColumnsWindow.getRoot().attachEvent("onHide", () => {
			let newDatatableColumns = datatableModel.getColumnsForDatatable(this._datatable);
			this._setColspansForColumnsHeader(newDatatableColumns);
			datatableModel.putInLocalStorage(newDatatableColumns, authService.getUserInfo()._id);
			this._datatable.refreshColumns(newDatatableColumns);
		});

		this._datatable.attachEvent("onBeforeColumnDrop", (sourceId, targetId) => {
			let columnsConfig;
			const localStorageColumnsConfig = datatableModel.getLocalStorageColumnsConfig();
			
			if (localStorageColumnsConfig) {
				columnsConfig = localStorageColumnsConfig;
			} else {
				columnsConfig = datatableModel.getInitialColumnsForDatatable();
			}
			const arrayLength = columnsConfig.length;
			let sourceIndex;
			let targetIndex;
			for (let index = 0; index < arrayLength; index++) {
				const columnHeader = columnsConfig[index].header;
				if (Array.isArray(columnHeader)) {
					columnHeader.forEach((columnHeaderValue) => {
						if (columnHeaderValue instanceof Object) {
							delete columnHeaderValue.colspan;
							delete columnHeaderValue.$colspan;
							delete columnHeaderValue.css;
						}
					});
				}
				if (columnsConfig[index].id === sourceId) {
					sourceIndex = index;
				} else if (columnsConfig[index].id === targetId) {
					targetIndex = index;
				}
			}
			const movedColumnsArray = this._arrayMove(columnsConfig, arrayLength, sourceIndex, targetIndex);
			this._setColspansForColumnsHeader(movedColumnsArray);
			datatableModel.putInLocalStorage(movedColumnsArray, this.userInfo._id);
			const newDatatableColumns = datatableModel.getColumnsForDatatable(this._datatable);
			this._datatable.refreshColumns(newDatatableColumns);
		});

		this._datatable.on_click["fa-pencil"] = (e, obj) => {
			let uniqueValuesArray = [];
			let columnId = obj.column;
			this._datatable.eachRow((rowId) => {
				let columnValue = this._datatable.getText(rowId, columnId);
				if (columnValue && uniqueValuesArray.indexOf(columnValue) === -1 && columnValue !== "No metadata for item") {
					uniqueValuesArray.push(columnValue);
				}
			});
			this._uniqueValuesWindow.showWindow(columnId, uniqueValuesArray);
		};

		this._exportButton.attachEvent("onItemClick", () => {
			this._view.$scope.exportToExcel();
		});

		this._view.$scope.on(this._view.$scope.app, "changedSelectedImagesCount", () => {
			this._selectImagesTemplate.refresh();
		});

		this._selectImagesTemplate.define("onClick", {
			"unselect-images-link": () => {
				this._unselectImages();
			},
			"gallery-select-all-images": () => {
				let limit = this._dataview.data.$max;
				let offset = this._dataview.data.$min;
				let isNeedShowAlert = true;
				let dataviewData = this._dataview.data.order;
				let length;
				if (dataviewData.length < limit) {
					length = dataviewData.length;
				} else {
					length = limit;
				}
				for (; offset < length; offset ++) {
					let item = this._dataview.getItem(dataviewData[offset]);
					if (item.markCheckbox) {
						return;
					}
					if (selectedDataviewItems.count() < constants.MAX_COUNT_IMAGES_SELECTION) {
						item.markCheckbox = 1;
						let checkBoxValue = 1;
						let checkBoxId = "1";
						this._dataview.callEvent("onCheckboxClicked", [checkBoxId, item.id, checkBoxValue]);
					}
					else if (isNeedShowAlert) {
						isNeedShowAlert = false;
						webix.alert({
							text: `You can select maximum ${constants.MAX_COUNT_IMAGES_SELECTION} images`
						});
					}
				}
				this._dataview.refresh();
				this._view.$scope.app.callEvent("changedSelectedImagesCount");
			},
			"gallery-select-first-count-images": () => {
				selectedDataviewItems.clearAll();
				let limit = constants.MAX_COUNT_IMAGES_SELECTION;
				let dataviewData = this._dataview.data.order;
				let length;
				if (dataviewData.length < limit) {
					length = dataviewData.length;
				} else {
					length = limit;
				}
				for (let offset = 0; offset < length; offset ++) {
					let item = this._dataview.getItem(dataviewData[offset]);
					item.markCheckbox = 1;
					let checkBoxValue = 1;
					let checkBoxId = 1;
					this._dataview.callEvent("onCheckboxClicked", [checkBoxId, item.id, checkBoxValue]);

				}
				this._dataview.refresh();
				this._view.$scope.app.callEvent("changedSelectedImagesCount");
			}
		});

		this._datatable.attachEvent("onAfterSelect", (id) => {
			const currentItem = this._datatable.getItem(id);
			this._datatableImagesTemplate.parse(currentItem);
		});
	}

	_arrayMove (array, length, oldIndex, newIndex) {
		if (newIndex >= length) {
			let key = newIndex - length + 1;
			while (key--) {
				array.push(undefined);
			}
		}
		array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
		return array;
	}

	_checkColumnsForDelete(columnConfig) {
		let hasPushed = false;
		let length = columnsConfigForDelete.length;
		if (length > 0) {
			columnsConfigForDelete.find((obj) => {
				if (obj.id === columnConfig.id){
					hasPushed = true;
				}
			});
			if (!hasPushed) {
				columnsConfigForDelete.push(columnConfig);
			}
		} else {
			columnsConfigForDelete.push(columnConfig);
		}
	}

	_unselectImages() {
		this._dataview.data.each((item) => {
			item.markCheckbox = 0;
			let checkBoxValue = 0;
			let checkBoxId = 1;
			this._dataview.callEvent("onCheckboxClicked", [checkBoxId, item.id, checkBoxValue]);
		});
		this._dataview.refresh();
		selectedDataviewItems.clearAll();
		this._view.$scope.app.callEvent("changedSelectedImagesCount");

	}

	_createColumnsConfig(obj, nestLevel = 0, header = [], path = "", objectKey) {
		Object.entries(obj).forEach(([key, value]) => {
			if (path.length === 0) {
				path = key;
			} else {
				path+= `.${key}`;
			}
			if (value instanceof Object) {
				header.push({text: key});
				this._createColumnsConfig(value, nestLevel++, header, path, key);
			} else {
				if (!objectKey) {
					path = key;
					header = [];
				}
				datatableColumnsConfig.push({
					id: path,
					header: header.concat(key)
				});
				if (objectKey) {
					path = path.substring(0, path.indexOf("."));
				}
			}
		});
	}

	_setColspansForColumnsHeader(newDatatableColumns) {
		let colspanInfoArray = [];
		let colspanIndex = 0;
		for (let index = 0; index < newDatatableColumns.length; index++) {

			if (newDatatableColumns[index].metadataColumn) {
				const columnHeader = newDatatableColumns[index].header;

				if (Array.isArray(columnHeader)) {
					let nextColumnIndex = index + 1;

					while (nextColumnIndex) {
						let unfoundValuesArray = [];
						const nextColumnConfig = newDatatableColumns[nextColumnIndex];

						if (nextColumnConfig && nextColumnConfig.metadataColumn) {
							const nextColumnHeader = nextColumnConfig.header;
							if (Array.isArray(nextColumnHeader)) {
								columnHeader.forEach((headerValue, headerIndex) => {
									if (headerValue instanceof Object && nextColumnHeader[headerIndex] instanceof Object) {
										if (headerValue.text === nextColumnHeader[headerIndex].text) {
											if (colspanInfoArray.length === 0 || !colspanInfoArray[colspanIndex]) {
												colspanInfoArray.push([{
													columnIndex: index,
													headerIndex: headerIndex,
													colspanValue: 2
												}]);
											} else {
												const neededHeaderIndex = colspanInfoArray[colspanIndex].findIndex(colspanInfoValues => colspanInfoValues.headerIndex === headerIndex);
												if (neededHeaderIndex !== -1) {
													++colspanInfoArray[colspanIndex][neededHeaderIndex].colspanValue;
												} else {
													colspanInfoArray[colspanIndex].push({
														columnIndex: index,
														headerIndex: headerIndex,
														colspanValue: 2
													});
												}
											}
										} else {
											unfoundValuesArray.push("nothing has found");
										}
									} else {
										unfoundValuesArray.push("nothing has found");
									}
								});

							} else {
								if (colspanInfoArray.length !== 0) {
									index = nextColumnIndex;
								}
								break;
							}
							if (unfoundValuesArray.length === columnHeader.length) {
								if (colspanInfoArray.length !== 0) {
									index = nextColumnIndex;
								}
								break;
							} else {
								++nextColumnIndex;
							}
						} else {
							if (colspanInfoArray.length !== 0) {
								index = nextColumnIndex;
							}
							break;
						}
					}
				}
				if (colspanInfoArray.length !== 0) {
					++colspanIndex;
				}
			}
		}

		colspanInfoArray.forEach((colspanInfo) => {
			colspanInfo.forEach((colspanInfoValues) => {
				const columnIndex = colspanInfoValues.columnIndex;
				const headerIndex = colspanInfoValues.headerIndex;
				const colspanValue = colspanInfoValues.colspanValue;
				const headerForcolspan = newDatatableColumns[columnIndex].header[headerIndex];
				if (headerForcolspan instanceof Object) {
					headerForcolspan["colspan"] = colspanValue;
					headerForcolspan["css"] = "column-header-top-name";
				}
			});
		});
	}
}

export default DataviewService;