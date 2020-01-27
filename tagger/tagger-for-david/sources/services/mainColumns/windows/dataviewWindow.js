import transitionalAjax from "../../transitionalAjaxService";
import windowParts from "../../../views/windows/windowParts";
import responsiveWindows from "../../../models/windows/responsiveWindows";
import constants from "../../../constants";

export default class dataviewWindowService {
	constructor(windowScope) {
		this.scope = windowScope;
		this.window = this.scope.getRoot();
		this.dataview = windowScope.getWindowDataview();
		this.pager = windowScope.getDataviewPager();
	}

	getWindowImages() {
		this.scope.dataviewPager.blockEvent();
		this.scope.dataviewPager.select(0);
		this.scope.dataviewPager.unblockEvent();
		// remember selected items
		this.scope.selectImagesService.onBeforeNewDataLoad();
		this.scope.dataviewStore.clearAll();
		const params = this.scope.getParamsForImages();
		return this.parseImages(params);
	}

	parseImages(params) {
		let promise = Promise.resolve(false);
		if (params.ids.length) {
			this.scope.view.showProgress();
			promise = params.type === "folder" ? transitionalAjax.getImagesByFolder(params) : transitionalAjax.getImagesByCollection(params);
		}
		return promise
			.then((images) => {
				if (images) {
					this.scope.dataviewStore.parseItems(images.data, params.offset, images.count);
					// restore selected items
					this.scope.selectImagesService.onAfterNewDataLoad(params.ids);
					this.scope.view.hideProgress();
					// restore unsaved changes
					const idsToAdd = this.scope.connectedImagesModel.getImagesIdsForAdding();
					const idsToDelete = this.scope.connectedImagesModel.getImagesIdsForRemoving();
					idsToAdd.forEach((id) => {
						if (this.scope.dataviewStore.getItemById(null, id)) {
							this.scope.dataviewStore.updateItem(null, id, {_marker: true});
						}
					});
					idsToDelete.forEach((id) => {
						if (this.scope.dataviewStore.getItemById(null, id)) {
							this.scope.dataviewStore.updateItem(null, id, {_marker: false});
						}
					});
					return images.data;
				}
				return false;
			})
			.catch(() => {
				this.scope.view.hideProgress();
			});
	}

	getVisibleRange() {
		const state = this.dataview.getScrollState();
		const top = Math.max(0, state.y);
		const width = this.dataview._content_width;
		const height = this.dataview._content_height; // size of single item

		const t = this.dataview.type;
		let dx = Math.floor(width / t.width) || 1; // at least single item per row

		let min = Math.floor(top / t.height); // index of first visible row

		let dy = Math.ceil((height + top) / t.height) - 1; // index of last visible row
		// total count of items, paging can affect this math

		let count = this.dataview.data.$max ? this.dataview.data.$max - this.dataview.data.$min : this.dataview.count();
		let max = Math.ceil(count / dx) * t.height; // size of view in rows

		return {
			_from: min,
			_dy: dy,
			_top: top,
			_max: max,
			_y: t.height,
			_dx: dx
		};
	}

	getPagerSize() {
		const vr = this.getVisibleRange();
		const yCount = vr._dy || 1;
		const xCount = vr._dx || 1;
		return yCount * xCount;
	}

	setImagesRange() {
		this.pager.define("size", this.getPagerSize());
		this.pager.refresh();
	}

	changeImageSize(id) {
		const multiplier = constants.DATAVIEW_IMAGE_MULTIPLIERS[id];
		const typeObj = windowParts.getDataviewTypeObject(multiplier, this.dataview);
		this.dataview.customize(typeObj);
		windowParts.setImageMultiplierId(id);
		this.dataview.refresh();
	}

	onChangeImageSizeValue(id) {
		// const index = this.scope.getFirstItemIndexOnPage();
		this.scope.dataviewStore.clearAll();
		this.changeImageSize(id);
		this.setImagesRange();
		// const page = this.scope.getCurrentPageByItemIndex(index);
		this.getWindowImages();
		// if (this.pager.data.page !== page) {
		// 	this.pager.select(page);
		// }
	}

	onWindowShow() {
		const imageSizeValue = windowParts.getImageMultiplierId();
		this.scope.imageSizeSelect.blockEvent();
		this.scope.imageSizeSelect.setValue(imageSizeValue);
		this.scope.imageSizeSelect.unblockEvent();
		this.changeImageSize(imageSizeValue);
		this.setImagesRange();
		this.getWindowImages();
		this.window.show();

		responsiveWindows.addWindow(this.window.config.id, this.window);
	}
}
