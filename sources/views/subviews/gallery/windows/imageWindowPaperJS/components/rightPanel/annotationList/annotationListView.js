import annotationModel from "./annotationModel";
import ListView from "../../../../../../../components/listView";
import adapter from "../../../services/adapter";
import editorPopup from "../editorPopup";

export default class AnnotationListView extends ListView {
	constructor(app, config = {name: "Annotations", newItemName: "Annotation"}, openSeadragonViewer) {
		super(app, config);
		this._openSeadragonViewer = openSeadragonViewer;
		this.eventsList = [];
	}

	config() {
		const list = {
			view: "list",
			id: this.ID_LIST,
			css: "right-panel-list",
			template: (obj) => {
				const hidden = true;
				const editIcon = '<span class="icon edit-item fas fa-edit font-size-12"></span>';
				const deleteIcon = '<span class="icon delete-item fas fa-times-circle font-size-12"></span>';
				const visibleIcon = `<span class="icon visible fas fa-eye ${hidden ? "hidden-block" : ""} font-size-12"></span>`;
				const invisibleIcon = `<span class="icon invisible fas fa-eye-slash ${hidden ? "hidden-block" : ""} font-size-12"></span>`;
				const name = `<span class="right-panel-list__item_name">${obj.annotation.name}</span>`;
				const element = `<div class="right-panel-list__item" style="padding-left:18px" title="${obj.annotation.name}\n${obj.annotation.description}">
									${name}
									${invisibleIcon}
									${visibleIcon}
									${editIcon}
									${deleteIcon}
								</div>`;
				return element;
			},
			type: {
				height: 30
			},
			onClick: {
				"edit-item": (node, id) => {
					const listView = this.getList();
					const item = listView.getItem(id);
					this.editItem(item, node);
				},
				"delete-item": async (event, id) => {
					const item = this.getList().getItem(id);
					const result = await webix.confirm({
						title: "Confirm delete",
						ok: "Yes",
						cancel: "No",
						text: `Delete annotation "${item.annotation.name}"?`
					});
					if (result) {
						this.deleteItem(id);
						annotationModel.deleteItemAnnotation(id);
					}
				},
			},
			select: true,
			autowidth: true,
			gravity: 1,
			scroll: true,
			multiselect: false,
		};

		/** @type {webix.ui.labelConfig} */
		const label = {
			view: "label",
			align: "left",
			borderless: true,
			gravity: 3,
			label: this._name,
		};

		const addButton = {
			view: "button",
			id: this.ID_ADD_BUTTON,
			click: () => {
				this.addItem({annotation: {}, itemId: this.itemId});
			},
			label: "Add new",
			height: 30,
			gravity: 1,
			width: 100,
		};

		return {
			rows: [
				{
					cols: [
						{width: 10},
						label,
						addButton
					]
				},
				list,
			]
		};
	}

	init() {}

	ready(/* view */) {}

	updatePaperJSToolkit(tk) {
		this.detachEvents();
		this._tk = tk;
		this.attachEvents();
	}

	updateOSDViewer(openSeadragonViewer) {
		this._openSeadragonViewer = openSeadragonViewer;
	}

