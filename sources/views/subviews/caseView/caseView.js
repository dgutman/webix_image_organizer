import {JetView} from "webix-jet";
import metadataTable from "../../../services/metadataTable/metadataTable";

export default class CaseView extends JetView {
	config() {
		metadataTable;
	}
}
