export default class RightPanelService {
	constructor(layerUI, featuresCollectionUI, featuresUI) {
		this._layerUi = layerUI;
		this._featuresCollectionUI = featuresCollectionUI;
		this._featuresUI = featuresUI;
	}

	_onFeatureCollectionAdded(ev) {
		const group = ev.group;
		let fc = this._featuresCollectionUI.parseData(group);
		this.element.querySelector(".annotation-ui-feature-collections").appendChild(fc.element);
		this._dragAndDrop.refresh();
		fc.element.dispatchEvent(new Event("element-added"));
		setTimeout(() => { fc.element.classList.add("inserted"); }, 30); // this allows opacity fade-in to be triggered
	}
}
