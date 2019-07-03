import EditColumnsWindow from "../../views/subviews/metadataTable/windows/editColumnsWindow";
import metadataTableModel from "../../models/metadataTableModel";
import authService from "../authentication";
import UniqueValuesWindow from "../../views/subviews/metadataTable/windows/uniqueValuesWindow";
import ajaxActions from "../ajaxActions";
import webixViews from "../../models/webixViews";
import utils from "../../utils/utils";
import downloadFiles from "../../models/downloadFiles";

let columnsConfigForDelete = [];
let datatableColumnsConfig = [];
let editUniqueClick;
let editValue;

class MetadataTableService {
	constructor(view, metadataTable, addColumnButton, exportButton, metadataTableThumbnailsTemplate) {
		this._view = view;
		this._metadataTable = metadataTable;
		this._addColumnButton = addColumnButton;
		this._exportButton = exportButton;
		this._metadataTableThumbnailsTemplate = metadataTableThumbnailsTemplate;
		this._ready();
	}

	_ready() {
		if (authService.isLoggedIn()) {
			this._metadataTable.define("dragColumn", "true");
			this._metadataTable.define("resizeColumn", "true");
			this.userInfo = authService.getUserInfo();
		}
		webix.extend(this._view, webix.ProgressBar);

		webixViews.setMetadataTableThumbnailTemplate(this._metadataTableThumbnailsTemplate);

		this._editColumnsWindow = this._view.$scope.ui(EditColumnsWindow);
		this._uniqueValuesWindow = this._view.$scope.ui(UniqueValuesWindow);
		this._addColumnButton.attachEvent("onItemClick", () => {
			const addButtonPromise = new Promise((success) => {
				let existedColumns = webix.toArray(this._metadataTable.config.columns);
				this._metadataTable.find((obj) => {
					if (obj.hasOwnProperty("meta")) {
						this._createColumnsConfig(obj.meta);
						return obj;
					}
				});
				existedColumns.each((columnConfig) => {
					this._checkColumnsForDelete(columnConfig);
				});
				return success();
			});
			addButtonPromise.then(() => {
				this._editColumnsWindow.showWindow(datatableColumnsConfig, columnsConfigForDelete, this._metadataTable);
				datatableColumnsConfig = [];
				columnsConfigForDelete = [];
			});
		});

		this._editColumnsWindow.getRoot().attachEvent("onHide", () => {
			const newDatatableColumns = metadataTableModel.getColumnsForDatatable(this._metadataTable);
			this._setColspansForColumnsHeader(newDatatableColumns);
			metadataTableModel.putInLocalStorage(newDatatableColumns, authService.getUserInfo()._id);
			this._metadataTable.refreshColumns(newDatatableColumns);
		});

		this._metadataTable.attachEvent("onBeforeColumnDrop", (sourceId, targetId) => {
			let columnsConfig;
			const localStorageColumnsConfig = metadataTableModel.getLocalStorageColumnsConfig();

			if (localStorageColumnsConfig) {
				columnsConfig = localStorageColumnsConfig;
			} else {
				columnsConfig = metadataTableModel.getInitialColumnsForDatatable();
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
			metadataTableModel.putInLocalStorage(movedColumnsArray, this.userInfo._id);
			const newDatatableColumns = metadataTableModel.getColumnsForDatatable(this._metadataTable);
			this._metadataTable.refreshColumns(newDatatableColumns);
		});

		this._metadataTable.on_click["fa-pencil-alt"] = (e, obj) => {
			let uniqueValuesArray = [];
			let columnId = obj.column;
			this._metadataTable.eachRow((rowId) => {
				let columnValue = this._metadataTable.getText(rowId, columnId);
				if (columnValue && uniqueValuesArray.indexOf(columnValue) === -1 && columnValue !== "No metadata for item") {
					uniqueValuesArray.push(columnValue);
				}
			});
			this._uniqueValuesWindow.showWindow(columnId, uniqueValuesArray);
			editUniqueClick = true;
		};

		this._metadataTable.attachEvent("onBeforeSort", () => {
			if (editUniqueClick) {
				editUniqueClick = false;
				return false;
			}
			return true;
		});

		this._exportButton.attachEvent("onItemClick", () => {
			this._view.$scope.exportToExcel();
		});

		this._metadataTable.attachEvent("onAfterLoad", () => {
			const newDatatableColumns = metadataTableModel.getColumnsForDatatable(this._metadataTable);
			this._metadataTable.refreshColumns(newDatatableColumns);
		});

		this._metadataTable.attachEvent("onBeforeEditStart", (infoObject) => {
			this._selectDatatableItem(infoObject.row);
		});

		this._metadataTable.attachEvent("onAfterEditStart", (infoObject) => {
			const columnId = infoObject.column;
			const editor = this._metadataTable.getEditor();
			const rowId = infoObject.row;
			const item = this._metadataTable.getItem(rowId);
			editValue = item.hasOwnProperty("meta") ? metadataTableModel.getOrEditMetadataColumnValue(item, `meta.${columnId}`) : "";
			if (editValue && typeof editValue !== "object")
				editor.setValue(editValue);
		});

		this._metadataTable.attachEvent("onBeforeEditStop", (values, obj) => {
			if (editValue !== values.value) {
				const columnId = obj.column;
				const rowId = obj.row;
				const itemToEdit = this._metadataTable.getItem(rowId);
				const copyOfAnItemToEdit = webix.copy(itemToEdit);
				// insert new metadata value or edit already existed
				utils.setObjectProperty(copyOfAnItemToEdit, `meta.${columnId}`, values.value);
				this._view.showProgress();
				ajaxActions.updateItemMetadata(itemToEdit._id, copyOfAnItemToEdit.meta)
					.then(() => {
						this._metadataTable.updateItem(rowId, copyOfAnItemToEdit);
						this._view.hideProgress();
					})
					.fail(() => {
						this._view.hideProgress();
					});

			}
		});

		this._metadataTable.attachEvent("onKeyPress", (keyCode) => {
			if (keyCode === 38 || keyCode === 40) {
				const editor = this._metadataTable.getEditor();
				const selectedId = this._metadataTable.getSelectedId() ? this._metadataTable.getSelectedId() : this._metadataTable.getFirstId();
				if (editor) {
					const rowId = editor.row;
					const columnId = editor.column;
					const columnConfig = this._metadataTable.getColumnConfig(columnId);
					if (!columnConfig.editor) {
						return false;
					}
					const nextRowId = keyCode === 38 ? this._metadataTable.getPrevId(rowId) : this._metadataTable.getNextId(rowId);
					this._metadataTable.edit({
						column: columnId,
						row: nextRowId
					});
				} else {
					const nextRowId = keyCode === 38 ? this._metadataTable.getPrevId(selectedId) : this._metadataTable.getNextId(selectedId);
					this._selectDatatableItem(nextRowId);
				}
			}
		});

		this._metadataTableThumbnailsTemplate.define("onClick", {
			"datatable-template-image": (e, id) => {
				const imageType = e.srcElement.getAttribute("imageType");
				const selectedObj = this._metadataTable.getSelectedItem();
				const imageWindow = webixViews.getImageWindow();
				const pdfViewerWindow = webixViews.getPdfViewerWindow();

				if (imageType === "label-image") {
					selectedObj.label = true;
				}
				downloadFiles.openOrDownloadFiles(selectedObj, imageWindow, pdfViewerWindow);
			}
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
									if (headerValue instanceof Object && nextColumnHeader[headerIndex] instanceof Object && !headerValue.hasOwnProperty("content")) {
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
				const headerForColspan = newDatatableColumns[columnIndex].header[headerIndex];
				if (headerForColspan instanceof Object) {
					headerForColspan["colspan"] = colspanValue;
					headerForColspan["css"] = "column-header-top-name";
				}
			});
		});
	}

	_selectDatatableItem(rowId) {
		this._metadataTable.blockEvent();
		const metadataTableThumbnailsTemplate = webixViews.getMetadataTableThumbnailTemplate();
		this._metadataTable.select(rowId);
		const currentItem = this._metadataTable.getItem(rowId);
		metadataTableThumbnailsTemplate.parse(currentItem);
		this._metadataTable.unblockEvent();
	}
}

export default MetadataTableService;