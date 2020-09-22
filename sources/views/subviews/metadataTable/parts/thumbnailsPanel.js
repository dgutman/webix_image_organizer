import {JetView} from "webix-jet";
import galleryImageUrl from "../../../../models/galleryImageUrls";
import ajaxActions from "../../../../services/ajaxActions";
import nonImageUrls from "../../../../models/nonImageUrls";
import utils from "../../../../utils/utils";
import constants from "../../../../constants";

export default class TableRightPanelView extends JetView {
	config() {
		const templateForImages = {
			view: "template",
			hidden: true,
			css: "datatable-images-template",
			name: "thumbnailsPanelTemplateName",
			id: constants.ID_DATATABLE_IMAGES_TEMPLATE,
			width: 200,
			template: (obj) => {
				if (!utils.isObjectEmpty(obj)) {
					const IMAGE_HEIGHT = 150;
					const IMAGE_WIDTH = 180;

					if (obj.largeImage) {
						const previewImageUrl = galleryImageUrl.getPreviewImageUrl(obj._id);
						const labelPreviewImageUrl = galleryImageUrl.getLabelPreviewImageUrl(obj._id);
						if (typeof previewImageUrl === "undefined") {
							ajaxActions.getImage(obj._id, "thumbnail")
								.then((url) => {
									galleryImageUrl.setPreviewImageUrl(obj._id, url);
									this.getRoot().refresh();
								})
								.catch(() => {
									galleryImageUrl.setPreviewImageUrl(obj._id, false);
								});
						}
						if (typeof labelPreviewImageUrl === "undefined") {
							ajaxActions.getImage(obj._id, "images/label")
								.then((url) => {
									galleryImageUrl.setPreviewLabelImageUrl(obj._id, url);
									this.getRoot().refresh();
								})
								.catch(() => {
									galleryImageUrl.setPreviewLabelImageUrl(obj._id, false);
								});
						}
					}

					return `<div class='datatable-template'>
							<span class='datatable-template-text'>Thumbnail image:</span>
							<img class='datatable-template-image' imageType='thumbnail-image' src="${galleryImageUrl.getPreviewImageUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}">
							<span class='datatable-template-text'>Label image:</span>
							<img class='datatable-template-image' imageType='label-image' src="${galleryImageUrl.getLabelPreviewImageUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}">
						</div>`;
				}
				return `<div class='datatable-template' style='position: relative; top: 50%;'>
								<center><span class='datatable-template-text'>
								Nothing to display
								<br>Please, select any item to display images
								</span></center>
							</div>`;
			}
		};

		return templateForImages;
	}
}
