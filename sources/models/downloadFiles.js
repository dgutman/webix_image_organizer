import authService from "../services/authentication";
import utils from "../utils/utils";
import ajaxActions from "../services/ajaxActions";

function openOrDownloadFiles(item, imageWindow, pdfViewerWindow) {
	const itemType = utils.searchForFileType(item);
	if (item.label) {
		imageWindow.showWindow(item, "standard");
		item.label = false; // To prevent openning label image 2nd time
		return true;
	}
	switch (itemType) {
		case "png":
		case "jpeg":
		case "jpg":
		case "tiff":
		case "bmp": {
			if (item.largeImage) {
				imageWindow.showWindow(item, "standard");
			} else utils.showAlert();
			break;
		}
		case "csv": {
			let url = ajaxActions.downloadItem(item._id);
			utils.downloadByLink(url, item.name);
			break;
		}
		case "svs":
		case "ndpi": {
			if (item.largeImage) {
				imageWindow.showWindow(item, "seadragon");
			}
			break;
		}
		case "pdf": {
			pdfViewerWindow.showWindow(item);
			break;
		}
		case "json": {
			imageWindow.showWindow(item, "jsonviewer");
			break;
		}
		default: {
			if (item.largeImage) {
				imageWindow.showWindow(item, "standard");
			} else utils.showAlert();
			break;
		}
	}
}

function downloadZip(sourceParam, ajaxActions, utils) {
	let url = `${ajaxActions.getHostApiUrl()}
						/resource/download/
							?resources={"item":${sourceParam.resources}}
									&includeMetadata=${sourceParam.metadata}${ajaxActions.setTokenIntoUrl(authService.getToken(), "&")}`;
	utils.downloadByLink(url);
}


export default {
	openOrDownloadFiles,
	downloadZip
};