import {JetView} from "webix-jet";
import MetadataTableCell from "../metadataTable/metadataTable";
import GalleryCell from "../gallery/gallery";
import Zstack from "../zstackView/zstackView";
import ScenesView from "../scenesView/scenesView";
import MultiChannelView from "../multichannelView/multichannelView";

export default class MultiDataviewClass extends JetView {
	constructor(app) {
		super(app);
		this._galleryCell = new GalleryCell(app);
		this._metadataTableCell = new MetadataTableCell(app);
		this._zStackViewCell = new Zstack(app);
		this._scenesViewCell = new ScenesView(app);
		this._multiChannelView = new MultiChannelView(app);
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
				this._multiChannelView
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
}
