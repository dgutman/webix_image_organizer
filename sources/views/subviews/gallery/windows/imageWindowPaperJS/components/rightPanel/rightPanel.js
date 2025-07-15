import { JetView } from "webix-jet";

// import { LayerUI } from "./osd-annotation/js/layerui.mjs";
import AnnotationListView from "./annotationList/annotationListView";
import FeaturesCollectionListView from "./featuresCollectionList/featuresCollectionListView";
import FeaturesListView from "./featuresList/featuresListView";
import { setAnnotationCounts } from "../../../../../../../models/annotationCounts";
import annotationApiRequests from "../../services/api";

export default class RightPanel extends JetView {
	constructor(app, config = {}) {
		super(app, config);
		this.annotationsView = new AnnotationListView(app);
		this.annotationsView.gravity = 0.5;
		this.featuresGroups = new FeaturesCollectionListView(app, {name: "Feature Collections", newItemName: "Group"});
		this.featuresGroups.gravity = 1;
		this.features = new FeaturesListView(app, {name: "Features", newItemName: "Creating..."});
		this.features.gravity = 1;
		this.featuresGroups.setFeaturesView(this.features);
		this.ID_SAVE_BUTTON = `save-button-id-${webix.uid()}`;
		this.deletedAnnotations = [];
		this._tk = null; // PaperJS toolkit
		this._view = null;
		this._itemId = null; // Item id set in index.js
	}

	config() {
		return {
			rows: [
				this.annotationsView,
				this.featuresGroups,
				this.features,
				{
					view: "button",
					label: "Save annotations",
					id: this.ID_SAVE_BUTTON
				},
				{gravity: 0.01}
			]
		};
	}

	init() {}

	ready(view) {
		this._view = view;
		const saveButtonView = this.getSaveButton();
		saveButtonView.attachEvent("onItemClick", () => this.saveAnnotationState());
	}

	getAnnotationsListView() {
		return this.annotationsView.getList();
	}

	getSaveButton() {
		return this.getRoot().queryView({id: this.ID_SAVE_BUTTON});
	}

	updatePaperJSToolkit(tk) {
		this._tk = tk;
		this.annotationsView.updatePaperJSToolkit(tk);
		this.featuresGroups.updatePaperJSToolkit(tk);
		this.features.updatePaperJSToolkit(tk);
		this.attachLayersEvents();
		this.attachItemsEvents();
	}

	updateOSDViewer(openSeadragonViewer) {
		this.annotationsView.updateOSDViewer(openSeadragonViewer);
	}

	attachLayersEvents() {
		this._tk.paperScope.project.on("feature-collection-added", (ev) => {
			this.features.clearAll();
			const group = ev.group;
			// group.on({
			// TODO: implement if necessary
			// })
			this.featuresGroups.addGroup(group);
		});
	}

	attachItemsEvents() {
		this._tk.paperScope.project.on("item-added", (ev) => {
			const item = ev.item;
			this.features.addItem(item);
		});
	}

	addAnnotation(annotation) {
		this.annotationsView.addAnnotationToList(annotation);
	}

	saveAnnotationState() {
		this.annotationsView.saveAnnotations();
	}

	setItemId(itemId) {
		this._itemId = itemId;
		this.annotationsView.setItemId(itemId);
	}

	async updateAnnotationsCount() {
		const count = await annotationApiRequests.getAnnotationsCount(this._itemId);
		setAnnotationCounts(this._itemId, count);
	}

	reset() {
		this.annotationsView.detachEvents();
		this.annotationsView.clearAll();
		this.featuresGroups.detachEvents();
		this.featuresGroups.clearAll();
		this.features.detachEvents();
		this.features.clearAll();
		this.deletedAnnotations = [];
	}
}
