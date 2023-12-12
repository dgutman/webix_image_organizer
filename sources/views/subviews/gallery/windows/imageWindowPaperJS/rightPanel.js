import {JetView} from "webix-jet";

import Items from "./itemView";
import Layers from "./layerView";

export default class RightPanel extends JetView {
	constructor(app, config = {}) {
		super(app, config);
		this.layers = new Layers(app);
		this.items = new Items(app);
	}

	config() {
		return {
			rows: [
				this.layers,
				this.items
			]
		};
	}

	init() {}

	ready(view) {
		this._view = view;
	}
}
