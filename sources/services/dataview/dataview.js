import EditColumnsWindow from "../../views/parts/datatableWindow/editColumnsWindow";
import datatableModel from "../../models/datatable";
import authService from "../authentication";
import UniqueValuesWindow from "../../views/dataview/windows/uniqueValuesWindow";
import constants from "../../constants";
import selectedDataviewItems from "../../models/selectDataviewItems";

let metadataKeys = [];
let columnsConfigForDelete = [];

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
					if (obj.meta) {
						let keys;
						if (obj.meta.groups) {
							keys = Object.keys(obj.meta.groups);
							this._checkObjectKeys(keys);
						} else {
							keys = Object.keys(obj.meta);
							this._checkObjectKeys(keys);
						}
					}
				});
				existedColumns.each((columnConfig) => {
					this._checkColumnsForDelete(columnConfig);
				});
				return success();
			});
			addButtonPromise.then(() => {
				this._editColumnsWindow.showWindow(metadataKeys, columnsConfigForDelete, this._datatable);
				metadataKeys = [];
				columnsConfigForDelete = [];
			});
		});

		this._datatable.attachEvent("onAfterColumnDrop", (sourceId, targetId) => {
			let columnsConfig;
			let localStorageColumnsConfig = datatableModel.getLocalStorageColumnsConfig();
			
			if (localStorageColumnsConfig) {
				columnsConfig = localStorageColumnsConfig;
			} else {
				columnsConfig = datatableModel.getInitialColumnsForDatatable();
			}
			let arrayLength = columnsConfig.length;
			let sourceIndex;
			let targetIndex;
			for (let index = 0; index < arrayLength; index++) {
				if (columnsConfig[index].id === sourceId) {
					sourceIndex = index;
				} else if (columnsConfig[index].id === targetId) {
					targetIndex = index;
				}
			}
			let newColumnsConfig = this._arrayMove(columnsConfig, arrayLength, sourceIndex, targetIndex);
			datatableModel.putInLocalStorage(newColumnsConfig, this.userInfo._id);
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

	_checkObjectKeys(keys) {
		keys.forEach((key) => {
			if (!(metadataKeys.indexOf(key) > -1)) {
				metadataKeys.push(key);
			}
		});
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
}

export default DataviewService;