import ListView from "../../../../../../components/listView";
import adapter from "../../services/adapter";

export default class AnnotationListView extends ListView {
	constructor(app, config = {name: "Annotations", newItemName: "Annotation"}, openSeadragonViewer) {
		super(app, config);
		this._openSeadragonViewer = openSeadragonViewer;
	}

	config() {
		const list = {
			view: "list",
			id: this.ID_LIST,
			css: "right-panel-list",
			template: (obj) => {
				const hidden = true;
				const saveIcon = '<span class="edit-item fas fa-save hidden-block"></span>';
				const deleteIcon = '<span class="delete-item fas fa-times-circle"></span>';
				const visibleIcon = `<span class="visible fas fa-eye ${hidden ? "hidden-block" : ""}"></span>`;
				const invisibleIcon = `<span class="invisible fas fa-eye-slash ${hidden ? "hidden-block" : ""}"></span>`;
				const name = `<span class="right-panel-list__item_name">${obj.annotation.name}</span>`;
				const element = `<div class="right-panel-list__item" style='padding-left:18px'>
									${name}
									${invisibleIcon}
									${visibleIcon}
									${saveIcon}
									${deleteIcon}
								</div>`;
				return element;
			},
			type: {
				height: 30
			},
			onClick: {
				"edit-item": () => {
					this.editItem();
				},
				"delete-item": (event, id) => {
					this.deleteItem(id);
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
				this.addItem({annotation: {elements: []}});
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
		// TODO: use array for events
		this._onBeforeSelectEvent = list.attachEvent("onBeforeSelect", (id, selectionFlag) => {
			const selectedId = list.getSelectedId();
			if (selectedId === id) {
				return false;
			}
			const selectedItem = list.getSelectedItem();
			if (selectedItem) {
				const geoJSON = this._tk.toGeoJSON();
				selectedItem.annotation.elements = adapter.featureCollectionsToElements(geoJSON);
				list.updateItem(selectedId, selectedItem);
			}
			return selectionFlag;
		});
		this._onAfterSelectEvent = list.attachEvent("onAfterSelect", (id) => {
			const annotation = list.getItem(id);
			const fc = adapter.annotationToFeatureCollections(annotation);
			if (fc) {
				this._tk.addFeatureCollections(
					fc,
					true,
					this._openSeadragonViewer.world.getItemAt(0)
				);
			}
		});
		this._onAfterAddEvent = list.attachEvent("onAfterAdd", (id) => {
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
		this._onAfterDeleteEvent = list.attachEvent("onAfterDelete", (id) => {
			// TODO: implement
		});
	}

	detachEvents() {
		const list = this.getList();
		list.detachEvent(this._onAfterSelectEvent);
		list.detachEvent(this._onAfterAddEvent);
		list.detachEvent(this._onAfterDeleteEvent);
	}

	deleteItem() {
		// TODO: implement
	}

	updateAnnotation(annotationData, annotationId) {
		// TODO: implement
	}

	addAnnotation(annotation) {
		const list = this.getList();
		list.add(annotation);
	}

	createAnnotation() {
		this.addItem();
	}

	addItem() {
		const list = this.getList();
		const lastId = list.getLastId() ?? 0;
		list.add({annotation: {name: `${this._newItemName} ${lastId + 1}`, elements: []}});
	}

	getAnnotations() {
		const list = this.getList();
		const annotations = list.serialize();
		return annotations;
	}
}
