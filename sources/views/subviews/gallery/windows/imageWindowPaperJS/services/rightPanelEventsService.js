import AnnotationsModel from "../../../../../../models/annotations/annotationsModel";
import ItemsModel from "../../../../../../models/annotations/paperjsItemsModel";
import LayersModel from "../../../../../../models/annotations/paperjsLayersModel";
import PaperScopeModel from "../../../../../../models/annotations/paperjsScopeModel";
import ajax from "../../../../../../services/ajaxActions";


/**
 * RightPanel events service
 *
 * @export
 * @class RightPanelEventsService
 * @typedef {RightPanelEventsService}
 */
export default class RightPanelEventsService {
	/**
	 * Creates an instance of RightPanelEventsService.
	 *
	 * @constructor
	 * @param {import("../index").ImageWindowView} rootScope
	 * @param {import("../rightPanel").RightPanel} rightPanelView
	 * @param {import("../osd-paperjs-annotation/annotationtoolkit").AnnotationToolkit} tk
	 * @param {import ("../../../../../../models/annotations/imageWindowViewModelPaperJS").default}
	 */
	constructor(rootScope, rightPanelView, tk, imageWindowViewModel) {
		this._lastId = 0;
		if (!RightPanelEventsService.instance) {
			this._rootScope = rootScope;
			this._rightPanelView = rightPanelView;
			this._annotationModel = new AnnotationsModel();
			this._layersModel = new LayersModel();
			this._itemsModel = new ItemsModel();
			this._tk = tk;
			this._paperScope = tk.overlay.paperScope;
			this._imageWindowViewModel = imageWindowViewModel;
			RightPanelEventsService.instance = this;
		}
		else {
			RightPanelEventsService.instance._rootScope = rootScope;
			RightPanelEventsService.instance.rightPanelView = rightPanelView;
			RightPanelEventsService.instance._tk = tk;
			RightPanelEventsService.instance._paperScope = tk.overlay.paperScope;
			RightPanelEventsService.instance._imageWindowViewModel = imageWindowViewModel;
		}
		RightPanelEventsService.instance.init();
		return RightPanelEventsService.instance;
	}


	/**
	 * init events
	 */
	init() {
		this.attachPaperscopeEvents(this._paperScope.project);
		const layersListView = this._rightPanelView.getLayersList();
		const itemsListView = this._rightPanelView.getItemsList();
		const saveAnnotationButton = this._rightPanelView.getSaveButton();
		if (layersListView) {
			this.attachLayersListViewEvents(layersListView);
		}

		if (itemsListView) {
			this.attachItemsListViewEvents(itemsListView);
		}

		const annotationsListView = this._rightPanelView.getAnnotationsList();
		const annotations = this.getAnnotations();
		const annotationsList = annotations.map(item => ({
			name: item.name,
			id: item.id
		}));
		if (annotationsListView) {
			annotationsListView.parse(annotationsList);
			this.attachAnnotationsListViewEvents(annotationsListView);
			const firstAnnotationId = annotationsListView.getFirstId();
			if (firstAnnotationId) {
				annotationsListView.select(firstAnnotationId);
			}
		}

		if (saveAnnotationButton) {
			saveAnnotationButton.attachEvent("onItemClick", () => {
				this.updateActiveAnnotation();
				this._rootScope.saveAnnotation();
			});
		}

		this.setActiveLayer();

		this.updateAnnotationLayers();
	}

	/**
	 * attach paperjs events
	 *
	 * @param {*} project
	 */
	attachPaperscopeEvents(project) {
		project.on({
			"rightPanel-items-updated": () => {
				this.updateItemsList();
				this.updateActiveAnnotation();
			}
		});
	}

