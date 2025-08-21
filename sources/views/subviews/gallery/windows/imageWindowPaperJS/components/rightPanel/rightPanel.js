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
		this.features = new FeaturesListView(app, {name: "Features", newItemName: "Creating..."}, null, this);
		this.features.gravity = 1;
		this.featuresGroups.setFeaturesView(this.features);
		this.ID_SAVE_BUTTON = `save-button-id-${webix.uid()}`;
		this.deletedAnnotations = [];
		this._tk = null; // PaperJS toolkit
		this._view = null;
		this._itemId = null; // Item id set in index.js
		this._appEvents = [];
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
		const featuresGroupsListView = this.getFeaturesGroupsListView();
		const featuresListView = this.getFeaturesListView();
		const loadingEvent = this.app.attachEvent("app:paperjs:annotation:loading", () => {
			if (!featuresGroupsListView.showProgress) {
				webix.extend(featuresGroupsListView, webix.ProgressBar);
			}
			if (!featuresListView.showProgress) {
				webix.extend(featuresListView, webix.ProgressBar);
			}
			featuresGroupsListView.showProgress();
			featuresListView.showProgress();
		});
		const loadedEvent = this.app.attachEvent("app:paperjs:annotation:loaded", () => {
			console.log("Annotations loaded");
			if (featuresGroupsListView.hideProgress) {
				featuresGroupsListView.hideProgress();
			}
			if (featuresListView.hideProgress) {
				featuresListView.hideProgress();
			}
		});
		this._appEvents.push(
			loadingEvent,
			loadedEvent
		);
	}

	destroy() {
		this._appEvents.forEach((eventId) => {
			this.app.detachEvent(eventId);
		});
		this._appEvents = [];
	}

	getAnnotationsListView() {
		return this.annotationsView.getList();
	}

	getFeaturesGroupsListView() {
		return this.featuresGroups.getList();
	}

	getFeaturesListView() {
		return this.features.getList();
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

	async addItemAnnotations(itemId) {
		const id = itemId ?? this._itemId;
		const annotations = await annotationApiRequests.getAnnotations(id);
		if (annotations) {
			annotations.forEach((a) => {
				// this._rightPanel.addItemAnnotations(a);
				this.annotationsView.addAnnotationToList(a);
			});
		}
	}

	async saveAnnotationState() {
		try {
			await this.annotationsView.saveAnnotations();
		}
		catch (error) {
			if (error.annotationsToRestore) {
				error.annotationsToRestore.forEach((/* a */) => {
					// TODO: restore annotations
				});
			}
		}
	}

	setItemId(itemId) {
		this._itemId = itemId;
		this.annotationsView.setItemId(itemId);
	}

	getItemId() {
		return this._itemId;
	}

	async updateAnnotationsCount() {
		const count = await annotationApiRequests.getAnnotationsCount(this._itemId);
		setAnnotationCounts(this._itemId, count);
	}

	setModifiedFlag(isModified) {
		this.annotationsView.setModifiedFlag(isModified);
	}

	reset() {
		this.annotationsView.clearAll();
		this.featuresGroups.clearAll();
		this.features.clearAll();
		this.deletedAnnotations = [];
	}
}
