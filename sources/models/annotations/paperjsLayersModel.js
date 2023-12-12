export default class PaperJSLayersModel {
	constructor(paperScope) {
		if (!PaperJSLayersModel.instance) {
			this._paperScope = paperScope;
			this._layers = [];
			this._activeLayer = null;
			// this._layer = paperScope.createFeatureCollectionLayer();
			// this._layer = this.createLayer;
			PaperJSLayersModel.instance = this;
		}
		return PaperJSLayersModel.instance;
	}

	static getInstanceModel() {
		return PaperJSLayersModel.instance;
	}

	createLayer(displayLabel = null) {
		const layer = new paper.Layer();
		this._paperScope.project.addLayer(layer);
		layer.isGeoJSONFeatureCollection = true;
		const layerNum = this._paperScope.project.layers.filter(
			l => l.isGeoJSONFeatureCollection
		).length;
		layer.name = displayLabel !== null ? displayLabel : `Annotation Layer ${layerNum}`;
		layer.displayName = layer.name;
		layer.defaultStyle = new paper.Style(this._paperScope.project.defaultStyle);
		return layer;
	}

	clearLayers() {
		// TODO: implement
	}

	addItemToLayer(item) {
		this._activeLayer?.addChild(item);
		item.style = this._activeLayer.defaultStyle;
		item.applyRescale();
		item.displayName = this._activeLayer.displayName;
	}

	getLayersList() {
		return this._layers;
	}

	addLayerToList(layer) {
		this._layers.push(layer);
	}

	getActiveLayer() {
		return this._activeLayer;
	}

	setActiveLayer(layer) {
		this._activeLayer = layer;
	}
}
