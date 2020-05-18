import ajaxActions from "../ajaxActions";
import utils from "../../utils/utils";
import galleryImageUrl from "../../models/galleryImageUrls";
import ImageWindow from "../../views/subviews/gallery/windows/imageWindow";
import PdfViewerWindow from "../../views/subviews/gallery/windows/pdfViewerWindow";
import FinderContextMenu from "../../views/components/finderContextMenu";
import authService from "../authentication";
import selectDataviewItems from "../../models/selectGalleryDataviewItems";
import constants from "../../constants";
import finderModel from "../../models/finderModel";
import metadataTableModel from "../../models/metadataTableModel";
import nonImageUrls from "../../models/nonImageUrls";
import downloadFiles from "../../models/downloadFiles";
import modifiedObjects from "../../models/modifiedObjects";
import webixViews from "../../models/webixViews";
import GalleryDataviewContextMenu from "../../views/components/galleryDataviewContextMenu";
import galleryDataviewFilterModel from "../../models/galleryDataviewFilterModel";
import MakeLargeImageWindow from "../../views/subviews/dataviewActionPanel/windows/makeLargeImageWindow";
import RenamePopup from "../../views/components/renamePopup";
import projectMetadata from "../../models/projectMetadata";
import imagesTagsModel from "../../models/imagesTagsModel";
import ImagesTagsWindow from "../../views/subviews/cartList/windows/imagesTagsWindow/ImagesTagsWindow";
import ItemsModel from "../../models/itemsModel";
import RecognitionServiceWindow from "../../views/subviews/finder/windows/recognitionServiceWindow";
import EmptyDataViewsService from "../views/emptyDataViews";
import viewMouseEvents from "../../utils/viewMouseEvents";
import recognizedItemsModel from "../../models/recognizedItems";
import FilterModel from "../../models/filterModel";
import editableFoldersModel from "../../models/editableFoldersModel";
import FolderNav from "../folderNav";

let contextToFolder;
let scrollEventId;
let lastSelectedFolderId;
const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
const imagesTagsCollection = imagesTagsModel.getImagesTagsCollection();
let filesToLargeImage = [];
let isRecognitionResultMode;

class MainService {
	constructor(view, hostBox, collectionBox, multiviewSwitcher, galleryDataviewPager, galleryDataview, metadataTable, finder, metadataTemplate, collapser, metadataPanelScrollView, cartList) {
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
		this._ready();
	}

