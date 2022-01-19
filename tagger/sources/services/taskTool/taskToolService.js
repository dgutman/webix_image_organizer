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

export default class TaskToolService {
	constructor(view) {
		this._view = view;
		this._ready();
	}

	_ready() {
		const scope = this._view.$scope;

		this._accordion = scope.accordion;
		this._foldersList = scope.foldersGroupList;
		this._dataview = scope.dataview;
		this._dataviewPager = scope.dataviewPager;
		this._selectDataviewTemplate = scope.selectDataviewTemplate;
		this._showSelectedButton = scope.showSelectedButton;
		this._tagsForm = scope.tagsForm;
		this._taskCreationForm = scope.taskCreationForm;
		this._createTaskButton = scope.createTaskButton;
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
		this._attachDataviewResizing();
		this._attachFolderListEvents();
		this._attachDataviewEvents();

		transitionalAjax.getTagTemplatesWithValues()
			.then((data) => {
				tagTemplates.tagsWithValues.parse(data);
			});

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
			}
		});

		this._showSelectedButton.attachEvent("onItemClick", () => {
			this._dataviewStore.clearAll();

			const selectedItems = this._selectedImagesModel.getSelectedItems();
			this._foldersList.unselectAll();
			this._dataviewStore.parseItems(selectedItems);
			this._toggleVisibilityOfHiddenViews(selectedItems.length);
		});

		this._createTaskButton.attachEvent("onItemClick", () => {
			const taskData = this._collectTaskData();
			const imageIds = this._selectedImagesModel.getSelectedIds();
			if (taskData) {
				this._view.showProgress();
				transitionalAjax.createTask(taskData, imageIds)
					.then((data) => {
						webix.message(data.message);
						this._view.hideProgress();
					})
					.catch(() => {
						this._view.hideProgress();
					});
			}
		});

		this._editTaskButton.attachEvent("onItemClick", () => {
			const taskId = scope.getParam("edit");
			const taskData = this._collectTaskData();
			const imageIds = this._selectedImagesModel.getSelectedIds();
			this._view.showProgress();
			transitionalAjax.updateTask(taskId, taskData, imageIds)
				.then((data) => {
					webix.message(data.message);
					return transitionalAjax.getTagTemplatesWithValues();
				})
				.then((data) => {
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

	_getItems(id) {
		const item = this._foldersList.getItem(id);
		this._dataviewStore.clearAll();
		if (item._modelType === "folder") {
			this._dataview.showProgress();
			ajaxService.getFolderDetails(item._id)
				.then((response) => {
					const {nItems} = response;
					this._foldersList.updateItem(item.id, {_count: nItems});

					return ajaxService.getItems(item._id);
				})
				.then((data) => {
					this._toggleVisibilityOfHiddenViews(data.length);
					this._dataviewStore.parseItems(data, 0, item._count);

					const selectedItems = this._selectedImagesModel.getSelectedItems();
					this._changeSelectedItemsButtonValue(selectedItems);
					this._dataview.hideProgress();
				})
				.catch(() => {
					this._dataview.hideProgress();
				});
		}
		else this._toggleVisibilityOfHiddenViews(false);
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

	_attachDataviewEvents() {
		this._dataviewService.setImageSize("Medium");
		this._resizeDataview();

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
			this._changeSelectedItemsButtonValue(items);
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

	_collectTaskData() {
		const tagsForm = this._tagsForm;
		const tagForms = tagsForm.queryView({selector: "tagForm"}, "all");

		const task = this._taskCreationForm.getValues();

		task.user = this.getIdsFromObjects(task.user).unique();
		task.creator = [auth.getUserId(), ...this.getIdsFromObjects(task.creator)].unique();

		const taskValidation = this._taskCreationForm.validate();

		task.tags = [];
		const tagsValidation = tagForms.reduce((acc, form) => {
			if (!form.validate()) {
				acc = false;
			}

			const tag = form.getValues();
			const valueForms = form.queryView({selector: "valueLayout"}, "all");
			tag.values = {};
			Object.assign(tag, form.config.tagSettings);

			const valueValidation = valueForms.reduce((valueAcc, valForm) => {
				const value = valForm.getValues();
				tag.values[value.name] = value;
				valueAcc = valForm.validate();
				return valueAcc;
			}, true);

			if (!valueValidation) {
				acc = false;
			}

			task.tags.push(tag);
			return acc;
		}, true);
		return (tagsValidation && taskValidation) ? task : null;
	}

	getIdsFromObjects(items) {
		return items.map(obj => obj._id);
	}
}
