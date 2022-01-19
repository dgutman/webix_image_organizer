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
			css: "gallery-images-dataview",
			select: true,
			datathrottle: 500,
			minWidth: 450,
			onContext: {},
			type: {
				width: 150,
				height: 135,
				markCheckbox: obj => (selectedDataviewItems.isSelected(obj._id) ? "checked fas fa-check-square" : "unchecked far fa-square enabled")
			},
			onClick: {
				"checkbox-icon": (ev, id) => {
					let imagesArray = [];
					const dataview = webixViews.getGalleryDataview();
					const item = dataview.getItem(id);
					const value = !selectedDataviewItems.isSelected(item._id);

					if (value && selectedDataviewItems.count() >= constants.MAX_COUNT_IMAGES_SELECTION) {
						webix.alert({
							text: `You can select maximum ${constants.MAX_COUNT_IMAGES_SELECTION} images`
						});
						return;
					}

					imagesArray = selectedDataviewItems.onItemSelect(ev.shiftKey, item, dataview);
					dataview.callEvent("onCheckboxClicked", [imagesArray, value]);
					state.app.callEvent("changedSelectedImagesCount");
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
