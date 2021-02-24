import {JetView} from "webix-jet";
import EditableListView from "../parts/editableListView";

const valuesSubConfig = {
	headerValue: "Values list",
	searchPlaceholder: "Search value",
	addItemBtnText: "Add value",
	editValue: "value",
	isViewEditable: true
};

export default class ValuesListColumn extends JetView {
	config() {
		return {
			name: "valuesListColumn",
			rows: [
				{$subview: new EditableListView(this.app, "", "", valuesSubConfig), name: "valuesListClass"}
			]
		};
	}

	getValuesListClass() {
		return this.getSubView("valuesListClass");
	}
}
