import {JetView} from "webix-jet";
import EditableListView from "../parts/editableListView";

const tagSubConfig = {
	headerValue: "Tags (parameters) list",
	searchPlaceholder: "Search tag",
	addItemBtnText: "Add tag",
	editValue: "name",
	isViewEditable: true
};

export default class TagListColumn extends JetView {
	config() {
		return {
			name: "tagListColumn",
			rows: [
				{$subview: new EditableListView(this.app, "", "", tagSubConfig), name: "tagListClass"}
			]
		};
	}

	getTagListClass() {
		return this.getSubView("tagListClass");
	}
}
