import ListView from "../../../../../../components/listView";

/**
 * Description placeholder
 *
 * @export
 * @class LayerUI
 * @typedef {LayerUI}
 * @extends {ListView}
 */
export default class FeatureUI extends ListView {
	/**
	 * Creates an instance of LayerUI.
	 *
	 * @constructor
	 * @param {*} app
	 * @param {{ name: string; newItemName: string; }} [config={name: "Layer", newItemName: "Layer"}]
	 */
	constructor(app, config = {name: "Features", newItemName: "Creating..."}, annotationToolkit) {
		super(app, config);
		this._tk = annotationToolkit;
		this.paperScope = this._tk?.paperScope;
		this.paperScope?.project.on("feature-collection-added", ev => this._onFeatureCollectionAdded(ev));
	}

	init() {}

	ready(view) {
		this._view = view;
		this.attachEvents();
	}

	attachEvents() {}

	addItem() {
		const list = this.getList();
		const lastId = list.getLastId() ?? 0;
		list.add({name: `${this.newItemName} ${lastId + 1}`, id: Number(lastId) + 1});
		list.select(`${lastId + 1}`);
	}

	editItem() {
		// TODO: implement
	}

	deleteItem(id) {
		const listView = this.getList();
		listView.remove(id);
	}

	editStyle() {
		// TODO: implement
	}

	/**
	 * Handle the feature collection added event.
	 * @param {object} ev - The event object.
	 * @private
	 */
	_onFeatureCollectionAdded(ev) {
		// TODO: rewrite for webix
		let grp = ev.group;

		// // TODO: add item to LayerUI
		// let fc = new FeatureCollectionUI(grp, {
		// 	iconFactory: this.iconFactory
		// });
		// this.element.querySelector(".annotation-ui-feature-collections").appendChild(fc.element);
		// this._dragAndDrop.refresh();
		// fc.element.dispatchEvent(new Event("element-added"));
		const list = this.getList();
		list.add(grp);
		this.app.callEvent("app:annotation-ui-element-added");
	}
}
