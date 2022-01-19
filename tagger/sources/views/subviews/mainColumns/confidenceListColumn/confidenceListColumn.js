import {JetView} from "webix-jet";
import EditableListView from "../parts/editableListView";

const confidenceSubConfig = {
	headerValue: "Confidence level",
	searchPlaceholder: "Search confidence level by name",
	addItemBtnText: "Add confidence level",
	editValue: "name",
	isViewEditable: false
};

export default class ConfidenceListColumn extends JetView {
	config() {
		return {
			name: "confidenceListColumn",
			rows: [
				{$subview: new EditableListView(this.app, "", "", confidenceSubConfig), name: "confidenceListClass"}
			]
		};
	}

	getConfidenceListClass() {
		return this.getSubView("confidenceListClass");
	}
}
