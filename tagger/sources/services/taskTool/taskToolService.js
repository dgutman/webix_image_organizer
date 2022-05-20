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
		this._showSelectedButton = scope.showSelectedButton;
		this._showImageName = scope.showImageName;
		this._showMeta = scope.showMeta;
		this._tagsForm = scope.tagsForm;
		this._taskCreationForm = scope.taskCreationForm;
		this._createTaskButton = scope.createTaskButton;
		this._publishTaskButton = scope.publishTaskButton;
		this._editTaskButton = scope.editTaskButton;
		this._tagTemplatesPopup = scope.ui(new TagTemplatesPopup(scope.app));
		this._itemMetadataPopup = scope.ui(new InfoPopup(scope.app, "metadata", "Metadata", true));

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

		transitionalAjax.getTagTemplatesWithValues()
			.then((data) => {
				tagTemplates.tagsWithValues.parse(data);
			});

		this._showSelectedButton.attachEvent("onItemClick", () => {
			if (this._showSelected) {
				this._setNormalDataviewState();
				this._selectDataviewTemplate.show();
			}
			else {
				this._setShowSelectedState();
			}
		});

		// Show/hide image names
		this._showImageName.attachEvent("onItemClick", () => this._setImageNames());

		// Show/hide metadata
		this._showMeta.attachEvent("onItemClick", () => this._setShowMeta());

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
		this._selectDataviewTemplate.define("onClick", {
			"select-all-on-page": () => {
				this._selectedImagesModel.selectAllVisibleItems(this._dataviewPager);
			},
			"select-all": () => {
				this._selectedImagesModel.selectAllItems();
			},
			"unselect-all": () => {
				this._selectedImagesModel.unselectAllItems();
			},
			"tag-templates": () => {
				this._tagTemplatesPopup.showWindow();
			},
			"dataview-button": () => {
				const taskData = this._collectTaskFormData();
				const isValid = this._validateTaskByJSONValidator(taskData);
				if (!isValid) return;

				const selectedItems = this._selectedImagesModel.getSelectedItems();
				const previewView = $$("preview_task");
				const previewPageService = previewView.$scope.previewPageService;
				const parentNode = previewView.getNode();
				if (!taskData.imgNames) {
					parentNode.classList.add("hide-names");
				} else {
					parentNode.classList.remove("hide-names");
				}
				if (!taskData.showMeta) {
					parentNode.classList.add("hide-meta");
				} else {
					parentNode.classList.remove("hide-meta");
				}
				previewPageService.parseTagsAndValues(taskData);
				previewPageService.parseImages(selectedItems);
				this._view.setValue("preview_task");
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
			if (taskData) {
				this._view.showProgress();
				transitionalAjax.createTask(taskData, imageIds)
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
				transitionalAjax.deleteTask(taskId, true);
				transitionalAjax.createTask(taskData, imageIds)
					.then((data) => {
						webix.message("Data published");
						this._view.hideProgress();
					})
					.catch(() => {
						this._view.hideProgress();
					});
			}
			this._view.$scope.app.show("/dashboard");
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

		const isTaskValid = validateTask({task: taskData});
		const selectedItems = this._selectedImagesModel.getSelectedItems();

		const condition = selectedItems.length && isTaskValid && taskData && iconValid && validDefault;
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
		return tagsValidation && taskValidation ? task : null;
	}

	getIdsFromObjects(items) {
		return items.map(obj => obj._id);
	}

	_getCollections() {
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
				return false;
			}
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
	}

	_setImageNames() {
		const parentNode = this._dataview.getNode();
		if (this.imgNames) {
			this.imgNames = false;
			this._showImageName.setValue("Show image name");
			parentNode.classList.add("hide-names");
		} else {
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
		} else {
			this.showMeta = true;
			parentNode.classList.remove("hide-meta");
			this._showMeta.setValue("Hide metadata");
		}
	}
}

export default TaskToolService;
