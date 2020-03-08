import metadataTableModel from "../../models/metadataTableModel";
import authService from "../authentication";
import UniqueValuesWindow from "../../views/subviews/metadataTable/windows/uniqueValuesWindow";
import ajaxActions from "../ajaxActions";
import webixViews from "../../models/webixViews";
import utils from "../../utils/utils";
import downloadFiles from "../../models/downloadFiles";
import EditColumnsWindow from "../../views/subviews/metadataTable/windows/editColumnsWindow";
import constants from "../../constants";

let editUniqueClick;
let editValue;
let movedColumnsArray = [];
let keyPressEventId;

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

		this._uniqueValuesWindow = this._view.$scope.ui(UniqueValuesWindow);
		this._editColumnsWindow = this._view.$scope.ui(EditColumnsWindow);

		this._addColumnButton.attachEvent("onItemClick", () => {
			this._editColumnsWindow.buildColumnsConfig(this._metadataTable)
				.then(([columnsToAdd, columnsToDelete]) => {
					this._editColumnsWindow.showWindow(columnsToAdd, columnsToDelete, this._metadataTable);
				})
				.catch(err => webix.message(err.message));
		});


		this._metadataTable.attachEvent("onAfterRender", () => {
			this._attachNameFilterKeyPressEvent();
		});

		this._editColumnsWindow.getRoot().attachEvent("onHide", () => {
			const newDatatableColumns = metadataTableModel.getColumnsForDatatable(this._metadataTable);
			this._setColspansForColumnsHeader(newDatatableColumns);
			// to prevent null header bug
			this._metadataTable.refreshColumns([]);
			this._metadataTable.refreshColumns(newDatatableColumns);
		});

		this._metadataTable.attachEvent("onBeforeColumnDrop", (sourceId, targetId) => {
			const localStorageColumnsConfig = metadataTableModel.getLocalStorageColumnsConfig();
			const initialColumnsConfig = metadataTableModel.getInitialColumnsForDatatable();
			const columnsConfig = localStorageColumnsConfig || initialColumnsConfig;
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
				}
				else if (columnsConfig[index].id === targetId) {
					targetIndex = index;
				}
			}

			movedColumnsArray = this._arrayMove(columnsConfig, arrayLength, sourceIndex, targetIndex);
			this._setColspansForColumnsHeader(movedColumnsArray);
			// to prevent null header bug
			this._metadataTable.refreshColumns([]);
		});

		this._metadataTable.attachEvent("onAfterColumnDrop", () => {
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
			editValue = editValue || "";
			if (editValue && typeof editValue !== "object") { editor.setValue(editValue); }
		});

		this._metadataTable.attachEvent("onBeforeEditStop", (values, obj) => {
			if (typeof editValue !== "object" && editValue.toString() !== values.value) {
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
					.catch(() => {
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
					if (nextRowId) {
						this._metadataTable.edit({
							column: columnId,
							row: nextRowId
						});
					}
				}
				else {
					const nextRowId = keyCode === 38 ? this._metadataTable.getPrevId(selectedId) : this._metadataTable.getNextId(selectedId);
					if (nextRowId) this._selectDatatableItem(nextRowId);
				}
			}
		});

		this._metadataTableThumbnailsTemplate.define("onClick", {
			"datatable-template-image": (e, id) => {
				const imageType = e.srcElement.getAttribute("imageType");
				const selectedObj = this._metadataTable.getSelectedItem();
				const imageWindow = webixViews.getImageWindow();
				const pdfViewerWindow = webixViews.getPdfViewerWindow();

				selectedObj.label = null;
				if (imageType === "label-image") {
					selectedObj.label = true;
				}
				downloadFiles.openOrDownloadFiles(selectedObj, imageWindow, pdfViewerWindow);
			}
		});
	}

	_arrayMove(array, length, oldIndex, newIndex) {
		if (newIndex >= length) {
			let key = newIndex - length + 1;
			while (key--) {
				array.push(undefined);
			}
		}
		array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
		return array;
	}

	_createColumnsConfig(columnsToAdd, columnsToDelete) {
		const keys = Object.keys(metadataTableModel.metadataDotObject);
		keys.forEach((key) => {
			const dotNotation = key.split(".");
			const header = dotNotation.map(text => ({text}));
			const toDelete = columnsToDelete.find(columnToDelete => columnToDelete.id === key);
			if (!toDelete) {
				columnsToAdd.push({
					id: key,
					header
				});
			}
		});
	}

	_setColspansForColumnsHeader(tableColumns) {
		if (!Array.isArray(tableColumns)) {
			webix.alert("There is no columns in metadata table");
		}
		let index = 0;

		tableColumns.forEach((tableColumn, columnIndex) => {
			const BreakException = {};
			const columnHeader = tableColumn.header;

			if (!tableColumn.metadataColumn || !Array.isArray(columnHeader) || index > columnIndex) {
				return tableColumn;
			}

			index = columnIndex + 1;
			try {
				columnHeader.forEach((headerValue, headerIndex) => {
					let count = 1;

					for (index; index < tableColumns.length; index++) {
						const nextColumn = tableColumns[index];
						const nextColumnHeader = nextColumn.header;

						if (!nextColumn || !Array.isArray(nextColumnHeader)) {
							throw BreakException;
						}

						const headerText = headerValue instanceof Object
							? headerValue.text
							: headerValue;
						const nextHeaderText = nextColumnHeader[headerIndex] instanceof Object
							? nextColumnHeader[headerIndex].text
							: nextColumnHeader[headerIndex];
						if (headerText !== nextHeaderText) {
							break;
						}
						count++;
					}
					const colspanValue = count;
					if (colspanValue !== 1) {
						if (headerValue instanceof Object) {
							headerValue.colspan = colspanValue;
							headerValue.css = "column-header-top-name";
						}
						else if (headerValue instanceof String) {
							headerValue = {
								text: headerValue,
								colspan: colspanValue,
								css: "column-header-top-name"
							};
						}
					}
				});
			}
			catch (err) {
				if (err !== BreakException) throw err;
			}
		});

		metadataTableModel.putInLocalStorage(tableColumns, authService.getUserInfo()._id);
	}

	_selectDatatableItem(rowId) {
		this._metadataTable.blockEvent();
		const metadataTableThumbnailsTemplate = webixViews.getMetadataTableThumbnailTemplate();
		this._metadataTable.select(rowId);
		const currentItem = this._metadataTable.getItem(rowId);
		metadataTableThumbnailsTemplate.parse(currentItem);
		this._metadataTable.unblockEvent();
	}

	_attachNameFilterKeyPressEvent() {
		const filterInput = this._metadataTable.getFilter("name");
		if (filterInput) {
			const dataviewSearchInput = webixViews.getDataviewSearchInput();
			let timeoutId;
			const inputEvent = function inputEvent() {
				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					dataviewSearchInput.blockEvent();
					dataviewSearchInput.setValue(filterInput.value);
					dataviewSearchInput.unblockEvent();
				}, 500);
			};
			filterInput.removeEventListener("input", inputEvent);
			filterInput.addEventListener("input", inputEvent);
		}
	}
}

export default MetadataTableService;
