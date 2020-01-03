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

const PAGER_ID = "dataview-tag-connection-pager";

export default class ConnectTagToImageWindow extends JetView {
	config() {
		const searchInput = windowParts.getSearchInputConfig();
		const pager = windowParts.getPagerConfig(PAGER_ID);
		const filterTemplate = windowParts.getFilterTemplateConfig();

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

		const collectionListHeader = {
			template: "Collections list",
			css: "list-header",
			height: 38,
			borderless: true
		};

		const collectionList = {
			view: "list",
			name: "collectionList",
			css: "ellipsis-text",
			borderless: true,
			scroll: "auto",
			template: (obj) => {
				const checkboxState = this.collectionList.isSelected(obj.id) ? "fas fa-check-square" : "far fa-square";
				return `<div onmousedown='return false' onselectstart='return false'><i class='icon-btn checkbox-icon ${checkboxState}'></i> <span class='item-name'>${obj.name}</span></div>`;
			},
			on: {
				onItemClick: (id, ev) => {
					const item = this.collectionStore.getItemById(id);
					if (ev.target.classList.contains("checkbox-icon") || ev.target.classList.contains("item-name")) {
						this.collectionSelectService.onItemSelect(ev.shiftKey, item);
						// this.connectedImagesModel.clearModel();
						windowParts.getWindowImages(this);
					}
				}
			}
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
							.finally(() => {
								this.connectedImagesModel.clearModel();
								this.view.hideProgress();
								this.closeWindow();
							});
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

		const connectTagToImageWindow = {
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
						template: obj => `Images-tags connection - ${obj.name}`,
						tooltip: () => {
							const template = this.getHeaderTemplate();
							const obj = template.getValues();
							return `Images-tags connection - ${obj.name}`;
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
						view: "scrollview",
						scroll: false,
						css: {"overflow-x": "auto"},
						padding: 10,
						margin: 10,
						body: {
							cols: [
								{
									gravity: 2,
									rows: [
										{
											padding: 10,
											cols: [
												{
													width: 320,
													css: {"margin-left": "4px !important"},
													rows: [
														searchInput
													]
												},
												{},
												pager
											]
										},
										filterTemplate,
										dataview
									]
								},
								{
									minWidth: 300,
									rows: [
										{height: 45},
										collectionListHeader,
										collectionList
									]
								}
							]
						}
					},
					buttons
				]
			}
		};

		return connectTagToImageWindow;
	}

	ready(view) {
		webix.extend(view, webix.ProgressBar);
		this.view = view;
		this.collectionList = this.getCollectionList();
		this.dataview = this.getWindowDataview();
		this.selectImagesService = new SelectItemsService(this.dataview);
		this.dataviewStore = new CustomDataPull(this.dataview);
		this.dataviewPager = this.getDataviewPager();
		this.searchInput = this.getSearchInput();
		this.selectAllTemplate = this.getSelectAllTemplate();
		this.connectedImagesModel = new ConnectedImagesModel();
		this.pagerService = new PagerService(this.dataviewPager, this.dataview);
		this.undoModel = undoFactory.create("tagPopup", this.getUndoIcon());
		this.filterTemplate = this.getFilterTemplate();

		this.searchInput.attachEvent("onEnter", () => {
			windowParts.getWindowImages(this);
		});
		this.searchInput.attachEvent("onSearchIconClick", () => {
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

	showWindow(tag, tagStore, collectionStore, collectionSelectService) {
		const headerTemplate = this.getHeaderTemplate();
		this.currentTag = tag;
		headerTemplate.setValues(tag);
		this.tagStore = tagStore;
		this.collectionStore = collectionStore;
		this.collectionSelectService = collectionSelectService;
		this.collectionSelectService.addSecondaryDataView(this.collectionList);
		this.parseCollections();
		this.collectionSelectService.markSecondarySelectedItems();
		this.getRoot().show();
		windowParts.getWindowImages(this);
		responsiveWindows.addWindow(this.getRoot().config.id, this.getRoot());
	}

	parseCollections() {
		const collections = this.collectionStore.getArrayOfItems();
		this.collectionList.parse(collections);
	}

	getParamsForImages() {
		const collections = this.collectionSelectService.getSelectedItems();
		const collectionIds = collections.map(collection => collection._id);
		const offset = this.dataviewPager.data.size * this.dataviewPager.data.page;
		const limit = this.dataviewPager.data.size;
		const search = this.searchInput.getValue();

		return {
			collectionIds,
			tag: this.currentTag.name,
			latest: this.filterTemplate.getValues().latest,
			offset,
			limit,
			s: search
		};
	}

	updateMetadata() {
		const idsToRemove = this.connectedImagesModel.getImagesIdsForRemoving();
		const idsToAdd = this.connectedImagesModel.getImagesIdsForAdding();

		if (idsToRemove.length || idsToAdd.length) {
			return transitionalAjax.updateImages(idsToAdd, idsToRemove, this.currentTag._id);
		}
		return Promise.resolve(false);
	}

	closeWindow() {
		this.searchInput.setValue("");
		this.connectedImagesModel.clearModel();
		this.collectionSelectService.clearSecondaryDataviews();
		this.filterTemplate.setValues({latest: false});
		this.undoModel.clearModel();
		responsiveWindows.removeWindow(this.getRoot().config.id);
		this.selectImagesService.clearModel();
		this.getRoot().hide();
	}

	getHeaderTemplate() {
		return this.getRoot().queryView({name: "headerTemplateName"});
	}

	getCollectionList() {
		return this.getRoot().queryView({name: "collectionList"});
	}

	getWindowDataview() {
		return this.getRoot().queryView({name: "windowDataview"});
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
