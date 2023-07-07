import {isObject} from "lodash/lang";
import lodashObject from "lodash/object";

import constants from "../../constants";
import downloadFiles from "../../models/downloadFiles";
import editableFoldersModel from "../../models/editableFoldersModel";
import FilterModel from "../../models/filterModel";
import FinderModel from "../../models/finderModel";
import galleryImageUrl from "../../models/galleryImageUrls";
import ItemsModel from "../../models/itemsModel";
import metadataTableModel from "../../models/metadataTableModel";
import modifiedObjects from "../../models/modifiedObjects";
import nonImageUrls from "../../models/nonImageUrls";
import npdataTableModel from "../../models/npdataTableModel";
import patientsDataModel from "../../models/patientsDataModel";
import projectMetadata from "../../models/projectMetadata";
import recognizedItemsModel from "../../models/recognizedItems";
import selectDataviewItems from "../../models/selectGalleryDataviewItems";
import webixViews from "../../models/webixViews";
import utils from "../../utils/utils";
import viewMouseEvents from "../../utils/viewMouseEvents";
import FinderContextMenu from "../../views/components/finderContextMenu";
import GalleryDataviewContextMenu from "../../views/components/galleryDataviewContextMenu";
import RenamePopup from "../../views/components/renamePopup";
import MakeLargeImageWindow from "../../views/subviews/dataviewActionPanel/windows/makeLargeImageWindow";
import BigCountNotificationWindow from "../../views/subviews/finder/windows/bigCountNotification";
import RecognitionServiceWindow from "../../views/subviews/finder/windows/recognitionServiceWindow";
import SetDefaultViewWindow from "../../views/subviews/finder/windows/setDefaultViewWindow";
import CsvViewerWindow from "../../views/subviews/gallery/windows/csvViewerWindow";
import ImageWindow from "../../views/subviews/gallery/windows/imageWindow/index";
import PdfViewerWindow from "../../views/subviews/gallery/windows/pdfViewerWindow";
import ajaxActions from "../ajaxActions";
import authService from "../authentication";
// import webixModels from "../../models/webixModels";
import FolderNav from "../folderNav";
import ImageThumbnailLoader from "../gallery/imageThumbnailLoader";
import EmptyDataViewsService from "../views/emptyDataViews";

let contextToFolder;
// TODO: find scroll event
// let scrollEventId;
let lastSelectedFolderId;
const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
const patientsDataCollection = patientsDataModel.getPatientsDataCollection();
const validationSchemas = projectMetadata.getValidationSchemas();
const folderAndSchemasMapping = projectMetadata.getFolderAndSchemasMapping();
let filesToLargeImage = [];
let isRecognitionResultMode;

class MainService {
	constructor(
		view,
		hostBox,
		collectionBox,
		multiviewSwitcher,
		galleryDataviewPager,
		galleryDataview,
		metadataTable,
		finder,
		metadataTemplate,
		collapser,
		metadataPanelScrollView,
		cartList,
		npView
	) {
		this._view = view;
		this._hostBox = hostBox;
		this._collectionBox = collectionBox;
		this._multiviewSwitcher = multiviewSwitcher;
		this._galleryDataviewPager = galleryDataviewPager;
		this._galleryDataview = galleryDataview;
		this._metadataTable = metadataTable;
		this._finder = finder;
		this._metadataTemplate = metadataTemplate;
		this._collapser = collapser;
		this._metadataPanelScrollView = metadataPanelScrollView;
		this._cartList = cartList;
		this._npView = npView;
		this._ready();
	}

