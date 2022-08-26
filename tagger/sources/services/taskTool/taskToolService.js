import transitionalAjax from "../transitionalAjaxService";
import ajaxService from "../ajaxActions";
import auth from "../authentication";
import DataviewService from "../dataview/dataviewService";
import "../globalEvents";
import SelectedImagesModel from "../../models/selectedImages";
import CustomDataPull from "../../models/customDataPullClass";
import taskJSONCollection from "../../models/taskJSON";
import TagTemplatesPopup from "../../views/windows/tagTemplates";
import tagTemplates from "../../models/tagTemplates";
import InfoPopup from "../../views/windows/infoPopup";
import validateTask from "../taskValidator";
import imageWindow from "../../views/windows/imageWindow";

const mongoose = require("mongoose");

const SELECTION_LIMIT = 1000;

class TaskToolService {
	constructor(view) {
		this._view = view;
		this._ready();

		this._bgItems = [];
	}

	_ready() {
		const scope = this._view.$scope;
		this._accordion = scope.accordion;
		this._foldersList = scope.foldersGroupList;
		this._dataview = scope.dataview;
		this._dataviewPager = scope.dataviewPager;
		this._selectDataviewTemplate = scope.selectDataviewTemplate;
		this._selectAll = scope.selectAll;
		this._selectAllOnPage = scope.selectAllOnPage;
		this._unselectAll = scope.unselectAll;
		this._tagTemplatesLink = scope.tagTemplatesLink;
		this._showSelectedButton = scope.showSelectedButton;
		this._showImageName = scope.showImageName;
		this._showMeta = scope.showMeta;
		this._showROI = scope.showROI;
		this._showROIBorders = scope.showROIBorders;
		this._tagsForm = scope.tagsForm;
		this._taskCreationForm = scope.taskCreationForm;
		this._createTaskButton = scope.createTaskButton;
		this._publishTaskButton = scope.publishTaskButton;
		this._editTaskButton = scope.editTaskButton;
		this._previewButton = scope.previewButton;
		this._tagTemplatesPopup = scope.ui(new TagTemplatesPopup(scope.app));
		this._itemMetadataPopup = scope.ui(new InfoPopup(scope.app, "metadata", "Metadata", true));
		this._imageWindow = scope.ui(imageWindow);

		// images collections for ROI
		this._imagesCollection = new webix.DataCollection();
		this._roisCollection = new webix.DataCollection();

		this._dataviewStore = new CustomDataPull(this._dataview);
		this._selectedImagesModel = new SelectedImagesModel(this._dataview);

		webix.extend(this._view, webix.ProgressBar);
		webix.extend(this._foldersList, webix.ProgressBar);
		webix.extend(this._dataview, webix.ProgressBar);

		this._dataviewService = new DataviewService(this._dataview, this._dataviewPager);
		this._getCollections();
		this._attachFolderListEvents();

		this._attachDataviewResizing();
		this._attachViewEvents();
		this._attachDataviewEvents();
		// "Show selected items" button initiation
		this._setShowSelectedState();
		this._setNormalDataviewState();

		// "Show image names" button initiation
		this._setImageNames();
		this._setShowMeta();

		// "Hide ROI borders" button initiation
		this._setShowROIBorder();

		// for ROI by pattern
		let jsonColl = taskJSONCollection.get();
		this._showROIBorders.hide();
		if (jsonColl?.task?.fromROI) {
			this._roisCollection.parse(jsonColl.images);
			this._setShowROI();
			this._setShowROIBorder();
			this.fromPattern = true;
			this._toggleVisibilityOfHiddenViews(jsonColl.images.length > 0);
			this._resizeDataview();
		}
		else {
			this._roisCollection.clearAll();
		}

		transitionalAjax.getTagTemplatesWithValues()
			.then((data) => {
				tagTemplates.tagsWithValues.parse(data);
			});

		this._showSelectedButton.attachEvent("onItemClick", () => {
			const isDataviewEmpty = this._dataview.serialize().length > 0;
			if (this._showSelected) {
				this._setNormalDataviewState();
				this._toggleVisibilityOfHiddenViews(isDataviewEmpty);
			}
			else {
				this._setShowSelectedState();
				this._toggleVisibilityOfHiddenViews(isDataviewEmpty);
			}
		});

		// Show/hide image names
		this._showImageName.attachEvent("onItemClick", () => this._setImageNames());

		this._dataview.attachEvent("onItemDblClick", (id, e) => {
			const item = this._dataviewStore.getItemById(id);
			this._imageWindow.showWindow(item, this.fromROI, this.showROIBorders, "creatorLarge");
		});

		// Show/hide metadata
		this._showMeta.attachEvent("onItemClick", () => this._setShowMeta());
		this._showROI.attachEvent("onItemClick", () => {
			if (this._selectedImagesModel.getSelectedItems().length > 0) {
				webix.confirm({
					title: "Clear selected items",
					text: "If you switch on/off the ROI mode, the selected items will be cleared. Do you want to proceed?",
					ok: "Yes",
					cancel: "No"
				})
					.then(() => {
						this._selectedImagesModel.unselectAllItems();
						this._setShowROI();
						this._view.hideProgress();
					});
			}
			else this._setShowROI();
		});
		this._showROIBorders.attachEvent("onItemClick", () => this._setShowROIBorder());

		this._editTaskButton.attachEvent("onItemClick", () => {
			const taskData = this._collectTaskFormData();
			const isValid = this._validateTaskByJSONValidator(taskData);
			if (!isValid) return;

			const taskId = scope.getParam("edit");
			const imageIds = this._selectedImagesModel.getSelectedIds();

			this._view.showProgress();
			transitionalAjax.updateTask(taskId, taskData, imageIds)
				.then((data) => {
					webix.message(data.message);
					return transitionalAjax.getTagTemplatesWithValues();
				})
				.then((data) => {
					tagTemplates.tagsWithValues.clearAll();
					tagTemplates.tagsWithValues.parse(data);
					this._view.hideProgress();
				})
				.catch(() => {
					this._view.hideProgress();
				});
		});

		const taskJSON = taskJSONCollection.get();
		if (taskJSON) {
			if (scope.getParam("edit")) {
				this._editTaskButton.show();
				this._createTaskButton.hide();
			}
			this._selectedImagesModel.add(taskJSON.images);
			this._changeSelectedItemsButtonValue(taskJSON.images);
		}
	}

