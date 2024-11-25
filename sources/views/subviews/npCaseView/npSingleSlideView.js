import SingleSlideView from "../scenesView/slideViews/singleSlideView/singleSlideView";

export default class NPSingleSlideView extends SingleSlideView {
	closeCollapsers() {
		this.getRoot().queryView({name: this._metadataCollapserName}).config.setClosedState();
		this.getRoot().queryView({name: this._controlsPanelCollapserName}).config.setClosedState();
	}
}
