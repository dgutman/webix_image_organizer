import {JetView} from "webix-jet";
import ImagesRowSlider from "./imagesRowSlider";
import SlideViewContainer from "./slideViewContainer";
import ModePanelView from "./modePanel";
import constants from "../../../constants";

const MODE_CHANGE_EVENT = constants.SCENES_VIEW_CHANGE_MODE_EVENT_NAME;
const POINTS_MODE_CHANGE_EVENT = constants.SCENES_VIEW_CHANGE_POINTS_MODE_EVENT_NAME;

export default class ScenesView extends JetView {
	constructor(app, config) {
		super(app, config);

		this._imagesSlider = new ImagesRowSlider(app, {height: 160});
		this._modePanelView = new ModePanelView(app);
		this._slideViewContainer = new SlideViewContainer(app);
	}

	config() {
		return {
			name: "scenesViewCell",
			margin: 8,
			rows: [
				this._imagesSlider,
				this._modePanelView,
				this._slideViewContainer
			]
		};
	}

	ready() {
		this._attachSliderEvents();
		this._attachChangeModeEvents();
	}

	_attachSliderEvents() {
		const listSlider = this._imagesSlider.$sliderList();

		this.on(listSlider.data, "onSyncApply", () => {
			const images = listSlider.data.serialize();
			this._slideViewContainer.setLayers(images);
			if (images.length) {
				webix.UIManager.setFocus(listSlider);
				// Hack to fix bug with webix_selected class for selected item
				webix.delay(() => {
					listSlider.select(images[0].id);
				});
			}
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
						this._setSelectedImagesToViewer();
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

	async _setSelectedImagesToViewer() {
		const listSlider = this._imagesSlider.$sliderList();
		const images = listSlider.getSelectedItem(true);
		await this._slideViewContainer.onImageSelect(images);
	}

	syncSlider(dataCollection) {
		this._imagesSlider.syncSlider(dataCollection);
	}
}
