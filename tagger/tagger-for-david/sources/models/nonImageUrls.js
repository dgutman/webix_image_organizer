import utils from "../utils/utils";

function getNonImageUrl(obj) {
	let srcForImage;
	if (obj._modelType === "folder") {
		srcForImage = "sources/images/folder.png";
	} else {
		let fileType = utils.searchForFileType(obj);
		switch (fileType) {
			case "pdf": {
				srcForImage = "sources/images/pdf.png";
				break;
			}
			case "json": {
				srcForImage = "sources/images/json.png";
				break;
			}
			case "csv": {
				srcForImage = "sources/images/csv.png";
				break;
			}
			case "bmp":
			case "jpg":
			case "png":
			case "jpeg": {
				srcForImage = "sources/images/no-image.png";
				break;
			}
			case "ndpi":
			case "svs": {
				srcForImage = "sources/images/x-file.png";
				break;
			}
			default: {
				srcForImage = "sources/images/unknown.png";
				break;
			}
		}
	}
	return srcForImage;
}

export default {
	getNonImageUrl
};
