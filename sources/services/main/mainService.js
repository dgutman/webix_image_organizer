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
import MetadataTableContextMenu from "../../views/components/metadataTableContextMenu";
import GalleryDataviewContextMenu from "../../views/components/galleryDataviewContextMenu";
import galleryDataviewFilterModel from "../../models/galleryDataviewFilterModel";
import MakeLargeImageWindow from "../../views/subviews/dataviewActionPanel/windows/makeLargeImageWindow";
import RenamePopup from "../../views/components/renamePopup";
import projectMetadata from "../../models/projectMetadata";
import imagesTagsModel from "../../models/imagesTagsModel";
import ImagesTagsWindow from "../../views/subviews/cartList/windows/imagesTagsWindow/ImagesTagsWindow";

let contextToFolder;
const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
const imagesTagsCollection = imagesTagsModel.getImagesTagsCollection();

class MainService {
	constructor(view, hostBox, collectionBox, multiviewSwither, galleryDataviewPager, galleryDataview, metadataTable, finder, metadataTemplate, collapser, metadataPanelScrollView, cartList) {
		this._view = view;
		this._hostBox = hostBox;
		this._collectionBox = collectionBox;
		this._multiviewSwither = multiviewSwither;
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
		let filesToLargeImage = [];

		const scrollPosition = this._finder.getScrollState();
		webix.extend(this._view, webix.ProgressBar);
		this._metadataPanelScrollView.hide();
		this._setValueAndParseData();

		const metadataTableCell = this._view.$scope.getSubMetadataTableView().getRoot();
		const galleryDataviewCell = this._view.$scope.getSubGalleryView().getRoot();

		this._imageWindow = this._view.$scope.ui(ImageWindow);
		this._selectImagesTemplate = this._view.$scope.getSubGalleryView().getSelectImagesTemplate();
		this._pdfViewerWindow = this._view.$scope.ui(PdfViewerWindow);
		this._setImagesTagsWindow = this._view.$scope.ui(ImagesTagsWindow);
		this._finderContextMenu = this._view.$scope.ui(FinderContextMenu).getRoot();
		this._cartViewButton = this._view.$scope.getSubDataviewActionPanelView().getCartButton();
		this._downloadingMenu = this._view.$scope.getSubCartListView().getDownloadingMenu();
		this._galleryDataviewYCountSelection = this._view.$scope.getSubGalleryFeaturesView().getDataviewYCountSelection();
		this._metadataTableContextMenu = this._view.$scope.ui(MetadataTableContextMenu).getRoot();
		this._galleryDataviewContextMenu = this._view.$scope.ui(GalleryDataviewContextMenu).getRoot();
		this._galleryDataviewRichselectFilter = this._view.$scope.getSubGalleryFeaturesView().getFilterBySelectionView();
		this._showMetadataWindowButton = this._view.$scope.getSubMetadataPanelView().getShowAddMetadataWindowButton();
		this._galleryDataviewSearch = this._view.$scope.getSubGalleryFeaturesView().getFilterByNameView();
		this._makeLargeImageWindow = this._view.$scope.ui(MakeLargeImageWindow);
		this._makeLargeImageButton = this._view.$scope.getSubGalleryFeaturesView().getMakeLargeImageButton();
		this._renamePopup = this._view.$scope.ui(RenamePopup);
		this._tableTemplateCollapser = this._metadataTable.$scope.getTableTemplateCollapser();
		this._makeLargeImageButtonLayout = this._view.$scope.getSubGalleryFeaturesView().getMakeLargeImageButtonLayout();
		this._galleryDataviewImageViewer = this._view.$scope.getSubGalleryFeaturesView().getGalleryImageViewer();
		this._projectFolderWindowButton = this._view.$scope.getSubDataviewActionPanelView().getProjectFolderWindowButton();
		this._createNewTagButton = this._view.$scope.getSubCartListView().getCreateNewTagButton();

		webixViews.setGalleryDataview(this._galleryDataview);
		webixViews.setMetadataTable(this._metadataTable);
		webixViews.setFinderView(this._finder);
		webixViews.setGalleryPager(this._galleryDataviewPager);
		webixViews.setMainView(this._view);
		webixViews.setImageWindow(this._imageWindow);

		galleryDataviewFilterModel.setRichselectDataviewFilter(this._galleryDataviewRichselectFilter);

		this._view.$scope.getSubFinderView().setTreePosition(scrollPosition.x);

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

		// connecting pager to data view
		this._galleryDataview.define("pager", this._galleryDataviewPager);

		this._galleryDataview.define("template", (obj, common) => {
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
			const imageViewerValue = this._galleryDataviewImageViewer.getValue();
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
								this._galleryDataview.refresh();
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
			this._finder.clearAll();
			this._galleryDataview.clearAll();
			this._metadataTable.clearAll();
			this._view.showProgress();
			this._view.$scope.getSubFinderView()
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
					utils.putHostsCollectionInLocalStorage(this.collectionItem);
					// define datatable columns
					const datatableColumns = metadataTableModel.getColumnsForDatatable(this._metadataTable);
					this._metadataTable.refreshColumns(datatableColumns);
					this._finder.parse(data);
					this._view.hideProgress();
				})
				.fail(() => {
					this._view.hideProgress();
				});

		});

		// switching between data table and data view
		this._multiviewSwither.attachEvent("onChange", (value) => {
			if (value) {
				metadataTableCell.show();
				this._collapser.hide();
				this._metadataPanelScrollView.hide();
				this._tableTemplateCollapser.show();
			} else {
				galleryDataviewCell.show();
				this._collapser.show({closed: true});
				this._tableTemplateCollapser.hide();
			}
		});

		this._finder.attachEvent("onBeforeOpen", (id) => {
			this._finder.blockEvent();
			this._finder.select(id);
			this._finder.unblockEvent();
			finderModel.loadBranch(id, this._view);
			return false;
		});


		//after opening the tree branch we fire this event
		this._finder.attachEvent("onAfterSelect", (id) => {
			const item = this._finder.getItem(id);
			if (item._modelType === "item") {
				utils.parseDataToViews(item);
			} else if (item._modelType === "folder") {
				finderModel.loadBranch(id, this._view);
			}
		});

		this._finder.attachEvent("onAfterClose", (id) => {
			this._finder.unselect(id);
			let items = [];
			const folder  = this._finder.getItem(id);
			if (folder.linear && !folder.hasOpened) {
				folder.linear = false;
				utils.findAndRemove(id, folder, items);
			} else if (!folder.linear && folder.hasOpened) {
				this._galleryDataviewPager.hide();
				this._galleryDataview.clearAll();
				this._metadataTable.clearAll();
			}
			utils.showOrHideImageSelectionTemplate("hide", this._selectImagesTemplate);
		});

		// parsing data to metadata template next to data view
		this._galleryDataview.attachEvent("onAfterSelect", (id) => {
			let item = this._galleryDataview.getItem(id);
			this._metadataTemplate.parse(item);
			if (authService.isLoggedIn() && authService.getUserInfo().admin) {
				this._showMetadataWindowButton.show();
			}
		});

		this._galleryDataview.attachEvent("onItemDblClick", (id) => {
			let item = this._galleryDataview.getItem(id);
			downloadFiles.openOrDownloadFiles(item, this._imageWindow, this._pdfViewerWindow);
		});

		this._metadataTable.attachEvent("onItemDblClick", (id) => {
			const item = this._metadataTable.getItem(id);
			downloadFiles.openOrDownloadFiles(item, this._imageWindow, this._pdfViewerWindow);
		});

		if (authService.isLoggedIn()) {
			this._finderContextMenu.attachTo(this._finder);

			this._finder.attachEvent("onBeforeContextMenu", (id) => {
				const item = this._finder.getItem(id);
				if (item._modelType === "folder") {
					if (authService.getUserInfo().admin) {
						this._finderContextMenu.clearAll();
						this._finderContextMenu.parse([
							constants.RENAME_CONTEXT_MENU_ID,
							{$template: "Separator"},
							constants.LINEAR_CONTEXT_MENU_ID
						]);
					} else {
						this._finderContextMenu.clearAll();
						this._finderContextMenu.parse(["Make linear structure"]);
					}
					contextToFolder = true;
					this._finderFolder = item;
				} else {
					if (authService.getUserInfo().admin) {
						this._finderContextMenu.clearAll();
						this._finderContextMenu.parse([constants.RENAME_FILE_CONTEXT_MENU_ID]);
						contextToFolder = false;
						this._finderItem = item;
					} else {
						return false;
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
				} else {
					itemId = this._finderItem.id;
				}
				switch (value) {
					case constants.RENAME_CONTEXT_MENU_ID: {
						this._finder.edit(folderId);
						break;
					}
					case constants.LINEAR_CONTEXT_MENU_ID: {
						const sourceParams = {
							sort: "_id"
						};
						this._view.showProgress();
						if (this._finderFolder.hasOpened || this._finderFolder.open) {
							utils.findAndRemove(folderId, this._finderFolder, items);
							this._finderFolder.hasOpened = false;
						}
						this._finder.blockEvent();
						this._finder.data.blockEvent();
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
								} else {
									this._finder.parse({
										data: webix.copy(data), parent: folderId
									});

									finderModel.setRealScrollPosition(
										finderModel.defineSizesAndPositionForDynamicScroll(this._finderFolder)
									);

									this._finder.attachEvent("onAfterScroll", () => {
										const positionX = this._view.$scope.getSubFinderView().getTreePositionX();
										const scrollState = this._finder.getScrollState();
										if (positionX !== scrollState.x) {
											this._view.$scope.getSubFinderView().setTreePosition(scrollState.x);
											return false;
										}
										finderModel.attachOnScrollEvent(scrollState, this._finderFolder, this._view, ajaxActions);
									});

									utils.parseDataToViews(webix.copy(data));
								}
								this._view.hideProgress();
							})
							.fail(() => {
								this._finder.parse({name: "error"});
								this._view.hideProgress();
							});
						break;
					}
					case constants.RENAME_FILE_CONTEXT_MENU_ID: {
						this._finder.edit(itemId);
						break;
					}
				}

			});

			this._finder.attachEvent("onAfterEditStop", (values, object) => {
				const newValue = values.value;
				if (newValue !== values.old) {
					this._view.showProgress();
					if (contextToFolder && !object.inGallery) {
						ajaxActions.putNewFolderName(this._finderFolder._id, newValue)
							.then(() => {
								webix.message({
									text: "Folder name was successfully updated!",
								});
								this._finder.refresh();
								this._galleryDataview.refresh();
								this._view.hideProgress();
							})
							.fail(() => {
								this._finderFolder.name = values.old;
								this._finder.refresh();
								this._galleryDataview.refresh();
								this._view.hideProgress();
							});
					} else {
						ajaxActions.putNewItemName(this._finderItem._id, newValue)
							.then(() => {
								webix.message({
									text: "Item name was successfully updated!",
								});
								this._finder.refresh();
								this._galleryDataview.refresh();
								this._view.hideProgress();
							})
							.fail(() => {
								this._finderItem.name = values.old;
								this._finder.refresh();
								this._galleryDataview.refresh();
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
					} else {
						items.forEach((item) => {
							this._cartList.remove(item.id);
						});
					}

					if (utils.isObjectEmpty(this._cartList.data.pull)) {
						this._view.$scope.getSubCartListView().hideList();
						this._cartViewButton.hide();
					}
				}
			}
		});

		this._cartViewButton.attachEvent("onItemClick", (clicked) => {
			let label = this._cartViewButton.config.label;
			if ((!label || label === "Show Cart") && selectDataviewItems.count() > 0)  {
				this._view.$scope.getSubCartListView().showList();
				this._cartViewButton.define("label", "Hide Cart");
				this._cartViewButton.refresh();
			} else if (label === "Hide Cart") {
				this._view.$scope.getSubCartListView().hideList();
				this._cartViewButton.define("label", "Show Cart");
				this._cartViewButton.refresh();
			}
			if (clicked === "checkboxClicked") {
				this._cartViewButton.show();
			}
		});

		this._cartList.define("template", (obj, common) => {
			return `<div>
						<span class='webix_icon ${utils.angleIconChange(obj)}' style="color: rgba(0, 0, 0, 0.8) !important;"></span>
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
			let dataviewItem = this._galleryDataview.getItem(id);
			let listItem = this._cartList.getItem(id);
			if (dataviewItem) {
				item = dataviewItem;
				item.markCheckbox = value;
				this._galleryDataview.updateItem(id, item);
			} else {
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

		this._finder.attachEvent("onAfterRender", () => {
			const treeWidth = this._finder.$width;
			const dataviewMinWidth = this._galleryDataview.config.minWidth;
			this._minCurrentTargenInnerWidth = dataviewMinWidth + treeWidth;
		});

		let dataviewSelectionId = utils.getDataviewSelectionId();
		if (dataviewSelectionId && dataviewSelectionId !== constants.DEFAULT_DATAVIEW_COLUMNS) {
			this._galleryDataviewYCountSelection.blockEvent();
			this._galleryDataviewYCountSelection.setValue(dataviewSelectionId);
			this._galleryDataviewYCountSelection.unblockEvent();
		}

		window.addEventListener("resize", (event) => {
			if (event.currentTarget.innerWidth >= this._minCurrentTargenInnerWidth) {
				const dataviewSelectionId = utils.getDataviewSelectionId();
				if (dataviewSelectionId && dataviewSelectionId !== constants.DEFAULT_DATAVIEW_COLUMNS) {
					this._galleryDataviewYCountSelection.callEvent("onChange", [dataviewSelectionId]);
				}
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

		this._galleryDataview.attachEvent("onAfterLoad", () => {
			utils.showOrHideImageSelectionTemplate("show", this._selectImagesTemplate);
			let dataviewSelectionId = utils.getDataviewSelectionId();
			if (dataviewSelectionId && dataviewSelectionId !== constants.DEFAULT_DATAVIEW_COLUMNS) {
				this._galleryDataviewYCountSelection.callEvent("onChange", [dataviewSelectionId]);
			}
			if (authService.isLoggedIn() && authService.getUserInfo().admin) {
				filesToLargeImage = this._galleryDataview.find((obj) => {
					let itemType = utils.searchForFileType(obj);
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

			this._galleryDataview.data.each((obj) => {
				if (selectDataviewItems.isSelected(obj._id) && !obj.markCheckbox) {
					obj.markCheckbox = 1;
					this._galleryDataview.updateItem(obj.id, obj);
				}
			});
		});

		if (authService.isLoggedIn()) {
			let columnId;
			let rowId;
			this._metadataTableContextMenu.attachTo(this._metadataTable);

			this._metadataTable.attachEvent("onBeforeContextMenu", (object) => {
				columnId = object.column;
				rowId = object.row;
				const columnConfig = this._metadataTable.getColumnConfig(columnId);
				if (!columnConfig.editor) {
					return false;
				}
			});

			this._metadataTableContextMenu.attachEvent("onItemClick", () => {
				this._metadataTable.edit({
					column: columnId,
					row: rowId
				});
			});
		}

		this._galleryDataview.attachEvent("onBeforeContextMenu", (...args) => {
			console.log(args)
		})

		if (authService.isLoggedIn() && authService.getUserInfo().admin) {
			this._galleryDataviewContextMenu.attachTo(this._galleryDataview);
			let itemId;
			this._galleryDataview.attachEvent("onBeforeContextMenu", (id) => {
				let item = this._galleryDataview.getItem(id);
				let itemType = utils.searchForFileType(item);
				if (item) {
					this._galleryDataviewItem = item;
					this._galleryDataviewContextMenu.clearAll();
					this._galleryDataviewContextMenu.parse([constants.RENAME_FILE_CONTEXT_MENU_ID]);
					if (!item.largeImage) {
						this._galleryDataviewContextMenu.parse([constants.MAKE_LARGE_IMAGE_CONTEXT_MENU_ID]);
						if (itemType === "bmp" || itemType === "jpg" || itemType === "png" || itemType === "gif" || itemType === "tiff") {
							itemId = item._id;
						}
					}
				} else {
					return false;
				}
			});

			this._galleryDataviewContextMenu.attachEvent("onItemClick", (id) => {
				switch (id) {
					case constants.RENAME_FILE_CONTEXT_MENU_ID: {
						this._finderItem = this._galleryDataviewItem;
						let itemClientRect = this._galleryDataview.getItemNode(this._galleryDataviewItem.id).getBoundingClientRect();
						let documentWidth = document.body.clientWidth;
						let oldName = this._galleryDataviewItem.name;
						this._renamePopup.showPopup(itemClientRect, documentWidth, oldName);
						this._galleryDataview.select(this._galleryDataviewItem.id);
						break;
					}
					case constants.MAKE_LARGE_IMAGE_CONTEXT_MENU_ID: {
						this._view.showProgress();
						ajaxActions.makeLargeImage(itemId)
							.then(() => {
								this._galleryDataview.refresh();
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

		this._galleryDataviewRichselectFilter.attachEvent("onChange", (value) => {
			galleryDataviewFilterModel.filterData(this._galleryDataview, value);
		});

		this._galleryDataviewSearch.attachEvent("onChange", (value) => {
			galleryDataviewFilterModel.filterByName(this._galleryDataview, value);
		});

		this._makeLargeImageButton.attachEvent("onItemClick", () => {
			this._makeLargeImageWindow.showWindow(filesToLargeImage);
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
		this._view.$scope.getSubHeaderView().parseCollectionData();
	}

	_setDataviewColumns(width, height) {
		this._galleryDataview.customize({
			width: width,
			height: height
		});
		galleryImageUrl.clearPreviewUrls();
		galleryImageUrl.clearPreviewLabelUrls();
		galleryImageUrl.clearPreviewMacroImageUrl();
		utils.setDataviewItemDimensions(width, height);
		this._galleryDataview.refresh();
	}

	_checkForImageHeight(imageHeight) {
		if (imageHeight === 90) {
			return imageHeight + 10;
		} else {
			return imageHeight;
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
