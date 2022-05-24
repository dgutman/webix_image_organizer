import transitionalAjax from "../transitionalAjaxService";
import auth from "../authentication";
import DataviewService from "./dataviewService";
import DataviewFilters from "./dataviewFilters";
import CustomDataPull from "../../models/customDataPullClass";
import "../globalEvents";
import imageWindow from "../../views/windows/imageWindow";
import UpdatedImagesService from "./updateImageService";
import constants from "../../constants";
import InfoPopup from "../../views/windows/infoPopup";
import hotkeysFactory from "./hotkeys";
import AsyncQueue from "../asyncQueue";
import NotificationsModel from "../../models/notificationsModel";
import messageBoxes from "../../views/components/messageBoxes";

export default class UserViewService {
	constructor(view, iconsTemplateService) {
		this._view = view;
		this._iconsTemplateService = iconsTemplateService;
		this._ready();
	}

	_ready() {
		webix.extend(this._view, webix.ProgressBar);
		const scope = this._view.$scope;
		// child views
		this._dataview = scope.getUserDataview();
		this._dataviewStore = new CustomDataPull(this._dataview);
		this._pager = scope.getDataviewPager();
		this._taskList = scope.getTaskList();
		this._taskAccordionItem = scope.getTaskAccordionItem();
		this._accordion = scope.getAccordion();
		this._imageSizeSelect = scope.getSelectImageSize();
		this._taskListStore = new CustomDataPull(this._taskList);
		this._tagSelect = scope.getTagSelect();
		this._valueSelect = scope.getValueSelect();
		this._itemsCountTemplate = scope.getItemsCountTemplate();
		this._nextButton = scope.getNextButton();
		this._backButton = scope.getBackButton();
		this._undoButton = scope.getUndoButton();
		this._completeButton = scope.getCompleteButton();
		this._imageWindow = scope.ui(imageWindow);
		this._tagInfoTemplate = scope.getTagInfoTemplate();
		this._hotkeyInfoTemplate = scope.getHotkeysInfoTemplate();
		this._filtersAccordionItem = scope.getFiltersAccordionItem();
		this._filtersTree = scope.getFiltersTree();
		this._selectFiltersTemplate = scope.getSelectAllFiltersTemplate();
		this._applyFiltersBtn = scope.getApplyFiltersButton();
		this._tagInfoPopup = scope.ui(new InfoPopup(scope.app, "tag", "Tag help"));
		this._hotkeysInfoPopup = scope.ui(new InfoPopup(scope.app, "hotkeys", "Hot-keys"));
		this._itemMetadataPopup = scope.ui(new InfoPopup(scope.app, "metadata", "Metadata", true));
		this._deviationFilterDropdown = scope.getDeviationFilterDropdown();
		this._showReview = scope.getShowReviewTemplate();
		this._animationButton = scope.getAnimationButton();

		this._dataviewService = new DataviewService(
			this._dataview,
			this._dataviewStore,
			this._pager,
			this._imageSizeSelect
		);
		this._dataviewFilters = new DataviewFilters(
			this._dataview,
			this._filtersTree,
			this._selectFiltersTemplate,
			this._filtersAccordionItem
		);

		webix.extend(this._taskList, webix.OverlayBox);

		this._getImagesQueue = new AsyncQueue(this._getImagesByPageChange.bind(this));

		this._updatedImagesService = new UpdatedImagesService(
			this._dataview,
			this._dataviewStore,
			this._tagSelect,
			this._valueSelect
		);

		this._hotkeysService = hotkeysFactory.createService(
			this._dataview,
			this._dataviewStore,
			this._tagSelect,
			this._valueSelect,
			this._updatedImagesService,
			this._dataviewService,
			this._nextButton
		);

		this._attachViewEvents();

		if (auth.isLoggedIn()) {
			this._loggedInUserService();
		}
	}

