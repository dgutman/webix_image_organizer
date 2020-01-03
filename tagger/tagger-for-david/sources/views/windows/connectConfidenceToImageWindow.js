import {JetView} from "webix-jet";
import CustomDataPull from "../../models/customDataPullClass";
import ConnectedImagesModel from "../../models/connectedImagesModel";
import PagerService from "../../services/pagerService";
import windowParts from "./windowParts";
import transitionalAjax from "../../services/transitionalAjaxService";
import SelectItemsService from "../../services/selectItemsService";
import undoFactory from "../../models/undoModel";
import constants from "../../constants";
import responsiveWindows from "../../models/windows/responsiveWindows";

const PAGER_ID = "dataview-confidence-connection-pager";

export default class ConnectTagToImageWindow extends JetView {
	config() {
		const searchInput = windowParts.getSearchInputConfig();
		const pager = windowParts.getPagerConfig(PAGER_ID);
		const filterTemplate = windowParts.getFilterTemplateConfig();

		const currentConfidenceLvlSelect = {
			view: "richselect",
			name: "currentConfidenceLvlSelect",
			label: "Set confidence level",
			labelWidth: 150,
			css: "select-field",
			options: {
				data: [],
				body: {
					template: obj => obj.name
				}
			}
		};

		const dataview = {
			view: "dataview",
			css: "window-dataview",
			name: "windowDataview",
			tooltip: "#name#",
			pager: PAGER_ID,
			borderless: true,
			template: (obj, common) => windowParts.getDataviewTempate(obj, common, this.dataview),
			type: {
				width: 150,
				height: 135,
				checkboxState: obj => (this.dataview.isSelected(obj.id) ? "fas fa-check-square" : "far fa-square")
			},
			onClick: windowParts.getDataviewOnClickObject(this)
		};

		const selectAllTemplate = windowParts.getSelectAllTemplateConfig();

		const buttons = {
			margin: 15,
			paddingY: 15,
			height: 70,
			borderless: true,
			cols: [
				selectAllTemplate,
				{},
				{
					view: "button",
					css: "btn-contour",
					width: 80,
					name: "cancelButton",
					value: "Cancel",
					hotkey: "escape",
					click: () => {
						windowParts.confirmBeforeClose(this.connectedImagesModel.countUnsavedItems())
							.then(() => { this.closeWindow(); });
					}
				},
				{
					view: "button",
					css: "btn",
					width: 80,
					name: "saveButton",
					value: "Save",
					click: () => {
						this.view.showProgress();
						this.updateMetadata()
							.then(() => {
								this.connectedImagesModel.clearModel();
								this.view.hideProgress();
								this.closeWindow();
							})
							.finally(() => { this.view.hideProgress(); });
					}
				}
			]
		};

		const undoIcon = {
			view: "icon",
			name: "taggerUndoIcon",
			css: "btn undo-btn disabled",
			icon: "fas fa-undo-alt",
			tooltip: "Undo last action",
			width: 30,
			height: 30,
			on: {
				onItemClick: () => {
					this.undoModel.oldItems.forEach((item) => {
						if (item._marker) {
							this.connectedImagesModel.addImageIdForAdding(item._id);
						}
						else {
							this.connectedImagesModel.addImageIdForRemoving(item._id);
						}
					});
					this.undoModel.undoLastAction(true);
				}
			}
		};

		const connectConfidenceToImageWindow = {
			view: "window",
			css: "tagger-window",
			scroll: true,
			width: constants.WINDOW_SIZE.WIDTH,
			height: constants.WINDOW_SIZE.HEIGHT,
			minHeight: constants.WINDOW_SIZE.MIN_HEIGHT,
			minWidth: constants.WINDOW_SIZE.MIN_WIDTH,
			modal: true,
			resize: true,
			position: "center",
			type: "clean",
			head: {
				padding: 5,
				cols: [
					undoIcon,
					{
						view: "template",
						css: "edit-window-header",
						name: "headerTemplateName",
						template: obj => `Images-values-confidence connection - ${obj.value.value} (${obj.tag.name})`,
						tooltip: () => {
							const template = this.getHeaderTemplate();
							const obj = template.getValues();
							return `Images-values-confidence connection - ${obj.value.value} (${obj.tag.name})`;
						},
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "fas fa-times",
						width: 30,
						height: 30,
						click: () => {
							windowParts.confirmBeforeClose(this.connectedImagesModel.countUnsavedItems())
								.then(() => { this.closeWindow(); });
						}
					}
				]
			},
			body: {
				padding: 10,
				rows: [
					{
						gravity: 2,
						rows: [
							{
								padding: 4,
								cols: [
									{rows: [searchInput]},
									{width: 30},
									pager
								]
							},
							{
								paddingY: 20,
								cols: [
									filterTemplate,
									{width: 30},
									currentConfidenceLvlSelect
								]
							},
							dataview
						]
					},
					buttons
				]
			}
		};

		return connectConfidenceToImageWindow;
	}

