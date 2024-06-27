import {JetView} from "webix-jet";

import downloadFiles from "../../../models/downloadFiles";
import galleryImageUrl from "../../../models/galleryImageUrls";
import nonImageUrls from "../../../models/nonImageUrls";
import ajaxActions from "../../../services/ajaxActions";
import ImageThumbnailLoader from "../../../services/gallery/imageThumbnailLoader";

const SLIDER_ID = "sliderList";
const NEXT_BTN_ID = "sliderNavNext";
const PREV_BTN_ID = "sliderNavPrev";

export default class ImagesRowSlider extends JetView {
	constructor(app, config, npCaseView) {
		super(app, config);

		this._cnf = config || {};
		this._sliderId = `${SLIDER_ID}-${webix.uid()}`;
		this._nextBtnId = `${NEXT_BTN_ID}-${webix.uid()}`;
		this._prevBtnId = `${PREV_BTN_ID}-${webix.uid()}`;
		this._isSingle = true;
		this._highlightedId = null;
		this._npCaseView = npCaseView;
	}

	config() {
		const navButtonConfig = {
			view: "button",
			type: "icon",
			width: 50,
			css: {"line-height": "unset !important"}
		};

		return {
			...this._cnf,
			name: "imagesRowSlider",
			cols: [
				{
					selector: "spacer",
					hidden: true
				},
				{
					...navButtonConfig,
					localId: this._prevBtnId,
					icon: "fas fa-angle-left"
				},
				{
					view: "list",
					layout: "x",
					scroll: "auto",
					autoheight: true,
					localId: this._sliderId,
					css: "images-row-slider",
					select: true,
					template: (obj, common) => {
						const list = this.$sliderList();
						const isSelected = list.isSelected(obj.id);
						const checkedClass = isSelected ? "is-checked" : "";

						const bgIcon = galleryImageUrl.getPreviewImageUrl(obj._id) ?
							`background: url(${nonImageUrls.getNonImageUrl(obj)}) center / auto 100% no-repeat;` : "";

						this._loadImagePreview(obj);

						let dsaStainOrRegionTag;
						if (this._npCaseView) {
							const switcher = this._npCaseView.getSwitcherView();
							dsaStainOrRegionTag = switcher.getValue()
								? obj.meta?.npSchema?.regionName
								: obj.meta?.npSchema?.stainID;
						}
						const dsaStainTag = obj.meta && obj.meta.dsaStainTag;
						const downloadButtonState = isSelected ? "download-icon-button-active" : "";
						const activeState = !this._isSingle && this._highlightedId === obj.id ? "active-item" : "";

						return `<div title='${obj.name}' class='unselectable-dataview-items ${activeState}'>
									<div class="thumbnails-name ellipsis-text">${dsaStainOrRegionTag || dsaStainTag || obj.name}</div>
									<div class="slider-images-container ${checkedClass}">
										<div class="slider-images-info">
											<div class="slider-images-header">
												<div class="slider-images-checkbox"> <i class="checkbox-icon ${common.checkboxState(obj, common)}"></i></div>
												<div style="display: flex; justify-content: space-around">
													<div class="download-icon"><span class="webix_icon ${downloadButtonState} fa fa-download"></span></div>
													<div class="open-image-icon"><span class="webix_icon open-image fa fa-external-link-alt"></span></div>
												</div>
											</div>
										</div>
										<div class="slider-image-wrap" style="height: 100%">
											<img style="${bgIcon}" height="height: 90%" loading="lazy" src="${galleryImageUrl.getPreviewImageUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}" class="slider-image">
										</div>
									</div>
								</div>`;
					},
					onClick: {
						"download-icon-button-active": (ev, id) => {
							const item = this.$sliderList().getItem(id);
							const jsonArray = JSON.stringify([item._id]);
							const encodedArray = encodeURI(jsonArray);
							downloadFiles.downloadZip({
								resources: encodedArray,
								metadata: false
							});
						},
						"checkbox-icon": (ev, id) => {
							this._handleSelect(id);
						},
						"open-image": (ev, id) => {
							this._openImageInNewTab(id);
						}
					},
					type: {
						height: 155,
						width: 180,
						checkboxState: (obj) => {
							if (this._isSingle) return "disabled";
							const checkboxState = this.$sliderList().isSelected(obj.id) ?
								"checked fas fa-check-square" : "unchecked far fa-square enabled";
							return checkboxState;
						}
					}
				},
				{
					...navButtonConfig,
					localId: this._nextBtnId,
					icon: "fas fa-angle-right"
				},
				{
					selector: "spacer",
					hidden: true
				}
			]
		};
	}