	_attachDataviewResizing() {
		this._accordion.attachEvent("onAfterCollapse", () => {
			this._resizeDataview();
		});
		this._accordion.attachEvent("onAfterExpand", () => {
			this._resizeDataview();
		});
		this._view.$scope.on(this._view.$scope.app, "windowResize", () => {
			this._resizeDataview();
		});
	}

	_attachViewEvents() {
		this._selectAllOnPage.attachEvent("onItemClick", () => {
			this._selectedImagesModel.selectAllVisibleItems(this._dataviewPager);
		});
		this._selectAll.attachEvent("onItemClick", () => {
			this._selectedImagesModel.selectAllItems();
		});
		this._unselectAll.attachEvent("onItemClick", () => {
			this._selectedImagesModel.unselectAllItems();
		});


		this._tagTemplatesLink.define("onClick", {
			"tag-templates-link": () => {
				this._tagTemplatesPopup.showWindow();
			}
		});

		this._createTaskButton.attachEvent("onItemClick", () => {
			const taskData = this._collectTaskFormData();
			const isValid = this._validateTaskByJSONValidator(taskData);
			if (!isValid) return;
			taskData.status = "created";
			this._publishTaskButton.show();
			this._createTaskButton.hide();
			const imageIds = this._selectedImagesModel.getSelectedIds();
			const selectedImages = this._selectedImagesModel.getSelectedItems();
			if (taskData.fromPattern) {
				selectedImages.forEach(img => img._id = mongoose.Types.ObjectId().toString());
			}
			if (taskData) {
				this._view.showProgress();
				transitionalAjax.createTask(taskData, imageIds, selectedImages)
					.then((data) => {
						webix.message(data.message);
						this._view.hideProgress();
						this.createdTaskId = data.data._id;
					})
					.catch(() => {
						this._view.hideProgress();
					});
			}
		});

		this._publishTaskButton.attachEvent("onItemClick", () => {
			const taskData = this._collectTaskFormData();
			const isValid = this._validateTaskByJSONValidator(taskData);
			if (!isValid) return;
			taskData.status = "published";
			this._publishTaskButton.show();
			this._createTaskButton.hide();
			const imageIds = this._selectedImagesModel.getSelectedIds();
			const taskId = this.createdTaskId;
			if (taskData && taskId) {
				this._view.showProgress();
				const selectedImages = this._selectedImagesModel.getSelectedItems();
				transitionalAjax.deleteTask(taskId, true)
					.then(() => transitionalAjax.createTask(taskData, imageIds, selectedImages)
						.then((data) => {
							webix.message("Data published");
							this._view.hideProgress();
						})
						.catch(() => {
							this._view.hideProgress();
						}));
			}
			this._view.$scope.app.show("/dashboard");
		});

		this._previewButton.attachEvent("onItemClick", () => {
			const taskData = this._collectTaskFormData();
			const isValid = this._validateTaskByJSONValidator(taskData);
			if (!isValid) return;

			const selectedItems = this._selectedImagesModel.getSelectedItems();
			const previewView = $$("preview_task");
			const previewPageService = previewView.$scope.previewPageService;
			const parentNode = previewView.getNode();
			if (!taskData.imgNames) {
				parentNode.classList.add("hide-names");
			}
			else {
				parentNode.classList.remove("hide-names");
			}
			if (!taskData.showMeta) {
				parentNode.classList.add("hide-meta");
			}
			else {
				parentNode.classList.remove("hide-meta");
			}
			previewPageService.parseTagsAndValues(taskData);
			previewPageService.parseImages(selectedItems, taskData);
			this._view.setValue("preview_task");
		});
	}

