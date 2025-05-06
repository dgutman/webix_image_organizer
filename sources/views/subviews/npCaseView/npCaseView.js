import {DataCollection} from "webix";

import NpPanel from "./npPanel";
import NPSingleSlideView from "./npSingleSlideView";
import SlideViewContainer from "./slideViewContainer";
import constants from "../../../constants";
import NPCaseViewService from "../../../services/npCaseView/npCaseViewService";
import collapser from "../../components/collapser";
import ImagesRowSlider from "../scenesView/imagesRowSlider";
import ScenesView from "../scenesView/scenesView";

const npPanelCollapserName = "npPanelCollapser";
const imagesRowSliderCollapserName = "imagesRowSliderCollapserName";
const toggleStainAndRegionId = "toggleStainAndRegionId";

export default class NPCaseView extends ScenesView {
	constructor(app, config) {
		super(app, config);
		this._npPanel = new NpPanel(app, {scroll: "x"});
		this._imagesRowSliderId = webix.uid();
		const sliderConfig = {
			height: 160,
			id: this._imagesRowSliderId,
		};
		this._imagesSlider = new ImagesRowSlider(app, sliderConfig, this);
		this._slideViewContainer = new SlideViewContainer(app);
		const currentSlideView = new NPSingleSlideView(app);
		this._slideViewContainer.setCurrentSlideView(currentSlideView);
		this.npPanelCollapserName = `${npPanelCollapserName}-${webix.uid()}`;
		this.imagesRowSliderCollapserName = `${imagesRowSliderCollapserName}-${webix.uid()}`;
		this.toggleStainAndRegionId = `${toggleStainAndRegionId}-${webix.uid()}`;
	}

	config() {
		const panelCollapser = collapser.getConfig(
			this._npPanel.getNpPanelId(),
			{type: "top", closed: false},
			this.npPanelCollapserName,
			"Images Attributes"
		);
		const imagesSliderCollapser = collapser.getConfig(
			this._imagesRowSliderId,
			{type: "top", closed: false},
			this.imagesRowSliderCollapserName,
			"Images slider"
		);
		const toggleButton = {
			id: this.toggleStainAndRegionId,
			view: "switch",
			name: "toggleType",
			css: "toggleStainAndRegion",
			offLabel: "Region",
			onLabel: "Stain",
			width: 100,
			value: 1
		};
		const modePanel = {
			cols: [
				toggleButton,
				this._modePanelView
			]
		};
		return {
			name: "npViewCell",
			css: "scenes-view",
			margin: 8,
			rows: [
				this._imagesSlider,
				imagesSliderCollapser,
				this._npPanel,
				panelCollapser,
				modePanel,
				this._slideViewContainer
			]
		};
	}

	init() {
		this.sliderCollection = new DataCollection();
		this.dataCollection = new DataCollection();
	}

	ready(view) {
		const imagesSliderCollapser = this.getImagesRowSliderCollapserView();
		const panelCollapser = this.getPanelCollapserView();
		this.npCaseViewService = new NPCaseViewService(
			view,
			this._imagesSlider,
			imagesSliderCollapser,
			this._npPanel,
			panelCollapser,
			this._slideViewContainer,
		);
		webix.extend(view, webix.OverlayBox);
		this._attachSliderEvents();
		this._attachNPCaseViewEvents();
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
		const switcherView = this.getSwitcherView();
		const updateView = () => {
			const npSchemaProperties = [];
			const items = webix.copy(this.dataCollection.data.pull);
			const itemsKeys = Object.keys(items);
			if (switcherView.getValue()) {
				itemsKeys.forEach((key) => {
					if (items[key].meta?.npSchema?.stainID
						&& !npSchemaProperties.includes(items[key].meta.npSchema.stainID)) {
						npSchemaProperties.push(items[key].meta.npSchema.stainID);
					}
				});
			}
			else {
				itemsKeys.forEach((key) => {
					if (items[key].meta?.npSchema?.regionName
						&& !npSchemaProperties.includes(items[key].meta.npSchema.regionName)) {
						npSchemaProperties.push(items[key].meta.npSchema.regionName);
					}
				});
			}
			const clickButtonHandler = function (id) {
				if (switcherView.getValue()) {
					sliderCollection.filter((obj) => {
						return obj.meta?.npSchema?.stainID
							&& ($$(id))?.config
							? obj.meta.npSchema.stainID === $$(id).config.value
							: false;
					});
					const buttons = npPanel.getButtons();
					buttons.forEach((button) => {
						const buttonNode = button.getNode();
						buttonNode.classList.remove("np_button_active");
						buttonNode.classList.add("np_button");
					});
					$$(id).getNode().classList.remove("np_button");
					$$(id).getNode().classList.add("np_button_active");
				}
				else {
					sliderCollection.filter((obj) => {
						return obj.meta?.npSchema?.regionName
							&& ($$(id))?.config
							? obj.meta.npSchema.regionName === $$(id).config.value
							: false;
					});
					const buttons = npPanel.getButtons();
					buttons.forEach((button) => {
						const buttonNode = button.getNode();
						buttonNode.classList.remove("np_button_active");
						buttonNode.classList.add("np_button");
					});
					$$(id).getNode().classList.remove("np_button");
					$$(id).getNode().classList.add("np_button_active");
				}
			};

			if (npSchemaProperties.length > 0) {
				npPanel.setButtons(npSchemaProperties, clickButtonHandler);
			}

			const foundItems = sliderCollection.find((obj) => {
				return obj.meta?.npSchema?.stainID
					? obj.meta.npSchema.stainID === "HE"
					: false;
			});

			if (foundItems.length > 0) {
				sliderCollection.filter((obj) => {
					return obj.meta?.npSchema?.stainID
						? obj.meta.npSchema.stainID === "HE"
						: false;
				});
			}
		};
		this.on(this.sliderCollection.data, "onSyncApply", updateView);

		this.on(listSlider, "onSelectChange", async () => {
			this._setSelectedImagesToViewer();
		});

		this.on(switcherView, "onChange", updateView);

		this.on(this.getRoot(), "onViewShow", async () => {
			this._setSelectedImagesToViewer();
		});
	}

	_attachNPCaseViewEvents() {}

	syncSlider(dataCollection) {
		this.dataCollection.sync(dataCollection);
		this.sliderCollection.sync(dataCollection);
		this.sliderCollection.filter((obj) => {
			return obj.meta?.npSchema?.stainID
				? obj.meta.npSchema.stainID === "HE"
				: false;
		});
		this._imagesSlider.syncSlider(this.sliderCollection);
	}

	getSwitcherView() {
		return this.$$(this.toggleStainAndRegionId);
	}

	closeCollapsers() {
		this.npCaseViewService.closeCollapsers();
	}

	getPanelCollapserView() {
		return this.getRoot().queryView({name: this.npPanelCollapserName});
	}

	getImagesRowSliderCollapserView() {
		return this.getRoot().queryView({name: this.imagesRowSliderCollapserName});
	}
}
