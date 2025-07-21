import ListView from "../../../../../../../components/listView";
import annotationConstants from "../../../constants";
import styleEditor from "../../toolbars/styleEditor";
import editorPopup from "../editorPopup";

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
		this.updatePaperJSToolkit(annotationToolkit);
		this._view = null;
		this.activeGroup = null;
		this.eventsList = [];
	}

	init() {}

	ready(view) {
		this._view = view;
		const list = this.getList();
		list.define("multiselect", true);
		list.refresh();
		this.attachEvents();
	}

	attachEvents() {
		this.paperScope?.project.on("feature-collection-added", ev => this._onFeatureCollectionAdded(ev));
		const list = this.getList();
		this._onItemClick = list.attachEvent("onItemClick", (id) => {
			const item = list.getItem(id);
			if (item?.feature) {
				item.feature.select();
			}
		});
		this.eventsList.push(
			this._onItemClick,
		);
	}

	detachEvents() {
		const list = this.getList();
		this.eventsList.forEach((eventId) => {
			list.detachEvent(eventId);
		});
	}

	handleAddItem(paperjsItem) {
		if (!paperjsItem) {
			return;
		}
		const list = this.getList();
		const lastId = list.getLastId() ?? "0";
		const itemId = list.add({name: `${paperjsItem.displayName}`, id: String(Number(lastId) + 1), feature: paperjsItem});
		list.select(`${itemId}`);
		this.attachPaperjsItemEvents(paperjsItem, itemId);
	}

	handleReplaceItem(itemId, paperjsItem) {
		if (!paperjsItem) {
			return;
		}
		const list = this.getList();
		const item = list.getItem(itemId);
		if (item) {
			item.feature = paperjsItem;
			list.updateItem(itemId, item);
			this.attachPaperjsItemEvents(paperjsItem, itemId);
		}
	}

	attachPaperjsItemEvents(paperjsItem, itemId) {
		const list = this.getList();
		paperjsItem.on({
			selected: () => {
				if (list.getItem(itemId)) {
					const selectedCount = this._tk?.paperScope?.project?.selectedItems?.length || 0;
					if (selectedCount > 1) {
						list.select(itemId, true);
					}
					else {
						list.select(itemId);
					}
				}
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
				this.detachPaperjsItemEvents(paperjsItem);
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

	detachPaperjsItemEvents(paperjsItem) {
		paperjsItem.off({
			selected: () => {},
			deselected: () => {},
			"selection:mouseenter": () => {},
			"selection:mouseleave": () => {},
			"item-replaced": () => {},
			"display-name-changed": () => {},
			removed: () => {}
		});
	}

	addItem() {
		const group = this.activeGroup;
		if (group) {
			const item = group.featureCollectionUI.createFeature();
			item.select();
		}
	}

	editItem(event, id) {
		const list = this.getList();
		const item = list.getItem(id);
		const node = list.getItemNode(id);
		const config = editorPopup.getConfig(item, editorPopup.ITEM_TYPES.FEATURE, list);
		const editPopup = webix.ui(config);
		editPopup.show(node);
	}

	async deleteItem(ev, id) {
		const result = await webix.confirm({
			title: "Confirm delete",
			ok: "Yes",
			cancel: "No",
			text: "Delete feature?"
		});
		if (result) {
			const listView = this.getList();
			listView.remove(id);
		}
	}

	editStyle(ev, id) {
		const list = this.getList();
		const item = list.getItem(id);
		if (item?.feature) {
			if (styleEditor.isOpened()) {
				styleEditor.destructPopup();
			}
			const popupConfig = styleEditor.getConfig(
				item.feature,
				annotationConstants.ANNOTATION_PAPERJS_TYPES.FEATURE
			);
			const popup = this.webix.ui(popupConfig);
			styleEditor.attachEvents(item.feature, annotationConstants.ANNOTATION_PAPERJS_TYPES.FEATURE);
			popup.show();
			const toolbarNode = this.getRoot()
				.getTopParentView()
				.queryView({id: annotationConstants.ANNOTATION_TOOLBAR_ID})
				?.getNode();
			popup.show(toolbarNode);
		}
	}

	updatePaperJSToolkit(tk) {
		this._tk = tk;
		this.paperScope = this._tk?.paperScope;
	}

	/**
	 * Handle the feature collection added event.
	 * @param {object} ev - The event object.
	 * @private
	 */
	_onFeatureCollectionAdded(ev) {
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

	togglePaperJSVisibility(item, isVisible) {
		if (item.feature) {
			item.feature.visible = !isVisible;
			this.paperScope?.project.view.update();
		}
	}
}
