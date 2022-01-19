import transitionalAjax from "../../transitionalAjaxService";
import windowParts from "../../../views/windows/windowParts";
import responsiveWindows from "../../../models/windows/responsiveWindows";
import DataviewService from "../../user/dataviewService";

export default class DataviewWindowService extends DataviewService {
	constructor(windowScope) {
		super(
			windowScope.getWindowDataview(),
			windowScope.dataviewStore,
			windowScope.getDataviewPager(),
			windowScope.getSelectImageSize()
		);
		this.scope = windowScope;
		this.window = this.scope.getRoot();
		this.attachWindowViewsEvents();
	}

	getWindowImages() {
		this.pager.blockEvent();
		this.pager.select(0);
		this.pager.unblockEvent();
		// remember selected items
		this.scope.selectImagesService.onBeforeNewDataLoad();
		this.dataviewStore.clearAll();
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

	onChangeImageSizeValue(id) {
		const index = this.getFirstItemIndexOnPage();
		this.dataviewStore.clearAll();
		this.changeImageSize(id);
		this.setImagesRange();
		const page = this.getCurrentPageByItemIndex(index);
		this.getWindowImages();
		if (this.pager.data.page !== page && page > -1) {
			this.pager.select(page);
		}
	}

	getCurrentPageByItemIndex(index) {
		let page = Math.floor(index / this.pager.data.size);
		const maxPage = this.pager.data.limit - 1;
		page = page > -1 ? page : maxPage;
		return Math.min(page, maxPage);
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

	attachWindowViewsEvents() {
		this.dataview.data.attachEvent("onStoreUpdated", () => {
			const count = this.dataview.count();
			if (!count) {
				this.pager.hide();
			}
			else if (count && !this.pager.isVisible()) {
				this.pager.show();
			}
		});

		this.scope.searchInput.attachEvent("onEnter", () => {
			this.getWindowImages();
		});
		this.scope.searchInput.attachEvent("onSearchIconClick", () => {
			this.getWindowImages();
		});

		this.scope.selectAllTemplate.define("onClick", {
			"select-all-images": () => {
				this.scope.selectImagesService.selectAllVisibleItems(this.pager);
			},
			"unselect-all-images": () => {
				this.scope.selectImagesService.unselectAllItems();
				this.scope.selectImagesService.clearInvisibleItems();
			}
		});

		this.pager.attachEvent("onAfterPageChange", (page) => {
			const offset = this.pager.data.size * page || 0;
			if (!this.dataview.getIdByIndex(offset)) {
				const params = this.scope.getParamsForImages();
				this.parseImages(params);
			}
		});

		this.dataview.data.attachEvent("onStoreLoad", (driver, rawData) => {
			this.scope.connectedImagesModel.putInitialIdsFromItems(rawData.data);
			this.setImagesRange();
		});

		this.scope.filterTemplate.define("onClick", {
			"filter-latest-changed": () => {
				this.scope.filterTemplate.setValues({latest: true});
				this.getWindowImages();
			},
			"filter-all": () => {
				this.scope.filterTemplate.setValues({latest: false});
				this.getWindowImages();
			}
		});

		this.imageSizeSelect.attachEvent("onChange", (val) => {
			this.onChangeImageSizeValue(val);
		});
	}
}
