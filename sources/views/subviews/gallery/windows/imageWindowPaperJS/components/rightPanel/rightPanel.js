import { JetView } from "webix-jet";

// import { LayerUI } from "./osd-annotation/js/layerui.mjs";
import AnnotationListView from "./annotationListView";
import FeaturesUI from "./featureUI";
import FeaturesCollectionUI from "./featuresCollectionUI";
import annotationApiRequests from "../../services/api";

export default class RightPanel extends JetView {
	constructor(app, config = {}) {
		super(app, config);
		// TODO: overwrite add items methods;
		this.annotationsView = new AnnotationListView(app);
		this.annotationsView.gravity = 0.5;
		this.featuresGroups = new FeaturesCollectionUI(app, {name: "Feature Collections", newItemName: "Group"});
		this.featuresGroups.gravity = 1;
		this.features = new FeaturesUI(app, {name: "Features", newItemName: "Creating..."});
		this.features.gravity = 1;
		this.featuresGroups.setFeaturesView(this.features);
		this.ID_SAVE_BUTTON = `save-button-id-${webix.uid()}`;
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
		saveButtonView.attachEvent("onItemClick", () => {
			const annotationsListView = this.getAnnotationsListView();
			const annotationListItems = annotationsListView.serialize();
			annotationListItems.forEach(async (annotationItem) => {
				if (annotationItem._id) {
					annotationApiRequests.updateAnnotation(annotationItem._id, annotationItem.annotation);
				}
				else {
					const itemId = annotationItem.itemId;
					const newAnnotation = itemId
						? await annotationApiRequests.createAnnotation(itemId, annotationItem.annotation)
						: null;
					if (newAnnotation) {
						this.annotationsView.updateAnnotation(annotationItem.id, newAnnotation);
					}
				}
			});
		});
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
			const group = ev.group;
			// group.on({
				
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
		this.annotationsView.addAnnotation(annotation);
	}

	saveAnnotationState() {
	}

	reset() {
		this.annotationsView.clearAll();
		this.featuresGroups.clearAll();
		this.features.clearAll();
	}
}
