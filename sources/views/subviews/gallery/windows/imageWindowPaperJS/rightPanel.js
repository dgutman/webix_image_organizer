import {JetView} from "webix-jet";

import ListView from "../../../../components/listView";

export default class RightPanel extends JetView {
	constructor(app, config = {}) {
		super(app, config);
		this.annotations = new ListView(app, {name: "Annotations", newItemName: "Annotation"});
		this.layers = new ListView(app, {name: "Layers", newItemName: "Layer"});
		this.items = new ListView(app, {name: "Items", newItemName: "Item"});
	}

	config() {
		return {
			rows: [
				// this.annotations,
				this.layers,
				this.items
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
}
