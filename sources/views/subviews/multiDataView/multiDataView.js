import {JetView} from "webix-jet";
import metadataTableCell from "../metadataTable/metadataTable";
import galleryCell from "../gallery/gallery";

export default class MultiDataviewClass extends JetView {
	config() {
		const multiDataView = {
			view: "multiview",
			cells: [
				galleryCell,
				metadataTableCell
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
