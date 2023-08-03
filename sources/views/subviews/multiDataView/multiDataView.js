import {JetView} from "webix-jet";

import GalleryCell from "../gallery/gallery";
import MetadataTableCell from "../metadataTable/metadataTable";
import MultiChannelView from "../multichannelView/multichannelView";
import NPCaseView from "../npCaseView/npCaseView";
import ScenesView from "../scenesView/scenesView";
import Zstack from "../zstackView/zstackView";

export default class MultiDataviewClass extends JetView {
	constructor(app) {
		super(app);
		this._galleryCell = new GalleryCell(app);
		this._metadataTableCell = new MetadataTableCell(app);
		this._zStackViewCell = new Zstack(app);
		this._scenesViewCell = new ScenesView(app);
		this._multiChannelView = new MultiChannelView(app);
		this._npView = new NPCaseView(app);
	}

	config() {
		const multiDataView = {
			view: "multiview",
			animate: false,
			cells: [
				this._galleryCell,
				this._metadataTableCell,
				this._zStackViewCell,
				this._scenesViewCell,
				this._multiChannelView,
				this._npView
			]
		};

		return {
			name: "multiDataViewClass",
			rows: [
				multiDataView
			]
		};
	}

	getThumbnalisView() {
		return this._galleryCell;
	}

	getMetadataTableView() {
		return this._metadataTableCell;
	}

	getZStackView() {
		return this._zStackViewCell;
	}

	getScenesView() {
		return this._scenesViewCell;
	}

	getMultichannelView() {
		return this._multiChannelView;
	}

	getNPView() {
		return this._npView;
	}
}
