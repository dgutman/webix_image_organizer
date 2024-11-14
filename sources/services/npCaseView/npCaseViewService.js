import npDataTableModel from "../../models/npdataTableModel";

export default class NPCaseViewService {
	constructor(
		view,
		imagesSlider,
		imagesSliderCollapser,
		npPanel,
		panelCollapser,
		sliderViewContainer,
	) {
		this._view = view;
		this._imagesSlider = imagesSlider;
		this._imagesSliderCollapser = imagesSliderCollapser;
		this._npPanel = npPanel;
		this._panelCollapser = panelCollapser;
		this._sliderViewContainer = sliderViewContainer;
		this._ready();
	}

	_ready() {
		this.npDataCollection = npDataTableModel.getNPDataCollection();
		this.npDataCollection.attachEvent("onAfterLoad", () => {});
	}

	closeCollapsers() {
		this._imagesSliderCollapser.config.setClosedState();
		this._panelCollapser.config.setClosedState();
		const currentSlideView = this._sliderViewContainer.getCurrentSlideView();
		currentSlideView?.closeCollapsers();
	}
}