	_attachViewEvents() {
		this._attachDataviewEvents();
		this._accordion.attachEvent("onAfterCollapse", () => {
			this._setPopupsPosition();
			this._resizeDataview();
		});
		this._accordion.attachEvent("onAfterExpand", () => {
			this._setPopupsPosition();
			this._resizeDataview();
		});
		this._view.$scope.on(this._view.$scope.app, "windowResize", () => {
			this._setPopupsPosition();
			this._resizeDataview();
		});

		this._imageSizeSelect.attachEvent("onChange", (val) => {
			this._dataviewService.changeImageSize(val);
			this._resizeDataview();
		});

		const sizeValue = this._imageSizeSelect.getValue();
		this._dataviewService.changeImageSize(sizeValue);
		this._resizeDataview();

		this._showReview.define("onClick", {
			"show-all": (ev) => {
				if (ev.target.innerHTML === "Hide all") {
					this._dataviewStore.clearAll();
					ev.target.innerHTML = "Show all";
					document.querySelector(".show-unreviewed").classList.add("disable-link");
					document.querySelector(".show-reviewed").classList.add("disable-link");
				}
				else {
					this._getImages();
					ev.target.innerHTML = "Hide all";
					document.querySelector(".show-unreviewed").classList.remove("disable-link");
					document.querySelector(".show-reviewed").classList.remove("disable-link");
				}
			},
			"show-reviewed": (ev) => {
				if (ev.target.innerHTML === "Hide reviewed") {
					this._dataview.filter(item => item && !item.isUpdated);
					ev.target.innerHTML = "Show reviewed";
					document.querySelector(".show-unreviewed").classList.add("disable-link");
					document.querySelector(".show-all").classList.add("disable-link");
				}
				else {
					ev.target.innerHTML = "Hide reviewed";
					document.querySelector(".show-unreviewed").classList.remove("disable-link");
					document.querySelector(".show-all").classList.remove("disable-link");
					this._getImages();
				}
			},
			"show-unreviewed": (ev) => {
				if (ev.target.innerHTML === "Hide unreviewed") {
					ev.target.innerHTML = "Show unreviewed";
					this._dataview.filter(item => item && item.isUpdated);
					document.querySelector(".show-reviewed").classList.add("disable-link");
					document.querySelector(".show-all").classList.add("disable-link");
				}
				else {
					ev.target.innerHTML = "Hide unreviewed";
					document.querySelector(".show-reviewed").classList.remove("disable-link");
					document.querySelector(".show-all").classList.remove("disable-link");
					this._getImages();
				}
			}
		});

		this._animationButton.attachEvent("onItemClick", () => {
			const btnView = this._animationButton.$view;
			const btn = btnView.querySelector(".webix_button");
			if (btn.innerHTML === "Hide animation") {
				btn.innerHTML = "Show animation";
				this._dataview.$view.classList.add("hide-animation");
			}
			else {
				btn.innerHTML = "Hide animation";
				this._dataview.$view.classList.remove("hide-animation");
			}
		});
	}

