import PaperScope from "./paperjsScopeModel";

export default class PaperJSLayersModel {
	
	/**
	 * Creates an instance of PaperJSLayersModel.
	 *
	 * @constructor
	 */
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

	createLayer() {
		const layer = this._tk.overlay.paperScope.createFeatureCollectionLayer();
		return layer;
	}

	getLayers() {
		return this._tk.getFeatureCollectionLayers();
	}

	activateLayer(layer) {
		if (layer?.activate) {
			this._activeLayer = layer;
			layer.activate();
		}
		else {
			debugger;
		}
	}

	updateLayerName(id, name) {
		const layerToUpdate = this.getLayers().find(
			l => l.id === id
		);
		layerToUpdate.name = name;
		layerToUpdate.displayName = name;
	}

	getLayerById(layerId) {
		const layers = this.getLayers();
		const found = layers.find(obj => obj.id === layerId);
		return found;
	}
}