	attachAnnotationsListViewEvents(annotationsListView) {
		annotationsListView.attachEvent("onAfterAdd", (id /*, index */) => {
			this._annotationModel.createAnnotation({id});
			const annotationData = this._annotationModel.getAnnotationByID(id);
			this._rootScope.showAnnotation(annotationData);
		});
		annotationsListView.attachEvent("onBeforeSelect", (id, selection) => {
			const selectedItemId = annotationsListView.getSelectedId();
			if (selectedItemId) {
				const annotationData = this._tk.toGeoJSON();
				this._annotationModel.updateAnnotation(annotationData, selectedItemId);
			}
		});
		annotationsListView.attachEvent("onAfterSelect", (id) => {
			const annotation = this._annotationModel.getAnnotationByID(id);
			this._annotationModel.setActiveAnnotation(id);
			if (annotation) {
				this._rootScope.showAnnotation(annotation);
			}
			this.updateAnnotationLayers();
		});
		annotationsListView.attachEvent("onBeforeDelete", (/* id */) => {
			const prevId = annotationsListView.getPrevId();
			annotationsListView.select(prevId);
		});
		annotationsListView.attachEvent("onAfterDelete", async (id) => {
			const annotationToDelete = this._annotationModel.getAnnotationByID(id);
			if (annotationToDelete._id) {
				await ajax.deleteAnnotation(annotationToDelete);
				this._annotationModel.deleteAnnotation(id);
			}
			else {
				this._annotationModel.deleteAnnotation(id);
			}
		});
	}

	/**
	 * attach events to layers list view
	 *
	 * @param {*} layersListView
	 */
	attachLayersListViewEvents(layersListView) {
		layersListView.attachEvent("onAfterSelect", (id) => {
			console.log(JSON.stringify(id));
			const newActiveLayer = this.getLayers().find(layer => Number(layer.id) === Number(id));
			newActiveLayer?.activate();
			this.updateItemsList();
		});

		layersListView.attachEvent("onItemClick", (id) => {
			console.log(JSON.stringify(id));
			const layerToActivate = this.getLayers().find(
				l => Number(l.id) === Number(id)
			);
			layerToActivate?.activate();
			this.updateItemsList();
		});

		layersListView.attachEvent("onAfterAdd", (id /* , index */) => {
			const newLayer = layersListView.getItem(id);
			// TODO: get model here
			this._rootScope._imageWindowViewModel.createNewLayer(newLayer.name);
		});

		layersListView.attachEvent("onDataUpdate", (id, data /* , old */) => {
			this._rootScope._imageWindowViewModel.updateLayerName(id, data.name);
		});
	}

	attachItemsListViewEvents(itemsListView) {
		itemsListView.attachEvent("onAfterDelete", (id) => {
			const items = this._tk.getFeatures();
			const itemToDelete = items.find(obj => obj.id === Number(id));
			if (itemToDelete?.remove) {
				itemToDelete.remove();
			}
		});
	}

	/**
	 * update items list handler
	 */
	updateItemsList() {
		const itemsListView = this._rightPanelView.getItemsList();
		const activeLayer = this._paperScope.project.activeLayer;
		const items = activeLayer?.getItems()
			.map(item => ({
				id: item._id,
				name: item._displayName
			}));
		itemsListView.clearAll();
		itemsListView.parse(items);
	}

	/**
	 * get layers from paperjs
	 *
	 * @returns {*}
	 */
	getLayers() {
		return this._tk.getFeatureCollectionLayers();
	}

	getAnnotations() {
		return this._annotationModel.getAnnotations();
	}

	clearAll() {
		this._rightPanelView.getItemsList().clearAll();
		this._rightPanelView.getLayersList().clearAll();
		this._rightPanelView.getAnnotationsList().clearAll();
	}

	updateAnnotationLayers() {
		const layers = this.getLayers();
		const activeLayer = this._paperScope.project.activeLayer;
		layers.forEach((layer) => {
			if (layer.id > this._lastId) {
				this._lastId = layer.id;
			}
		});
		const layersList = layers.map(layer => ({name: layer._displayName, id: layer.id}));
		const layersListView = this._rightPanelView.getLayersList();
		if (layersListView) {
			layersListView.clearAll();
			layersListView.parse(layersList);
			if (layersListView.getItem(activeLayer.id)) {
				layersListView.select(activeLayer.id);
			}
		}
	}

	updateActiveAnnotation() {
		const annotationData = this._tk.toGeoJSON();
		this._annotationModel.updateActiveAnnotation(annotationData);
		console.log(annotationData);
	}

	setActiveLayer() {
		const layers = this.getLayers();
		const firstLayer = layers[0];
		if (firstLayer?.activate) {
			firstLayer.activate();
		}
	}
}