	_attachDataviewEvents() {
		this._dataviewService.setImageSize("Medium");
		this._resizeDataview();
		this._setImageNames();
		this._setShowMeta();

		this._setDataviewOverLay();

		this._dataview.data.attachEvent("onStoreUpdated", () => {
			this._setDataviewOverLay();
		});

		this._dataview.attachEvent("onItemClick", (id, ev) => {
			const item = this._dataview.getItem(id);

			if (ev.target.classList.contains("checkbox")) {
				this._selectedImagesModel.onItemSelect(ev.shiftKey, item);
			}
			else if (ev.target.classList.contains("show-metadata")) {
				if (this._itemMetadataPopup.isVisible()) {
					this._itemMetadataPopup.closeWindow();
					return false;
				}
				if (!this._itemMetadataPopup.isVisible() || !this._itemMetadataPopup._wasMoved) {
					this._itemMetadataPopup.showWindow(ev.target, {pos: "bottom"}, item, true);
				}
				else {
					this._itemMetadataPopup.createJSONViewer(item);
				}
				return false;
			}
		});

		this._dataview.attachEvent("customSelectChange", (items) => {
			const isFitSelectionLimit = this._fitBySelectionLimit(items);
			if (isFitSelectionLimit) {
				this._changeSelectedItemsButtonValue(items);
			}
			else {
				webix.message(`You can't select more than ${SELECTION_LIMIT} images`);
			}
		});
	}

	_setDataviewOverLay() {
		const count = this._dataview.count();
		let overlayText = "";

		overlayText = "There are no items";
		this._dataviewService.setDataviewState(count, overlayText);
	}

	_resizeDataview() {
		const xSpacer = this._view.queryView({selector: "dataview_x_spacer"});
		const ySpacer = this._view.queryView({selector: "dataview_y_spacer"});
		if (xSpacer.isVisible()) xSpacer.hide();
		if (ySpacer.isVisible()) ySpacer.hide();
		this._dataviewService.onResizeDataview()
			.then((page) => {
				// to fix bug with 2 times last page selecting.
				if (this._dataviewPager.data.page !== page) {
					this._dataviewPager.select(page);
				}
				// to align dataview to center
				const {xReminder, yReminder} = this._dataviewService.getVisibleRange();

				const xSpacerWidth = xReminder / 2;
				xSpacer.define("width", xSpacerWidth);
				if (xSpacerWidth >= 16 && this._dataview.count()) xSpacer.show();

				const ySpacerHeight = yReminder / 2;
				ySpacer.define("height", ySpacerHeight);
				if (ySpacerHeight >= 16 && this._dataview.count()) ySpacer.show();
				this._itemMetadataPopup.setInitPosition();
			});
	}

