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
						if (typeof galleryImageUrl.getPreviewImageUrl(obj._id) === "undefined") {
							galleryImageUrl.setPreviewImageUrl(obj._id, "");
							// to prevent sending query more than 1 times
							ajaxActions.getImage(obj._id, IMAGE_HEIGHT, IMAGE_WIDTH, "thumbnail")
								.then((data) => {
									galleryImageUrl.setPreviewImageUrl(obj._id, URL.createObjectURL(data));
									this.getRoot().refresh();
								});
						}
						if (typeof galleryImageUrl.getLabelPreviewImageUrl(obj._id) === "undefined") {
							galleryImageUrl.setPreviewLabelImageUrl(obj._id, "");
							ajaxActions.getImage(obj._id, IMAGE_HEIGHT, IMAGE_WIDTH, "images/label")
								.then((data) => {
									if (data.type === "image/jpeg") {
										galleryImageUrl.setPreviewLabelImageUrl(obj._id, URL.createObjectURL(data));
										this.getRoot().refresh();
									}
								});
						}
					}
					return `<div class='datatable-template'>
							<span class='datatable-template-text'>Thumnail Image:</span>
							<img class='datatable-template-image' src="${galleryImageUrl.getPreviewImageUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}">
							<span class='datatable-template-text'>Label Image:</span>
							<img class ='datatable-template-image' src="${galleryImageUrl.getLabelPreviewImageUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}">
						</div>`;
				} else {
					return  `<div class='datatable-template' style='position: relative; top: 50%;'>
								<center><span class='datatable-template-text'>
								Nothing to display
								<br>Please, select any item to display images
								</span></center>
							</div>`;
				}

			}
		};

		return templateForImages;
	}
}