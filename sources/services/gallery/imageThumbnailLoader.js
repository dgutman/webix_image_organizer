import galleryImageUrl from "../../models/galleryImageUrls";
import ajaxActions from "../ajaxActions";

export default class ImageThumbnailLoader {
	constructor(dataview) {
		this._dataview = dataview;
	}

	static _getCurrentItemPreviewUrlType(imageType) {
		let getPreviewUrl;
		let setPreviewUrl;

		switch (imageType) {
			case "thumbnail": {
				getPreviewUrl = galleryImageUrl.getPreviewImageUrl;
				setPreviewUrl = galleryImageUrl.setPreviewImageUrl;
				break;
			}
			case "images/label": {
				getPreviewUrl = galleryImageUrl.getLabelPreviewImageUrl;
				setPreviewUrl = galleryImageUrl.setPreviewLabelImageUrl;
				break;
			}
			case "images/macro": {
				getPreviewUrl = galleryImageUrl.getPreviewMacroImageUrl;
				setPreviewUrl = galleryImageUrl.setPreviewMacroImageUrl;
				break;
			}
			default: {
				break;
			}
		}
		return {getPreviewUrl, setPreviewUrl};
	}

	static loadImagePreview(obj, imageType, dataview) {
		const {
			getPreviewUrl,
			setPreviewUrl
		} = ImageThumbnailLoader._getCurrentItemPreviewUrlType(imageType);

		const preview = getPreviewUrl(obj._id);
		if (obj.largeImage && !preview) {
			if (preview === false) {
				if (dataview.exists(obj.id) && !obj.imageWarning) {
					obj.imageWarning = true;
					dataview.render(obj.id, obj, "update");
				}
			}
			else {
				ajaxActions.getImage(obj._id, imageType)
					.then((url) => {
						setPreviewUrl(obj._id, url);
						if (dataview.exists(obj.id)) {
							dataview.render(obj.id, obj, "update");
						}
					})
					.catch(() => {
						if (dataview.exists(obj.id) && !obj.imageWarning) {
							obj.imageWarning = true;
							dataview.render(obj.id, obj, "update");
						}
						setPreviewUrl(obj._id, false);
					});
			}
		}
	}

	loadImagePreview(obj, imageType) {
		ImageThumbnailLoader.loadImagePreview(obj, imageType, this._dataview);
	}
}
