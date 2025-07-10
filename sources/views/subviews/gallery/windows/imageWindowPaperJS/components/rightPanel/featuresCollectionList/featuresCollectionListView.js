import ListView from "../../../../../../../components/listView";
import annotationConstants from "../../../constants";
import editStyle from "../../toolbars/styleEditor";
import editorPopup from "../editorPopup";

/**
 * Description placeholder
 *
 * @export
 * @class LayerUI
 * @typedef {LayerUI}
 * @extends {ListView}
 */
export default class FeaturesCollectionListView extends ListView {
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
		this.updatePaperJSToolkit(annotationToolkit);
		this.featuresView = null;
		this._view = null;
		this.activeGroup = null;
		this.iconsVisibility.focusIcon = false;
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
				this.featuresView.handleAddItem(child);
			});
			this.featuresView.setActiveGroup(group);
		});
		list.attachEvent("onAfterDelete", () => {
			const selectedItem = list.getSelectedItem();
			this.featuresView.setActiveGroup(selectedItem?.group ?? null);
		});
	}

	addItem() {
		this.featuresView.clearAll();
		this._tk.addEmptyFeatureCollectionGroup();
	}

	addGroup(group) {
		const list = this.getList();
		this.clearFeaturesItems();
		const lastId = list.getLastId() ?? 0;
		const newItemId = lastId + 1;
		const itemId = list.add({name: `${group.displayName} ${newItemId}`, id: newItemId, group});
		list.select(`${newItemId}`);
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

	editItem(event, id) {
		const list = this.getList();
		const item = list.getItem(id);
		const node = list.getItemNode(id);
		const config = editorPopup.getConfig(item, editorPopup.ITEM_TYPES.GROUP, list);
		const editPopup = webix.ui(config);
		editPopup.show(node);
	}

	async deleteItem(ev, id) {
		const result = await webix.confirm({
			title: "Confirm delete",
			ok: "Yes",
			cancel: "No",
			text: "Delete group?"
		});
		if (result) {
			const listView = this.getList();
			listView.remove(id);
		}
	}

	editStyle(ev, id) {
		const list = this.getList();
		const item = list.getItem(id);
		const group = item.group;
		if (group) {
			const editStyleConfig = editStyle.getConfig(
				group,
				annotationConstants.ANNOTATION_PAPERJS_TYPES.GROUP
			);
			const editStylePopup = webix.ui(editStyleConfig);
			editStyle.attachEvents(group, annotationConstants.ANNOTATION_PAPERJS_TYPES.GROUP);
			const toolbarNode = this.getRoot()
				.getTopParentView()
				.queryView({id: annotationConstants.ANNOTATION_TOOLBAR_ID})
				?.getNode();
			editStylePopup.show(toolbarNode);
		}
		else {
			webix.message(`the group is not defined for item ${id}`, "error");
		}
	}

	updatePaperJSToolkit(tk) {
		this._tk = tk;
		this.paperScope = this._tk?.paperScope;
	}

	/**
	 * set view for features list
	 *
	 * @param {FeaturesListView} view
	 */
	setFeaturesView(view) {
		this.featuresView = view;
	}

	addChild(item) {
		this.featuresView.handleAddItem(item);
	}

	clearFeaturesItems() {
		if (this.featuresView) {
			this.featuresView.clearAll();
		}
	}

	getActiveGroup() {
		const list = this.getList();
		const selectedId = list.getSelectedId();
		if (selectedId) {
			return list.getItem(selectedId).group;
		}
		return null;
	}

	togglePaperJSVisibility(item, isVisible) {
		const group = item.group;
		if (group) {
			group.visible = !isVisible;
			this.paperScope?.project.view.update();
		}
	}
}
