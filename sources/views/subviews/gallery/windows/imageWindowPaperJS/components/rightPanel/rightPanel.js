import { JetView } from "webix-jet";

// import { LayerUI } from "./osd-annotation/js/layerui.mjs";
import FeaturesUI from "./featureUI";
import FeaturesCollectionUI from "./featuresCollectionUI";

export default class RightPanel extends JetView {
	constructor(app, config = {}) {
		super(app, config);
		// TODO: overwrite add items methods;
		this.featuresGroups = new FeaturesCollectionUI(app, {name: "Feature Collections", newItemName: "Group"});
		this.featuresGroups.gravity = 1;
		this.features = new FeaturesUI(app, {name: "Features", newItemName: "Creating..."});
		this.features.gravity = 1;
		this.featuresGroups.setFeaturesView(this.features);
		// this.items = new ListView(app, {name: "Items", newItemName: "Item"});
		this.ID_SAVE_BUTTON = `save-button-id-${webix.uid()}`;
	}

	config() {
		return {
			rows: [
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
	}

	getItemsList() {
		return this.items.getList();
	}

	getAnnotationsList() {
		return this.annotations.getList();
	}

	getSaveButton() {
		return this.getRoot().queryView({id: this.ID_SAVE_BUTTON});
	}

	updatePaperJSToolkit(tk) {
		this._tk = tk;
		this.featuresGroups._tk = tk;
		this.features._tk = tk;
		this.attachLayersEvents();
		this.attachItemsEvents();
	}

	attachLayersEvents() {
		// TODO: implement
		this._tk.paperScope.project.on("feature-collection-added", (ev) => {
			const group = ev.group;
			// group.on({
				
			// })
			this.featuresGroups.addGroup(group);
		});
	}

	attachItemsEvents() {
		// TODO: implement
		this._tk.paperScope.project.on("item-added", (ev) => {
			const item = ev.item;
			this.features.addItem(item);
		});
	}
}