	_loggedInUserService() {
		this._showPopupNotifications();
		this._getTasks();
		const tagList = this._tagSelect.getList();
		const valuesList = this._valueSelect.getList();

		this._taskList.attachEvent("onItemClick", (taskId) => {
			const changedItems = this._updatedImagesService.changedItems;
			const changedItemsIds = Object.keys(changedItems);
			if (changedItemsIds.length) {
				webix.confirm({
					title: "Save",
					text: "Do you want to save unsaved data before choosing a new task?",
					ok: "Yes",
					cancel: "No"
				})
					.catch(() => {
						this._updatedImagesService.clearChangedItems();
						this._taskList.select(taskId);
						return false;
					})
					.then(result => result ? this._saveUnsavedImages() : false)
					.then((response) => {
						if (response) {
							webix.message(response.message);
						}

						this._taskList.select(taskId);
						this._view.hideProgress();
					})
					.catch(() => {
						this._view.hideProgress();
					});
			}
			else {
				this._taskList.select(taskId);
			}
			return false;
		});

		this._taskList.attachEvent("onSelectChange", () => {
			const task = this._taskList.getSelectedItem();
			this._pager.select(0);
			this._dataviewStore.clearAll();
			this._toggleVisibilityOfHiddenViews();
			this._itemsCountTemplate.setValues({});
			if (task) {
				this._selectTask(task);
				// show/hide image names
				if (!task.imgNames) {
					this._dataview.$view.classList.add("hide-names");
				}
				else {
					this._dataview.$view.classList.remove("hide-names");
				}
				// show/hide metadata
				if (!task.showMeta) {
					this._dataview.$view.classList.add("hide-meta");
				}
				else {
					this._dataview.$view.classList.remove("hide-meta");
				}
			}
			else {
				this._toggleVisibilityOfDropdowns();
			}
			this._view.$scope.app.callEvent("OnTaskSelect", [task || {}]);
		});

		this._tagSelect.attachEvent("onChange", (id, oldId, preselectedValue) => {
			valuesList.clearAll();
			this._valueSelect.setValue();
			this._tagInfoTemplate.setValues({description: this.taskDescription || ""});
			if (id) {
				const tag = tagList.getItem(id);
				valuesList.parse(tag.values);

				this._tagInfoTemplate.setValues(tag);

				if (this._tagInfoPopup.isVisible()) {
					const obj = this._tagInfoTemplate.getValues() || {description: this.taskDescription || ""};
					this._tagInfoPopup.setNewData(obj);
				}

				let preselectedId = preselectedValue ? preselectedValue.id : valuesList.getFirstId();
				if (!preselectedValue && tag.type === constants.TAG_TYPES.MULTI_WITH_DEFAULT) {
					preselectedId = valuesList.find(value => value.name === tag.default, true).id;
					valuesList.updateItem(preselectedId, {default: true});
				}
				this._valueSelect.setValue(preselectedId);
			}
		});

		this._valueSelect.attachEvent("onChange", (id, oldId) => {
			// Remove the border highlight on the image when changing a tag
			const items = document.querySelectorAll(".dataview-item");
			items.forEach((item) => {
				if (item.classList.contains("highlighted") && !item.querySelector(".checked")) {
					item.classList.remove("highlighted");
					// Add round underline for icons instead of red frame
					item.querySelector(".item-tag-related-icons").classList.add("underline-icons");
				}
			});
			if (id && id !== oldId && !this._hotkeysService.image) {
				const selectedValue = valuesList.getItem(id);
				if (this.currentValue && this.currentValue !== selectedValue.name) {
					this.currentValue = selectedValue.name;
					this._dataviewStore.clearAll();
					this._pager.select(0);
					this._getImages();
				}
			}
		});

		this._dataview.attachEvent("onDataRequest", () => {
			this._getImagesQueue.addJobToQueue();
		});

		this._dataview.attachEvent("onMouseMoving", (ev) => {
			let tooltip = webix.TooltipControl.getTooltip();
			if (ev.target.classList.contains("dataview-images-icons") && tooltip) {
				let coords = ev.target.getBoundingClientRect();
				tooltip._settings.dy = coords.y - ev.clientY + coords.height - 30;
				tooltip._settings.dx = coords.x - ev.clientX + coords.width - 30;
			}
		});

		this._deviationFilterDropdown.attachEvent("onChange", (id) => {
			const ignore = id === "deviations";
			this._iconsTemplateService.changeIgnoreDefaultState(ignore);
		});

		this._nextButton.attachEvent("onItemClick", () => {
			const pageItems = this._getItemsOnThePage();
			const dataToUpdate = [];
			const changedItems = this._updatedImagesService.changedItems;
			const tasks = this._taskList.getSelectedItem(true);
			const taskIds = tasks.map(task => task._id);

			pageItems.each((item) => {
				if (item.meta && item.meta.hasOwnProperty("tags")) {
					dataToUpdate.push({
						_id: item._id,
						tags: item.meta.tags,
						isUpdated: item.isUpdated || changedItems.hasOwnProperty(item._id)
					});
				}
			});

			if (dataToUpdate.length) {
				for (let i = 0; i < dataToUpdate.length; i++) {
					let item = dataToUpdate[i];
					if (item.isUpdated && item.tags) {
						let isReviewed = false;
						for (let key in item.tags) {
							if (item.tags[key].length > 0) isReviewed = true;
						}
						item.isReviewed = isReviewed;
					}
				}
				this._view.showProgress();
				const reviewPromise =
					transitionalAjax.reviewImages(dataToUpdate, taskIds);
				reviewPromise
					.then((response) => {
						const images = response.data;
						images.forEach((image) => {
							delete changedItems[image._id];
						});
						webix.message(response.message);
						this._view.hideProgress();

						this._dataviewStore.clearAll();
						this._getImages();
					})
					.catch(() => {
						this._view.hideProgress();
					});
			}
		});

		this._undoButton.attachEvent("onItemClick", () => {
			this._view.showProgress();
			// TODO: check undo on roi
			const undoPromise = transitionalAjax.undoLastChange();
			undoPromise
				.then((response) => {
					webix.message(response.message);
					this._view.hideProgress();
					this._dataviewStore.clearAll();
					this._getImages();
				})
				.catch(() => {
					this._view.hideProgress();
				});
		});

		this._backButton.attachEvent("onItemClick", () => {
			let confirmPromise = Promise.resolve();
			confirmPromise = messageBoxes.confirmMessage("Are you sure you want to unsubmit the task?");
			confirmPromise.then(() => {
				const tasks = this._taskList.getSelectedItem(true);
				const taskIds = tasks.map(task => task._id);

				this._view.showProgress();
				const unreviewPromise =
					transitionalAjax.unreviewImages(taskIds);
				unreviewPromise
					.then((response) => {
						webix.message(response.message);
						this._view.hideProgress();

						this._dataviewStore.clearAll();
						this._getImages();
					})
					.catch(() => {
						this._view.hideProgress();
					});
			})
				.catch(() => {
					this._view.hideProgress();
				});
		});

		this._completeButton.attachEvent("onItemClick", () => {
			webix.confirm({
				text: "Are you sure that you are ready to finalize the task? Please, note further changes to the task will not be available.",
				ok: "Yes",
				cancel: "No"
			});
		});

		this._hotkeyInfoTemplate.define("onClick", {
			"info-template-icon": () => {
				this._showInfoPopup(this._hotkeyInfoTemplate, this._hotkeysInfoPopup);
			}
		});

		this._tagInfoTemplate.define("onClick", {
			"info-template-icon": () => {
				this._showInfoPopup(this._tagInfoTemplate, this._tagInfoPopup);
			}
		});

		this._applyFiltersBtn.attachEvent("onItemClick", () => {
			const changedItems = this._updatedImagesService.changedItems;
			const changedItemsIds = Object.keys(changedItems);
			if (changedItemsIds.length) {
				webix.confirm({
					title: "Save",
					text: "Before using filters, you need to save changes. Save?",
					ok: "Yes",
					cancel: "No"
				})
					.catch(() => {
						this._updatedImagesService.clearChangedItems();
						this._applyFilters();
						return false;
					})
					.then(result => (result ? this._saveUnsavedImages() : false))
					.then((response) => {
						if (response) {
							const images = response.data;
							images.forEach((image) => {
								delete changedItems[image._id];
							});

							webix.message(response.message);
						}

						this._applyFilters();
						this._view.hideProgress();
					})
					.catch(() => {
						this._view.hideProgress();
					});
			}
			else {
				this._applyFilters();
			}
		});
	}

