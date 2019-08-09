import {JetView} from "webix-jet";
import "../../components/activeDataview";
import GalleryService from "../../../services/gallery/gallery";
import constants from "../../../constants";
import selectedDataviewItems from "../../../models/selectGalleryDataviewItems";
import webixViews from "../../../models/webixViews";
import state from "../../../models/state";
import utils from "../../../utils/utils";

export default class GalleryViewClass extends JetView {
	config() {
		const galleryHeaderTemplate = {
			css: "gallery-header-template",
			view: "template",
			name: "selectImagesTemplateName",
			height: 30,
			hidden: true,
			template() {
				let text = `<span class='gallery-select-all-images link'> Select all on the page</span> or
								<span class='gallery-select-first-count-images link'> Select the first</span> ${constants.MAX_COUNT_IMAGES_SELECTION} images. You can select maximum ${constants.MAX_COUNT_IMAGES_SELECTION} images.`;
				const selectedImagesCount = selectedDataviewItems.count();
				if (selectedImagesCount) {
					return `${text} <span class='unselect-images-link link'>Unselect ${selectedImagesCount} ${selectedImagesCount === 1 ? "image" : "images"}</span>`;
				}
				return text;
			}
		};

		const itemsDataView = {
			view: "activeDataview",
			tooltip: obj => obj.name,
			css: "gallery-images-dataview",
			select: true,
			datathrottle: 500,
			minWidth: 860,
			onContext: {},
			type: {
				width: 150,
				height: 135
			},
			activeContent: {
				markCheckbox: {
					view: "checkbox",
					css: "checkbox-ctrl",
					width: 20,
					height: 30,
					on: {
						onChange(value, oldValue) {
							if (value !== oldValue) {
								let imagesArray = [];
								const dataview = webixViews.getGalleryDataview();
								const item = dataview.getItem(this.config.$masterId);
								if (value && selectedDataviewItems.count() >= constants.MAX_COUNT_IMAGES_SELECTION) {
									dataview.updateItem(item.id, {markCheckbox: oldValue});
									webix.alert({
										text: `You can select maximum ${constants.MAX_COUNT_IMAGES_SELECTION} images`
									});
									return;
								}
								item.markCheckbox = value;
								if (value) {
									if (state.toSelectByShift) {
										imagesArray = utils.getImagesToSelectByShift(item, selectedDataviewItems, dataview, value);
									}
									else {
										imagesArray = [item];
									}
									selectedDataviewItems.add(imagesArray);
								}
								else {
									const deletedItemsDataCollection = selectedDataviewItems.getDeletedItemsDataCollection();
									if (state.toSelectByShift) {
										imagesArray = utils.getImagesToSelectByShift(item, selectedDataviewItems, dataview, value);
									}
									else {
										deletedItemsDataCollection.clearAll();
										deletedItemsDataCollection.add(item);
										imagesArray = [item];
									}
									imagesArray.forEach((item) => {
										selectedDataviewItems.remove(item._id);
									});
								}
								dataview.callEvent("onCheckboxClicked", [imagesArray, value]);
								state.app.callEvent("changedSelectedImagesCount");
							}
						}
					}
				}
			}
		};

		const galleryCell = {
			name: "galleryCell",
			rows: [
				galleryHeaderTemplate,
				itemsDataView
			]
		};

		return galleryCell;
	}

	ready(view) {
		const galleryDataview = this.getDataView();
		const selectImagesTemplate = this.getSelectImagesTemplate();

		this.galleryService = new GalleryService(
			view,
			galleryDataview,
			selectImagesTemplate,
		);
	}

	getDataView() {
		return this.getRoot().queryView({view: "activeDataview"});
	}

	getSelectImagesTemplate() {
		return this.getRoot().queryView({name: "selectImagesTemplateName"});
	}
}
