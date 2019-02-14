import ajaxActions from "../ajaxActions";
import utils from "../../utils/utils";
import galleryImageUrl from "../../models/galleryImageUrls";
import ImageWindow from "../../views/parts/imageWindow/imageWindow";
import NonModalWindow from "../../views/parts/nonModalWindow";
import ContextMenu from "../../views/components/treeContextMenu";
import authService from "../authentication";
import selectDataviewItems from "../../models/selectDataviewItems";
import constants from "../../constants";
import treeModel from "../../models/treeview";
import datatableModel from "../../models/datatable";
import nonImageUrls from "../../models/nonImageUrls";
import downloadFiles from "../../models/downloadFiles";
import helpingFunctions from "../../models/helpingFunctions";
import modifiedObjects from "../../models/modifiedObjects";
import dataViews from "../../models/dataViews";
import DatatableContextMenu from "../../views/components/datatableContextMenu";
import DataviewContextMenu from "../../views/components/dataviewContextMenu";
import dataviewFilterModel from "../../models/dataviewFilterModel";
import MakeLargeImageWindow from "../../views/parts/makeLargeImageWindow/makeLargeImageWindow";
import RenamePopup from "../../views/components/renamePopup";
import projectMetadata from "../../models/projectMetadata";
import imagesTagsModel from "../../models/imagesTagsModel";
import ImagesTagsWindow from "../../views/cartView/imagesTagsWindow/ImagesTagsWindow";

let contextToFolder;
const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
const imagesTagsCollection = imagesTagsModel.getImagesTagsCollection();

class MainService {
	constructor(view, hostBox, collectionBox, switcher, pager, dataview, datatable, tree, metaTemplate, collapser, scrollview, cartList) {
		this._view = view;
		this._hostBox = hostBox;
		this._collectionBox = collectionBox;
		this._switcher = switcher;
		this._pager = pager;
		this._dataview = dataview;
		this._datatable = datatable;
		this._tree = tree;
		this._metaTemplate = metaTemplate;
		this._collapser = collapser;
		this._scrollview = scrollview;
		this._cartList = cartList;
		this._ready();
	}