	_applyFilters() {
		this._dataviewFilters.applyFilters();
		this._dataviewStore.clearAll();
		this._getImages();
	}

	_getImagesByPageChange() {
		const indexes = this._getNotLoadedItemIndex();
		if (indexes.pageIndex > -1) {
			return this._getImages(indexes.index, indexes.limit);
		}
		return Promise.resolve(false);
	}

	_showInfoPopup(template, popupClass) {
		const obj = template.getValues() || {};
		const popup = popupClass.getInfoPopup();
		const templateNode = template.getNode();
		if (popup.isVisible()) {
			popupClass.closeWindow();
		}
		else if (obj.help) {
			popupClass.showWindow(templateNode, {pos: "bottom"}, obj);
		}
	}

	_getNotLoadedItemIndex() {
		const pData = this._pager.data;
		const offset = pData.size * pData.page;
		const last = offset + pData.size;
		const items = this._dataview.data.serialize();
		const pageItems = items.slice(offset, last);
		const pageIndex = pageItems.findIndex(item => !item);
		const index = pageIndex + offset;
		const limit = pData.size - pageIndex;

		return {index, pageIndex, limit};
	}

	_getTasks() {
		this._view.showProgress();
		transitionalAjax.getTasks()
			.then((data) => {
				this._taskListStore.parseItems(data);
				if (data.length) {
					const firstId = this._taskList.getFirstId();
					this._taskAccordionItem.enable();
					this._filtersAccordionItem.enable();
					this._taskList.select(firstId);
				}
				this._setDataviewOverLay();
				this._view.hideProgress();
			})
			.fail(() => {
				this._view.hideProgress();
			});
	}

