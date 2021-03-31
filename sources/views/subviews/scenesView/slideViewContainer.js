import {JetView} from "webix-jet";
import MakerLayer from "../../../services/organizer/makerLayer";
import OrganizerFilters from "../../../services/organizer/organizerFilters";
import SingleSlideView from "./slideViews/singleSlideView/singleSlideView";
import SplitSlideView from "./slideViews/splitSlideView/splitSlideView";

const CONTAINER_VIEW_ID = "scenes-view-container";

export default class ScenesViewerWithControls extends JetView {
	constructor(app, config) {
		super(app, config);

		this._cnf = config || {};

		this._currentSlideView = new SingleSlideView(app, config);
		this._viewFilters = new OrganizerFilters();

		this._layers = {};
	}

	config() {
		return {
			...this._cnf,
			name: "scenesViewerContainer",
			localId: CONTAINER_VIEW_ID,
			margin: 8,
			rows: [
				this._currentSlideView
			]
		};
	}

	async onImageSelect(images) {
		const layers = images.map(image => this._layers[image._id]);
		return	this._currentSlideView.onImageSelect(images, layers);
	}

	setLayers(images) {
		this._layers = images.reduce((acc, image) => {
			acc[image._id] = MakerLayer.makeLayer({
				name: image.name,
				colorItem: null
			});
			return acc;
		}, {});
	}

	makeSplitView() {
		this._removeChilds();
		this._currentSlideView = this.app.createView(SplitSlideView);
		this.getRoot().addView(this._currentSlideView);
	}

	makeSingleView() {
		this._removeChilds();

		this._currentSlideView = this.app.createView(SingleSlideView);
		this.getRoot().addView(this._currentSlideView);
	}

	combineSlides() {
		this._currentSlideView.combineSlides();
	}

	splitSlides() {
		this._currentSlideView.splitSlides();
	}

	syncSlides() {
		this._currentSlideView.syncSlides();
	}

	unsyncSlides() {
		this._currentSlideView.unsyncSlides();
	}

	changePointsMode(mode) {
		this._currentSlideView.changePointsMode(mode);
	}

	_removeChilds() {
		const view = this.getRoot();
		const childs = view.getChildViews();
		childs.forEach((childView) => {
			view.removeView(childView.config.id);
		});
	}
}
