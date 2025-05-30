import TimedOutBehavior from "../../../../../../../utils/timedOutBehavior";
import ListView from "../../../../../../components/listView";

/**
 * Description placeholder
 *
 * @export
 * @class FeaturesListView
 * @typedef {FeaturesListView}
 * @extends {ListView}
 */
export default class FeaturesListView extends ListView {
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
		this.attachEvents();
		this._view = null;
		this.activeGroup = null;
	}

	init() {}

	ready(view) {
		this._view = view;
		this.attachEvents();
	}

	attachEvents() {
		this.paperScope?.project.on("feature-collection-added", ev => this._onFeatureCollectionAdded(ev));
	}

	handleAddItem(paperjsItem) {
		if (!paperjsItem) {
			return;
		}
		const list = this.getList();
		const lastId = list.getLastId() ?? 0;
		const itemId = list.add({name: `${paperjsItem.displayName} ${lastId + 1}`, id: Number(lastId) + 1, feature: paperjsItem});
		list.select(`${lastId + 1}`);
		paperjsItem.on({
			selected: () => {
				list.select(itemId);
			},
			deselected: () => {
				list.unselect(itemId);
			},
			"selection:mouseenter": () => {
				// TODO: implement
			},
			"selection:mouseleave": () => {
				// TODO: implement
			},
			"item-replaced": (ev) => {
				console.log("item-replaced", ev);
				// TODO: implement
			},
			"display-name-changed": (ev) => {
				const item = list.getItem(itemId);
				item.name = paperjsItem.displayName;
				list.updateItem(itemId, item);
			},
			removed: (ev) => {
				if (ev.item === paperjsItem) {
					if (list.getItem(itemId)) {
						list.remove(itemId);
					}
				}
			}
		});
	}

	addItem() {
		// const list = this.getList();
		// list.add({name: this.config.newItemName, id: list.getLastId() + 1});
		const group = this.activeGroup;
		if (group) {
			const item = group.featureCollectionUI.createFeature();
			item.select();
		}
	}

	editItem(ev, id) {
		// TODO: implement
		const list = this.getList();
		const item = list.getItem(id);
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
		const features = grp.getFeatures();
		features.forEach((f) => {
			list.add(f);
		});
		this.app.callEvent("app:feature-ui-element-added");
	}

	setActiveGroup(activeGroup) {
		this.activeGroup = activeGroup;
		this.updateAddButtonState();
	}

	updateAddButtonState() {
		const addButton = this.getAddButton();
		if (this.activeGroup) {
			addButton.enable();
		}
		else {
			addButton.disable();
		}
	}

	handleFocus(event, id) {
		const list = this.getList();
		const item = list.getItem(id);
		if (item) {
			const feature = item.feature;
			this.centerItem(feature);
		}
	}

	centerItem(paperItem, immediately = false) {
		const viewport = paperItem.project.overlay.viewer.viewport;
		const bounds = paperItem.bounds;
		const center = viewport.imageToViewportCoordinates(bounds.center.x, bounds.center.y);
		const scale = 1.5;
		const xy = viewport.imageToViewportCoordinates(
			bounds.center.x - bounds.width / scale,
			bounds.center.y - bounds.height / scale
		);
		const wh = viewport.imageToViewportCoordinates(
			2 * bounds.width / scale,
			2 * bounds.height / scale
		);
		const rect = new OpenSeadragon.Rect(xy.x, xy.y, wh.x, wh.y);
		const vb = viewport.getBounds();
		if (rect.width > vb.width || rect.height > vb.height) {
			viewport.fitBounds(rect, immediately);
		}
		else {
			viewport.panTo(center, immediately);
		}
	}
}