	_parseHotkeysInfoTemplateData() {
		const keysObj = this._updatedImagesService.hotkeys;
		const hotkeyIcons = this._updatedImagesService.hotkeyIcons;
		const hotkeys = Object.keys(keysObj);

		let help = "<ul class='tagger-hotkeys-list'>";
		hotkeys.forEach((key) => {
			const hotkey = keysObj[key];
			const [hotKeyTag, hotKeyValue] = hotkey;
			let iconName = "<div webix_tooltip='There is no icon' class='hotkey-none-icon'><i class='fas fa-times'></i></div>";
			if (hotkeyIcons[key]) {
				iconName = this._iconsTemplateService.getSingleIconTemplate(...hotkeyIcons[key]);
			}
			// 0 is the name of the tag, 1 is the name of the value
			help += `<li>${iconName} <b style='font-weight: bold'>"${key}"</b> - ${hotKeyTag}${hotKeyValue ? `: ${hotKeyValue}` : ""}</li>`;
		});
		help += "</ul>";
		const infoObject = {
			description: `<span><b style='font-weight: bold'>Hot-keys (${hotkeys.length})</b> Please use the keyboard arrows or hover your mouse over the image and click:</span>`,
			help
		};
		this._hotkeyInfoTemplate.setValues(infoObject);
	}

	_selectTask(task) {
		this._updatedImagesService.clearChangedItems();
		this._updatedImagesService.hotkeys = {};
		this._updatedImagesService.hotkeyIcons = {};
		const tagList = this._tagSelect.getList();
		tagList.clearAll();

		this._tagSelect.setValue();
		this._view.showProgress();
		transitionalAjax.getTagsWithValuesByTask(task._id)
			.then((data) => {
				tagList.parse(data);
				const firstId = tagList.getFirstId();
				if (firstId) {
					this._tagSelect.setValue(firstId);
				}

				this._dataviewFilters.parseFiltersToTree(webix.copy(data), task._id);

				this._dataviewFilters.setInitialFiltersState();

				this._updatedImagesService.collectValueHotkeys();
				this._parseHotkeysInfoTemplateData();
				this._hotkeysService.selectNewScope(task.name, this._updatedImagesService.hotkeys);

				if (this._tagInfoPopup.isVisible()) {
					const obj = this._tagInfoTemplate.getValues() || {description: this.taskDescription || ""};
					this._tagInfoPopup.setNewData(obj);
				}
				if (this._hotkeysInfoPopup.isVisible()) {
					const obj = this._hotkeyInfoTemplate.getValues() || {};
					this._hotkeysInfoPopup.setNewData(obj);
				}
				if (this._itemMetadataPopup.isVisible()) {
					this._itemMetadataPopup.closeWindow();
				}

				this._toggleVisibilityOfDropdowns(true);
				this._view.hideProgress();
				return this._checkTask(task);
			})
			.fail(() => {
				this._view.hideProgress();
			});
	}