	_toggleVisibilityOfHiddenViews(show) {
		const hiddenViews = this._view.$scope.viewsToHide;
		hiddenViews.forEach((view) => {
			if (show) view.show();
			else view.hide();
		});
		this._resizeDataview();
	}

	_changeSelectedItemsButtonValue(items) {
		this._showSelectedButton.setValue(`Show selected items (${items.length})`);
	}

	_validateTaskByJSONValidator(taskData) {
		if (!taskData) return false;
		const iconValid = taskData.tags.reduce((sum, current) => {
			let iconVal = !((current.icontype === "badge" || current.icontype === "badgecolor") && current.icon === "");
			return sum && iconVal;
		}, true);
		if (!iconValid) {
			webix.message("Please, select icon");
		}

		const hasDefault = taskData.tags.filter((tag) => {
			if (tag.type === "multiple_with_default") return true;
		});
		let validDefault = hasDefault.length === 0;
		if (!validDefault) {
			let defaultsArr = hasDefault.filter((tag) => {
				let values = tag.values;
				for (let key in values) {
					if (values[key].default === true) return true;
				}
			});
			validDefault = defaultsArr.length === hasDefault.length;
		}
		if (!validDefault) {
			webix.message("Please, select default value");
		}
		const validDate = !!taskData.deadline;
		if (!validDate) {
			taskData.deadline = new Date().toString();
			document.querySelector(".webix_el_datepicker").classList.add("webix_invalid");
			webix.message("Please, select the deadline");
		}
		else {
			document.querySelector(".webix_el_datepicker").classList.remove("webix_invalid");
		}

		const isTaskValid = validateTask({task: taskData});
		const selectedItems = this._selectedImagesModel.getSelectedItems();

		const validFields = iconValid && validDefault && validDate;
		const condition = selectedItems.length && isTaskValid && taskData && validFields;

		if (!condition) {
			if (!selectedItems.length) {
				webix.message("Please, select images");
			}
			if (taskData && !isTaskValid) {
				validateTask.errors.forEach((err) => {
					if (err.dataPath) {
						webix.message(`<b class='strong-font'>${err.dataPath}</b><div>${err.message}</div>`);
					}
				});
			}
		}
		return condition;
	}

	_collectTaskFormData() {
		const tagForms = this._tagsForm.getFormChilds();
		const task = this._taskCreationForm.$scope.collectFormData();
		if (task.deadline) task.deadline = task.deadline.toString();
		task.imgNames = this.imgNames || false;
		task.showMeta = this.showMeta || false;
		task.fromROI = this.fromROI || false;
		task.showROIBorders = this.showROIBorders || false;
		task.fromPattern = this.fromPattern || false;

		task.user = this.getIdsFromObjects(task.user).unique();
		task.creator = [auth.getUserId(), ...this.getIdsFromObjects(task.creator || [])].unique();
		const taskService = this._taskCreationForm.$scope._taskCreationService;
		const taskValidation = this._taskCreationForm.validate();

		const userInputId = taskService._usersSelect._multiCombo.data.id;
		const userInput = document.querySelector(`[view_id="${userInputId}"] input`);
		userInput.value = "";
		const creatorInputId = taskService._creatorsSelect._multiCombo.data.id;
		const creatorInput = document.querySelector(`[view_id="${creatorInputId}"] input`);
		creatorInput.value = "";
		const tagsValidation = tagForms.reduce((acc, form) => {
			if (!form.validate()) {
				acc = false;
			}

			const valueForms = form.queryView({localId: "value-form"}, "all");
			const valueValidation = valueForms.reduce((valueAcc, valForm) => {
				const isFormValid = valForm.validate();
				return !valueAcc ? valueAcc : isFormValid;
			}, true);

			if (!valueValidation) {
				acc = false;
			}

			return acc;
		}, true);

		this.invalidInputs = document.querySelectorAll(".webix_invalid input[id]");
		this.invalidInputs.forEach((input) => {
			input.addEventListener("blur", () => {
				this._collectTaskFormData();
			});
		});
		return tagsValidation && taskValidation ? task : null;
	}

