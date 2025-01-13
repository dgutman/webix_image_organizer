import { JetView } from "webix-jet";

// import { LayerUI } from "./osd-annotation/js/layerui.mjs";
import FeaturesUI from "./featureUI";
import FeaturesCollectionUI from "./featuresCollectionUI";
import LayerUI from "./layerUI";

export default class RightPanel extends JetView {
	constructor(app, config = {}) {
		super(app, config);
		// TODO: overwrite add items methods;
		this.annotations = new LayerUI(app, {name: "Annotations", newItemName: "Annotation"});
		this.annotations.gravity = 1;
		this.featuresGroups = new FeaturesCollectionUI(app, {name: "Feature Collections", newItemName: "Annotation Group"});
		this.featuresGroups.gravity = 1;
		this.features = new FeaturesUI(app, {name: "Features", newItemName: "Creating..."});
		this.features.gravity = 1;
		// this.items = new ListView(app, {name: "Items", newItemName: "Item"});
		this.ID_SAVE_BUTTON = `save-button-id-${webix.uid()}`;
	}

	config() {
		return {
			rows: [
				this.annotations,
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
	}

	attachAnnotationEvents() {
		// TODO: implement
	}

	attachLayersEvents() {
		// TODO: implement
	}

	attachItemsEvents() {
		// TODO: implement
	}
}
