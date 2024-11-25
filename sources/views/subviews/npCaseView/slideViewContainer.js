import NPSingleSlideView from "./npSingleSlideView";
import NPSplitSlideView from "./npSplitSlideView";
import MakerLayer from "../../../services/organizer/makerLayer";
import OrganizerFilters from "../../../services/organizer/organizerFilters";
import ScenesViewerWithControls from "../scenesView/slideViewContainer";

const CONTAINER_VIEW_ID = "np-view-container";

export default class NPViewerWithControls extends ScenesViewerWithControls {
	constructor(app, config) {
		super(app, config);

		this._cnf = config || {};
		this._containerViewId = `${CONTAINER_VIEW_ID}-${webix.uid()}`;

		this._currentSlideView = new NPSingleSlideView(app, config);
		this._viewFilters = new OrganizerFilters();

		this._layers = {};
	}

	config() {
		return {
			...this._cnf,
			name: "NPViewerContainer",
			localId: this._containerViewId,
			margin: 8,
			rows: [
				this._currentSlideView
			]
		};
	}

	ready() {
		this.attachEvents();
	}

	attachEvents() {
		this.on(this.getRoot(), "onDestruct", () => {
			console.log("destructor");
		});
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
		this._currentSlideView = this.app.createView(NPSplitSlideView);
		this.getRoot().addView(this._currentSlideView);
	}

	makeSingleView() {
		this._removeChilds();
		this._currentSlideView = this.app.createView(NPSingleSlideView);
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

	getCurrentSlideView() {
		return this._currentSlideView;
	}

	setCurrentSlideView(slideView) {
		this._currentSlideView = slideView;
	}
}
