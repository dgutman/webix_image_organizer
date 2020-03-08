import {JetView} from "webix-jet";
import CustomDataPull from "../../models/customDataPullClass";
import ConnectedImagesModel from "../../models/connectedImagesModel";
import windowParts from "./windowParts";
import transitionalAjax from "../../services/transitionalAjaxService";
import SelectItemsService from "../../services/selectItemsService";
import undoFactory from "../../models/undoModel";
import constants from "../../constants";
import responsiveWindows from "../../models/windows/responsiveWindows";
import DataviewWindowService from "../../services/mainColumns/windows/dataviewWindow";

const PAGER_ID = "dataview-value-connection-pager";

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
			pager: PAGER_ID,
			borderless: true,
			template: (obj, common) => windowParts.getDataviewTempate(obj, common, this.dataview),
			type: {
				width: constants.DATAVIEW_IMAGE_SIZE.WIDTH,
				height: constants.DATAVIEW_IMAGE_SIZE.HEIGHT,
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

		const connectValueToImageWindow = {
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
						template: obj => `Images-values connection - ${obj.value.value} (${obj.tag.name})`,
						tooltip: () => {
							const template = this.getHeaderTemplate();
							const obj = template.getValues();
							return `Images-values connection - ${obj.value.value} (${obj.tag.name})`;
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
								cols: [
									filterTemplate,
									imageSizeSelect,
									{}
								]
							},
							dataview
						]
					},
					buttons
				]
			}
		};

		return connectValueToImageWindow;
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

		this.undoModel = undoFactory.create("valuePopup", this.getUndoIcon());

		this.windowService = new DataviewWindowService(this);

		view.attachEvent("onViewResize", () => {
			this.windowService.setImagesRange();
			this.dataviewStore.clearAll();
			this.windowService.getWindowImages();
		});
	}

	showWindow({tag, value}, tagStore, valuesStore, ids) {
		this.collectionIds = ids;
		const headerTemplate = this.getHeaderTemplate();
		this.currentTag = tag;
		this.currentValue = value;
		headerTemplate.setValues({tag, value});
		this.tagStore = tagStore;
		this.valuesStore = valuesStore;

		this.windowService.onWindowShow();
	}

	getParamsForImages() {
		const ids = this.collectionIds.selectedIds;
		const offset = this.dataviewPager.data.size * this.dataviewPager.data.page;
		const limit = this.dataviewPager.data.size;
		const search = this.searchInput.getValue();

		return {
			ids,
			tag: this.currentTag.name,
			value: this.currentValue.value,
			latest: this.filterTemplate.getValues().latest,
			offset,
			limit,
			s: search,
			type: this.collectionIds.selectedType

		};
	}

	updateMetadata() {
		const idsToRemove = this.connectedImagesModel.getImagesIdsForRemoving();
		const idsToAdd = this.connectedImagesModel.getImagesIdsForAdding();

		if (idsToRemove.length || idsToAdd.length) {
			return transitionalAjax.updateImages(idsToAdd, idsToRemove, this.currentTag._id, this.currentValue._id);
		}
		return Promise.resolve(false);
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
}