	getIdsFromObjects(items) {
		return items.map(obj => obj._id);
	}

	_getCollections() {
		this._setShowROI(false);
		this._foldersList.showProgress();
		ajaxService.getCollection()
			.then((data) => {
				data = data.map((obj) => {
					obj.webix_kids = true;
					return obj;
				});
				this._foldersList.parse(data);
				this._foldersList.hideProgress();
			})
			.catch(() => { this._foldersList.hideProgress(); });
	}

	_getFolders(parent) {
		this._setShowROI(false);
		return ajaxService.getFolder(parent._modelType, parent._id)
			.then((data) => {
				data = data.map((obj) => {
					obj.webix_kids = true;
					return obj;
				});
				delete parent.webix_kids;
				this._foldersList.parse({parent: parent.id, data});
				return data;
			});
	}

	_getItems(folderId) {
		this._setShowROI(false);
		document.querySelector(".roi-button").classList.add("hide-roi");
		this._roisCollection.clearAll();
		this._imagesCollection.clearAll();
		const item = this._foldersList.getItem(folderId);
		if (item._modelType === "folder") {
			if (!this._showSelected) {
				this._dataviewStore.clearAll();
			}
			this._dataview.showProgress();
			ajaxService.getFolderDetails(item._id)
				.then((response) => {
					const {nItems} = response;
					this._foldersList.updateItem(item.id, {_count: nItems});

					return ajaxService.getItems(item._id);
				})
				.then((data) => {
					if (this._showSelected) {
						this._bgItems = data;
						this._dataview.hideProgress();
						return;
					}
					this._toggleVisibilityOfHiddenViews(data.length);
					this._dataviewStore.parseItems(data, 0, item._count);
					this._imagesCollection.parse(data);
					this._parseROI(data);
					this._dataview.hideProgress();
				})
				.catch(() => {
					this._dataview.hideProgress();
				});
		}
		else this._toggleVisibilityOfHiddenViews(this._dataviewStore.count());
	}

	_attachFolderListEvents() {
		this._foldersList.attachEvent("onItemClick", (id, ev) => {
			if (this.fromROI && this._selectedImagesModel.getSelectedItems().length > 0) {
				webix.confirm({
					title: "Clear selected items",
					text: "If you select another folder, the selected items will be cleared. Do you want to proceed?",
					ok: "Yes",
					cancel: "No"
				})
					.then(() => {
						this._selectedImagesModel.unselectAllItems();
						this._selectFolder(id, ev);
						this._view.hideProgress();
					});
			}
			else this._selectFolder(id, ev);
			return false;
		});

		this._foldersList.attachEvent("onAfterSelect", (id) => {
			this._getItems(id);
		});
	}

	_fitBySelectionLimit(selectedItems) {
		if (selectedItems.length <= SELECTION_LIMIT) {
			return true;
		}

		this._dataview.blockEvent();
		this._selectedImagesModel.unselectAllItems();
		this._dataview.unblockEvent();

		const itemsToSelect = selectedItems
			.slice(0, SELECTION_LIMIT);
		this._selectedImagesModel.selectImages(itemsToSelect);
		return false;
	}

	_setShowSelectedState() {
		if (this._showSelected) {
			return;
		}
		const prevImages = this._dataviewStore.getArrayOfItems();
		this._bgItems = prevImages;
		this._dataviewStore.clearAll();

		const selectedItems = this._selectedImagesModel.getSelectedItems();
		this._foldersList.unselectAll();
		this._dataviewStore.parseItems(selectedItems);
		this._toggleVisibilityOfHiddenViews(selectedItems.length);
		this._showSelectedButton.setValue("Show all items");
		this._showSelected = true;
	}

	_setNormalDataviewState() {
		if (!this._showSelected) {
			return;
		}
		this._changeSelectedItemsButtonValue(this._selectedImagesModel.getSelectedItems());
		this._dataviewStore.clearAll();
		this._dataviewStore.parseItems(this._bgItems);
		this._bgItems = [];
		this._showSelected = false;
		this._resizeDataview();
	}

