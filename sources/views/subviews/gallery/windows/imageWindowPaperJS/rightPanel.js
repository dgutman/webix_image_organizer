import {JetView} from "webix-jet";

import ListView from "../../../../components/listView";

/**
 * RightPanel
 *
 * @export
 * @class RightPanel
 * @typedef {RightPanel}
 * @extends {JetView}
 */
export default class RightPanel extends JetView {
	constructor(app, config = {}) {
		super(app, config);
		this.annotations = new ListView(app, {name: "Annotations", newItemName: "Annotation"});
		this.layers = new ListView(app, {name: "Layers", newItemName: "Layer"});
		this.items = new ListView(app, {name: "Items", newItemName: "Item", isAddButtonHidden: true});
		this.ID_SAVE_BUTTON = `save-button-id-${webix.uid()}`;
	}

	config() {
		return {
			rows: [
				this.annotations,
				this.layers,
				this.items,
				{
					view: "button",
					label: "Save annotations",
					id: this.ID_SAVE_BUTTON
				}
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

	getLayersList() {
		return this.layers.getList();
	}

	getAnnotationsList() {
		return this.annotations.getList();
	}

	getSaveButton() {
		return this.getRoot().queryView({id: this.ID_SAVE_BUTTON});
	}
}