	_checkTask(task) {
		if (!task.checked_out) {
			this._view.showProgress();
			return transitionalAjax.checkTask(task._id)
				.then((response) => {
					webix.message(response.message);
					const updatedTask = response.data;
					this._taskListStore.updateItem(null, updatedTask._id, updatedTask);
					return this._getImages();
				});
		}
		return this._getImages();
	}

	_getImages(startWith, limit) {
		const task = this._taskList.getSelectedItem();

		this._view.showProgress();
		let promise = Promise.resolve(false);
		const params = this._getParamsForImages(startWith, limit);
		if (params.ids.length) {
			promise = transitionalAjax.getImagesByTask(params);
		}
		return promise
			.then((images) => {
				if (images) {
					// define tags with changed values to images
					const processedImages = this._updatedImagesService.presetChangedValues(images.data);
					this._dataviewStore.parseItems(processedImages, params.offset, images.count);

					const templateValues = {
						count: images.count,
						totalCount: images.totalCount,
						unfilteredCount: images.unfilteredCount
					};
					this._itemsCountTemplate.setValues(templateValues);
					this._toggleButtonsVisibility(templateValues);

					this._toggleVisibilityOfHiddenViews(images.count);

					this._view.hideProgress();
					return processedImages;
				}
				return false;
			})
			.catch(() => {
				this._view.hideProgress();
			});
	}

	_getParamsForImages(startWith, limit) {
		const tasks = this._taskList.getSelectedItem(true);
		const taskIds = tasks.map(task => task._id);
		const offset = startWith || this._pager.data.size * this._pager.data.page;
		limit = limit || this._pager.data.size;
		const params = {
			ids: taskIds,
			offset,
			limit
		};
		if (this._dataviewFilters.enabled) {
			// this._dataviewFilters.setInitialFiltersState();
			params.filters = this._dataviewFilters.getSelectedFilters();
		}

		return params;
	}

	_attachDataviewEvents() {
		this._setDataviewOverLay();

		this._dataview.data.attachEvent("onStoreUpdated", () => {
			this._setDataviewOverLay();
		});

		this._dataview.attachEvent("onItemDblClick", (id, e) => {
			if (!e.target.classList.contains("checkbox")) {
				const item = this._dataviewStore.getItemById(id);
				this._imageWindow.showWindow(item);
			}
		});

		this._dataview.attachEvent("onItemClick", (id, e) => {
			const item = this._dataviewStore.getItemById(id);
			if (e.target.classList.contains("unchecked")) {
				this._updatedImagesService.addSelectedTagValueToImage(id);
				return false;
			}
			else if (e.target.classList.contains("checked") && e.target.classList.contains("enabled")) {
				this._updatedImagesService.removeSelectedTagValueFromImage(id);
				// Remove the border highlight on the image when changing a tag
				const selector = `[webix_l_id='${id}'] .dataview-item`;
				const parent = document.querySelector(selector);
				parent.classList.remove("highlighted");
				// Add round underline for icons instead of red frame
				parent.querySelector(".item-tag-related-icons").classList.add("underline-icons");
				return false;
			}
			else if (e.target.classList.contains("show-metadata")) {
				if (!this._itemMetadataPopup.isVisible() || !this._itemMetadataPopup._wasMoved) {
					this._itemMetadataPopup.showWindow(e.target, {pos: "bottom"}, item, true);
				}
				else {
					this._itemMetadataPopup.createJSONViewer(item);
				}
				return false;
			}
		});

		// to update dataview item tooltip by data updating
		this._dataview.attachEvent("onDataUpdate", () => {
			const tooltip = webix.TooltipControl.getTooltip();
			if (tooltip && tooltip.isVisible()) {
				tooltip.render();
			}
		});
	}

