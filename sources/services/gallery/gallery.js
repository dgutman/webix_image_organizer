import constants from "../../constants";
import selectedDataviewItems from "../../models/selectGalleryDataviewItems";

class GalleryService {
	constructor(view, galleryDataview, selectImagesTemplate) {
		this._view = view;
		this._galleryDataview = galleryDataview;
		this._selectImagesTemplate = selectImagesTemplate;
		this._ready();
	}

	_ready() {
		this._view.$scope.on(this._view.$scope.app, "changedSelectedImagesCount", () => {
			this._selectImagesTemplate.refresh();
		});

		this._selectImagesTemplate.define("onClick", {
			"unselect-images-link": () => {
				this._unselectImages();
			},
			"gallery-select-all-images": () => {
				const value = 1;
				const limit = this._galleryDataview.data.$max;
				const dataviewData = this._galleryDataview.data.order;
				let offset = this._galleryDataview.data.$min;
				let isNeedShowAlert = true;
				let length;
				let items = [];

				if (dataviewData.length < limit) {
					length = dataviewData.length;
				}
				else {
					length = limit;
				}
				for (; offset < length; offset++) {
					let item = this._galleryDataview.getItem(dataviewData[offset]);
					if (!selectedDataviewItems.isSelected(item._id)) {
						if (selectedDataviewItems.count() < constants.MAX_COUNT_IMAGES_SELECTION) {
							items.push(item);
							selectedDataviewItems.add(item);
						}
						else if (isNeedShowAlert) {
							isNeedShowAlert = false;
							webix.alert({
								text: `You can select maximum ${constants.MAX_COUNT_IMAGES_SELECTION} images`
							});
						}
					}
				}

				this._galleryDataview.callEvent("onCheckboxClicked", [items, value]);
				this._galleryDataview.refresh();
				this._view.$scope.app.callEvent("changedSelectedImagesCount");
			},
			"gallery-select-first-count-images": () => {
				this._unselectImages();
				const value = 1;
				const limit = constants.MAX_COUNT_IMAGES_SELECTION;
				const dataviewData = this._galleryDataview.data.order;
				let length;
				let items = [];

				if (dataviewData.length < limit) {
					length = dataviewData.length;
				}
				else {
					length = limit;
				}
				for (let offset = 0; offset < length; offset++) {
					let item = this._galleryDataview.getItem(dataviewData[offset]);
					if (!selectedDataviewItems.isSelected(item._id)) {
						items.push(item);
						selectedDataviewItems.add(item);
					}
				}

				this._galleryDataview.callEvent("onCheckboxClicked", [items, value]);
				this._galleryDataview.refresh();
				this._view.$scope.app.callEvent("changedSelectedImagesCount");
			}
		});
	}

	_unselectImages() {
		const value = 0;
		const items = selectedDataviewItems.getSelectedImages();

		selectedDataviewItems.clearAll();
		selectedDataviewItems.putSelectedImagesToLocalStorage();
		this._galleryDataview.callEvent("onCheckboxClicked", [items, value, true]);
		this._galleryDataview.refresh();
		this._view.$scope.app.callEvent("changedSelectedImagesCount");
	}
}

export default GalleryService;
