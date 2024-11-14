import {JetView} from "webix-jet";

import ImagesRowSlider from "./imagesRowSlider";
import ModePanelView from "./modePanel";
import SlideViewContainer from "./slideViewContainer";
import constants from "../../../constants";
import TimedOutBehavior from "../../../utils/timedOutBehavior";

const MODE_CHANGE_EVENT = constants.SCENES_VIEW_CHANGE_MODE_EVENT_NAME;
const POINTS_MODE_CHANGE_EVENT = constants.SCENES_VIEW_CHANGE_POINTS_MODE_EVENT_NAME;

export default class ScenesView extends JetView {
	constructor(app, config) {
		super(app, config);

		this._imagesSlider = new ImagesRowSlider(app, {height: 160});
		this._modePanelView = new ModePanelView(app);
		this._slideViewContainer = new SlideViewContainer(app);

		this._timedOutBehavior = new TimedOutBehavior(50);
	}

	config() {
		return {
			name: "scenesViewCell",
			css: "scenes-view",
			margin: 8,
			rows: [
				this._imagesSlider,
				this._modePanelView,
				this._slideViewContainer
			]
		};
	}

	ready(view) {
		webix.extend(view, webix.OverlayBox);
		this._attachSliderEvents();
		this._attachChangeModeEvents();
	}

	_attachSliderEvents() {
		const listSlider = this._imagesSlider.$sliderList();
		this.on(listSlider.data, "onSyncApply", () => {
			const count = listSlider.count();
			this._toggleViewOverlay(count);
			this._timedOutBehavior.execute(this._syncApplyHandler, this, [listSlider]);
		});

		this.on(listSlider, "onSelectChange", async () => {
			this._setSelectedImagesToViewer();
		});
	}

	_attachChangeModeEvents() {
		const modePanelView = this._modePanelView.getRoot();
		const listSlider = this._imagesSlider.$sliderList();

		this.on(modePanelView, MODE_CHANGE_EVENT, (value) => {
			this._imagesSlider.toogleMode(value);
			switch (value) {
				case "split": {
					this._slideViewContainer.makeSplitView();
					// Hack to prepare new view to get data
					webix.delay(() => {
						const selectedIds = listSlider.getSelectedId(true);
						if (selectedIds.length <= 1) {
							const [selectedImage] = selectedIds;
							const nextImage = listSlider.getNextId(selectedImage);
							listSlider.select(nextImage, true);
						}
					});
					break;
				}
				case "combine": {
					this._slideViewContainer.combineSlides();
					break;
				}
				case "uncombine": {
					this._slideViewContainer.splitSlides();
					break;
				}
				case "sync": {
					this._slideViewContainer.syncSlides();
					break;
				}
				case "unsync": {
					this._slideViewContainer.unsyncSlides();
					break;
				}
				case "single": {
					this._slideViewContainer.makeSingleView();
					// Hack to prepare new view to get data
					webix.delay(() => {
						const selectedIds = listSlider.getSelectedId(true);
						const [firstSelected] = selectedIds;
						listSlider.unselectAll();
						listSlider.select(firstSelected || listSlider.getFirstId());
					});
					break;
				}
				default: {
					break;
				}
			}
		});

		this.on(modePanelView, POINTS_MODE_CHANGE_EVENT, (value) => {
			this._slideViewContainer.changePointsMode(value);
		});
	}

	_syncApplyHandler(listSlider) {
		const images = listSlider.data.serialize();
		this._slideViewContainer.setLayers(images);

		if (images.length) {
			webix.UIManager.setFocus(listSlider);
			listSlider.select(images[0].id);
			// Hack to fix bug with webix_selected class for selected item
			const itemNode = listSlider.getItemNode();
			if (itemNode) itemNode.classList.add("webix_selected");
		}
		else {
			this._clearSlideViewer();
		}
	}

	async _setSelectedImagesToViewer() {
		const listSlider = this._imagesSlider.$sliderList();
		const images = listSlider.getSelectedItem(true);
		await this._slideViewContainer.onImageSelect(images);
	}

	_toggleViewOverlay(hide) {
		const overlayInnerHTML = `<div class='data-subview-overlay'>
			<span class='overlay-text'>There are no items</span>
		</div>`;
		if (hide) {
			this.getRoot().hideOverlay();
		}
		else {
			this.getRoot().showOverlay(overlayInnerHTML);
		}
	}

	_clearSlideViewer() {
		// if no items, clear slide view layers
		this._slideViewContainer.onImageSelect([]);
	}

	syncSlider(dataCollection) {
		this._imagesSlider.syncSlider(dataCollection);
	}
}
