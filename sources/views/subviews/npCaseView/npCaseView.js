import {DataCollection} from "webix";
import ScenesView from "../scenesView/scenesView";
import NpPanel from "./npPanel";
import NPTableView from "./npTableView";

export default class NPCaseViewClass extends ScenesView {
	constructor(app, config) {
		super(app, config);
		this._npPanel = new NpPanel(app);
		this._npTableView = new NPTableView(app);
	}

	config() {
		return {
			name: "npViewCell",
			css: "scenes-view",
			margin: 8,
			rows: [
				this._imagesSlider,
				this._npPanel,
				this._modePanelView,
				this._slideViewContainer
			]
		};
	}

	init() {
		this.sliderCollection = new DataCollection();
		this.dataCollection = new DataCollection();
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

		const npPanel = this._npPanel;
		const sliderCollection = this.sliderCollection;
		this.on(this.sliderCollection.data, "onSyncApply", () => {
			const stainArray = [];
			const items = webix.copy(this.dataCollection.data.pull);
			const itemsKeys = Object.keys(items);
			itemsKeys.forEach((key) => {
				if (items[key].meta
					&& items[key].meta.npSchema
					&& items[key].meta.npSchema.stainID
					&& !stainArray.includes(items[key].meta.npSchema.stainID)) {
					stainArray.push(items[key].meta.npSchema.stainID);
				}
			});
			const clickButtonHandler = function (id) {
				sliderCollection.filter((obj) => {
					return obj.meta
						&& obj.meta.npSchema
						&& obj.meta.npSchema.stainID
						&& $$(id)
						&& $$(id).config
						? obj.meta.npSchema.stainID === $$(id).config.value
						: false;
				});
			};
			if (stainArray.length > 0) {
				npPanel.setButtons(stainArray, clickButtonHandler);
			}

			const foundItems = sliderCollection.find((obj) => {
				return obj.meta
					&& obj.meta.npSchema
					&& obj.meta.npSchema.stainID
					? obj.meta.npSchema.stainID === "HE"
					: false;
			});

			if (foundItems.length > 0) {
				sliderCollection.filter((obj) => {
					return obj.meta
						&& obj.meta.npSchema
						&& obj.meta.npSchema.stainID
						? obj.meta.npSchema.stainID === "HE"
						: false;
				});
			}
		});

		this.on(listSlider, "onSelectChange", async () => {
			this._setSelectedImagesToViewer();
		});
	}

	syncSlider(dataCollection) {
		this.dataCollection.sync(dataCollection);
		this.sliderCollection.sync(dataCollection);
		this.sliderCollection.filter((obj) => {
			return obj.meta
				&& obj.meta.npSchema
				&& obj.meta.npSchema.stainID
				? obj.meta.npSchema.stainID === "HE"
				: false;
		});
		this._imagesSlider.syncSlider(this.sliderCollection);
	}
}
