export default class RightPanelEventsService {
	constructor(rootScope, rightPanelView, tk) {
		this._rootScope = rootScope;
		this._rightPanelView = rightPanelView;
		this._paperScope = tk.overlay.paperScope;
		this._lastId = 0;
		this.init();
	}

	init() {
		const layers = this.getLayers();
		const activeLayer = this._paperScope.project.activeLayer;
		layers.forEach((layer) => {
			if (layer.id > this._lastId) {
				this._lastId = layer.id;
			}
		});
		const layersList = layers.map(layer => ({name: layer._displayName, id: layer.id}));
		const layersListView = this._rightPanelView.getLayersList();
		const itemsListView = this._rightPanelView.getItemsList();
		layersListView?.parse(layersList);
		if (layersListView.getItem(activeLayer.id)) {
			layersListView?.select(activeLayer.id);
		}

		layersListView.attachEvent("onAfterSelect", (id) => {
			console.log(JSON.stringify(id));
			const newActiveLayer = this.getLayers().find(layer => Number(layer.id) === Number(id));
			newActiveLayer?.activate();
			const items = newActiveLayer?.getItems()
				.map((item) => {
					return {
						id: item._id,
						name: item._displayName
					};
				});
			itemsListView.clearAll();
			itemsListView.parse(items);
		});

		layersListView.attachEvent("onItemClick", (id) => {
			console.log(JSON.stringify(id));
			const layerToActivate = this.getLayers().find(
				l => Number(l.id) === Number(id)
			);
			layerToActivate?.activate();
			const items = layerToActivate?.getItems()
				.map((item) => {
					return {
						id: item._id,
						name: item._displayName
					};
				});
			itemsListView.clearAll();
			itemsListView.parse(items);
		});

		layersListView.attachEvent("onAfterAdd", (id /* , index */) => {
			const newLayer = layersListView.getItem(id);
			// TODO: get model here
			this._rootScope._imageWindowViewModel.createNewLayer(newLayer.name);
		});

		layersListView.attachEvent("onDataUpdate", (id, data /* , old */) => {
			this._rootScope._imageWindowViewModel.updateLayerName(id, data.name);
		});

		itemsListView.attachEvent("onAfterAdd", (id /* , index */) => {
			// TODO: find items in project
		});

		// TODO: add onAfterDraw event
	}

	getLayers() {
		return this._paperScope.project.layers.filter(
			l => l.isGeoJSONFeatureCollection
		);
	}
}
