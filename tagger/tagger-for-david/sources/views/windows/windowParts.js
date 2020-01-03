import galleryImageUrl from "../../models/galleryImageUrls";
import nonImageUrls from "../../models/nonImageUrls";
import ajaxService from "../../services/ajaxActions";
import transitionalAjax from "../../services/transitionalAjaxService";

function getFilterTemplateConfig() {
	return {
		template: (obj) => {
			const latest = obj.latest ? "latest" : "";
			return `<div class='filter-images-flex-container ${latest}'>
						<a class='filter-latest-changed'>Last changes</a>
						<a class='filter-all'>All</a>
					</div>`;
		},
		name: "filterImagesTemplate",
		height: 25,
		borderless: true
	};
}

function getItemsCount(pagerObj) {
	const count = pagerObj.count;
	const page = pagerObj.page + 1; // because first page in object is 0
	const pageSize = pagerObj.size;
	if (count < pageSize) {
		return `(${count} of ${count})`;
	}
	let pageCount = pageSize * page;
	if (pageCount > count) {
		pageCount = count;
	}
	return `(${pageCount} of ${count})`;
}

function getSearchInputConfig(name, placeholder) {
	return {
		view: "search",
		name: name || "searchInput",
		css: "search-field ellipsis-text",
		placeholder: placeholder || "Type image name"
	};
}

function getSelectAllTemplateConfig() {
	return {
		name: "selectAllTemplate",
		width: 250,
		template: `<div class='select-images-container'><a class='select-all-images'>Select all on the page</a>
					<a class='unselect-all-images'>Unselect all</a></div>`,
		borderless: true
	};
}

function searchImagesByName(searchInput, dataView) {
	const searchValue = searchInput.getValue();
	if (searchValue) {
		const lowerCaseSearchValue = searchValue.toLowerCase();
		dataView.filter((obj) => {
			if (obj) {
				const lowerCaseName = obj.name.toString().toLowerCase();
				if (lowerCaseName) {
					return lowerCaseName.includes(lowerCaseSearchValue);
				}
			}
		});
	}
	else {
		dataView.filter();
	}
}

function getPagerConfig(id) {
	return {
		view: "pager",
		id,
		width: 400,
		size: 70,
		template: (obj, common) => `${common.first()} ${common.prev()} <input type='text' class='pager-input' value='${common.page(obj)}'>
			<span class='pager-amount'>of ${obj.limit} ${getItemsCount(obj)}</span> ${common.next()} ${common.last()}`
	};
}

function getDataviewTempate(obj, common, dataview) {
	const IMAGE_HEIGHT = 100;
	const IMAGE_WIDTH = 150;
	const getPreviewUrl = galleryImageUrl.getPreviewImageUrl;
	const setPreviewUrl = galleryImageUrl.setPreviewImageUrl;
	let isHighlighted = "not-highlighted";
	let iconState = "fas fa-plus-circle add-icon";
	if (obj._marker) {
		isHighlighted = "highlighted";
		iconState = "fas fa-times-circle delete-icon";
	}
	if (typeof getPreviewUrl(obj._id) === "undefined") {
		setPreviewUrl(obj._id, "");
		// to prevent sending query more than 1 times
		ajaxService.getImage(obj._id, IMAGE_HEIGHT, IMAGE_WIDTH, "thumbnail")
			.then((data) => {
				if (data.type === "image/jpeg") {
					setPreviewUrl(obj._id, URL.createObjectURL(data));
					if (dataview.exists(obj.id)) {
						dataview.updateItem(obj.id, obj); // to call item render, not whole dataview
					}
				}
			});
	}

	return `<div onmousedown='return false' onselectstart='return false' class='dataview-items'>
				<div class="dataview-images-info">
					<div class="dataview-images-header">
						<div class="dataview-checkbox-container"><i class='checkbox ${common.checkboxState(obj, common)}'></i></div>
						<div class="dataview-icon"><i class='${iconState}'></i></div>
					</div>
				</div>
				<div class="dataview-images-container ${isHighlighted}" style="height: ${IMAGE_HEIGHT}px">
					<img src="${getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}" class="dataview-image" style="height: ${IMAGE_HEIGHT}px">
				</div>
				<div class="thumbnails-name ellipsis-text">${obj.name}</div>
			</div>`;
}

