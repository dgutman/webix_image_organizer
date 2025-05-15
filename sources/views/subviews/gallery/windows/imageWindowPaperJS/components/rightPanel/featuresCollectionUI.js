import ListView from "../../../../../../components/listView";

/**
 * Description placeholder
 *
 * @export
 * @class LayerUI
 * @typedef {LayerUI}
 * @extends {ListView}
 */
export default class FeaturesCollection extends ListView {
	/**
	 * Creates an instance of LayerUI.
	 *
	 * @constructor
	 * @param {*} app
	 * @param {{ name: string; newItemName: string; }} [config={name: "Feature Collections", newItemName: "Annotation Group"}]
	 */
	constructor(app, config = {name: "Feature Collections", newItemName: "Annotation Group"}, annotationToolkit) {
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

	attachEvents() {
		const list = this.getList();
		list.attachEvent("onAfterSelect", (id) => {
			const item = list.getItem(id);
			const group = item.group;
			const children = group.getChildren();
			this.featuresView.clearAll();
			children.forEach((child) => {
				this.featuresView.addItem(child);
			});
		});
	}

	addItem() {
		this.featuresView.clearAll();
		this._tk.addEmptyFeatureCollectionGroup();
	}

	addGroup(group) {
		const list = this.getList();
		this.featuresView.clearAll();
		const lastId = list.getLastId() ?? 0;
		const itemId = list.add({name: `${group.displayName} ${lastId + 1}`, id: Number(lastId) + 1, group});
		list.select(`${lastId + 1}`);
		group.on({
			"selection:mouseenter": () => {
				// TODO: implement if necessary
			},
			"selection:mouseleave": () => {
				// TODO: implement if necessary
			},
			selected: () => {
				// TODO: implement if necessary
				list.select(itemId);
			},
			deselected: () => {
				list.unselect(itemId);
			},
			"display-name-changed": () => {
				const item = list.getItem(itemId);
				item.name = group.displayName;
				list.updateItem(itemId, item);
			},
			removed: () => {
				if (Number(itemId) === Number(list.getSelectedId())) {
					this.featuresView.clearAll();
				}
				if (list.getItem(itemId)) {
					list.remove(itemId);
				}
			},
			"child-added": (ev) => {
				const item = ev.item;
				this.addChild(item);
			}
		});
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

	updatePaperJSToolkit(tk) {
		this._tk = tk;
	}

	/**
	 * set view for features list
	 *
	 * @param {FeatureUI} view
	 */
	setFeaturesView(view) {
		this.featuresView = view;
	}

	addChild(item) {
		this.featuresView.addItem(item);
	}
}
