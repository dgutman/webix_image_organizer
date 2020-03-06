import downloadFiles from "../models/downloadFiles";
import webixViews from "../models/webixViews";
import constants from "../constants";
import utils from "./utils";
import ajaxActions from "../services/ajaxActions";
import authService from "../services/authentication";
import editableFoldersModel from "../models/editableFoldersModel";

let largeImageFiles;
let makeLargeImageButton;

function setFilesToLargeImage(filesToLargeImage) {
	largeImageFiles = filesToLargeImage;
}

function setMakeLargeImageButton(largeImageButton) {
	makeLargeImageButton = largeImageButton;
}

function setDefaultGalleryContextMenu(dataview) {
	let galleryDataviewItem;
	if (authService.isLoggedIn()) {
		let itemId;
		let item;
		const galleryDataviewContextMenu = webixViews.getGalleryDataviewContextMenu();
		const mainView = webixViews.getMainView();
		dataview.attachEvent("onBeforeContextMenu", (id) => {
			item = dataview.getItem(id);
			const itemType = utils.searchForFileType(item);
			itemId = item._id;
			if (editableFoldersModel.getFolderAccessLvl(item.folderId) > -1) {
				const isFolderEditable = editableFoldersModel.isFolderEditable(item.folderId);
				if (item && isFolderEditable) {
					galleryDataviewItem = item;
					galleryDataviewContextMenu.clearAll();
					galleryDataviewContextMenu.parse([constants.RENAME_FILE_CONTEXT_MENU_ID]);
					if (itemType === "bmp" || itemType === "jpg" || itemType === "png" || itemType === "gif" || itemType === "tiff" || itemType === "jpeg") {
						if (!item.largeImage) {
							galleryDataviewContextMenu.parse([constants.MAKE_LARGE_IMAGE_CONTEXT_MENU_ID]);
						}
					}
				}
				else {
					return false;
				}
			}
			else {
				editableFoldersModel.getFolderFromServer(item.folderId)
					.then(() => {
						dataview.callEven("onBeforeContextMenu", [id]);
					});
				return false;
			}
		});

		galleryDataviewContextMenu.attachEvent("onItemClick", (id) => {
			switch (id) {
				case constants.RENAME_FILE_CONTEXT_MENU_ID: {
					const itemClientRect = dataview.getItemNode(galleryDataviewItem.id).getBoundingClientRect();
					const documentWidth = document.body.clientWidth;
					const oldName = galleryDataviewItem.name;
					const renamePopup = webixViews.getRenamePopup();
					renamePopup.showPopup(itemClientRect, documentWidth, oldName, item);
					dataview.select(galleryDataviewItem.id);
					break;
				}
				case constants.MAKE_LARGE_IMAGE_CONTEXT_MENU_ID: {
					mainView.showProgress();
					ajaxActions.makeLargeImage(itemId)
						.then(() => {
							ajaxActions.getItem(itemId)
								.then((updatedItem) => {
									dataview.find((galleryItem) => {
										if (galleryItem._id === updatedItem._id) {
											dataview.updateItem(galleryItem.id, updatedItem);
										}
									});
									largeImageFiles = largeImageFiles.filter(largeImageItem => largeImageItem._id !== itemId);
									if (!largeImageFiles.length) makeLargeImageButton.hide();

									mainView.hideProgress();
								})
								.catch(() => mainView.hideProgress());
						})
						.catch(() => mainView.hideProgress());
					break;
				}
				default:
					break;
			}
		});
	}
}

function setDataviewMouseEvents(dataview, action, event) {
	dataview.detachEvent(event);
	if (event === "onBeforeContextMenu" && action === "edit") {
		setDefaultGalleryContextMenu(dataview);
		return true;
	}
	switch (action) {
		case "open": {
			dataview.attachEvent(event, (id) => {
				let item = dataview.getItem(id);
				const imageWindow = webixViews.getImageWindow();
				const pdfViewerWindow = webixViews.getPdfViewerWindow();
				downloadFiles.openOrDownloadFiles(item, imageWindow, pdfViewerWindow);
				return false;
			});
			break;
		}
		default:
			break;
	}
}

function setDatatableMouseEvents(datatable, action, event) {
	datatable.detachEvent(event);
	switch (action) {
		case "open": {
			datatable.attachEvent(event, (object) => {
				const item = datatable.getItem(object.row);
				const imageWindow = webixViews.getImageWindow();
				const pdfViewerWindow = webixViews.getPdfViewerWindow();
				downloadFiles.openOrDownloadFiles(item, imageWindow, pdfViewerWindow);
			});
			break;
		}
		case "edit": {
			datatable.attachEvent(event, (object) => {
				const item = datatable.getItem(object.row);
				const columnConfig = datatable.getColumnConfig(object.column);
				if (!columnConfig.editor) {
					return false;
				}
				else if (editableFoldersModel.getFolderAccessLvl(item.folderId) > -1) {
					const isFolderEditable = editableFoldersModel.isFolderEditable(item.folderId);
					if (isFolderEditable) {
						datatable.edit({
							column: object.column,
							row: object.row
						});
					}
					else {
						return false;
					}
				}
				else {
					editableFoldersModel.getFolderFromServer(item.folderId)
						.then((isFolderEditable) => {
							if (isFolderEditable) {
								datatable.edit({
									column: object.column,
									row: object.row
								});
							}
						});
					return false;
				}
			});
			break;
		}
		case "select": {
			datatable.attachEvent(event, (object) => {
				const metadataTableThumbnailsTemplate = webixViews.getMetadataTableThumbnailTemplate();
				datatable.blockEvent();
				datatable.select(object.row);
				const currentItem = datatable.getItem(object.row);
				metadataTableThumbnailsTemplate.parse(currentItem);
				datatable.unblockEvent();
			});
			break;
		}
		default:
			break;
	}
}

export default {
	setDataviewMouseEvents,
	setDatatableMouseEvents,
	setFilesToLargeImage,
	setMakeLargeImageButton
};