	_setImageNames() {
		const parentNode = this._dataview.getNode();
		if (this.imgNames) {
			this.imgNames = false;
			this._showImageName.setValue("Show image name");
			parentNode.classList.add("hide-names");
		}
		else {
			this.imgNames = true;
			parentNode.classList.remove("hide-names");
			this._showImageName.setValue("Hide image name");
		}
	}

	_setShowMeta() {
		const parentNode = this._dataview.getNode();
		if (this.showMeta) {
			this.showMeta = false;
			this._showMeta.setValue("Show metadata");
			parentNode.classList.add("hide-meta");
		}
		else {
			this.showMeta = true;
			parentNode.classList.remove("hide-meta");
			this._showMeta.setValue("Hide metadata");
		}
	}

	_setShowROI(isRoi = true) {
		if (!isRoi || this.fromROI) {
			this.fromROI = false;
			this._showROI.setValue("Switch on ROI mode");
			this._showROIBorders.hide();
			this._dataviewStore.clearAll();
			let imgCollection = this._imagesCollection.serialize();
			imgCollection = imgCollection.map(img => img = {...img, roi: false, normal: true});
			this._dataviewStore.parseItems(imgCollection);
			this._showROIBorders.hide();
			this._resizeDataview();
		}
		else {
			this.fromROI = true;
			this._showROI.setValue("Switch off ROI mode");
			this._showROIBorders.show();
			this._dataviewStore.clearAll();
			let roiCollection = this._roisCollection.serialize();
			roiCollection = roiCollection.map(img => img = {...img, roi: true});
			this._dataviewStore.parseItems(roiCollection);
			this._showROIBorders.show();
			this._resizeDataview();
		}
	}

	_setShowROIBorder() {
		if (this.showROIBorders) {
			this.showROIBorders = false;
			this._showROIBorders.setValue("Show ROI Borders");
			this._dataview.$view.classList.add("hide-border");
		}
		else {
			this.showROIBorders = true;
			this._showROIBorders.setValue("Hide ROI Borders");
			this._dataview.$view.classList.remove("hide-border");
		}
	}

	_parseROI(data) {
		let roiFilter = data.filter((item) => {
			if (!item || !item.meta) return false;
			let imageIsROI = item.meta.roiList || item.taggerMode === "ROI" || (item.meta.roi_left || item.meta.roi_right);
			return imageIsROI;
		});
		let roiArr = [];
		roiFilter.forEach((item) => {
			if (item.meta.roiList) {
				let imgArr = this._collectionFromROIImage(item);
				roiArr = roiArr.concat(imgArr);
			}
			else {
				roiArr.push(item);
			}
		});
		this._roisCollection.parse(roiArr);
	}

	_collectionFromROIImage(img) {
		let roilist = [];
		if (img.meta.roiList) {
			img.meta.roiList.forEach((item) => {
				let roi = {...item};
				roi.mainId = img._id;
				roi.allRoi = img.meta.roiList;
				roi.roi = true;
				roi.folderId = img.folderId;
				roi.name = `${img.name}_roi`;
				roi.meta = {};
				roi._id = mongoose.Types.ObjectId().toString();
				roi.roiImg = true;
				if (item.apiUrl) {
					let coords = this._getRoiFromUrl(item.apiUrl);
					roi.left = coords.left;
					roi.top = coords.top;
					roi.right = coords.left + coords.width;
					roi.bottom = coords.left + coords.height;
				}
				roilist.push(roi);
			});
		}
		return roilist;
	}

	_getRoiFromUrl(url) {
		let urlObj = new URL(url);
		let urlParams = new URLSearchParams(urlObj.search);
		let urlCoords = {};
		urlCoords.left = +urlParams.get("left");
		urlCoords.top = +urlParams.get("top");
		urlCoords.width = +urlParams.get("regionWidth");
		urlCoords.height = +urlParams.get("regionHeight");
		return urlCoords;
	}

	_selectFolder(id, ev) {
		const item = this._foldersList.getItem(id);
		this._foldersList.select(id);
		if (item.webix_kids) {
			this._foldersList.showProgress();
			this._getFolders(item)
				.then(() => { // open item after data loading
					this._foldersList.on_click.webix_list_item.call(this._foldersList, ev, id);
					this._foldersList.hideProgress();
				})
				.catch(() => { this._foldersList.hideProgress(); });
		}
	}
}

export default TaskToolService;