	ready() {
		this._imageThumbnailLoader = new ImageThumbnailLoader(this.$sliderList());

		this._attachOnLoadEvent();
		this._attachNavButtonsEvents();
		this._attachListEvents();
	}

	$sliderList() {
		this._sliderList = this._sliderList || this.$$(this._sliderId);
		return this._sliderList;
	}

	syncSlider(dataCollection) {
		this.$sliderList().sync(dataCollection, function filter() {
			this.filter(item => item.hasOwnProperty("largeImage"));
		});
	}

	_loadImagePreview(obj) {
		this._imageThumbnailLoader.loadImagePreview(obj, "thumbnail");
	}

	_attachOnLoadEvent() {
		const list = this.$sliderList();
		this.on(list.data, "onSyncApply", () => {
			const count = list.count();
			this._resizeListWithContainerByCount(count);
		});
	}

	_attachNavButtonsEvents() {
		const nextBtn = this.$$(this._nextBtnId);
		const prevBtn = this.$$(this._prevBtnId);

		this.on(nextBtn, "onItemClick", () => {
			this._handleNav("next");
		});

		this.on(prevBtn, "onItemClick", () => {
			this._handleNav("prev");
		});
	}

	_handleNav(direction) {
		const list = this.$sliderList();
		const currentId = (this._isSingle ? list.getSelectedId() : this._highlightedId)	||
			list.getFirstId();
		const currentIndex = list.getIndexById(currentId);
		const lastId = list.getLastId();
		let nextId;
		if (direction === "next") {
			if (currentId.toString() === lastId.toString()) {
				nextId = list.getFirstId();
			}
			else {
				nextId = list.getNextId(currentId);
			}
		}
		else if (currentIndex === 0) {
			nextId = list.getLastId();
		}
		else {
			nextId = list.getPrevId(currentId);
		}
		if (this._isSingle) {
			list.select(nextId);
			list.showItem(nextId);
			webix.UIManager.setFocus(list);
		}
		else {
			this._highlightedId = nextId || list.getFirstId();
			const prevItem = list.getItem(currentId);
			const item = list.getItem(this._highlightedId);
			list.showItem(this._highlightedId);
			list.refresh(item.id);
			list.refresh(prevItem.id);
		}
	}

	_attachListEvents() {
		const list = this.$sliderList();

		this.on(list, "onBeforeSelect", (id, selection) => {
			const selectedIds = list.getSelectedId(true);
			// eslint-disable-next-line eqeqeq
			if (selection && selectedIds.length >= 2 && !selectedIds.find(selId => selId == id)) {
				list.unselectAll();
				list.select([selectedIds.pop(), id]);
				return false;
			}
		});

		this.on(list, "onItemDblClick", (id) => {
			if (!this._isSingle) {
				this._handleSelect(id);
			}
		});
	}

	// TO DO fix hidden case
	_resizeListWithContainerByCount(count) {
		const spacers = this.getRoot().queryView({selector: "spacer"}, "all");
		const list = this.$sliderList();
		let maxWidth = this._countSliderContainerMaxWidth();

		list.define("width", Math.min(maxWidth, list.type.width * count));

		spacers.forEach((view) => {
			view.show();
		});
		list.resize();
	}

	_countSliderContainerMaxWidth() {
		const prevButton = this.$$(this._prevBtnId);
		const navButtonsWidth = (prevButton.$width || prevButton.config.width) * 2;
		const rootWidth = this._getRootOrParentWidth(this.getRoot());

		return rootWidth - navButtonsWidth;
	}

	_getRootOrParentWidth(view) {
		return view.$width || this._getRootOrParentWidth(view.getParentView());
	}

	_handleSelect(id) {
		const list = this.$sliderList();
		if (list.isSelected(id)) {
			list.unselect(id);
		}
		else {
			list.select(id, true);
		}
	}

	_openImageInNewTab(id) {
		const list = this.$sliderList();
		const item = list.getItem(id);
		const imageId = item._id;
		ajaxActions.openImageInNewTab(imageId);
	}

	toogleMode(mode) {
		const list = this.$sliderList();
		switch (mode) {
			case "single": {
				this._isSingle = true;
				list.define("select", true);
				break;
			}
			default: {
				this._isSingle = false;
				list.define("select", false);
				break;
			}
		}
		list.refresh();
	}
}