	ready(view) {
		webix.extend(view, webix.ProgressBar);
		this.view = view;
		this.dataview = this.getWindowDataview();
		this.selectImagesService = new SelectItemsService(this.dataview);
		this.dataviewStore = new CustomDataPull(this.dataview);
		this.dataviewPager = this.getDataviewPager();
		this.currentConfidenceLvlSelect = this.getCurrentConfidenceLvlSelect();
		this.searchInput = this.getSearchInput();
		this.selectAllTemplate = this.getSelectAllTemplate();
		this.connectedImagesModel = new ConnectedImagesModel();
		this.pagerService = new PagerService(this.dataviewPager, this.dataview);
		this.undoModel = undoFactory.create("confidencePopup", this.getUndoIcon());
		this.filterTemplate = this.getFilterTemplate();

		this.searchInput.attachEvent("onEnter", () => {
			windowParts.getWindowImages(this);
		});
		this.searchInput.attachEvent("onSearchIconClick", () => {
			windowParts.getWindowImages(this);
		});

		this.currentConfidenceLvlSelect.attachEvent("onChange", () => {
			this.connectedImagesModel.clearModel();
			windowParts.getWindowImages(this);
		});

		this.selectAllTemplate.define("onClick", {
			"select-all-images": () => {
				this.selectImagesService.selectAllItems(this.dataviewPager);
			},
			"unselect-all-images": () => {
				this.selectImagesService.unselectAllItems();
				this.selectImagesService.clearInvisibleItems();
			}
		});

		this.dataviewPager.attachEvent("onAfterPageChange", (page) => {
			const offset = this.dataviewPager.data.size * page;
			if (!this.dataview.getIdByIndex(offset)) {
				const params = this.getParamsForImages();
				windowParts.parseImages(this, params);
			}
		});

		this.dataview.data.attachEvent("onStoreLoad", (driver, rawData) => {
			this.connectedImagesModel.putInitialIdsFromItems(rawData.data);
		});

		this.filterTemplate.define("onClick", {
			"filter-latest-changed": () => {
				this.filterTemplate.setValues({latest: true});
				windowParts.getWindowImages(this);
			},
			"filter-all": () => {
				this.filterTemplate.setValues({latest: false});
				windowParts.getWindowImages(this);
			}
		});
	}

	showWindow({tag, value, confidence}, stores, collections) {
		this.collections = collections;
		const headerTemplate = this.getHeaderTemplate();
		this.currentTag = tag;
		this.currentValue = value;
		this.tagStore = stores.tagStore;
		this.valuesStore = stores.valuesStore;
		this.confidenceStore = stores.confidenceStore;
		headerTemplate.setValues({tag, value, confidence});
		this.parseConfidenceToDropDown(this.currentConfidenceLvlSelect, confidence);
		this.getRoot().show();
		windowParts.getWindowImages(this);
		responsiveWindows.addWindow(this.getRoot().config.id, this.getRoot());
	}

	getParamsForImages() {
		const collectionIds = this.collections.map(collection => collection._id);
		const confidence = this.getCurrentConfidenceLvl();
		const offset = this.dataviewPager.data.size * this.dataviewPager.data.page;
		const limit = this.dataviewPager.data.size;
		const search = this.searchInput.getValue();

		return {
			collectionIds,
			tag: this.currentTag.name,
			value: this.currentValue.value,
			confidence: confidence.name,
			latest: this.filterTemplate.getValues().latest,
			offset,
			limit,
			s: search
		};
	}

	parseConfidenceToDropDown(dropDown, currentConfidence) {
		const list = dropDown.getList();
		list.clearAll();
		list.parse(this.confidenceStore.getArrayOfItems());
		const item = list.serialize().find(obj => obj.name === currentConfidence.name);
		dropDown.blockEvent();
		dropDown.setValue(item);
		dropDown.unblockEvent();
	}

	updateMetadata() {
		const idsToRemove = this.connectedImagesModel.getImagesIdsForRemoving();
		const idsToAdd = this.connectedImagesModel.getImagesIdsForAdding();
		const tagId = this.currentTag._id;
		const valueId = this.currentValue._id;
		const confidence = this.getCurrentConfidenceLvl();

		if (idsToRemove.length || idsToAdd.length) {
			return transitionalAjax.updateImages(idsToAdd, idsToRemove, tagId, valueId, confidence.name);
		}
		return Promise.resolve(false);
	}

	getCurrentConfidenceLvl() {
		const confidenceId = this.currentConfidenceLvlSelect.getValue();
		return this.currentConfidenceLvlSelect.getList().getItem(confidenceId);
	}

	closeWindow() {
		this.searchInput.setValue("");
		this.connectedImagesModel.clearModel();
		this.filterTemplate.setValues({latest: false});
		this.undoModel.clearModel();
		responsiveWindows.removeWindow(this.getRoot().config.id);
		this.selectImagesService.clearModel();
		this.getRoot().hide();
	}

	getHeaderTemplate() {
		return this.getRoot().queryView({name: "headerTemplateName"});
	}

	getWindowDataview() {
		return this.getRoot().queryView({name: "windowDataview"});
	}

	getSortByConfidenceSelect() {
		return this.getRoot().queryView({name: "sortByConfidenceSelect"});
	}

	getCurrentConfidenceLvlSelect() {
		return this.getRoot().queryView({name: "currentConfidenceLvlSelect"});
	}

	getDataviewPager() {
		return this.$$(PAGER_ID);
	}

	getSearchInput() {
		return this.getRoot().queryView({name: "searchInput"});
	}

	getFilterTemplate() {
		return this.getRoot().queryView({name: "filterImagesTemplate"});
	}

	getUndoIcon() {
		return this.getRoot().queryView({name: "taggerUndoIcon"});
	}

	getSelectAllTemplate() {
		return this.getRoot().queryView({name: "selectAllTemplate"});
	}
}