	_setDataviewOverLay() {
		const count = this._dataview.count();
		let overlayText = "";

		if (!auth.isLoggedIn()) {
			overlayText = "No items loaded. Please, log in";
		}
		else if (!this._taskList.count()) {
			overlayText = "No tasks to review";
		}
		else {
			overlayText = "No items to review";
		}
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
				if (this._pager.data.page !== page) {
					this._pager.select(page);
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

	_getItemsOnThePage() {
		// without arguments returns items on current page
		return this._dataview.data.getRange();
	}

	_toggleVisibilityOfHiddenViews(show) {
		const hiddenViews = this._view.$scope.getInitiallyHiddenViews();
		hiddenViews.forEach((view) => {
			if (show) view.show();
			else view.hide();
		});
		this._resizeDataview();
	}

	_toggleVisibilityOfDropdowns(show) {
		const dropdownsLayout = this._view.queryView({selector: "task_dropdowns"});
		if (show) dropdownsLayout.show();
		else dropdownsLayout.hide();
		this._resizeDataview();
	}

	_setPopupsPosition() {
		this._hotkeysInfoPopup.setInitPosition();
		this._tagInfoPopup.setInitPosition();
	}

	_toggleButtonsVisibility({totalCount, unfilteredCount}) {
		if (totalCount && totalCount !== unfilteredCount) {
			this._backButton.show();
		}
		else {
			this._backButton.hide();
		}

		if (this._taskList.getSelectedItem(true)[0].status === "finished") {
			this._completeButton.hide();
		}
	}

	_saveUnsavedImages() {
		this._view.showProgress();
		const dataToUpdate = [];
		const changedItems = this._updatedImagesService.changedItems;
		const changedItemsIds = Object.keys(changedItems);
		changedItemsIds.forEach((id) => {
			dataToUpdate.push({
				_id: id,
				tags: changedItems[id],
				isUpdated: true
			});
		});
		const tasks = this._taskList.getSelectedItem(true);
		const taskIds = tasks.map(task => task._id);
		const reviewPromise = transitionalAjax.reviewImages(dataToUpdate, taskIds, true);
		return reviewPromise;
	}

	_showPopupNotifications() {
		const notificationsModel = NotificationsModel.getInstance();
		notificationsModel.collection.waitData
			.then(() => {
				const newItems = notificationsModel
					.collection.data
					.serialize()
					.filter(not => !not.isRead);

				newItems.forEach((not) => {
					webix.message({
						text: this._getWebixMessageNotificationText(not),
						type: "info",
						expire: 3000
					});
				});
			});
	}

	_getWebixMessageNotificationText(notification) {
		const text = notification.text.length > constants.WEBIX_MESSAGE_TEXT_LIMIT ?
			`${notification.text.slice(0, constants.WEBIX_MESSAGE_TEXT_LIMIT).trim()}...` :
			notification.text;

		return `<span class='strong-font ellipsis-text'>${notification.taskName}</span>
				<br>
				<span>${text}</span>`;
	}

	_tagsAreSet(data) {
		if (data.length) {
			for (let i = 0; i < data.length; i++) {
				let item = data[i];
				if (item.isUpdated && item.tags) {
					let isReviewed = false;
					for (let key in item.tags) {
						if (item.tags[key].length > 0) isReviewed = true;
					}
					item.isReviewed = isReviewed;
				}
			}
		}
	}
}
