import {JetView} from "webix-jet";
import metadataTableCell from "../metadataTable/metadataTable";
import galleryCell from "../gallery/gallery";
// import zstack from "../zstackView/zstackView";
import scenesView from "../scenesView/scenesView";

export default class MultiDataviewClass extends JetView {
	config() {
		const multiDataView = {
			view: "multiview",
			animate: false,
			cells: [
				galleryCell,
				metadataTableCell,
				// zstack,
				scenesView
			]
		};

		return {
			name: "multiDataViewClass",
			rows: [
				multiDataView
			]
		};
	}
}