function confirmBeforeClose(condition) {
	if (condition) {
		return webix.confirm({
			title: "Close",
			text: "There are unsaved changes. Are you sure you want to close window?",
			ok: "Yes",
			cancel: "No"
		});
	}
	return Promise.resolve();
}

function parseImages(ref, params) {
	let promise = Promise.resolve(false);
	if (params.collectionIds.length) {
		ref.view.showProgress();
		promise = transitionalAjax.getImagesByCollection(params);
	}
	return promise
		.then((images) => {
			if (images) {
				ref.dataviewStore.parseItems(images.data, params.offset, images.count);
				// restore selected items
				ref.selectImagesService.onAfterNewDataLoad(params.collectionIds);
				ref.view.hideProgress();
				return images.data;
			}
			return false;
		})
		.catch(() => {
			ref.view.hideProgress();
		});
}

function getWindowImages(ref) {
	ref.dataviewPager.blockEvent();
	ref.dataviewPager.select(0);
	ref.dataviewPager.unblockEvent();
	// remember selected items
	ref.selectImagesService.onBeforeNewDataLoad();
	ref.dataviewStore.clearAll();
	const params = ref.getParamsForImages();
	return parseImages(ref, params)
		.then((data) => {
			if (data) {
				// restore unsaved changes
				const idsToAdd = ref.connectedImagesModel.getImagesIdsForAdding();
				const idsToDelete = ref.connectedImagesModel.getImagesIdsForRemoving();
				idsToAdd.forEach((id) => {
					if (ref.dataviewStore.getItemById(null, id)) {
						ref.dataviewStore.updateItem(null, id, {_marker: true});
					}
				});
				idsToDelete.forEach((id) => {
					if (ref.dataviewStore.getItemById(null, id)) {
						ref.dataviewStore.updateItem(null, id, {_marker: false});
					}
				});
			}
			return data;
		});
}

function addMarker(id, ref) {
	const item = ref.dataviewStore.getItemById(id);
	ref.connectedImagesModel.addImageIdForAdding(item._id);
	ref.dataviewStore.updateItem(id, null, {_marker: true});
}

function deleteMarker(id, ref) {
	const item = ref.dataviewStore.getItemById(id);
	ref.connectedImagesModel.addImageIdForRemoving(item._id);
	ref.dataviewStore.updateItem(id, null, {_marker: false});
}

function getDataviewOnClickObject(ref) {
	return {
		"delete-icon": (ev, id) => {
			let oldImages = [];
			if (ref.dataview.isSelected(id)) {
				const images = ref.selectImagesService.getSelectedItems();
				const invisibleImages = ref.selectImagesService.invisibleItems;
				images.forEach((image) => {
					oldImages.push(webix.copy(image));
					deleteMarker(image.id, ref);
				});
				invisibleImages.forEach((image) => {
					oldImages.push(webix.copy(image));
					ref.connectedImagesModel.addImageIdForRemoving(image._id);
				});
			}
			else {
				const image = ref.dataviewStore.getItemById(id);
				oldImages.push(webix.copy(image));
				deleteMarker(id, ref);
			}
			ref.undoModel.setActionToUndo(oldImages, ref.dataviewStore, "update");
		},
		"add-icon": (ev, id) => {
			let oldImages = [];
			if (ref.dataview.isSelected(id)) {
				const images = ref.selectImagesService.getSelectedItems();
				const invisibleImages = ref.selectImagesService.invisibleItems;
				images.forEach((image) => {
					oldImages.push(webix.copy(image));
					addMarker(image.id, ref);
				});
				invisibleImages.forEach((image) => {
					oldImages.push(webix.copy(image));
					ref.connectedImagesModel.addImageIdForAdding(image._id);
				});
			}
			else {
				const image = ref.dataviewStore.getItemById(id);
				oldImages.push(webix.copy(image));
				addMarker(id, ref);
			}
			ref.undoModel.setActionToUndo(oldImages, ref.dataviewStore, "update");
		},
		checkbox: (ev, id) => {
			const item = ref.dataviewStore.getItemById(id);
			ref.selectImagesService.onItemSelect(ev.shiftKey, item);
		}
	};
}

export default {
	getPagerConfig,
	getSearchInputConfig,
	getFilterTemplateConfig,
	searchImagesByName,
	getSelectAllTemplateConfig,
	getDataviewTempate,
	confirmBeforeClose,
	getWindowImages,
	parseImages,
	getDataviewOnClickObject
};