	_ready() {
		const scrollPosition = this._finder.getScrollState();
		webix.extend(this._view, webix.ProgressBar);
		this._metadataPanelScrollView.hide();

		const metadataTableCell = this._view.$scope.getSubMetadataTableView().getRoot();
		const galleryDataviewCell = this._view.$scope.getSubGalleryView().getRoot();

		this._imageWindow = this._view.$scope.ui(ImageWindow);
		this._selectImagesTemplate = this._view.$scope.getSubGalleryView().getSelectImagesTemplate();
		this._pdfViewerWindow = this._view.$scope.ui(PdfViewerWindow);
		// this._setImagesTagsWindow = this._view.$scope.ui(ImagesTagsWindow);
		this._finderCountTemplate = this._finder.$scope.getTreeCountTemplate();
		this._finderContextMenu = this._view.$scope.ui(FinderContextMenu).getRoot();
		this._cartViewButton = this._view.$scope.getSubDataviewActionPanelView().getCartButton();
		this._downloadingMenu = this._view.$scope.getSubCartListView().getDownloadingMenu();
		this._galleryDataviewYCountSelection = this._view.$scope.getSubGalleryFeaturesView().getDataviewYCountSelection();
		this._galleryDataviewContextMenu = this._view.$scope.ui(GalleryDataviewContextMenu).getRoot();
		this._galleryDataviewRichselectFilter = this._view.$scope.getSubGalleryFeaturesView().getFilterBySelectionView();
		this._showMetadataWindowButton = this._view.$scope.getSubMetadataPanelView().getShowAddMetadataWindowButton();
		this._galleryDataviewSearch = this._view.$scope.getSubGalleryFeaturesView().getFilterByNameView();
		this._makeLargeImageWindow = this._view.$scope.ui(MakeLargeImageWindow);
		this._makeLargeImageButton = this._view.$scope.getSubGalleryFeaturesView().getMakeLargeImageButton();
		this._renamePopup = this._view.$scope.ui(RenamePopup);
		this._tableTemplateCollapser = this._metadataTable.$scope.getTableTemplateCollapser();
		this._galleryDataviewImageViewer = this._view.$scope.getSubGalleryFeaturesView().getGalleryImageViewer();
		this._projectFolderWindowButton = this._view.$scope.getSubDataviewActionPanelView().getProjectFolderWindowButton();
		// this._createNewTagButton = this._view.$scope.getSubCartListView().getCreateNewTagButton();
		this._galleryFeaturesView = this._view.$scope.getSubGalleryFeaturesView().getRoot();
		this._filterTableView = this._view.$scope.getSubDataviewActionPanelView().getFilterTableView();
		this._recognitionStatusTemplate = this._view.$scope.getSubDataviewActionPanelView().getRecognitionProgressTemplate();
		this._itemsModel = new ItemsModel(this._finder);
		this._itemsDataCollection = this._itemsModel.getDataCollection();
		this._recognitionOptionsWindow = this._view.$scope.ui(RecognitionServiceWindow);
		this._recognitionProgressTemplate = this._view.$scope.getSubDataviewActionPanelView().getRecognitionProgressTemplate();
		this._recognitionResultsDropDown = this._view.$scope.getSubDataviewActionPanelView().getRecognitionOptionDropDown();
		this._filterModel = new FilterModel(this._itemsDataCollection);

		webixViews.setGalleryDataview(this._galleryDataview);
		webixViews.setMetadataTable(this._metadataTable);
		webixViews.setFinderView(this._finder);
		webixViews.setGalleryPager(this._galleryDataviewPager);
		webixViews.setMainView(this._view);
		webixViews.setImageWindow(this._imageWindow);
		webixViews.setPdfViewerWindow(this._pdfViewerWindow);
		webixViews.setGalleryDataviewContextMenu(this._galleryDataviewContextMenu);
		webixViews.setItemsModel(this._itemsModel);
		webixViews.setRenamePopup(this._renamePopup);
		webixViews.setMetadataTemplate(this._metadataTemplate);
		webixViews.setDataviewSearchInput(this._galleryDataviewSearch);

		this._folderNav = new FolderNav(this._view.$scope, this._finder);

		viewMouseEvents.setMakeLargeImageButton(this._makeLargeImageButton);

		this._galleryDataview.sync(this._itemsDataCollection);
		this._metadataTable.sync(this._itemsDataCollection);

		galleryDataviewFilterModel.setRichselectDataviewFilter(this._galleryDataviewRichselectFilter);
		// galleryDataviewFilterModel.setNameDataviewFilter(this._galleryDataviewSearch);
		this._filterTableView.getList().sync(this._galleryDataviewRichselectFilter.getList());
		this._filterTableView.bind(this._galleryDataviewRichselectFilter);

		this._view.$scope.getSubFinderView().setTreePosition(scrollPosition.x);

		const emptyDataViewsService = new EmptyDataViewsService(
			this._itemsDataCollection,
			this._galleryDataview,
			this._metadataTable,
			this._galleryDataviewPager,
			this._selectImagesTemplate
		);
		emptyDataViewsService.attachDataCollectionEvent();

		// disable context menu for webix elements
		this._metadataTable.getNode().addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});

		this._galleryDataview.getNode().addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});

		this._setInitSettingsMouseEvents();
		this._view.$scope.on(this._view.$scope.app, "change-event-settings", (values) => {
			utils.setMouseSettingsEvents(this._galleryDataview, this._metadataTable, values);
		});

		// to hide select lists after scroll
		document.body.addEventListener("scroll", () => {
			webix.callEvent("onClick", []);
		});

		this._galleryDataviewPager.attachEvent("onAfterRender", function () {
			const currentPager = this;
			const node = this.getNode();
			const inputNode = node.getElementsByClassName("pager-input")[0];

			inputNode.addEventListener("focus", function () {
				this.prev = this.value;
			});
			inputNode.addEventListener("keyup", function (e) {
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
			this._itemsDataCollection.sort(by, dir);
			return false;
		});

		// connecting pager to data view
		this._galleryDataview.define("pager", this._galleryDataviewPager);

		this._galleryDataview.define("template", (obj, common) => {
			let dataviewNewImageHeight = utils.getNewImageHeight();
			let dataviewNewItemWidth = utils.getDataviewItemWidth();
			let IMAGE_HEIGHT;
			let IMAGE_WIDTH;
			const {getPreviewUrl, setPreviewUrl, imageType} = this._getCurrentItemPreviewType();

			if (dataviewNewImageHeight) {
				IMAGE_HEIGHT = dataviewNewImageHeight - 10;
			}
			else {
				IMAGE_HEIGHT = 100;
			}
			if (dataviewNewItemWidth) {
				IMAGE_WIDTH = dataviewNewItemWidth;
			}
			else {
				IMAGE_WIDTH = 150;
			}
			const checkedClass = obj.markCheckbox ? "is-checked" : "";

			if (obj.largeImage && !getPreviewUrl(obj._id)) {
				if (getPreviewUrl(obj._id) === false) {
					if (this._galleryDataview.exists(obj.id) && !obj.imageWarning) {
						obj.imageWarning = true;
						this._galleryDataview.render(obj.id, obj, "update");
					}
				}
				else {
					ajaxActions.getImage(obj._id, imageType)
						.then((url) => {
							setPreviewUrl(obj._id, url);
							if (this._galleryDataview.exists(obj.id)) {
								this._galleryDataview.render(obj.id, obj, "update");
							}
						})
						.catch(() => {
							if (this._galleryDataview.exists(obj.id) && !obj.imageWarning) {
								obj.imageWarning = true;
								this._galleryDataview.render(obj.id, obj, "update");
							}
							setPreviewUrl(obj._id, false);
						});
				}
			}

			const warning = obj.imageWarning ? `<span class='webix_icon fas fa-exclamation-triangle warning-icon' style='${this._getPositionFloat(obj)}'></span>` : "";
			const starHtml = obj.starColor ? `<span class='webix_icon fa fa-star gallery-images-star-icon' style='color: ${obj.starColor}'></span>` : "";

			if (obj.imageWarning) {
				galleryDataviewFilterModel.addFilterValue("warning");
				galleryDataviewFilterModel.parseFilterToRichSelectList();
			}

			const bgIcon = getPreviewUrl(obj._id) ? `background: url(${nonImageUrls.getNonImageUrl(obj)}) center / auto 100% no-repeat;` : "";

			// const imageTagDiv = obj.tag ? this._getImagesTagDiv(obj, IMAGE_HEIGHT) : "<div></div>";
			return `<div class='unselectable-dataview-items'>
						<div class="gallery-images-container ${checkedClass}" style="height: ${utils.getNewImageHeight()}px">
									<div class="gallery-images-info">
										<div class="gallery-images-header">
											<div class="gallery-images-checkbox"> ${common.markCheckbox(obj, common)}</div>
											<div class="download-icon"><span class="webix_icon fa fa-download"></span></div>
										</div>
									</div>
							<div class="gallery-image-wrap" style="height: ${this._checkForImageHeight(IMAGE_HEIGHT)}px">
								${starHtml}
								${warning}
								<img style="${bgIcon}" height="${this._checkForImageHeight(IMAGE_HEIGHT)}" loading="lazy" src="${getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}" class="gallery-image">
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
			let viewToShow;
			if (value) {
				viewToShow = "metadataTable";
				metadataTableCell.show();
				this._collapser.config.setClosedState();
				this._collapser.hide();
				this._tableTemplateCollapser.show();
				this._filterTableView.show();
				this._galleryFeaturesView.hide();
				this._toggleCartList(viewToShow);
				// to fix bug with displaying data
				this._metadataTable.scrollTo(0, 0);
				this._selectTableItemByDataview();
			}
			else {
				viewToShow = "gallery";
				galleryDataviewCell.show();
				this._collapser.show();
				this._tableTemplateCollapser.hide();
				this._galleryDataviewPager.show();
				this._galleryFeaturesView.show();
				this._toggleCartList(viewToShow);
				this._selectDataviewItemByTable();
			}
		});

		this._finder.attachEvent("onBeforeSelect", () => {
			this._setLastSelectedFolderId();
		});

		this._finder.attachEvent("onBeforeOpen", (id) => {
			this._finder.select(id);
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
			let items = [];
			const folder = this._finder.getItem(id);
			if (folder.linear && !folder.hasOpened) {
				folder.linear = false;
				utils.findAndRemove(id, folder, items);
			}
			else if (!folder.linear && folder.hasOpened) {
				if (!this._finder.getSelectedId(id)) {
					this._galleryDataviewPager.hide();
					this._itemsDataCollection.clearAll();
				}
			}

			if (lastSelectedFolderId) {
				const lastSelectedFolderNode = this._finder.getItemNode(lastSelectedFolderId);
				if (lastSelectedFolderNode) webix.html.removeCss(lastSelectedFolderNode, "last-selected-folder");
			}
			lastSelectedFolderId = id;
			this._highlightLastSelectedFolder();
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
								constants.UPLOAD_METADATA_MENU_ID
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
				let items = [];
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
						this._finder.detachEvent(scrollEventId);
						const sourceParams = {
							sort: "lowerName"
						};
						this._view.showProgress();
						finderModel.closePreviousLinearFolder();
						if (this._finderFolder.hasOpened || this._finderFolder.open) {
							utils.findAndRemove(folderId, this._finderFolder, items);
						}
						this._finder.blockEvent();
						this._finder.data.blockEvent();
						this._setLastSelectedFolderId();
						this._finder.select(folderId);
						this._finder.open(folderId);
						this._finder.data.unblockEvent();
						this._finder.unblockEvent();
						ajaxActions.getLinearStucture(this._finderFolder._id, sourceParams)
							.then((data) => {
								this._finderFolder.linear = true;

								if (data.length === 0) {
									this._finder.parse({
										name: "Nothing to display", parent: folderId
									});
								}
								else {
									this._itemsModel.parseItems(webix.copy(data), folderId);
									finderModel.setRealScrollPosition(finderModel.defineSizesAndPositionForDynamicScroll(this._finderFolder));

									scrollEventId = this._finder.attachEvent("onAfterScroll", () => {
										const positionX = this._view.$scope.getSubFinderView().getTreePositionX();
										const scrollState = this._finder.getScrollState();
										if (positionX !== scrollState.x) {
											this._view.$scope.getSubFinderView().setTreePosition(scrollState.x);
											return false;
										}
										finderModel.attachOnScrollEvent(scrollState, this._finderFolder, this._view, this._filterModel);
									});

									utils.parseDataToViews(webix.copy(data));
									this._highlightLastSelectedFolder(this._finderFolder._id);
								}
								this._view.hideProgress();
							})
							.catch(() => {
								this._finder.parse({name: "error"});
								this._view.hideProgress();
							});
						break;
					}
					case constants.RENAME_FILE_CONTEXT_MENU_ID: {
						this._finder.edit(itemId);
						break;
					}
					case constants.REFRESH_FOLDER_CONTEXT_MENU_ID: {
						if (this._finderFolder.hasOpened || this._finderFolder.open) {
							this._finder.close(folderId);
							utils.findAndRemove(folderId, this._finderFolder, items);
						}
						this._finder.select(folderId);
						break;
					}
					case constants.RUN_RECOGNITION_SERVICE: {
						const dataviewItems = this._galleryDataview
							.serialize()
							.filter(item => item.largeImage && (item.folderId === this._finderFolder._id || !item._modelType));
						this._recognitionOptionsWindow.setItemsToRecognize(dataviewItems);
						this._recognitionOptionsWindow.showWindow(this._finder, this._finderFolder, this._galleryDataview, this._recognitionStatusTemplate);
						break;
					}
					case constants.UPLOAD_METADATA_MENU_ID: {
						this._finder.select(folderId);
						webix.delay(() => {
							this._view.$scope.app.show(`${constants.APP_PATHS.UPLOAD_METADATA}/${this._view.$scope.getParam("folders") || ""}`);
						}, 100);
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
						if (!this._finderItem) {
							this._finderItem = this._finder.find(finderItem => finderItem._id === item._id, true);
						}
						else if (!item) {
							item = this._galleryDataview.find(galleryItem => galleryItem._id === this._finderItem._id, true);
						}
						const cartListItem = this._cartList.find(cartItem => cartItem._id === item._id, true);
						ajaxActions.putNewItemName(this._finderItem._id, newValue)
							.then((updatedItem) => {
								this._finder.updateItem(this._finderItem.id, updatedItem);
								this._galleryDataview.updateItem(item.id, updatedItem);
								if (cartListItem) {
									this._cartList.updateItem(cartListItem.id, updatedItem);
									const cartData = this._cartList.serialize(true);
									utils.putSelectedItemsToLocalStorage(cartData);
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
								this._finder.updateItem(this._finderItem.id, this._finderItem);
								this._galleryDataview.updateItem(item.id, item);
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
			items.forEach((item) => {
				this._galleryDataview.find((obj) => {
					if (obj._id === item._id) {
						item.id = obj.id;
						webix.dp(this._finder).ignore(() => {
							this._galleryDataview.updateItem(item.id, item);
						});
					}
				});
			});
			if (utils.isObjectEmpty(this._cartList.data.pull) && value) {
				this._cartViewButton.callEvent("onItemClick", ["checkboxClicked"]);
			}
			if (items.length === 1) {
				if (items[0].markCheckbox) {
					this._cartList.add(items[0]);
				}
				else if (!items[0].markCheckbox && utils.findItemInList(items[0]._id, this._cartList)) {
					this._cartList.callEvent("onDeleteButtonClick", [items[0]]);
				}
			}
			else if (items.length > 1) {
				if (value) {
					this._cartList.parse(items);
				}
				else {
					if (unselectAll) {
						this._cartList.clearAll();
					}
					else {
						items.forEach((item) => {
							this._cartList.remove(item.id);
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
			if (obj.largeImage && !galleryImageUrl.getPreviewImageUrl(obj._id)) {
				if (galleryImageUrl.getPreviewImageUrl(obj._id) === false) {
					if (this._cartList.exists(obj.id) && !obj.imageWarning) {
						obj.imageWarning = true;
						this._cartList.render(obj.id, obj, "update");
					}
				}
				else {
					ajaxActions.getImage(obj._id, "thumbnail")
						.then((url) => {
							galleryImageUrl.setPreviewImageUrl(obj._id, url);
							if (this._cartList.exists(obj.id)) {
								this._cartList.render(obj.id, obj, "update");
							}
						})
						.catch(() => {
							if (this._cartList.exists(obj.id) && !obj.imageWarning) {
								obj.imageWarning = true;
								this._cartList.render(obj.id, obj, "update");
							}
							galleryImageUrl.setPreviewImageUrl(obj._id, false);
						});
				}
			}
			return `<div>
						<span class='webix_icon fas ${utils.angleIconChange(obj)}' style="color: #6E7480;"></span>
						<div style='float: right'>${common.deleteButton(obj, common)}</div>
 						<div class='card-list-name'>${obj.name}</div>
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
			const value = 0;
			let item;
			let dataviewItem = this._galleryDataview.getItem(id);
			let listItem = this._cartList.getItem(id);
			if (dataviewItem) {
				item = dataviewItem;
				item.markCheckbox = value;
				this._galleryDataview.updateItem(id, item);
			}
			else {
				item = listItem;
				this._galleryDataview.find((obj) => {
					if (obj._id === item._id) {
						obj.markCheckbox = value;
						this._galleryDataview.updateItem(obj.id, obj);
					}
				});
			}
			selectDataviewItems.remove(item._id);
			this._cartList.find((obj) => {
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
		});

		this._cartList.attachEvent("onAfterRender", () => {
			if (modifiedObjects.count() > 0) {
				modifiedObjects.getObjects().forEach((obj) => {
					let itemNode = this._cartList.getItemNode(obj.id);
					let listTextNode = itemNode.firstChild.children[2];
					itemNode.setAttribute("style", "height: 140px !important; color: #0288D1;");
					listTextNode.setAttribute("style", "margin-left: 17px; width: 110px !important;");
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
					this._recognitionOptionsWindow.showWindow(this._finder, null, this._galleryDataview, this._recognitionStatusTemplate);
					break;
				}
				// case constants.ADD_TAG_TO_IMAGES_MENU_ID: {
				// 	const windowAction = "set";
				// 	this._setImagesTagsWindow.showWindow(windowAction, imagesTagsCollection, this._cartList);
				// }
			}
		});

		this._finder.attachEvent("onAfterRender", () => {
			const treeWidth = this._finder.$width;
			const dataviewMinWidth = this._galleryDataview.config.minWidth;
			this._minCurrentTargenInnerWidth = dataviewMinWidth + treeWidth;
		});

		const dataviewSelectionId = utils.getDataviewSelectionId() || constants.DEFAULT_DATAVIEW_COLUMNS;
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

		this._itemsDataCollection.attachEvent("onAfterLoad", () => {
			const dataviewSelectionId = utils.getDataviewSelectionId();
			const datatableState = this._metadataTable.getState();
			if (datatableState.sort) {
				this._itemsDataCollection.sort(datatableState.sort.id, datatableState.sort.dir);
			}
			if (dataviewSelectionId && dataviewSelectionId !== constants.DEFAULT_DATAVIEW_COLUMNS) {
				this._galleryDataviewYCountSelection.callEvent("onChange", [dataviewSelectionId]);
			}

			this._setFilesToLargeImage();

			this._galleryDataview.data.each((obj) => {
				if (selectDataviewItems.isSelected(obj._id) && !obj.markCheckbox) {
					obj.markCheckbox = 1;
					this._galleryDataview.updateItem(obj.id, obj);
				}
			});

			const datatableColumns = metadataTableModel.getColumnsForDatatable(this._metadataTable);
			this._metadataTable.refreshColumns(datatableColumns);
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
					if (this._metadataTable.getColumnConfig(config.columnId).filterTypeValue === constants.FILTER_TYPE_DATE) {
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

		// this._createNewTagButton.attachEvent("onItemClick", () => {
		// 	const windowAction = "create";
		// 	this._setImagesTagsWindow.showWindow(windowAction, imagesTagsCollection);
		// });

		this._recognitionProgressTemplate.define("onClick", {
			fas: () => {
				const statusObj = this._recognitionProgressTemplate.getValues();
				if (statusObj.value !== constants.RECOGNITION_STATUSES.IN_PROGRESS.value) {
					webix.confirm({
						text: "Are you sure you want to show results?",
						type: "confirm-warning",
						ok: "Yes",
						cancel: "No",
						callback: (result) => {
							if (result) {
								switch (statusObj.value) {
									case constants.RECOGNITION_STATUSES.WARNS.value:
									case constants.RECOGNITION_STATUSES.DONE.value: {
										isRecognitionResultMode = true;
										this._changeRecognitionResultsMode();
										break;
									}
									case constants.RECOGNITION_STATUSES.ERROR.value: {
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

	// URL-NAV get host and collection from URL params and select it
	_urlChange(view, url) {
		this._folderNav.openFirstFolder();
	}

	_setGallerySelectedItemsFromLocalStorage() {
		selectDataviewItems.clearAll();
		const itemsArray = utils.getSelectedItemsFromLocalStorage();
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

	// _getImagesTagDiv(obj, imageHeight) {
	// 	let iconsDivLeft = "";
	// 	let iconsDivRight = "";
	//
	// 	const itemContainerHeight = 20;
	// 	const tagKeys = Object.keys(obj.tag);
	// 	const tagsImageId = imagesTagsCollection.getLastId();
	// 	const tagsImage = imagesTagsCollection.getItem(tagsImageId);
	// 	const maxTagsOnSide = Math.round(imageHeight/itemContainerHeight - 2);
	// 	const maxTagsOnItem = maxTagsOnSide * 2;
	//
	// 	tagKeys.forEach((tagKey, tagIndex) => {
	// 		for (let tagsImageKey in tagsImage) {
	// 			if (tagsImageKey === tagKey) {
	// 				if (Array.isArray(tagsImage[tagsImageKey]) && tagIndex < maxTagsOnItem) {
	// 					let foundObjectIcon = tagsImage[tagsImageKey].find(obj => obj.tagIcon);
	// 					if (tagIndex < maxTagsOnSide) {
	// 						iconsDivLeft+= `<div style="height: ${itemContainerHeight}px;">
	// 										<span class="webix_icon fa fa-${foundObjectIcon.tagIcon} tag-align-left"></span>
	// 									</div>`;
	// 					} else {
	// 						if (obj.starColor && obj.starColor.length > 0 && (tagIndex >= maxTagsOnSide - 1)) {
	// 							break;
	// 						}
	// 						iconsDivRight+= `<div style="height: ${itemContainerHeight}px;">
	// 										<span class="webix_icon fa fa-${foundObjectIcon.tagIcon} tag-align-right"></span>
	// 									</div>`;
	// 					}
	// 				} else {
	// 					break;
	// 				}
	// 			}
	// 		}
	// 	});
	//
	// 	return `<div style='float: left'>${iconsDivLeft}</div>
	// 	        <div style='float: right'>${iconsDivRight}</div>`;
	// }

	_setInitSettingsMouseEvents() {
		const settingsValues = utils.getLocalStorageSettingsValues() || utils.getDefaultMouseSettingsValues();
		utils.setMouseSettingsEvents(this._galleryDataview, this._metadataTable, settingsValues);
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
		if (lastSelectedFolderId) {
			const lastItemNode = this._finder.getItemNode(lastSelectedFolderId);
			if (lastItemNode) webix.html.addCss(lastItemNode, "last-selected-folder");
		}
	}

	_toggleCartList(view) {
		if (view === "gallery") {
			const selectedItems = utils.getSelectedItemsFromLocalStorage();
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
		else if (view === "metadataTable") {
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
				}
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

	_selectFinderItem(id) {
		const item = this._finder.getItem(id);
		if (item._modelType === "item" || !item._modelType) {
			utils.parseDataToViews(item);
			this._highlightLastSelectedFolder();
		}
		else if (item._modelType === "folder") {
			finderModel.loadBranch(id, this._view)
				.then(() => {
					this._highlightLastSelectedFolder();
					this._folderNav.openNextFolder(item);
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
		let realIndex = this._galleryDataview.getIndexById(id); // we can't use DOM method for not-rendered-yet items, so fallback to pure math
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

	_collectionChangeHandler(collectionItem) {
		this.pendingCollectionChange = true;
		this._filterModel.clearFilters();
		isRecognitionResultMode = false;
		this._changeRecognitionResultsMode();
		this._itemsModel.clearAll();

		this._itemsDataCollection.clearAll();
		this._metadataTemplate.setValues({});
		this._collapser.config.setClosedState();
		this._view.showProgress();
		this._view.$scope.getSubFinderView()
			.loadTreeFolders("collection", collectionItem._id)
			.then((data) => {
				this._folderNav.openFirstFolder();
				const projectMetadataFolder = data.find(folder => folder.name === constants.PROJECT_METADATA_FOLDER_NAME);
				projectMetadataCollection.clearAll();
				projectMetadata.clearWrongMetadata();
				if (projectMetadataFolder) {
					projectMetadataCollection.add(projectMetadataFolder);
					this._projectFolderWindowButton.show();
				}
				else {
					this._projectFolderWindowButton.hide();
				}
				utils.putHostsCollectionInLocalStorage(collectionItem);
				// define datatable columns
				const datatableColumns = metadataTableModel.getColumnsForDatatable(this._metadataTable);
				this._metadataTable.refreshColumns(datatableColumns);
				this._itemsModel.parseItems(data);
				this.pendingCollectionChange = false;
				this._view.hideProgress();
			})
			.catch(() => {
				this.pendingCollectionChange = false;
				this._view.hideProgress();
			});
	}
}

export default MainService;
