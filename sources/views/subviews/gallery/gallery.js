import {JetView} from "webix-jet";
import "../../components/activeDataview";
import GalleryService from "../../../services/gallery/gallery";
import constants from "../../../constants";
import selectedDataviewItems from "../../../models/selectGalleryDataviewItems";
import webixViews from "../../../models/webixViews";
import state from "../../../models/state";

export default class GalleryViewClass extends JetView {

	config() {
		const galleryHeaderTemplate = {
			css: "gallery-header-template",
			view: "template",
			name: "selectImagesTemplateName",
			height: 30,
			hidden: true,
			template() {
				let text = `<span class='gallery-select-all-images link'> Select All on the Page</span> or
								<span class='gallery-select-first-count-images link'> Select the First</span> ${constants.MAX_COUNT_IMAGES_SELECTION} images. You can select maximum ${constants.MAX_COUNT_IMAGES_SELECTION} images.`;
				const selectedImagesCount = selectedDataviewItems.count();
				if (selectedImagesCount) {
					return `${text} <span class='unselect-images-link link'>Unselect ${selectedImagesCount} ${selectedImagesCount === 1 ? "image" : "images"}</span>`;
				}
				return text;
			}
		};

		const itemsDataView = {
			view: "activeDataview",
			tooltip: (obj) => obj.name,
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
								const dataview = webixViews.getGalleryDataview();
								const item = dataview.getItem(this.config.$masterId);
								if (value && selectedDataviewItems.count() >= constants.MAX_COUNT_IMAGES_SELECTION) {
									dataview.updateItem(item.id, {markCheckbox: oldValue});
									webix.alert({
										text: `You can select maximum ${constants.MAX_COUNT_IMAGES_SELECTION} images`
									});
								}
								item.markCheckbox = value;
								if (value) {
									selectedDataviewItems.add(item._id);
								} else {
									selectedDataviewItems.remove(item._id);
								}
								dataview.callEvent("onCheckboxClicked", [item, value]);
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

		this.galleryService =  new GalleryService(
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