	_ready() {
		const scrollPosition = this._finder.getScrollState();
		webix.extend(this._view, webix.ProgressBar);
		this._metadataPanelScrollView.hide();

		const metadataTableCell = this._view.$scope.getSubMetadataTableView().getRoot();
		const galleryDataviewCell = this._view.$scope.getSubGalleryView().getRoot();
		const zstackCell = this._view.$scope.getSubZStackView();
		const scenesViewCell = this._view.$scope.getSubScenesViewCell();
		const multichannelViewCell = this._view.$scope.getSubMultichannelViewCell();

		this._imageWindow = this._view.$scope.ui(ImageWindow);
		this._selectImagesTemplate = this._view.$scope.getSubGalleryView().getSelectImagesTemplate();
		this._pdfViewerWindow = this._view.$scope.ui(PdfViewerWindow);
		this._csvViewerWindow = this._view.$scope.ui(CsvViewerWindow);
		this._finderCountTemplate = this._finder.$scope.getTreeCountTemplate();
		this._finderContextMenu = this._view.$scope.ui(FinderContextMenu).getRoot();
		this._cartViewButton = this._view.$scope.getSubDataviewActionPanelView().getCartButton();
		this._downloadingMenu = this._view.$scope.getSubCartListView().getDownloadingMenu();
		this._galleryDataviewYCountSelection = this._view.$scope
			.getSubGalleryFeaturesView().getDataviewYCountSelection();
		this._galleryDataviewContextMenu = this._view.$scope.ui(GalleryDataviewContextMenu).getRoot();
		this._galleryDataviewRichselectFilter = this._view.$scope
			.getSubGalleryFeaturesView().getFilterBySelectionView();
		this._showMetadataWindowButton = this._view.$scope
			.getSubMetadataPanelView().getShowAddMetadataWindowButton();
		this._galleryDataviewSearch = this._view.$scope
			.getSubGalleryFeaturesView().getFilterByNameView();
		this._makeLargeImageWindow = this._view.$scope.ui(MakeLargeImageWindow);
		this._makeLargeImageButton = this._view.$scope
			.getSubGalleryFeaturesView().getMakeLargeImageButton();
		this._renamePopup = this._view.$scope.ui(RenamePopup);
		// this._tableTemplateCollapser = this._metadataTable.$scope.getTableTemplateCollapser();
		this._galleryDataviewImageViewer = this._view.$scope
			.getSubGalleryFeaturesView().getGalleryImageViewer();
		this._projectFolderWindowButton = this._view.$scope
			.getSubDataviewActionPanelView().getProjectFolderWindowButton();
		this._galleryFeaturesView = this._view.$scope.getSubGalleryFeaturesView().getRoot();
		this._filterTableView = this._view.$scope.getSubDataviewActionPanelView().getFilterTableView();
		this._recognitionStatusTemplate = this._view.$scope
			.getSubDataviewActionPanelView().getRecognitionProgressTemplate();
		if (ItemsModel.instance) ItemsModel.instance.destroy();
		this._itemsModel = new ItemsModel(this._finder, this._galleryDataview, this._metadataTable);
		this._itemsDataCollection = this._itemsModel.getDataCollection();
		this._metadataTableDataCollection = metadataTableModel.getMetadataTableDataCollection();
		/*
			TODO: this collection should be consist of all elements under the folder and
			show all images with HE by default.
		*/
		this._npSliderDataCollection = npdataTableModel.getNPDataCollection();
		this._recognitionOptionsWindow = this._view.$scope.ui(RecognitionServiceWindow);
		this._bigCountNotification = this._view.$scope.ui(BigCountNotificationWindow);
		this._recognitionProgressTemplate = this._view.$scope
			.getSubDataviewActionPanelView().getRecognitionProgressTemplate();
		this._recognitionResultsDropDown = this._view.$scope
			.getSubDataviewActionPanelView().getRecognitionOptionDropDown();
		this._filterModel = new FilterModel(
			this._itemsModel,
			this._galleryDataviewRichselectFilter,
			this._filterTableView
		);

		this._finderModel = new FinderModel(this._view, this._finder, this._itemsModel);

		webixViews.setGalleryDataview(this._galleryDataview);
		webixViews.setMetadataTable(this._metadataTable);
		webixViews.setFinderView(this._finder);
		webixViews.setGalleryPager(this._galleryDataviewPager);
		webixViews.setMainView(this._view);
		webixViews.setImageWindow(this._imageWindow);
		webixViews.setPdfViewerWindow(this._pdfViewerWindow);
		webixViews.setCsvViewerWindow(this._csvViewerWindow);
		webixViews.setGalleryDataviewContextMenu(this._galleryDataviewContextMenu);
		webixViews.setItemsModel(this._itemsModel);
		webixViews.setRenamePopup(this._renamePopup);
		webixViews.setMetadataTemplate(this._metadataTemplate);
		webixViews.setDataviewSearchInput(this._galleryDataviewSearch);

		this._folderNav = new FolderNav(this._view.$scope, this._finder);
		this._imageTumbnailLoader = new ImageThumbnailLoader(this._galleryDataview);

		viewMouseEvents.setMakeLargeImageButton(this._makeLargeImageButton);

		this._galleryDataview.sync(this._itemsDataCollection);
		this._metadataTable.sync(this._metadataTableDataCollection);
		zstackCell.setCollection(this._itemsDataCollection);
		scenesViewCell.syncSlider(this._itemsDataCollection);
		this._npView.syncSlider(this._itemsDataCollection);

		this._itemsDataCollection.define("scheme", {
			$init: (obj) => {
				obj.$height = this._metadataTable.config._rowHeight || constants.METADATA_TABLE_ROW_HEIGHT;
			}
		});

		this._view.$scope.getSubFinderView().setTreePosition(scrollPosition.x);

		const emptyDataViewsService = new EmptyDataViewsService(
			this._itemsDataCollection,
			this._galleryDataview,
			this._metadataTable,
			this._galleryDataviewPager,
			this._selectImagesTemplate
		);
		emptyDataViewsService.attachDataCollectionEvent();

		this._view.attachEvent(constants.OPEN_MULTICHANNEL_VIEW_EVENT, async (image) => {
			const actionPanel = this._view.$scope.getSubDataviewActionPanelView();
			await actionPanel.multichannelViewOptionToggle(image);
			multichannelViewCell.show();
			this._finder.select(image.id);
		});

		// disable context menu for webix elements
		this._metadataTable.getNode().addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});

		this._galleryDataview.getNode().addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});

		this._setInitSettingsMouseEvents();
		this._view.$scope.on(this._view.$scope.app, "change-event-settings", (values) => {
			viewMouseEvents.setMouseSettingsEvents(this._galleryDataview, this._metadataTable, values);
		});

		// to hide select lists after scroll
		document.body.addEventListener("scroll", () => {
			webix.callEvent("onClick", []);
		});

		this._galleryDataviewPager.attachEvent("onAfterRender", function onAfterRender() {
			const currentPager = this;
			const node = this.getNode();
			const inputNode = node.getElementsByClassName("pager-input")[0];

			inputNode.addEventListener("focus", function focus() {
				this.prev = this.value;
			});
			inputNode.addEventListener("keyup", function keyup(e) {
				if (e.keyCode === 13) { // enter
					let value = parseInt(this.value);
					if (value && value > 0 && value <= currentPager.data.limit) {
						currentPager.select(value - 1); // because in pager first page is 0
					}
					else {
						this.value = this.prev;
					}
				}
			});
		});

		// prevent select for datatable
		this._metadataTable.attachEvent("onBeforeSelect", () => false);

		this._metadataTable.data.attachEvent("onBeforeSort", (by, dir) => {
			this._metadataTableDataCollection.sort(by, dir);
			return false;
		});

		// connecting pager to data view
		this._galleryDataview.define("pager", this._galleryDataviewPager);

		this._galleryDataview.define("template", (obj, common) => {
			let dataviewNewImageHeight = utils.getNewImageHeight();
			let IMAGE_HEIGHT;
			const {getPreviewUrl, imageType} = this._getCurrentItemPreviewType();

			if (dataviewNewImageHeight) {
				IMAGE_HEIGHT = dataviewNewImageHeight - 10;
			}
			else {
				IMAGE_HEIGHT = 100;
			}

			const checkedClass = selectDataviewItems.isSelected(obj._id) ? "is-checked" : "";

			this._imageTumbnailLoader.loadImagePreview(obj, imageType);

			const warning = obj.imageWarning ? `<span class='webix_icon fas fa-exclamation-triangle warning-icon' style='${this._getPositionFloat(obj)}'></span>` : "";
			const starHtml = obj.starColor ? `<span class='webix_icon fa fa-star gallery-images-star-icon' style='color: ${obj.starColor}'></span>` : "";

			if (obj.imageWarning) {
				this._filterModel.addFilterValue("warning");
				this._filterModel.parseFilterToRichSelectList();
			}

			const previewUrl = getPreviewUrl(obj._id);
			const bgIcon = previewUrl ? `background: url(${nonImageUrls.getNonImageUrl(obj)}) center / auto 100% no-repeat;` : "";

			let src = nonImageUrls.getNonImageUrl(obj);
			if (previewUrl) {
				src = previewUrl;

				const styleParamsString = this._getStyleParamsOfThumbnailPreview(obj);
				if (styleParamsString) {
					src += `&style=${styleParamsString}`;
				}
			}

			return `<div title='${obj.name}' class='unselectable-dataview-items'>
				<div class="gallery-images-container ${checkedClass}" style="height: ${utils.getNewImageHeight()}px">
					<div class="gallery-images-info">
						<div class="gallery-images-header">
							<div class="gallery-images-checkbox"> <i class="checkbox-icon ${common.markCheckbox(obj, common)}"></i></div>
							<div class="download-icon"><span class="webix_icon fa fa-download"></span></div>
						</div>
					</div>
					<div class="gallery-image-wrap" style="height: ${this._checkForImageHeight(IMAGE_HEIGHT)}px">
						${starHtml}
						${warning}
						<img
							style="${bgIcon}"
							height="${this._checkForImageHeight(IMAGE_HEIGHT)}"
							loading="lazy" src="${src}"
							class="gallery-image"
						>
					</div>
				</div>
				<div class="thumbnails-name">${obj.name}</div>
			</div>`;
		});

		// // setting onChange event for hosts
		this._view.$scope.on(this._view.$scope.app, "hostChange", () => {
			selectDataviewItems.clearAll();
		});

		// setting onChange event for collection
		this._view.$scope.on(this._view.$scope.app, "collectionChange", (id, collectionItem) => {
			if (!this.pendingCollectionChange) this._collectionChangeHandler(collectionItem);
		});
		if (!this._finder.count() && !this.pendingCollectionChange) {
			const collectionId = this._collectionBox.getValue();
			const collection = this._collectionBox.getList().getItem(collectionId);
			if (collection) this._collectionChangeHandler(collection);
		}

		// switching between data table and data view
		this._multiviewSwitcher.attachEvent("onChange", (value) => {
			const [
				thumbnailOption,
				metadataViewOption,
				zStackViewOption,
				npViewOption
			] = constants.MAIN_MULTIVIEW_OPTIONS;
			const scenesOption = constants.SCENES_VIEW_OPTION;
			const multichannelViewOption = constants.MULTICHANNEL_VIEW_OPTION;

			// TODO: find selectedItem
			// const selectedItem = this._finder.getSelectedItem();

			switch (value) {
				case thumbnailOption.id:
					galleryDataviewCell.show();
					this._collapser.show();
					this._galleryDataviewPager.show();
					this._galleryFeaturesView.show();
					this._toggleCartList("gallery");
					this._selectDataviewItemByTable();
					break;
				case metadataViewOption.id:
					this._closeThumbnailViewPanels();
					metadataTableCell.show();
					this._filterTableView.show();
					// to fix bug with displaying data
					this._metadataTable.scrollTo(0, 0);
					this._selectTableItemByDataview();
					break;
				case zStackViewOption.id:
					this._closeThumbnailViewPanels();
					zstackCell.getRoot().show();
					break;
				case npViewOption.id:
					this._closeThumbnailViewPanels();
					this._npView.getRoot().show();
					break;
				case scenesOption.id:
					this._closeThumbnailViewPanels();
					scenesViewCell.getRoot().show();
					break;
				case multichannelViewOption.id:
					this._closeThumbnailViewPanels();
					multichannelViewCell.show();
					break;
				default:
					break;
			}
		});

		this._finder.attachEvent("onBeforeSelect", () => {
			this._setLastSelectedFolderId();
		});

		this._finder.attachEvent("onBeforeOpen", (id) => {
			this._finder.select(id);
			return false;
		});

		this._finder.attachEvent("putItemsToSubFolder", () => {
			this._bigCountNotification.showWindow();
		});

		// after opening the tree branch we fire this event
		this._finder.attachEvent("onAfterSelect", (id) => {
			if (isRecognitionResultMode) {
				webix.confirm({
					title: "Attention!",
					text: "Are you sure you want to hide results?",
					type: "confirm-warning",
					cancel: "Yes",
					ok: "No"
				})
					.then(() => {
						this._finder.unselectAll();
					})
					.catch(() => {
						isRecognitionResultMode = false;
						this._changeRecognitionResultsMode();
						this._selectFinderItem(id);
					});
			}
			else {
				this._selectFinderItem(id);
			}
		});

		this._finder.attachEvent("onAfterClose", (id) => {
			this._finder.unselect(id);
			if (this._finder.getSelectedId()) return;

			const folder = this._finder.getItem(id);
			if (folder.linear && !folder.hasOpened) {
				folder.linear = false;
				this._itemsModel.findAndRemove(id, folder);
				this._itemsModel.selectedItem = null;
			}
			else if (!folder.linear && folder.hasOpened) {
				this._galleryDataviewPager.hide();
				this._itemsDataCollection.clearAll();
			}

			if (lastSelectedFolderId) {
				const lastSelectedFolderNode = this._finder.getItemNode(lastSelectedFolderId);
				if (lastSelectedFolderNode) webix.html.removeCss(lastSelectedFolderNode, "last-selected-folder");
			}
			lastSelectedFolderId = id;
			this._highlightLastSelectedFolder();

			this._filterModel.prepareDataToFilter([], true);
		});

		// parsing data to metadata template next to data view
		this._galleryDataview.attachEvent("onAfterSelect", (id) => {
			let item = this._galleryDataview.getItem(id);
			this._metadataTemplate.setValues(item);
			if (authService.isLoggedIn() && authService.getUserInfo().admin) {
				this._showMetadataWindowButton.show();
			}
		});

		if (authService.isLoggedIn()) {
			this._finderContextMenu.attachTo(this._finder);

			// eslint-disable-next-line consistent-return
			this._finder.attachEvent("onBeforeContextMenu", (id) => {
				const item = this._finder.getItem(id);
				this._finderContextMenu.clearAll();
				switch (item._modelType) {
					case "folder": {
						this._finderContextMenu.parse([
							constants.REFRESH_FOLDER_CONTEXT_MENU_ID,
							{$template: "Separator"},
							constants.LINEAR_CONTEXT_MENU_ID
						]);
						if (editableFoldersModel.isFolderEditable(item._id)) {
							this._finderContextMenu.parse([
								{$template: "Separator"},
								constants.RENAME_CONTEXT_MENU_ID,
								{$template: "Separator"},
								constants.UPLOAD_METADATA_MENU_ID,
								{$template: "Separator"},
								constants.SET_OPTIONS
							]);
						}
						if (authService.getUserInfo() && authService.getUserInfo().admin) {
							this._finderContextMenu.parse([
								{$template: "Separator"},
								constants.RUN_RECOGNITION_SERVICE
							]);
						}
						contextToFolder = true;
						this._finderFolder = item;
						break;
					}
					case constants.SUB_FOLDER_MODEL_TYPE: {
						this._finderContextMenu.hide();
						return false;
					}
					case "item":
					default: {
						const itemFolder = this._finder.getItem(item.$parent);
						if (editableFoldersModel.isFolderEditable(itemFolder._id)) {
							this._finderContextMenu.parse([constants.RENAME_FILE_CONTEXT_MENU_ID]);
							contextToFolder = false;
							this._finderItem = item;
						}
						else {
							this._finderContextMenu.hide();
							return false;
						}
						break;
					}
				}
			});

			this._finderContextMenu.attachEvent("onItemClick", (id) => {
				let itemId;
				let folderId;
				const item = this._finderContextMenu.getItem(id);
				const value = item.value;
				if (contextToFolder) {
					folderId = this._finderFolder.id;
				}
				else {
					itemId = this._finderItem.id;
				}
				switch (value) {
					case constants.RENAME_CONTEXT_MENU_ID: {
						this._finder.edit(folderId);
						break;
					}
					case constants.LINEAR_CONTEXT_MENU_ID: {
						const isCollapsed = true;
						this._loadLinearImages(folderId, isCollapsed);
						break;
					}
					case constants.RENAME_FILE_CONTEXT_MENU_ID: {
						this._finder.edit(itemId);
						break;
					}
					case constants.REFRESH_FOLDER_CONTEXT_MENU_ID: {
						if (this._finderFolder.hasOpened || this._finderFolder.open) {
							this._finder.close(folderId);
							this._itemsModel.findAndRemove(folderId, this._finderFolder);
						}
						this._finder.select(folderId);
						break;
					}
					case constants.RUN_RECOGNITION_SERVICE: {
						const dataviewItems = this._galleryDataview
							.serialize()
							.filter(dataviewItem => dataviewItem.largeImage &&
								(dataviewItem.folderId === this._finderFolder._id || !dataviewItem._modelType));
						this._recognitionOptionsWindow.setItemsToRecognize(dataviewItems);
						this._recognitionOptionsWindow.showWindow(
							this._finder,
							this._finderFolder,
							this._galleryDataview,
							this._recognitionStatusTemplate
						);
						break;
					}
					case constants.UPLOAD_METADATA_MENU_ID: {
						this._finder.select(folderId);
						webix.delay(() => {
							this._view.$scope.app.show(`${constants.APP_PATHS.UPLOAD_METADATA}/${this._view.$scope.getParam("folders") || ""}`);
						}, 100);
						break;
					}
					case constants.SET_OPTIONS: {
						const currentFolder = this._finderFolder;
						const _optionsWindow = this._view.$scope.ui(SetDefaultViewWindow);
						_optionsWindow.showWindow(currentFolder);
						break;
					}
					default: {
						break;
					}
				}
			});

			this._finder.attachEvent("onAfterEditStop", (values, object, item) => {
				const newValue = values.value;
				if (newValue !== values.old) {
					this._view.showProgress();
					if (contextToFolder && !object.inGallery) {
						ajaxActions.putNewFolderName(this._finderFolder._id, newValue)
							.then((folder) => {
								this._finder.updateItem(this._finderFolder.id, folder);
								webix.message({text: "Folder name was successfully updated!"});
								this._view.hideProgress();
							})
							.catch(() => {
								this._finderFolder.name = values.old;
								this._finder.updateItem(this._finderFolder.id, this._finderFolder);
								this._view.hideProgress();
							});
					}
					else {
						if (
							!this._finderItem
							|| this._finderItem?._id !== item?._id
						) {
							this._finderItem = this._itemsModel.findItem(null, item._id);
						}
						else if (!item) {
							item = this._galleryDataview
								.find(galleryItem => galleryItem._id === this._finderItem._id, true);
						}
						const cartListItem = this._cartList.find(cartItem => cartItem._id === item._id, true);
						ajaxActions.putNewItemName(this._finderItem._id, newValue)
							.then((updatedItem) => {
								this._itemsModel.updateItems(updatedItem);

								if (cartListItem) {
									this._cartList.updateItem(cartListItem.id, updatedItem);
									selectDataviewItems.putSelectedImagesToLocalStorage();
								}
								const selectedItem = this._galleryDataview.getSelectedItem();
								if (selectedItem) {
									this._metadataTemplate.setValues(selectedItem);
								}
								webix.message({text: "Item name was successfully updated!"});
								this._view.hideProgress();
							})
							.catch(() => {
								this._finderItem.name = values.old;
								this._itemsModel.updateItems(this._finderItem);
								this._view.hideProgress();
							});
					}
				}
			});
		}

		this._galleryDataview.attachEvent("onCheckboxClicked", (items, value, unselectAll) => {
			if (!Array.isArray(items)) {
				items = [items];
			}
			if (utils.isObjectEmpty(this._cartList.data.pull) && value) {
				this._cartViewButton.callEvent("onItemClick", ["checkboxClicked"]);
			}
			if (items.length) {
				if (value) {
					this._cartList.parse(items);
				}
				else {
					if (unselectAll) {
						this._cartList.clearAll();
					}
					else {
						items.forEach((item) => {
							const cartItem = this._cartList.find(obj => obj._id === item._id, true);
							if (cartItem) this._cartList.remove(cartItem.id);
						});
					}

					if (utils.isObjectEmpty(this._cartList.data.pull)) {
						this._cartViewButton.define("label", "Show cart");
						this._view.$scope.getSubCartListView().hideList();
						this._cartViewButton.hide();
					}
				}
			}
			selectDataviewItems.putSelectedImagesToLocalStorage();
			this._galleryDataview.refresh();
		});

		this._cartViewButton.attachEvent("onItemClick", (clicked) => {
			const label = this._cartViewButton.config.label;
			if ((!label || label === "Show cart") && selectDataviewItems.count() > 0) {
				this._view.$scope.getSubCartListView().showList();
				this._cartViewButton.define("label", "Hide cart");
				this._cartViewButton.refresh();
			}
			else if (label === "Hide cart") {
				this._view.$scope.getSubCartListView().hideList();
				this._cartViewButton.define("label", "Show cart");
				this._cartViewButton.refresh();
			}
			if (clicked === "checkboxClicked") {
				this._cartViewButton.show(true);
			}
		});

		this._cartList.define("template", (obj, common) => {
			this._imageTumbnailLoader.loadImagePreview(obj, "thumbnail", this._cartList);

			return `<div>
				<span class='webix_icon fas ${utils.angleIconChange(obj)}' style="color: #6E7480;"></span>
				<div style='float: right'>${common.deleteButton(obj, common)}</div>
				<div class='card-list-name' title='${obj.name}'>${obj.name}</div>
				<img src="${galleryImageUrl.getPreviewImageUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}" class="cart-image">
			</div>`;
		});

		this._cartList.attachEvent("onDeleteButtonClick", (params) => {
			let item;
			let itemId;
			if (params.name) {
				item = params;
				itemId = params.id;
			}
			else {
				this.deleteButton = $$(params);
				itemId = this.deleteButton.config.$masterId;
				item = this._cartList.getItem(itemId);
			}
			if (item.imageShown) {
				item.imageShown = false;
				modifiedObjects.remove(item);
			}
			this._cartList.data.callEvent("onAfterDeleteItem", [itemId]);
		});

		this._cartList.data.attachEvent("onAfterDeleteItem", (id) => {
			let item = this._cartList.getItem(id);
			selectDataviewItems.remove(item);
			this._cartList.forEach((obj) => {
				if (obj._id === item._id) {
					this._cartList.remove(obj.id);
				}
			});
			this._view.$scope.app.callEvent("changedSelectedImagesCount");
			if (utils.isObjectEmpty(this._cartList.data.pull)) {
				this._cartViewButton.callEvent("onItemClick");
				this._cartViewButton.hide();
			}
			selectDataviewItems.putSelectedImagesToLocalStorage();
			this._galleryDataview.refresh();
		});

		this._cartList.attachEvent("onAfterRender", () => {
			if (modifiedObjects.count() > 0) {
				modifiedObjects.getObjects().forEach((obj) => {
					let itemNode = this._cartList.getItemNode(obj.id);
					if (itemNode) {
						let listTextNode = itemNode.firstChild.children[2];
						itemNode.setAttribute("style", "height: 140px !important; color: #0288D1;");
						listTextNode.setAttribute("style", "margin-left: 17px; width: 110px !important;");
					}
				});
			}
		});

		this._downloadingMenu.attachEvent("onMenuItemClick", (id) => {
			let sourceParams = {
				resources: selectDataviewItems.getURIEncoded()
			};

			switch (id) {
				case constants.IMAGES_ONLY_MENU_ID: {
					sourceParams.metadata = false;
					downloadFiles.downloadZip(sourceParams, ajaxActions, utils);
					break;
				}
				case constants.IMAGES_AND_METADATA_MENU_ID: {
					sourceParams.metadata = true;
					downloadFiles.downloadZip(sourceParams, ajaxActions, utils);
					break;
				}
				case constants.COPY_TO_CLIPBOARD_MENU_ID: {
					let objectsToCopy = this._cartList.find(obj => obj);
					let stringOfObjects = JSON.stringify(objectsToCopy);
					let stringToCopy = stringOfObjects.substr(1).slice(0, -1);
					let dummy = document.createElement("input");
					document.body.appendChild(dummy);
					dummy.setAttribute("value", stringToCopy);
					dummy.select();
					document.execCommand("copy");
					document.body.removeChild(dummy);
					webix.message("Copied");
					break;
				}
				case constants.RUN_RECOGNITION_SERVICE: {
					const selectedImages = this._cartList
						.serialize()
						.filter(item => item.largeImage);
					this._recognitionOptionsWindow.setItemsToRecognize(selectedImages);
					this._recognitionOptionsWindow.showWindow(
						this._finder,
						null,
						this._galleryDataview,
						this._recognitionStatusTemplate
					);
					break;
				}
				case constants.EMPTY_CART_MENU_ID: {
					const selectedItems = selectDataviewItems.getSelectedImages();
					this._galleryDataview.callEvent("onCheckboxClicked", [selectedItems, 0, true]);
					selectDataviewItems.clearAll();
					this._galleryDataview.refresh();
					selectDataviewItems.putSelectedImagesToLocalStorage();
					this._view.$scope.app.callEvent("changedSelectedImagesCount");
					break;
				}
				default: {
					break;
				}
			}
		});

		this._finder.attachEvent("onAfterRender", () => {
			const treeWidth = this._finder.$width;
			const dataviewMinWidth = this._galleryDataview.config.minWidth;
			this._minCurrentTargenInnerWidth = dataviewMinWidth + treeWidth;
		});

		const dataviewSelectionId = utils
			.getDataviewSelectionId() || constants.DEFAULT_DATAVIEW_COLUMNS;
		this._galleryDataviewYCountSelection.blockEvent();
		this._galleryDataviewYCountSelection.setValue(dataviewSelectionId);
		this._galleryDataviewYCountSelection.unblockEvent();

		window.addEventListener("resize", (event) => {
			const dataviewSizeId = utils.getDataviewSelectionId() || constants.DEFAULT_DATAVIEW_COLUMNS;
			if (event.currentTarget.innerWidth >= this._minCurrentTargenInnerWidth) {
				this._galleryDataviewYCountSelection.callEvent("onChange", [dataviewSizeId]);
			}
		});

		this._galleryDataviewYCountSelection.attachEvent("onChange", (id) => {
			let newitemWidth;
			let newItemHeight;
			const previousItemWidth = this._galleryDataview.type.width;
			const previousItemHeight = this._galleryDataview.type.height;
			let multiplier = previousItemHeight / previousItemWidth;
			let dataviewWidth = this._galleryDataview.$width;

			switch (id) {
				case constants.THREE_DATAVIEW_COLUMNS: {
					newitemWidth = Math.round(dataviewWidth / 3) - 5;
					break;
				}
				case constants.FIVE_DATAVIEW_COLUMNS: {
					newitemWidth = Math.round(dataviewWidth / 5) - 5;
					break;
				}
				case constants.DEFAULT_DATAVIEW_COLUMNS: {
					newitemWidth = 150;
					newItemHeight = 135;
					break;
				}
				default:
					break;
			}
			if (id !== constants.DEFAULT_DATAVIEW_COLUMNS) {
				newItemHeight = Math.round(newitemWidth * multiplier);
			}
			let newImageHeight = newItemHeight - 35;
			utils.setNewImageHeight(newImageHeight);
			utils.setDataviewSelectionId(id);
			this._setDataviewColumns(newitemWidth, newItemHeight);
		});

		this._finder.data.attachEvent("onStoreUpdated", () => {
			const count = this._countFinderItems();
			this._finderCountTemplate.setCount(count);
		});

		// TODO: synchronise this._itemsDataCollection and this._metadataTableDataCollection
		this._itemsDataCollection.attachEvent("onAfterLoad", () => {
			this._updateMetadataTableData();
		});

		patientsDataCollection.attachEvent("onAfterLoad", () => {
			this._updateMetadataTableData();
		});

		this._makeLargeImageWindow.getRoot().attachEvent("onHide", () => {
			this._setFilesToLargeImage();
		});

		if (authService.isLoggedIn()) {
			this._galleryDataviewContextMenu.attachTo(this._galleryDataview);
		}

		this._filterTableView.attachEvent("onChange", (value) => {
			this._galleryDataviewRichselectFilter.setValue(value);
		});
		this._galleryDataviewRichselectFilter.attachEvent("onChange", (value) => {
			switch (value) {
				case "warning": {
					this._filterModel.addFilter("imageWarning", value, "warning");
					break;
				}
				case "folders": {
					const selectedFolder = this._finder.getSelectedItem();
					if (!selectedFolder || selectedFolder._modelType === "folder") {
						this._filterModel.addFilter("modelType", "folder", "modelType");
					}
					break;
				}
				default: {
					if (/\s(star)+/g.test(value)) { // star type
						this._filterModel.addFilter("starColor", value, "star");
						break;
					}
					this._filterModel.addFilter("itemType", value, "itemType");
					break;
				}
			}
		});

		this._galleryDataviewSearch.attachEvent("onEnter", () => {
			this._filterDataByName();
		});
		this._galleryDataviewSearch.attachEvent("onSearchIconClick", () => {
			this._filterDataByName();
		});

		this._metadataTable.attachEvent("onBeforeFilter", (name, value, config) => {
			let type;
			switch (config.content) {
				case "selectFilter": {
					type = "select";
					break;
				}
				case "textFilter":
				default: {
					if (
						this._metadataTable
							.getColumnConfig(config.columnId)
							.filterTypeValue === constants.FILTER_TYPE_DATE
					) {
						type = "date";
						break;
					}
					type = "text";
					break;
				}
			}
			this._filterModel.addFilter(name, value, type);
			return false;
		});

		this._makeLargeImageButton.attachEvent("onItemClick", () => {
			this._makeLargeImageWindow.showWindow(filesToLargeImage, this._makeLargeImageButton);
		});

		this._finder.getNode().addEventListener("contextmenu", (event) => {
			event.preventDefault();
			return false;
		}, false);

		this._galleryDataview.getNode().addEventListener("contextmenu", (event) => {
			event.preventDefault();
			return false;
		}, false);

		this._galleryDataviewImageViewer.attachEvent("onChange", (newValue, oldValue) => {
			if (newValue !== oldValue) {
				this._galleryDataview.refresh();
			}
		});

		this._recognitionProgressTemplate.define("onClick", {
			fas: () => {
				const statusObj = this._recognitionProgressTemplate.getValues();
				if (statusObj.value !== constants.LOADING_STATUSES.IN_PROGRESS.value) {
					webix.confirm({
						text: "Are you sure you want to show results?",
						type: "confirm-warning",
						ok: "Yes",
						cancel: "No",
						callback: (result) => {
							if (result) {
								switch (statusObj.value) {
									case constants.LOADING_STATUSES.WARNS.value:
									case constants.LOADING_STATUSES.DONE.value: {
										isRecognitionResultMode = true;
										this._changeRecognitionResultsMode();
										break;
									}
									case constants.LOADING_STATUSES.ERROR.value: {
										webix.alert(statusObj.text);
										break;
									}
									default: {
										break;
									}
								}
							}
							else {
								this._recognitionStatusTemplate.hide();
							}
						}
					});
				}
			}
		});

		this._recognitionResultsDropDown.attachEvent("onChange", (id) => {
			if (id) {
				this._itemsDataCollection.clearAll();
				this._itemsDataCollection.parse(recognizedItemsModel.getRecognizedItemsByOption(id));
			}
		});

		this._setGallerySelectedItemsFromLocalStorage();
	}

	_updateMetadataTableData() {
		this._metadataTableDataCollection.clearAll();
		const itemsData = this._itemsDataCollection.serialize();
		const patientsData = patientsDataCollection.serialize();
		const metadataTableData = [];
		itemsData.forEach((item) => {
			const patientDataToAdd = patientsData.find(patient => patient.name === item?.meta?.subject);
			const itemKeys = Object.keys(item);
			const patientKeys = patientDataToAdd ? Object.keys(patientDataToAdd) : [];
			const metadataToAdd = {};
			itemKeys.forEach((itemKey) => {
				metadataToAdd[itemKey] = item[itemKey];
			});
			patientKeys.forEach((patientKey) => {
				metadataToAdd[`patient-${patientKey}`] = patientDataToAdd[patientKey];
			});
			metadataTableData.push(metadataToAdd);
		});
		this._metadataTableDataCollection.parse(metadataTableData);
		npdataTableModel.setMetadata(metadataTableData);

		const selectionId = utils.getDataviewSelectionId();
		const datatableState = this._metadataTable.getState();
		if (datatableState.sort) {
			this._itemsDataCollection.sort(datatableState.sort.id, datatableState.sort.dir);
		}
		if (selectionId && selectionId !== constants.DEFAULT_DATAVIEW_COLUMNS) {
			this._galleryDataviewYCountSelection.callEvent("onChange", [selectionId]);
		}

		this._setFilesToLargeImage();
		metadataTableModel.refreshDatatableColumns();
	}

	_getStyleParamsOfThumbnailPreview(data) {
		let styleParamsString = null;
		const {THUMBNAIL_URLS} = constants;

		// eslint-disable-next-line no-restricted-syntax
		for (let url of THUMBNAIL_URLS) {
			const styleParams = lodashObject.get(data, url);
			if (styleParams) {
				styleParamsString = isObject(styleParams)
					? encodeURIComponent(JSON.stringify(styleParams)) : styleParams;
				break;
			}
		}

		return styleParamsString;
	}

	// URL-NAV get folders and open it
	_urlChange() {
		this._folderNav.openFirstFolder();
	}

	_setGallerySelectedItemsFromLocalStorage() {
		selectDataviewItems.clearAll();
		const itemsArray = selectDataviewItems.getSelectedItemsFromLocalStorage();
		itemsArray.forEach((item) => {
			item.imageShown = false;
		});
		selectDataviewItems.add(itemsArray);
		if (selectDataviewItems.count()) {
			this._galleryDataview.callEvent("onCheckboxClicked", [selectDataviewItems.getSelectedImages(), true]);
		}
	}

	_setDataviewColumns(width, height) {
		this._galleryDataview.customize({
			width,
			height
		});
		// galleryImageUrl.clearPreviewUrls();
		// galleryImageUrl.clearPreviewLabelUrls();
		// galleryImageUrl.clearPreviewMacroImageUrl();
		utils.setDataviewItemDimensions(width, height);
		this._galleryDataview.refresh();
	}

	_checkForImageHeight(imageHeight) {
		if (imageHeight === 90) {
			return imageHeight + 10;
		}
		return imageHeight;
	}

	_setInitSettingsMouseEvents() {
		const settingsValues = utils
			.getLocalStorageSettingsValues() || utils.getDefaultMouseSettingsValues();
		viewMouseEvents
			.setMouseSettingsEvents(this._galleryDataview, this._metadataTable, settingsValues);
	}

	_setLastSelectedFolderId() {
		if (lastSelectedFolderId) {
			const lastSelectedFolderNode = this._finder.getItemNode(lastSelectedFolderId);
			if (lastSelectedFolderNode) webix.html.removeCss(lastSelectedFolderNode, "last-selected-folder");
		}

		const currentItemId = this._finder.getSelectedId();
		if (currentItemId) {
			const currentItem = this._finder.getItem(currentItemId);
			if (currentItem._modelType === "folder") {
				lastSelectedFolderId = currentItemId;
			}
		}
	}

	_highlightLastSelectedFolder() {
		const currentFolderId = this._finder.getSelectedId();
		// eslint-disable-next-line eqeqeq
		if (lastSelectedFolderId && lastSelectedFolderId != currentFolderId) {
			const lastItemNode = this._finder.getItemNode(lastSelectedFolderId);
			if (lastItemNode) webix.html.addCss(lastItemNode, "last-selected-folder");
		}
	}

	_toggleCartList(view) {
		if (view === "gallery") {
			const selectedItems = selectDataviewItems.getSelectedItemsFromLocalStorage();
			if (selectedItems.length) {
				this._cartViewButton.show();
				const buttonLabel = this._cartViewButton.config.label;
				if (buttonLabel === "Hide cart") this._view.$scope.getSubCartListView().showList();
			}
			else {
				this._view.$scope.getSubCartListView().hideList();
				this._cartViewButton.hide();
			}
		}
		else {
			this._view.$scope.getSubCartListView().hideList();
			this._cartViewButton.hide();
		}
	}

	_setFilesToLargeImage() {
		if (authService.isLoggedIn() && authService.getUserInfo().admin) {
			filesToLargeImage = this._galleryDataview.find((obj) => {
				let itemType = utils.searchForFileType(obj);
				if (!obj.largeImage) {
					if (itemType === "bmp" || itemType === "jpg" || itemType === "png" || itemType === "gif" || itemType === "tiff") {
						return obj;
					}
					return null;
				}
				return null;
			});
			viewMouseEvents.setFilesToLargeImage(filesToLargeImage);
			if (filesToLargeImage.length !== 0) {
				this._makeLargeImageButton.show();
			}
			else {
				this._makeLargeImageButton.hide();
			}
		}
	}

	_changeRecognitionResultsMode() {
		this._filterModel.clearFilters();
		if (isRecognitionResultMode) {
			const options = recognizedItemsModel.getValidOptions();
			const optionsList = this._recognitionResultsDropDown.getList();
			this._recognitionProgressTemplate.hide();
			this._recognitionResultsDropDown.setValue();
			optionsList.clearAll();
			optionsList.parse(options);
			this._recognitionResultsDropDown.setValue(options[0]);
			this._recognitionResultsDropDown.show();
			this._finder.unselectAll();
		}
		else {
			const optionsList = this._recognitionResultsDropDown.getList();
			this._recognitionResultsDropDown.hide();
			this._recognitionResultsDropDown.setValue();
			optionsList.clearAll();
			this._itemsDataCollection.clearAll();
			recognizedItemsModel.clearProcessedItems();
			recognizedItemsModel.setValidOptions();
		}
	}

	async _selectFinderItem(id) {
		const item = this._finder.getItem(id);
		const isCollapsed = item.link !== constants.EXPAND_LINK;
		this._finderFolder = item;
		const actionPanel = this._view.$scope.getSubDataviewActionPanelView();
		const multichannelViewCell = this._view.$scope.getSubMultichannelViewCell();
		if (!item.link) {
			actionPanel.scenesViewOptionToggle(item);
			await actionPanel.multichannelViewOptionToggle(item);
			actionPanel.caseViewOptionToggle(item);
		}
		else {
			const parentId = this._finder.getParentId(id);
			this._finderFolder = this._finder.getItem(parentId);
			this._loadLinearImages(parentId, isCollapsed);
			return;
		}
		if (item._modelType === "item" || !item._modelType) {
			this._itemsModel.selectedItem = item;
			this._itemsModel.parseDataToViews(item, false, item.id);
			this._highlightLastSelectedFolder();
			if (this._multiviewSwitcher.getList().exists(constants.MULTICHANNEL_VIEW_OPTION.id)) {
				multichannelViewCell.setImage(item);
			}
		}
		else if (item._modelType === "folder") {
			if (item?.meta?.isLinear) {
				this._loadLinearImages(id, isCollapsed);
			}
			else {
				this._itemsModel.selectedItem = item;
				this._finderModel.loadBranch(id, this._view)
					.then(() => {
						this._highlightLastSelectedFolder();
						this._folderNav.openNextFolder(item);
					});
			}
		}
		else if (item._modelType === constants.SUB_FOLDER_MODEL_TYPE) {
			webix.confirm({
				text: "The folder consists of a large amount of data. Continue?",
				type: "confirm-warning",
				cancel: "No",
				ok: "Yes"
			})
				.then(() => {
					this._itemsModel.openSubFolder(id);
				})
				.catch(() => {
					this._finder.select(item.$parent);
				});
		}
	}

	_getPositionFloat(obj) {
		return obj.starColor ? "left: 15px" : "right: 13px;";
	}

	_filterDataByName() {
		const value = this._galleryDataviewSearch.getValue();
		this._filterModel.addFilter("name", value, "text");
		const datatableFilter = this._metadataTable.getFilter("name");
		if (datatableFilter) {
			datatableFilter.value = value;
		}
	}

	_selectTableItemByDataview() {
		// select metadatatable item
		const id = this._galleryDataview.getSelectedId();
		if (id) {
			const metadataTableThumbnailsTemplate = webixViews.getMetadataTableThumbnailTemplate();
			this._metadataTable.blockEvent();
			this._metadataTable.select(id);
			this._metadataTable.showItem(id);
			const currentItem = this._metadataTable.getItem(id);
			metadataTableThumbnailsTemplate.parse(currentItem);
			this._metadataTable.unblockEvent();
		}
	}

	_selectDataviewItemByTable() {
		// select dataview item
		const id = this._metadataTable.getSelectedId();
		if (id) {
			this._scrollDataviewToItem(id);
			this._galleryDataview.select(id);
			this._galleryDataview.refresh();
		}
	}

	_scrollDataviewToItem(id) {
		const range = this._getVisibleRange();
		const pager = this._galleryDataviewPager;
		const pData = pager.data;
		// we can't use DOM method for not-rendered-yet items, so fallback to pure math
		let realIndex = this._galleryDataview.getIndexById(id);
		pager.select(parseInt(realIndex / pData.size));
		let ind;
		if (pData.page) {
			ind = realIndex - pData.size * pData.page;
		}
		let dy = Math.floor(ind / range._dx) * range._y;
		let state = this._galleryDataview.getScrollState();
		if (dy < state.y || dy + range._y >= state.y + this._galleryDataview._content_height) {
			this._galleryDataview.scrollTo(0, dy);
		}
	}

	_getVisibleRange() {
		const width = this._galleryDataview._content_width;

		const t = this._galleryDataview.type;
		let dx = Math.floor(width / t.width) || 1; // at least single item per row

		return {
			_y: t.height,
			_dx: dx
		};
	}

	_countFinderItems() {
		let items = Object.values(this._finder.data.pull);
		items = items.filter(item => item._modelType === "item" || !item._modelType);
		return items.length;
	}

	_getCurrentItemPreviewType() {
		let imageType;
		let getPreviewUrl;
		let setPreviewUrl;

		const imageViewerValue = this._galleryDataviewImageViewer.getValue();
		switch (imageViewerValue) {
			case constants.THUMBNAIL_DATAVIEW_IMAGES: {
				getPreviewUrl = galleryImageUrl.getPreviewImageUrl;
				setPreviewUrl = galleryImageUrl.setPreviewImageUrl;
				imageType = "thumbnail";
				break;
			}
			case constants.LABEL_DATAVIEW_IMAGES: {
				getPreviewUrl = galleryImageUrl.getLabelPreviewImageUrl;
				setPreviewUrl = galleryImageUrl.setPreviewLabelImageUrl;
				imageType = "images/label";
				break;
			}
			case constants.MACRO_DATAVIEW_IMAGES: {
				getPreviewUrl = galleryImageUrl.getPreviewMacroImageUrl;
				setPreviewUrl = galleryImageUrl.setPreviewMacroImageUrl;
				imageType = "images/macro";
				break;
			}
			default: {
				break;
			}
		}
		return {imageType, getPreviewUrl, setPreviewUrl};
	}

	async _collectionChangeHandler(collectionItem) {
		try {
			this.pendingCollectionChange = true;
			isRecognitionResultMode = false;
			this._changeRecognitionResultsMode();
			const actionPanel = this._view.$scope.getSubDataviewActionPanelView();
			actionPanel.scenesViewOptionToggle();
			actionPanel.multichannelViewOptionToggle();
			this._itemsModel.clearAll();
			this._itemsDataCollection.clearAll();
			this._metadataTemplate.setValues({});
			this._collapser.config.setClosedState();
			this._view.showProgress();
			const subcollectionData = await this._view.$scope.getSubFinderView()
				.loadTreeFolders(constants.FOLDER_PARENT_TYPES.COLLECTION, collectionItem._id);
			this._folderNav.openFirstFolder();
			let projectFolderMetadata = subcollectionData
				.find(folder => folder.name === constants.PROJECT_METADATA_FOLDER_NAME);
			const collectionFolders = projectMetadata.getCollectionFolders();
			// Clear collection folders before push folders from server
			projectMetadata.clearCollectionFolders();
			collectionFolders.push(...subcollectionData
				.filter(folder => folder._modelType === constants.MODEL_TYPE.FOLDER
					&& folder.name !== constants.PROJECT_METADATA_FOLDER_NAME));
			// projectMetadataCollection.clearAll();
			projectMetadata.clearProjectFolderMetadata();
			projectMetadata.clearWrongMetadata();
			if (projectFolderMetadata) {
				projectMetadataCollection.add(projectFolderMetadata);
				this._projectFolderWindowButton.show();
			}
			else {
				const newProjectMetadataFolder = {
					parentType: constants.FOLDER_PARENT_TYPES.COLLECTION,
					name: constants.PROJECT_METADATA_FOLDER_NAME,
					parentId: collectionItem._id
				};
				projectFolderMetadata = await ajaxActions.postNewFolder(newProjectMetadataFolder);
				if (projectFolderMetadata) {
					projectMetadataCollection.add(projectFolderMetadata);
					this._projectFolderWindowButton.show();
				}
				else {
					this._projectFolderWindowButton.hide();
				}
			}

			const projectMetadataContent = await this._view.$scope.getSubFinderView().loadTreeFolders(
				projectFolderMetadata._modelType,
				projectFolderMetadata._id
			);

			const validationSchemasFolder = projectMetadataContent
				.find(item => item.name === constants.VALIDATION_SCHEMAS_FOLDER_NAME);

			if (validationSchemasFolder) {
				projectMetadata.setProjectValidationSchemasFolder(validationSchemasFolder);
				const validationSchemasItems = await ajaxActions.getItems(validationSchemasFolder._id);
				validationSchemasItems.forEach(async (schema) => {
					const schemaBlob = await ajaxActions.getBlobFile(schema._id);
					const jsonSchema = schemaBlob?.json();
					if (jsonSchema) {
						validationSchemas.push(jsonSchema);
					}
				});
				validationSchemasFolder.meta?.folderAndSchemasMapping?.forEach((map) => {
					folderAndSchemasMapping.set(map.folderName, map.schemas);
				});
			}
			else {
				const newFolder = {
					name: constants.VALIDATION_SCHEMAS_FOLDER_NAME,
					parentId: projectFolderMetadata._id,
					parentType: projectFolderMetadata._modelType
				};
				const newValidationSchemasFolder = ajaxActions.postNewFolder(newFolder);
				projectMetadata.setProjectValidationSchemasFolder(newValidationSchemasFolder);
			}

			// TODO: think about folder name for patient data
			const schemaFolder = subcollectionData
				.find(folder => folder.name === constants.SCHEMA_METADATA_FOLDER_NAME);
			patientsDataCollection.clearAll();
			if (schemaFolder && schemaFolder._id && schemaFolder._modelType) {
				const schemafolderData = await this._view.$scope.getSubFinderView()
					.loadTreeFolders(schemaFolder._modelType, schemaFolder._id);
				const patientsDataFolder = schemafolderData
					.find(folder => folder.name === constants.PATIENTS_METADATA_FOLDER_NAME);
				if (patientsDataFolder) {
					patientsDataModel.setPatientsDataFolderId(patientsDataFolder);
					const patientsFolderData = await this._view.$scope.getSubFinderView()
						.getFolderItems(patientsDataFolder);
					patientsFolderData.forEach((patientData) => {
						patientsDataCollection.add(patientData);
					});
				}
			}
			utils.putHostsCollectionInLocalStorage(collectionItem);
			// define datatable columns
			metadataTableModel.refreshDatatableColumns();
			this._itemsModel.parseItems(subcollectionData);
			this.pendingCollectionChange = false;
			this._view.hideProgress();
		}
		catch (error) {
			this.pendingCollectionChange = false;
			this._view.hideProgress();
		}
	}

	linearStructureHandler(folderId, sourceParams, addBatch, isCollapsed) {
		const folder = this._finder.getItem(folderId);
		return ajaxActions.getLinearStructure(folder._id, sourceParams)
			.then((data) => {
				if (data.length === 0) {
					folder.linear = null;
					this._itemsModel.updateItems(this._finderFolder);
				}
				else if (folder.linear) {
					let finderElements;
					if (isCollapsed && !addBatch) {
						finderElements = data.slice(0, constants.COLLAPSED_ITEMS_COUNT);
						finderElements.push({link: constants.EXPAND_LINK});
					}
					else if (!addBatch) {
						finderElements = webix.copy(data);
						finderElements.push({link: constants.COLLAPSE_LINK});
					}
					if (finderElements) {
						this._itemsModel.parseItems(finderElements, folderId, data?.length);
					}
					this._itemsModel.parseDataToViews(webix.copy(data), addBatch, folderId);
					this._highlightLastSelectedFolder();

					if (data.length < sourceParams.limit) {
						const currentLinear = folder.linear;
						this._finder.updateItem(
							folderId,
							{linear: Object.assign(currentLinear, constants.LOADING_STATUSES.DONE)}
						);
					}
					else {
						const newParams = {
							sort: "lowerName",
							limit: constants.LINEAR_STRUCTURE_LIMIT,
							offset: this._itemsModel.getFolderCount(folder)
						};

						this.linearStructureHandler(folderId, newParams, true, isCollapsed);
					}
				}
			});
	}

	_closeThumbnailViewPanels() {
		const spacerForPager = this._view.$scope.getSubDataviewActionPanelView().getSpacerForPager();
		this._toggleCartList();
		spacerForPager.show();
		this._collapser.config.setClosedState();
		this._collapser.hide();
		this._galleryFeaturesView.hide();
	}

	_loadLinearImages(folderId, isCollapsed) {
		const sourceParams = {
			sort: "lowerName",
			limit: constants.LINEAR_STRUCTURE_LIMIT
		};
		if (this._finderFolder.hasOpened || this._finderFolder.open) {
			this._finder.close(folderId);
			this._itemsModel.findAndRemove(folderId, this._finderFolder);
		}
		this._finder.blockEvent();
		this._finder.data.blockEvent();
		this._setLastSelectedFolderId();
		this._finder.data.unblockEvent();
		this._finder.unblockEvent();
		this._folderNav.setFoldersIntoUrl();
		this._itemsModel.selectedItem = this._finderFolder;
		this._finderFolder.linear = Object.assign({}, constants.LOADING_STATUSES.IN_PROGRESS);
		this._itemsModel.updateItems(this._finderFolder);
		const addBatch = false;
		this.linearStructureHandler(folderId, sourceParams, addBatch, isCollapsed);
	}
}

export default MainService;
