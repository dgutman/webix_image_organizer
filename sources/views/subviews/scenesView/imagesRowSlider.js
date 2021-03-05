import {JetView} from "webix-jet";
import galleryImageUrl from "../../../models/galleryImageUrls";
import nonImageUrls from "../../../models/nonImageUrls";
import ImageThumbnailLoader from "../../../services/gallery/imageThumbnailLoader";
import downloadFiles from "../../../models/downloadFiles";

const SLIDER_ID = "sliderList";
const NEXT_BTN_ID = "sliderNavNext";
const PREV_BTN_ID = "sliderNavPrev";

export default class ImagesRowSlider extends JetView {
	constructor(app, config) {
		super(app, config);

		this._cnf = config || {};

		this._isSingle = true;
		this._highlightedId = null;
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
			hidden: true,
			cols: [
				{
					selector: "spacer",
					hidden: true
				},
				{
					...navButtonConfig,
					localId: PREV_BTN_ID,
					icon: "fas fa-angle-left"
				},
				{
					view: "list",
					layout: "x",
					scroll: "auto",
					autoheight: true,
					localId: SLIDER_ID,
					css: "images-row-slider",
					select: true,
					template: (obj, common) => {
						const list = this.$sliderList();
						const isSelected = list.isSelected(obj.id);
						const checkedClass = isSelected ? "is-checked" : "";

						const bgIcon = galleryImageUrl.getPreviewImageUrl(obj._id) ?
							`background: url(${nonImageUrls.getNonImageUrl(obj)}) center / auto 100% no-repeat;` : "";

						this._loadImagePreview(obj);

						const dsaStainTag = obj.meta && obj.meta.dsaStainTag;
						const downloadButtonState = isSelected ? "download-icon-button-active" : "";
						const activeState = !this._isSingle && this._highlightedId === obj.id ? "active-item" : "";

						return `<div title='${obj.name}' class='unselectable-dataview-items ${activeState}'>
									<div class="thumbnails-name ellipsis-overflow">${dsaStainTag || obj.name}</div>
									<div class="slider-images-container ${checkedClass}">
										<div class="slider-images-info">
											<div class="slider-images-header">
												<div class="slider-images-checkbox"> <i class="checkbox-icon ${common.checkboxState(obj, common)}"></i></div>
												<div class="download-icon"><span class="webix_icon ${downloadButtonState} fa fa-download"></span></div>
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
					localId: NEXT_BTN_ID,
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
		this._sliderList = this._sliderList || this.$$(SLIDER_ID);
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
		const sliderView = this.getRoot();
		this.on(list.data, "onSyncApply", () => {
			const count = list.count();
			if (count) {
				sliderView.show();
			}
			else {
				sliderView.hide();
			}
			this._resizeListWithContainerByCount(count);
		});
	}

	_attachNavButtonsEvents() {
		const nextBtn = this.$$(NEXT_BTN_ID);
		const prevBtn = this.$$(PREV_BTN_ID);

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
		const nextId = direction === "next" ? list.getNextId(currentId) : list.getPrevId(currentId);
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
		const prevButton = this.$$(PREV_BTN_ID);
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
