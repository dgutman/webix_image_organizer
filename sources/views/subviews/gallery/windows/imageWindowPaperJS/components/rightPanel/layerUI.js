import ListView from "../../../../../../components/listView";

/**
 * Description placeholder
 *
 * @export
 * @class LayerUI
 * @typedef {AnnotationUI}
 * @extends {ListView}
 */
export default class LayerUI extends ListView {
	/**
	 * Creates an instance of LayerUI.
	 *
	 * @constructor
	 * @param {*} app
	 * @param {{ name: string; newItemName: string; }} [config={name: "Annotation", newItemName: "new Annotation"}]
	 */
	constructor(app, config = {name: "Annotation", newItemName: "new Annotation"}, annotationToolkit) {
		super(app, config);
		this._tk = annotationToolkit;
		this.paperScope = this._tk?.paperScope;
	}

	init() {
		// TODO: overwrite add items methods;
	}

	ready(view) {
		this._view = view;
		// TODO: implement
		// const list = this.getList();
		// if (list.serialize().length < 1) {

		// }
		this.attachEvents();
	}

	attachEvents() {
		if (this.paperScope) {
			this.paperScope.project.on("feature-collection-added", ev => this._onFeatureCollectionAdded(ev));
		}
	}

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

	_onFeatureCollectionAdded(ev) {
		let grp = ev.group;
		let fc = new FeatureCollectionUI(grp, {
			iconFactory: this.iconFactory
		});
		this.element.querySelector(".annotation-ui-feature-collections").appendChild(fc.element);
		this._dragAndDrop.refresh();
		fc.element.dispatchEvent(new Event("element-added"));
		setTimeout(function() {fc.element.classList.add("inserted"); }, 30);//this allows opacity fade-in to be triggered
	}
}
