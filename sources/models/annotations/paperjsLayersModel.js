import PaperScope from "./paperjsScopeModel";

export default class PaperJSLayersModel {
	constructor(tk) {
		this._tk = tk;
		this._paperScopeModel = new PaperScope(tk);
		this._paperScope = this._paperScopeModel.getPaperScope();
		if (!PaperJSLayersModel.instance) {
			this._layers = [];
			this._activeLayer = null;
			PaperJSLayersModel.instance = this;
		}
		PaperJSLayersModel.instance._tk = tk;
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

	addItemToLayer(item) {
		this._activeLayer?.addChild(item);
		item.style = this._activeLayer.defaultStyle;
		item.applyRescale();
		item.displayName = this._activeLayer.displayName;
	}

	getLayersList() {
		return this._paperScope.project.layers.filter(
			l => l.isGeoJSONFeatureCollection
		);
	}

	addLayerToList(layer) {
		this._layers.push(layer);
	}

	getActiveLayer() {
		return this._paperScope.project.activeLayer;
	}

	setActiveLayer(layer) {
		this._activeLayer = layer;
	}

	updateLayerName(id, name) {
		const layerToUpdate = this.getLayersList().find(
			l => l.id === id
		);
		layerToUpdate.name = name;
	}
}
