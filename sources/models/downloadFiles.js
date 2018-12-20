import helpingFunctions from "./helpingFunctions";
import authService from "../services/authentication";

function openOrDownloadFiles(item, ajaxActions, utils, imageWindow, nonModalWindow) {
	const itemType = helpingFunctions.searchForFileType(item);
	switch (itemType) {
		case "png":
		case "jpeg":
		case "jpg": {
			if (item.largeImage) {
				imageWindow.showWindow(item, "standard");
			} else helpingFunctions.showAlert();
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
			nonModalWindow.showWindow(item);
			break;
		}
		case "json": {
			imageWindow.showWindow(item, "jsonviewer");
			break;
		}
		default: {
			helpingFunctions.showAlert();
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