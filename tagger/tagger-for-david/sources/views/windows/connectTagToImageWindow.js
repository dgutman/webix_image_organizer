import {JetView} from "webix-jet";
import dot from "dot-object";
import JSONFormatter from "json-formatter-js";
import CustomDataPull from "../../models/customDataPullClass";
import ConnectedImagesModel from "../../models/connectedImagesModel";
// import PagerService from "../../services/pagerService";
import windowParts from "./windowParts";
import transitionalAjax from "../../services/transitionalAjaxService";
import SelectItemsService from "../../services/selectItemsService";
import undoFactory from "../../models/undoModel";
import constants from "../../constants";
import responsiveWindows from "../../models/windows/responsiveWindows";
import DataviewWindowService from "../../services/mainColumns/windows/dataviewWindow";

const PAGER_ID = "dataview-tag-connection-pager";

export default class ConnectTagToImageWindow extends JetView {
	config() {
		const searchInput = windowParts.getSearchInputConfig();
		const pager = windowParts.getPagerConfig(PAGER_ID);
		const filterTemplate = windowParts.getFilterTemplateConfig();
		const imageSizeSelect = windowParts.getImageSizeSelectorConfig();

		const dataview = {
			view: "dataview",
			css: "window-dataview",
			name: "windowDataview",
			tooltip: "#name#",
			minHeight: constants.DATAVIEW_IMAGE_SIZE.HEIGHT,
			minWidth: constants.DATAVIEW_IMAGE_SIZE.WIDTH,
			pager: PAGER_ID,
			borderless: true,
			template: (obj, common) => windowParts.getDataviewTempate(obj, common, this.dataview, true),
			type: {
				width: constants.DATAVIEW_IMAGE_SIZE.WIDTH,
				height: constants.DATAVIEW_IMAGE_SIZE.HEIGHT,
				checkboxState: obj => (this.dataview.isSelected(obj.id) ? "fas fa-check-square" : "far fa-square")
			},
			onClick: Object.assign(windowParts.getDataviewOnClickObject(this), {
				"info-icon": (ev, id) => {
					const item = this.dataviewStore.getItemById(id);
					this.showItemInfo(item);
				}
			})
		};

		// const collectionList = {
		// 	view: "list",
		// 	name: "collectionList",
		// 	css: "ellipsis-text",
		// 	borderless: true,
		// 	scroll: "auto",
		// 	template: (obj) => {
		// 		const checkboxState = this.collectionList.isSelected(obj.id) ? "fas fa-check-square" : "far fa-square";
		// 		return `<div onmousedown='return false' onselectstart='return false'><i class='icon-btn checkbox-icon ${checkboxState}'></i> <span class='item-name'>${obj.name}</span></div>`;
		// 	},
		// 	on: {
		// 		// onItemClick: (id, ev) => {
		// 		// 	const item = this.collectionStore.getItemById(id);
		// 		// 	if (ev.target.classList.contains("checkbox-icon") || ev.target.classList.contains("item-name")) {
		// 		// 		// this.collectionSelectService.onItemSelect(ev.shiftKey, item);
		// 		// 		// this.connectedImagesModel.clearModel();
		// 		// 		this.windowService.getWindowImages();
		// 		// 	}
		// 		// }
		// 	}
		// };

		const collectionTreeView = {
			view: "tree",
			name: "windowCollectionTreeView",
			gravity: 2,
			borderless: true,
			select: true,
			multiselect: "level",
			scroll: "auto",
			css: "finder-view",
			type: "lineTree",
			oncontext: {},
			template(obj, common) {
				return `${common.icon(obj, common) + common.folder(obj, common)}<span style="height: 40px">${obj.name}</span>`;
			},
			scheme: {
				$init(obj) {
					if (obj._modelType === "folder" || obj._modelType === "collection") {
						obj.webix_kids = true;
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
						scroll: "auto",
						css: {"overflow-x": "auto"},
						padding: 10,
						margin: 10,
						body: {
							borderless: true,
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
								{
									view: "accordion",
									type: "line",
									cols: [
										{
											gravity: 2,
											rows: [
												{
													cols: [
														filterTemplate,
														imageSizeSelect,
														{}
													]
												},
												dataview
											]
										},
										{
											header: "Collections list",
											name: "dataviewAccordionItem",
											css: "dataview-window-accordion-item",
											minWidth: 300,
											collapsed: true,
											headerAltHeight: 44,
											body: {
												name: "dataviewWindowMultiview",
												animate: false,
												cells: [
													{
														borderless: true,
														rows: [
															// collectionList,
															collectionTreeView
														]
													},
													{
														name: "itemsInfoCell",
														borderless: true,
														rows: [
															{
																name: "itemInfoTemplate",
																template: obj => `<div class='flex-table'>
																					<div class='flex-table-row'>
																						<div class='flex-table-col flex-table-header'>Name:</div>
																						<div class='flex-table-col'>${obj.name}</div>
																					</div>
																					<div class='flex-table-row'>
																						<div class='flex-table-col flex-table-header'>ID:</div>
																						<div class='flex-table-col'>${obj.mainId}</div>
																					</div>
																					<div class='flex-table-row'>
																						<div class='flex-table-col flex-table-header'>Tags:</div>
																						<div class='flex-table-col json-viewer'></div>
																					</div>
																				</div>`,
																borderless: true
															}
														]
													}
												]
											},
											onClick: {
												"close-item-info-icon": () => {
													this.hideItemInfo();
													return false;
												}
											}
										}
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
		this.dataview = this.getWindowDataview();
		this.selectImagesService = new SelectItemsService(this.dataview);
		this.dataviewStore = new CustomDataPull(this.dataview);
		this.dataviewPager = this.getDataviewPager();
		this.searchInput = this.getSearchInput();
		this.selectAllTemplate = this.getSelectAllTemplate();
		this.connectedImagesModel = new ConnectedImagesModel();
		this.filterTemplate = this.getFilterTemplate();
		this.imageSizeSelect = this.getSelectImageSize();
		this.itemInfoTemplate = this.getRoot().queryView({name: "itemInfoTemplate"});
		this.accordion = this.getRoot().queryView({view: "accordion"});

		this.undoModel = undoFactory.create("tagPopup", this.getUndoIcon());

		this.windowService = new DataviewWindowService(this);

		this.accordion.attachEvent("onAfterCollapse", () => {
			this.onResizeDataview();
		});
		this.accordion.attachEvent("onAfterExpand", () => {
			this.onResizeDataview();
		});
		view.attachEvent("onViewResize", () => {
			this.onResizeDataview();
		});

		this.getCollectionTreeView().attachEvent("onSelectChange", () => {
			this.windowService.getWindowImages();
		});
	}

	showWindow(tag, tagStore, collectionTree) {
		const headerTemplate = this.getHeaderTemplate();
		this.currentTag = tag;
		headerTemplate.setValues(tag);
		this.tagStore = tagStore;
		// this.collectionStore = collectionStore;
		// this.collectionSelectService = collectionSelectService;
		this.mainCollectionTree = collectionTree;

		const treeState = collectionTree.getState();
		this.getCollectionTreeView().blockEvent();
		this.getCollectionTreeView().setState(treeState);
		this.getCollectionTreeView().unblockEvent();
		// this.collectionSelectService.addSecondaryDataView(this.collectionList);
		// this.parseCollections();
		// this.collectionSelectService.markSecondarySelectedItems();

		this.windowService.onWindowShow();
	}

	getParamsForImages() {
		// const collections = this.collectionSelectService.getSelectedItems();
		const ids = this.getCollectionAndSelectedIds();
		// const collectionIds = collections.map(collection => collection._id);
		const offset = this.dataviewPager.data.size * this.dataviewPager.data.page;
		const limit = this.dataviewPager.data.size;
		const search = this.searchInput.getValue();
		const params = {
			ids: ids.selectedIds,
			tag: this.currentTag.name,
			latest: this.filterTemplate.getValues().latest,
			offset,
			limit,
			s: search,
			type: ids.selectedType
		};
		return params;
	}

	updateMetadata() {
		const idsToRemove = this.connectedImagesModel.getImagesIdsForRemoving();
		const idsToAdd = this.connectedImagesModel.getImagesIdsForAdding();

		if (idsToRemove.length || idsToAdd.length) {
			return transitionalAjax.updateImages(idsToAdd, idsToRemove, this.currentTag._id);
		}
		return Promise.resolve(false);
	}

	showItemInfo(item) {
		const dataviewAccordionItem = this.getRoot().queryView({name: "dataviewAccordionItem"});
		const itemsInfoCell = this.getRoot().queryView({name: "itemsInfoCell"});
		const itemInfoTemplate = this.getRoot().queryView({name: "itemInfoTemplate"});
		dataviewAccordionItem.define("header", "Item's info <i class='close-item-info-icon fas fa-times'></i>");
		dataviewAccordionItem.refresh();
		// if accordion item isn't expanded
		if (dataviewAccordionItem.$width <= dataviewAccordionItem.config.headerAltHeight) {
			dataviewAccordionItem.expand();
		}
		itemInfoTemplate.setValues(item);
		this.itemInfoTemplate.refresh();
		const templateNode = this.itemInfoTemplate.getNode();
		itemsInfoCell.show();
		const tags = dot.pick("meta.tags", item);
		this.createJSONViewer(tags || {}, templateNode.querySelector(".json-viewer"));
	}

	hideItemInfo() {
		this.itemInfoTemplate.refresh();
		const multiview = this.getRoot().queryView({name: "dataviewWindowMultiview"});
		const dataviewAccordionItem = this.getRoot().queryView({name: "dataviewAccordionItem"});
		dataviewAccordionItem.define("header", "Collections list");
		dataviewAccordionItem.refresh();
		multiview.back();
	}

	createJSONViewer(data, templateNode) {
		const formatter = new JSONFormatter(data);
		templateNode.appendChild(formatter.render());
	}

	onResizeDataview() {
		const index = this.windowService.getFirstItemIndexOnPage();
		this.windowService.setImagesRange();
		const page = this.windowService.getCurrentPageByItemIndex(index);
		this.dataviewStore.clearAll();
		this.windowService.getWindowImages();
		if (this.dataviewPager.data.page !== page) {
			this.dataviewPager.select(page);
		}
	}

	closeWindow() {
		this.searchInput.setValue("");
		this.connectedImagesModel.clearModel();
		// this.collectionSelectService.clearSecondaryDataviews();
		this.filterTemplate.setValues({latest: false});
		this.undoModel.clearModel();
		responsiveWindows.removeWindow(this.getRoot().config.id);
		this.selectImagesService.clearModel();
		this.hideItemInfo();
		const treeState = this.getCollectionTreeView().getState();
		this.mainCollectionTree.blockEvent();
		this.mainCollectionTree.setState(treeState);
		this.mainCollectionTree.unblockEvent();

		this.getRoot().hide();
	}

	getCollectionAndSelectedIds() {
		const ids = this.mainCollectionTree.getSelectedId(true);
		const firstItem = this.mainCollectionTree.getItem(ids[0]);
		const _ids = ids
			.filter((id) => {
				const item = this.mainCollectionTree.getItem(id);
				return item.$level === firstItem.$level;
			})
			.map((id) => {
				const item = this.mainCollectionTree.getItem(id);
				return item._id;
			});
		let collectionIds = [];
		let selectedType = "collection";
		if (firstItem._modelType === "collection") {
			collectionIds = _ids;
		}
		else {
			collectionIds = [firstItem.baseParentId];
			selectedType = "folder";
		}
		return {collectionIds, selectedIds: _ids, selectedType};
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

	getSelectImageSize() {
		return this.getRoot().queryView({name: "windowSelectImageSize"});
	}

	getCollectionTreeView() {
		return this.getRoot().queryView({name: "windowCollectionTreeView"});
	}
}