	attachEvents() {
		const list = this.getList();
		this._onBeforeSelectEvent = list.attachEvent("onBeforeSelect", (id, selectionFlag) => {
			const selectedId = list.getSelectedId();
			if (selectedId === id) {
				return false;
			}
			const selectedItem = list.getSelectedItem();
			if (selectedItem) {
				this.updateAnnotation(selectedId);
			}
			return selectionFlag;
		});
		this._onAfterSelectEvent = list.attachEvent("onAfterSelect", async (id) => {
			this.app.callEvent("app:paperjs:annotation:loading", []);
			try {
				const annotation = await annotationModel.getAnnotation(id);
				const fc = annotation
					? adapter.annotationToFeatureCollections(annotation)
					: null;
				this._tk.addFeatureCollections([], true);
				if (fc) {
					this._tk.addFeatureCollections(
						fc,
						true,
						this._openSeadragonViewer.world.getItemAt(0)
					);
				}
			}
			catch (error) {
				console.error(error);
				webix.message({
					type: "error",
					text: "Error loading annotation"
				});
			}
			finally {
				this.app.callEvent("app:paperjs:annotation:loaded", []);
			}
			this._tk.getFeatureCollectionGroups();
		});
		this._onAfterAddEvent = list.attachEvent("onAfterAdd", (id) => {
			const addedItem = list.getItem(id);
			annotationModel.addListViewItem(addedItem);
			const selectedItem = list.getSelectedItem();
			if (!selectedItem) {
				const firstId = list.getFirstId();
				if (firstId) {
					list.select(firstId);
				}
			}
			// TODO: uncomment after changing in left panel
			// const annotation = list.getItem(id);
			// const fc = adapter.annotationToFeatureCollections(annotation);
			// if (fc) {
			// 	this._tk.addFeatureCollections(
			// 		fc,
			// 		true,
			// 		this._openSeadragonViewer.world.getItemAt(0)
			// 	);
			// }
		});
		this._onAfterDeleteEvent = list.attachEvent("onAfterDelete", (/* id */) => {
			// TODO: implement
		});
		this._onDataUpdate = list.attachEvent("onDataUpdate", (id, data) => {
			annotationModel.updateAnnotationNameAndDescription(id, data);
		});
		this.eventsList.push(
			this._onBeforeSelectEvent,
			this._onAfterSelectEvent,
			this._onAfterAddEvent,
			this._onAfterDeleteEvent,
			this._onDataUpdate
		);
		list.attachEvent("onDestruct", () => {
			this.detachEvents();
		});
	}

	detachEvents() {
		const list = this.getList();
		this.eventsList.forEach((eventId) => {
			list.detachEvent(eventId);
		});
	}

	deleteItem(id) {
		const list = this.getList();
		const item = list.getItem(id);
		const selectedId = list.getSelectedId();
		if (item) {
			list.remove(id);
			if (selectedId === id) {
				const firstId = list.getFirstId();
				if (firstId) {
					list.select(firstId);
				}
				else {
					this._tk.close();
				}
			}
		}
	}

	async updateAnnotation(itemId) {
		const list = this.getList();
		const currentItemId = itemId || list.getSelectedId();
		const geoJSON = this._tk.toGeoJSON();
		const elements = adapter.featureCollectionsToElements(geoJSON);
		const groups = this._tk.getFeatureCollectionGroups().map(g => g.name);
		const data = {
			annotation: {
				elements,
			},
			groups,
		};
		await annotationModel.updateAnnotation(currentItemId, data);
	}

	addAnnotationToList(annotation) {
		const list = this.getList();
		const lastId = list.getLastId() ?? 0;
		annotation.id = String(Number(lastId) + 1);
		list.add(annotation);
	}

	createAnnotation() {
		const item = this.addItem();
		annotationModel.addListViewItem(item);
	}

	addItem() {
		const list = this.getList();
		const lastId = list.getLastId() ?? "0";
		const newId = String(Number(lastId) + 1);
		const addedItemId = list.add({annotation: {name: `${this._newItemName} ${newId}`, elements: []}, id: newId, itemId: this.itemId});
		list.refresh();
		if (addedItemId) {
			list.select(addedItemId);
		}
		const newItem = list.getItem(newId);
		const node = list.getItemNode(newId);
		this.editItem(newItem, node);
	}

	editItem(item, node) {
		const list = this.getList();
		const config = editorPopup.getConfig(item, editorPopup.ITEM_TYPES.ANNOTATION, list);
		const editPopup = webix.ui(config);
		editPopup.show(node);
	}

	async saveAnnotations() {
		await this.updateAnnotation();
		await annotationModel.saveAnnotations();
	}

	setItemId(itemId) {
		this.itemId = itemId;
		annotationModel.setItemId(itemId);
	}

	setModifiedFlag(isModified) {
		const list = this.getList();
		const selectedId = list.getSelectedId();
		annotationModel.setModifiedFlag(selectedId, isModified);
		console.log("annotation modified");
	}
}