	_ready() {
		let filesToLargeImage = [];

		const scrollPosition = this._tree.getScrollState();
		webix.extend(this._view, webix.ProgressBar);
		this._scrollview.hide();
		this._setValueAndParseData();

		dataViews.setDataview(this._dataview);
		dataViews.setDatatable(this._datatable);
		dataViews.setTreeview(this._tree);
		dataViews.setPagerView(this._pager);
		dataViews.setMainView(this._view);

		const datatableCell = this._view.$scope.getSubDataView().getDatatableCell();
		const dataviewCell = this._view.$scope.getSubDataView().getDataviewCell();

		this._imageWindow = this._view.$scope.ui(ImageWindow);
		this._selectImagesTemplate = this._view.$scope.getSubDataView().getSelectImagesTemplate();
		this._nonModalWindow = this._view.$scope.ui(NonModalWindow);
		this._setImagesTagsWindow = this._view.$scope.ui(ImagesTagsWindow);
		this._contextMenu = this._view.$scope.ui(ContextMenu).getRoot();
		this._cartViewButton = this._view.$scope.getSubPagerAndSwitcherView().getCartButton();
		this._downloadingMenu = this._view.$scope.getSubCartView().getDownloadingMenu();
		this._dataviewYCountSelection = this._view.$scope.getSubGalleryFeaturesView().getDataviewYCountSelection();
		this._datatableContextMenu = this._view.$scope.ui(DatatableContextMenu).getRoot();
		this._dataviewContextMenu = this._view.$scope.ui(DataviewContextMenu).getRoot();
		this._dataviewRichselectFilter = this._view.$scope.getSubGalleryFeaturesView().getFilterBySelectionView();
		this._showMetadataWindowButton = this._view.$scope.getSubMetadataView().getShowAddMetadataWindowButton();
		this._dataviewSearch = this._view.$scope.getSubGalleryFeaturesView().getFilterByNameView();
		this._makeLargeImageWindow = this._view.$scope.ui(MakeLargeImageWindow);
		this._makeLargeImageButton = this._view.$scope.getSubGalleryFeaturesView().getMakeLargeImageButton();
		this._renamePopup = this._view.$scope.ui(RenamePopup);
		this._tableTemplateCollapser = this._dataview.$scope.getTableTemplateCollapser();
		this._makeLargeImageButtonLayout = this._view.$scope.getSubGalleryFeaturesView().getMakeLargeImageButtonLayout();
		this._galleryImageViewer = this._view.$scope.getSubGalleryFeaturesView().getGalleryImageViewer();
		this._projectFolderWindowButton = this._view.$scope.getSubPagerAndSwitcherView().getProjectFolderWindowButton();
		this._createNewTagButton = this._view.$scope.getSubCartView().getCreateNewTagButton();

		dataviewFilterModel.setRichselectDataviewFilter(this._dataviewRichselectFilter);

		this._view.$scope.getSubTreeView().setTreePosition(scrollPosition.x);

		this._pager.attachEvent("onAfterRender", function () {
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

		// connecting pager to data view
		this._dataview.define("pager", this._pager);

		this._dataview.define("template", (obj, common) => {
			let dataviewNewImageHeight = utils.getNewImageHeight();
			let dataviewNewItemWidth = utils.getDataviewItemWidth();
			let IMAGE_HEIGHT;
			let IMAGE_WIDTH;
			let getPreviewUrl;
			let setPreviewUrl;
			let imageType;

			if (dataviewNewImageHeight) {
				IMAGE_HEIGHT = dataviewNewImageHeight - 10;
			} else {
				IMAGE_HEIGHT = 100;
			}
			if (dataviewNewItemWidth) {
				IMAGE_WIDTH = dataviewNewItemWidth;
			} else {
				IMAGE_WIDTH = 150;
			}
			const checkedClass = obj.markCheckbox ? "is-checked" : "";
			const starHtml = obj.starColor ? `<span class='webix_icon fa-star gallery-images-star-icon' style='color: ${obj.starColor}'></span>` : "";
			const imageViewerValue = this._galleryImageViewer.getValue();
			switch(imageViewerValue) {
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
			}

			if (obj.largeImage) {
				if (typeof getPreviewUrl(obj._id) === "undefined") {
					setPreviewUrl(obj._id, "");
					// to prevent sending query more than 1 times
					ajaxActions.getImage(obj._id, IMAGE_HEIGHT, IMAGE_WIDTH, imageType)
						.then((data) => {
							if (data.type === "image/jpeg") {
								setPreviewUrl(obj._id, URL.createObjectURL(data));
								this._dataview.refresh();
							}
						});
				}
			}

			const imageTagDiv = obj.tag ? this._getImagesTagDiv(obj, IMAGE_HEIGHT) : "<div></div>";
			return `<div class='unselectable-dataview-items'>
						<div class="gallery-images-container ${checkedClass}" style="height: ${utils.getNewImageHeight()}px">
									<div class="gallery-images-info">
										<div class="gallery-images-header">
											<div class="gallery-images-checkbox"> ${common.markCheckbox(obj, common)}</div>
											<div class="download-icon"><span class="webix_icon fa-download"></span></div>
										</div>
										${imageTagDiv}
									</div>
							${starHtml}
							<img src="${getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}" class="gallery-image" style="height: ${this._checkForImageHeight(IMAGE_HEIGHT)}px">
						</div>
						<div class="thumbnails-name">${obj.name}</div>
					</div>`;
		});

		// setting onChange event for hosts
		this._hostBox.attachEvent("onChange", (newId, oldId) => {
			if (newId !== oldId) {
				webix.confirm({
					title: "Attention!",
					text: "Are you sure you want to change host? All data will be cleared.",
					callback: (result) => {
						if (result) {
							this._putValuesAfterHostChange(newId);
							this._view.$scope.app.refresh();
						} else {
							this._hostBox.blockEvent();
							this._hostBox.setValue(oldId);
							this._hostBox.unblockEvent();
						}
					}
				});
			}
		});

		// setting onChange event for collection
		this._collectionBox.attachEvent("onChange", (id) => {
			this.collectionItem = this._collectionBox.getList().getItem(id);
			this._tree.clearAll();
			this._dataview.clearAll();
			this._datatable.clearAll();
			this._view.showProgress();
			this._view.$scope.getSubTreeView()
				.loadTreeFolders("collection", this.collectionItem._id)
				.then((data) => {
					const projectMetadataFolder = data.find(folder => folder.name === constants.PROJECT_METADATA_FOLDER_NAME);
					projectMetadataCollection.clearAll();
					projectMetadata.clearWrongMetadata();
					if (projectMetadataFolder) {
						projectMetadataCollection.add(projectMetadataFolder);
						this._projectFolderWindowButton.show();
					} else {
						this._projectFolderWindowButton.hide();
					}
					helpingFunctions.putHostsCollectionInLocalStorage(this.collectionItem);
					// define datatable columns
					const datatableColumns = datatableModel.getColumnsForDatatable(this._datatable);
					this._datatable.refreshColumns(datatableColumns);
					this._tree.parse(data);
					this._view.hideProgress();
				})
				.fail(() => {
					this._view.hideProgress();
				});

		});

		// switching between data table and data view
		this._switcher.attachEvent("onChange", (value) => {
			if (value) {
				datatableCell.show();
				this._collapser.hide();
				this._scrollview.hide();
				this._tableTemplateCollapser.show();
			} else {
				dataviewCell.show();
				this._collapser.show({closed: true});
				this._tableTemplateCollapser.hide();
			}
		});

		this._tree.attachEvent("onBeforeOpen", (id) => {
			this._tree.blockEvent();
			this._tree.select(id);
			this._tree.unblockEvent();
			treeModel.loadBranch(id, this._view);
			return false;
		});


		//after opening the tree branch we fire this event
		this._tree.attachEvent("onAfterSelect", (id) => {
			const item = this._tree.getItem(id);
			if (item._modelType === "item") {
				helpingFunctions.parseDataToViews(item);
			} else if (item._modelType === "folder") {
				treeModel.loadBranch(id, this._view);
			}
		});

		this._tree.attachEvent("onAfterClose", (id) => {
			this._tree.unselect(id);
			let items = [];
			const folder  = this._tree.getItem(id);
			if (folder.linear && !folder.hasOpened) {
				folder.linear = false;
				helpingFunctions.findAndRemove(id, folder, items);
			} else if (!folder.linear && folder.hasOpened) {
				this._pager.hide();
				this._dataview.clearAll();
				this._datatable.clearAll();
			}
			helpingFunctions.showOrHideImageSelectionTemplate("hide", this._selectImagesTemplate);
		});

		// parsing data to metadata template next to data view
		this._dataview.attachEvent("onAfterSelect", (id) => {
			let item = this._dataview.getItem(id);
			this._metaTemplate.parse(item);
			if (authService.isLoggedIn() && authService.getUserInfo().admin) {
				this._showMetadataWindowButton.show();
			}
		});

		this._dataview.attachEvent("onItemDblClick", (id) => {
			let item = this._dataview.getItem(id);
			downloadFiles.openOrDownloadFiles(item, ajaxActions, utils, this._imageWindow, this._nonModalWindow);
		});

		this._datatable.attachEvent("onItemDblClick", (id) => {
			const item = this._datatable.getItem(id);
			downloadFiles.openOrDownloadFiles(item, ajaxActions, utils, this._imageWindow, this._nonModalWindow);
		});

		if (authService.isLoggedIn()) {
			this._contextMenu.attachTo(this._tree);

			this._tree.attachEvent("onBeforeContextMenu", (id) => {
				const item = this._tree.getItem(id);
				if (item._modelType === "folder") {
					if (authService.getUserInfo().admin) {
						this._contextMenu.clearAll();
						this._contextMenu.parse([
							constants.RENAME_CONTEXT_MENU_ID,
							{$template: "Separator"},
							constants.LINEAR_CONTEXT_MENU_ID
						]);
					} else {
						this._contextMenu.clearAll();
						this._contextMenu.parse(["Make linear structure"]);
					}
					contextToFolder = true;
					this.treeFolder = item;
				} else {
					if (authService.getUserInfo().admin) {
						this._contextMenu.clearAll();
						this._contextMenu.parse([constants.RENAME_FILE_CONTEXT_MENU_ID]);
						contextToFolder = false;
						this.treeItem = item;
					} else {
						return false;
					}
				}

			});

			this._contextMenu.attachEvent("onItemClick", (id) => {
				let items = [];
				let itemId;
				let folderId;
				const item = this._contextMenu.getItem(id);
				const value = item.value;
				if (contextToFolder) {
					folderId = this.treeFolder.id;
				} else {
					itemId = this.treeItem.id;
				}
				switch (value) {
					case constants.RENAME_CONTEXT_MENU_ID: {
						this._tree.edit(folderId);
						break;
					}
					case constants.LINEAR_CONTEXT_MENU_ID: {
						const sourceParams = {
							sort: "_id"
						};
						this._view.showProgress();
						if (this.treeFolder.hasOpened || this.treeFolder.open) {
							helpingFunctions.findAndRemove(folderId, this.treeFolder, items);
							this.treeFolder.hasOpened = false;
						}
						this._tree.blockEvent();
						this._tree.data.blockEvent();
						this._tree.select(folderId);
						this._tree.open(folderId);
						this._tree.data.unblockEvent();
						this._tree.unblockEvent();
						ajaxActions.getLinearStucture(this.treeFolder._id, sourceParams)
							.then((data) => {
								this.treeFolder.linear = true;
								if (data.length === 0) {
									this._tree.parse({
										name: "Nothing to display", parent: folderId
									});
								} else {
									this._tree.parse({
										data: webix.copy(data), parent: folderId
									});
									treeModel.setRealScrollPosition(
										treeModel.defineSizesAndPositionForDynamicScroll(this.treeFolder)
									);
									this._tree.attachEvent("onAfterScroll", () => {
										const positionX = this._view.$scope.getSubTreeView().getTreePositionX();
										const scrollState = this._tree.getScrollState();
										if (positionX !== scrollState.x) {
											this._view.$scope.getSubTreeView().setTreePosition(scrollState.x);
											return false;
										}
										treeModel.attachOnScrollEvent(scrollState, this.treeFolder, this._view, ajaxActions);
									});
									helpingFunctions.parseDataToViews(webix.copy(data));
								}
								this._view.hideProgress();
							})
							.fail(() => {
								this._tree.parse({name: "error"});
								this._view.hideProgress();
							});
						break;
					}
					case constants.RENAME_FILE_CONTEXT_MENU_ID: {
						this._tree.edit(itemId);
						break;
					}
				}

			});

			this._tree.attachEvent("onAfterEditStop", (values, object) => {
				const newValue = values.value;
				if (newValue !== values.old) {
					this._view.showProgress();
					if (contextToFolder && !object.inGallery) {
						ajaxActions.putNewFolderName(this.treeFolder._id, newValue)
							.then(() => {
								webix.message({
									text: "Folder name was successfully updated!",
								});
								this._tree.refresh();
								this._dataview.refresh();
								this._view.hideProgress();
							})
							.fail(() => {
								this.treeFolder.name = values.old;
								this._tree.refresh();
								this._dataview.refresh();
								this._view.hideProgress();
							});
					} else {
						ajaxActions.putNewItemName(this.treeItem._id, newValue)
							.then(() => {
								webix.message({
									text: "Item name was successfully updated!",
								});
								this._tree.refresh();
								this._dataview.refresh();
								this._view.hideProgress();
							})
							.fail(() => {
								this.treeItem.name = values.old;
								this._tree.refresh();
								this._dataview.refresh();
								this._view.hideProgress();
							});
					}
				}
			});
		}

		this._dataview.attachEvent("onCheckboxClicked", (items, value, unselectAll) => {
			if (!Array.isArray(items)) {
				items = [items];
			}
			items.forEach((item) => {
				this._dataview.find((obj) => {
					if (obj._id === item._id) {
						item.id = obj.id;
						webix.dp(this._tree).ignore(() => {
							this._dataview.updateItem(item.id, item);
						});
					}
				});
			});

			if (helpingFunctions.isObjectEmpty(this._cartList.data.pull) && value) {
				this._cartViewButton.callEvent("onItemClick", ["checkboxClicked"]);
			}
			if (items.length === 1) {
				if (items[0].markCheckbox) {
					this._cartList.add(items[0]);
				}
				else if (!items[0].markCheckbox && helpingFunctions.findItemInList(items[0]._id, this._cartList)) {
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
					} else {
						items.forEach((item) => {
							this._cartList.remove(item.id);
						});
					}

					if (helpingFunctions.isObjectEmpty(this._cartList.data.pull)) {
						this._view.$scope.getSubCartView().hideList();
						this._cartViewButton.hide();
					}
				}
			}
		});

		this._cartViewButton.attachEvent("onItemClick", (clicked) => {
			let label = this._cartViewButton.config.label;
			if ((!label || label === "Show Cart") && selectDataviewItems.count() > 0)  {
				this._view.$scope.getSubCartView().showList();
				this._cartViewButton.define("label", "Hide Cart");
				this._cartViewButton.refresh();
			} else if (label === "Hide Cart") {
				this._view.$scope.getSubCartView().hideList();
				this._cartViewButton.define("label", "Show Cart");
				this._cartViewButton.refresh();
			}
			if (clicked === "checkboxClicked") {
				this._cartViewButton.show();
			}
		});

		this._cartList.define("template", (obj, common) => {
			return `<div>
						<span class='webix_icon ${helpingFunctions.angleIconChange(obj)}' style="color: rgba(0, 0, 0, 0.8) !important;"></span>
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
			} else {
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
			let dataviewItem = this._dataview.getItem(id);
			let listItem = this._cartList.getItem(id);
			if (dataviewItem) {
				item = dataviewItem;
				item.markCheckbox = value;
				this._dataview.updateItem(id, item);
			} else {
				item = listItem;
				this._dataview.find((obj) => {
					if (obj._id === item._id) {
						obj.markCheckbox = value;
						this._dataview.updateItem(obj.id, obj);
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
			if (helpingFunctions.isObjectEmpty(this._cartList.data.pull)) {
				this._cartViewButton.callEvent("onItemClick");
				this._cartViewButton.hide();
			}
		});

		this._cartList.on_click["webix_icon"] = (e, id, node) => {
			let item = this._cartList.getItem(id);
			let itemNode = this._cartList.getItemNode(id);
			let listTextNode = itemNode.firstChild.children[2];
			if (!item.imageShown) {
				itemNode.setAttribute("style", "height: 140px !important; color: #0288D1;");
				listTextNode.setAttribute("style", "margin-left: 17px; width: 115px;");
				node.setAttribute("class", "webix_icon fa-angle-down");
				item.imageShown = true;
				modifiedObjects.add(item);
			} else {
				itemNode.setAttribute("style", "height: 30px !important; color: rgba(0, 0, 0, 0.8);");
				listTextNode.setAttribute("style", "margin-left: 12px; width: 125px;");
				node.setAttribute("class", "webix_icon fa-angle-right");
				item.imageShown = false;
				modifiedObjects.remove(item);
			}
		};

		this._cartList.attachEvent("onAfterRender", () => {
			if (modifiedObjects.count() > 0) {
				modifiedObjects.getObjects().forEach((obj) => {
					let itemNode = this._cartList.getItemNode(obj.id);
					let listTextNode = itemNode.firstChild.children[2];
					itemNode.setAttribute("style", "height: 140px !important; color: #0288D1;");
					listTextNode.setAttribute("style", "margin-left: 17px; width: 115px;");
				});
			}
		});

		this._downloadingMenu.attachEvent("onMenuItemClick", (id) => {
			let sourceParams = {
				resources: selectDataviewItems.getURIEncoded()
			};

			switch(id) {
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
					let objectsToCopy = this._cartList.find((obj) => {
						return obj;
					});
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
				case constants.ADD_TAG_TO_IMAGES_MENU_ID: {
					const windowAction = "set";
					this._setImagesTagsWindow.showWindow(windowAction, imagesTagsCollection, this._cartList);
				}
			}
		});

		this._tree.attachEvent("onAfterRender", () => {
			const treeWidth = this._tree.$width;
			const dataviewMinWidth = this._dataview.config.minWidth;
			this._minCurrentTargenInnerWidth = dataviewMinWidth + treeWidth;
		});

		let dataviewSelectionId = utils.getDataviewSelectionId();
		if (dataviewSelectionId && dataviewSelectionId !== constants.DEFAULT_DATAVIEW_COLUMNS) {
			this._dataviewYCountSelection.blockEvent();
			this._dataviewYCountSelection.setValue(dataviewSelectionId);
			this._dataviewYCountSelection.unblockEvent();
		}

		window.addEventListener("resize", (event) => {
			if (event.currentTarget.innerWidth >= this._minCurrentTargenInnerWidth) {
				const dataviewSelectionId = utils.getDataviewSelectionId();
				if (dataviewSelectionId && dataviewSelectionId !== constants.DEFAULT_DATAVIEW_COLUMNS) {
					this._dataviewYCountSelection.callEvent("onChange", [dataviewSelectionId]);
				}
			}
		});

		this._dataviewYCountSelection.attachEvent("onChange", (id) => {
			let newitemWidth;
			let newItemHeight;
			const previousItemWidth = this._dataview.type.width;
			const previousItemHeight = this._dataview.type.height;
			let multiplier = previousItemHeight / previousItemWidth;
			let dataviewWidth = this._dataview.$width;

			switch (id) {
				case constants.THREE_DATAVIEW_COLUMNS: {
					newitemWidth =  Math.round(dataviewWidth / 3) - 5;
					break;
				}
				case constants.FIVE_DATAVIEW_COLUMNS: {
					newitemWidth =  Math.round(dataviewWidth / 5) - 5;
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

		this._dataview.attachEvent("onAfterLoad", () => {
			helpingFunctions.showOrHideImageSelectionTemplate("show", this._selectImagesTemplate);
			let dataviewSelectionId = utils.getDataviewSelectionId();
			if (dataviewSelectionId && dataviewSelectionId !== constants.DEFAULT_DATAVIEW_COLUMNS) {
				this._dataviewYCountSelection.callEvent("onChange", [dataviewSelectionId]);
			}
			if (authService.isLoggedIn() && authService.getUserInfo().admin) {
				filesToLargeImage = this._dataview.find((obj) => {
					let itemType = helpingFunctions.searchForFileType(obj);
					if (!obj.largeImage) {
						if (itemType === "bmp" || itemType === "jpg" || itemType === "png" || itemType === "gif" || itemType === "tiff") {
							return obj;
						}
					}
				});
				if (filesToLargeImage.length !== 0) {
					this._makeLargeImageButtonLayout.show();
				} else {
					this._makeLargeImageButtonLayout.hide();
				}
			}

			this._dataview.data.each((obj) => {
				if (selectDataviewItems.isSelected(obj._id) && !obj.markCheckbox) {
					obj.markCheckbox = 1;
					this._dataview.updateItem(obj.id, obj);
				}
			});
		});

		this._datatable.attachEvent("onAfterEditStart", (infoObject) => {
			const columnId = infoObject.column;
			const editor = this._datatable.getEditor();
			const rowId = infoObject.row;
			const item = this._datatable.getItem(rowId);
			let editValue;

			if (item.hasOwnProperty("meta")) {
				editValue = datatableModel.getMetadataColumnValue(item, `meta.${columnId}`);
			}

			editor.setValue(editValue);
		});

		this._datatable.attachEvent("onBeforeEditStop", (values, obj) => {
			if (values.old !== values.value) {
				const columnId = obj.column;
				const rowId = obj.row;
				const itemToEdit = this._datatable.getItem(rowId);
				const copyOfAnItemToEdit = webix.copy(itemToEdit);
				const metadataTags = this._findMetadataTags(itemToEdit, columnId);
				if (metadataTags) {
					if (metadataTags.metaKey) {
						itemToEdit.meta[metadataTags.metaTag][metadataTags.metaKey] = values.value;
					}
					else {
						itemToEdit.meta[metadataTags.metaTag] = values.value;
					}
				}
				this._view.showProgress();
				ajaxActions.updateItemMetadata(itemToEdit._id, itemToEdit.meta)
					.then(() => {
						this._datatable.updateItem(rowId, itemToEdit);
						webix.message({
							text: `${columnId} column was successfully updated!`,
							expire: 2000
						});
						this._view.hideProgress();
					})
					.fail(() => {
						this._datatable.updateItem(rowId, copyOfAnItemToEdit);
						this._view.hideProgress();
					});
			}
		});

		if (authService.isLoggedIn()) {
			let columnId;
			let rowId;
			this._datatableContextMenu.attachTo(this._datatable);

			this._datatable.attachEvent("onBeforeContextMenu", (object) => {
				columnId = object.column;
				rowId = object.row;
				const columnConfig = this._datatable.getColumnConfig(columnId);
				if (!columnConfig.editor) {
					return false;
				}
			});

			this._datatableContextMenu.attachEvent("onItemClick", () => {
				this._datatable.edit({
					column: columnId,
					row: rowId
				});
			});
		}

		if (authService.isLoggedIn() && authService.getUserInfo().admin) {
			this._dataviewContextMenu.attachTo(this._dataview);
			let itemId;
			this._dataview.attachEvent("onBeforeContextMenu", (id) => {
				let item = this._dataview.getItem(id);
				let itemType = helpingFunctions.searchForFileType(item);
				if (item) {
					this.dataViewItem = item;
					this._dataviewContextMenu.clearAll();
					this._dataviewContextMenu.parse([constants.RENAME_FILE_CONTEXT_MENU_ID]);
					if (!item.largeImage) {
						this._dataviewContextMenu.parse([constants.MAKE_LARGE_IMAGE_CONTEXT_MENU_ID]);
						if (itemType === "bmp" || itemType === "jpg" || itemType === "png" || itemType === "gif" || itemType === "tiff") {
							itemId = item._id;
						}
					}
				} else {
					return false;
				}
			});

			this._dataviewContextMenu.attachEvent("onItemClick", (id) => {
				switch (id) {
					case constants.RENAME_FILE_CONTEXT_MENU_ID: {
						this.treeItem = this.dataViewItem;
						let itemClientRect = this._dataview.getItemNode(this.dataViewItem.id).getBoundingClientRect();
						let documentWidth = document.body.clientWidth;
						let oldName = this.dataViewItem.name;
						this._renamePopup.showPopup(itemClientRect, documentWidth, oldName);
						this._dataview.select(this.dataViewItem.id);
						break;
					}
					case constants.MAKE_LARGE_IMAGE_CONTEXT_MENU_ID: {
						this._view.showProgress();
						ajaxActions.makeLargeImage(itemId)
							.then(() => {
								this._dataview.refresh();
								this._view.hideProgress();
							})
							.fail(() => {
								this._view.hideProgress();
							});
						break;
					}
				}

			});
		}

		this._dataviewRichselectFilter.attachEvent("onChange", (value) => {
			dataviewFilterModel.filterData(this._dataview, value);
		});

		this._dataviewSearch.attachEvent("onChange", (value) => {
			dataviewFilterModel.filterByName(this._dataview, value);
		});

		this._makeLargeImageButton.attachEvent("onItemClick", () => {
			this._makeLargeImageWindow.showWindow(filesToLargeImage);
		});

		this._tree.getNode().addEventListener("contextmenu", (event) => {
			event.preventDefault();
			return false;
		}, false);

		this._dataview.getNode().addEventListener("contextmenu", (event) => {
			event.preventDefault();
			return false;
		}, false);

		this._galleryImageViewer.attachEvent("onChange", (newValue, oldValue) => {
			if (newValue !== oldValue) {
				this._dataview.refresh();
			}
		});

		this._createNewTagButton.attachEvent("onItemClick", () => {
			const windowAction = "create";
			this._setImagesTagsWindow.showWindow(windowAction, imagesTagsCollection);
		});
	}

	_putValuesAfterHostChange(hostId) {
		const hostBoxItem = this._hostBox.getList().getItem(hostId);
		const hostAPI = hostBoxItem.hostAPI;
		webix.storage.local.put("hostId", hostId);
		webix.storage.local.put("hostAPI", hostAPI);
	}

	// setting hosts value and parsing data to collection and tree
	_setValueAndParseData() {
		const localStorageHostId = webix.storage.local.get("hostId");
		const firstHostItemId = process.env.SERVER_LIST[0].id;
		const hostId =  localStorageHostId ? localStorageHostId : firstHostItemId;
		this._putValuesAfterHostChange(hostId);
		this._hostBox.setValue(hostId);
		this._view.$scope.getSubSelectView().parseCollectionData();
	}

	_setDataviewColumns(width, height) {
		this._dataview.customize({
			width: width,
			height: height
		});
		galleryImageUrl.clearPreviewUrls();
		galleryImageUrl.clearPreviewLabelUrls();
		galleryImageUrl.clearPreviewMacroImageUrl();
		utils.setDataviewItemDimensions(width, height);
		this._dataview.refresh();
	}

	_checkForImageHeight(imageHeight) {
		if (imageHeight === 90) {
			return imageHeight + 10;
		} else {
			return imageHeight;
		}
	}

	_findMetadataTags(itemToEdit, columnId) {
		let objectWithKeysToReturn;
		for (let key in itemToEdit.meta) {
			if (key === columnId) {
				return objectWithKeysToReturn = {
					metaTag: key
				};
			} else if (key !== columnId && typeof(itemToEdit.meta[key]) === "object") {
				for (let metaKey in itemToEdit.meta[key]) {
					if (metaKey === columnId) {
						return objectWithKeysToReturn = {
							metaTag: key,
							metaKey: metaKey
						};
					}
				}
			}
		}
	}

	_getImagesTagDiv(obj, imageHeight) {
		let iconsDivLeft = "";
		let iconsDivRight = "";

		const itemContainerHeight = 20;
		const tagKeys = Object.keys(obj.tag);
		const tagsImageId = imagesTagsCollection.getLastId();
		const tagsImage = imagesTagsCollection.getItem(tagsImageId);
		const maxTagsOnSide = Math.round(imageHeight/itemContainerHeight - 2);
		const maxTagsOnItem = maxTagsOnSide * 2;

		tagKeys.forEach((tagKey, tagIndex) => {
			for (let tagsImageKey in tagsImage) {
				if (tagsImageKey === tagKey) {
					if (Array.isArray(tagsImage[tagsImageKey]) && tagIndex < maxTagsOnItem) {
						let foundObjectIcon = tagsImage[tagsImageKey].find(obj => obj.tagIcon);
						if (tagIndex < maxTagsOnSide) {
							iconsDivLeft+= `<div style="height: ${itemContainerHeight}px;">
											<span class="webix_icon fa-${foundObjectIcon.tagIcon} tag-align-left"></span>
										</div>`;
						} else {
							if (obj.starColor && obj.starColor.length > 0 && (tagIndex >= maxTagsOnSide - 1)) {
								break;
							}
							iconsDivRight+= `<div style="height: ${itemContainerHeight}px;">
											<span class="webix_icon fa-${foundObjectIcon.tagIcon} tag-align-right"></span>
										</div>`;
						}
					} else {
						break;
					}
				}
			}
		});

		return `<div style='float: left'>${iconsDivLeft}</div>
		        <div style='float: right'>${iconsDivRight}</div>`;
	}
}

export default MainService;
