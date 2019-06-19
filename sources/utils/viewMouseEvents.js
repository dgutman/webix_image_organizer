import downloadFiles from "../models/downloadFiles";
import webixViews from "../models/webixViews";
import constants from "../constants";
import utils from "./utils";
import ajaxActions from "../services/ajaxActions";
import authService from "../services/authentication";

function setDefaultGalleryContextMenu(dataview) {
	let galleryDataviewItem;
	if (authService.isLoggedIn() && authService.getUserInfo().admin) {
		let itemId;
		const galleryDataviewContextMenu = webixViews.getGalleryDataviewContextMenu();
		dataview.attachEvent("onBeforeContextMenu", (id) => {
			let item = dataview.getItem(id);
			let itemType = utils.searchForFileType(item);
			if (item) {
				galleryDataviewItem = item;
				galleryDataviewContextMenu.clearAll();
				galleryDataviewContextMenu.parse([constants.RENAME_FILE_CONTEXT_MENU_ID]);
				if (itemType === "bmp" || itemType === "jpg" || itemType === "png" || itemType === "gif" || itemType === "tiff") {
					if (!item.largeImage) {
						galleryDataviewContextMenu.parse([constants.MAKE_LARGE_IMAGE_CONTEXT_MENU_ID]);
						itemId = item._id;
					}
				}
			} else {
				return false;
			}
		});

		galleryDataviewContextMenu.attachEvent("onItemClick", (id) => {
			switch (id) {
				case constants.RENAME_FILE_CONTEXT_MENU_ID: {
					let itemClientRect = dataview.getItemNode(galleryDataviewItem.id).getBoundingClientRect();
					let documentWidth = document.body.clientWidth;
					let oldName = galleryDataviewItem.name;
					this._renamePopup.showPopup(itemClientRect, documentWidth, oldName);
					dataview.select(galleryDataviewItem.id);
					break;
				}
				case constants.MAKE_LARGE_IMAGE_CONTEXT_MENU_ID: {
					this._view.showProgress();
					ajaxActions.makeLargeImage(itemId)
						.then(() => {
							dataview.refresh();
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
				const columnConfig = datatable.getColumnConfig(object.column);
				if (!columnConfig.editor) {
					return false;
				}
				datatable.edit({
					column: object.column,
					row: object.row
				});
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
	}

}

export default {
	setDataviewMouseEvents,
	setDatatableMouseEvents,
};