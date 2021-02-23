import {JetView} from "webix-jet";
import galleryImageUrl from "../../../models/galleryImageUrls";
import nonImageUrls from "../../../models/nonImageUrls";
import ImageThumbnailLoader from "../../../services/gallery/imageThumbnailLoader";
import downloadFiles from "../../../models/downloadFiles";

const SLIDER_ID = "sliderDataview";
const NEXT_BTN_ID = "sliderNavNext";
const PREV_BTN_ID = "sliderNavPrev";
const SCROLLVIEW_SLIDER_ID = "sliderScrollview";

export default class ImagesRowSlider extends JetView {
	constructor(app, config) {
		super(app, config);

		this._cnf = config || {};
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
					view: "scrollview",
					localId: SCROLLVIEW_SLIDER_ID,
					css: {"overflow-x": "auto !important"},
					scroll: "x",
					body: {
						view: "dataview",
						localId: SLIDER_ID,
						css: "gallery-images-dataview",
						select: true,
						template: (obj) => {
							const dataview = this.$sliderDataview();
							const isSelected = dataview.isSelected(obj.id);
							const checkedClass = isSelected ? "is-checked" : "";

							const bgIcon = galleryImageUrl.getPreviewImageUrl(obj._id) ?
								`background: url(${nonImageUrls.getNonImageUrl(obj)}) center / auto 100% no-repeat;` : "";

							this._loadImagePreview(obj);

							const dsaStainTag = obj.meta && obj.meta.dsaStainTag;

							const downloadButtonState = isSelected ? "download-icon-button-active" : "";

							return `<div title='${obj.name}' class='unselectable-dataview-items'>
										<div class="thumbnails-name">${dsaStainTag || obj.name}</div>
										<div class="gallery-images-container ${checkedClass}">
											<div class="gallery-images-info">
												<div class="gallery-images-header">
													<div class="download-icon"><span class="webix_icon ${downloadButtonState} fa fa-download"></span></div>
												</div>
											</div>
											<div class="gallery-image-wrap" style="height: 90%">
												<img style="${bgIcon}" height="height: 90%" loading="lazy" src="${galleryImageUrl.getPreviewImageUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}" class="gallery-image">
											</div>
										</div>
									</div>`;
						},
						onClick: {
							"download-icon-button-active": (ev, id) => {
								const item = this.$sliderDataview().getItem(id);
								const jsonArray = JSON.stringify([item._id]);
								const encodedArray = encodeURI(jsonArray);
								downloadFiles.downloadZip({
									resources: encodedArray,
									metadata: false
								});
							}
						},
						yCount: 1,
						xCount: 20,
						scroll: false,
						type: {
							height: 150
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
		this._imageThumbnailLoader = new ImageThumbnailLoader(this.$sliderDataview());

		this._attachOnLoadEvent();
		this._attachNavButtonsEvents();
	}

	$sliderDataview() {
		this._sliderDataview = this._sliderDataview || this.$$(SLIDER_ID);
		return this._sliderDataview;
	}

	syncSlider(dataCollection) {
		this.$sliderDataview().sync(dataCollection, function filter() {
			this.filter(item => item.hasOwnProperty("largeImage"));
		});
	}

	_loadImagePreview(obj) {
		this._imageThumbnailLoader.loadImagePreview(obj, "thumbnail");
	}

	_attachOnLoadEvent() {
		const dataview = this.$sliderDataview();
		const sliderView = this.getRoot();
		this.on(dataview.data, "onSyncApply", () => {
			const count = dataview.count();
			if (count) {
				sliderView.show();
			}
			else {
				sliderView.hide();
			}
			this._resizeDataviewWithContainerByCount(count);
		});
	}

	_attachNavButtonsEvents() {
		const nextBtn = this.$$(NEXT_BTN_ID);
		const prevBtn = this.$$(PREV_BTN_ID);
		const dataview = this.$sliderDataview();

		this.on(nextBtn, "onItemClick", () => {
			const selectedId = dataview.getSelectedId() || dataview.getFirstId();
			const nextId = dataview.getNextId(selectedId) || selectedId;

			dataview.select(nextId);
			dataview.showItem(nextId);
		});

		this.on(prevBtn, "onItemClick", () => {
			const selectedId = dataview.getSelectedId() || dataview.getFirstId();
			const prevId = dataview.getPrevId(selectedId) || selectedId;

			dataview.select(prevId);
			dataview.showItem(prevId);
		});
	}

	// TO DO fix hidden case
	_resizeDataviewWithContainerByCount(count) {
		const scrollView = this.$$(SCROLLVIEW_SLIDER_ID);
		const spacers = this.getRoot().queryView({selector: "spacer"}, "all");
		const dataview = this.$sliderDataview();
		let maxWidth = this._countSliderContainerMaxWidth();

		dataview.define("xCount", count);
		scrollView.define("width", Math.min(maxWidth, dataview.type.width * count));

		spacers.forEach((view) => {
			view.show();
		});
		if (dataview.isVisible()) {
			scrollView.resize();
			dataview.resize();
		}
		else {
			const renderEventId = dataview.attachEvent("onBeforeRender", () => {
				this._resizeDataviewWithContainerByCount(count);
				dataview.detachEvent(renderEventId);
			});
		}
	}

	_countSliderContainerMaxWidth() {
		const navButtonsWidth = this.$$(PREV_BTN_ID).$width * 2;
		const rootWidth = this.getRoot().$width;

		return rootWidth - navButtonsWidth;
	}
}
