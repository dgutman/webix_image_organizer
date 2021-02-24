import {JetView} from "webix-jet";
import getDataFromServerView from "./getDataFromServerView/getDataFromServerView";
import CollectionListColumn from "./collectionListColumn/collectionListColumn";
import TagListColumn from "./tagListColumn/tagListColumn";
import ValuesListColumn from "./valuesListColumn/valuesListColumn";
import ConfidenceListColumn from "./confidenceListColumn/confidenceListColumn";
import TaggerMainColumnsService from "../../../services/mainColumns/mainColumnsService";

export default class ColumnsViewClass extends JetView {
	config() {
		const columns = {
			view: "accordion",
			name: "columnsView",
			type: "line",
			multi: true,
			padding: 10,
			margin: 10,
			cols: [
				{header: "Collections list", body: {$subview: CollectionListColumn, name: "collectionColumnClass"}, minWidth: 200},
				{view: "resizer"},
				{header: "Tags (parameters) list", body: {$subview: TagListColumn, name: "tagColumn"}, minWidth: 175},
				{view: "resizer"},
				{header: "Values list", body: {$subview: ValuesListColumn, name: "valuesColumn"}, minWidth: 175},
				{view: "resizer"},
				{header: "Confidence level", body: {$subview: ConfidenceListColumn, name: "confidenceColumn"}, minWidth: 175}
			],
			borderless: true
		};

		const ui = {
			rows: [
				getDataFromServerView,
				columns
			]
		};

		return ui;
	}

	ready(view) {
		this.columnsView = this.getColumnsView();
		this.taggerMainColumnsService = new TaggerMainColumnsService(view);
	}

	getDataButton() {
		return this.getRoot().queryView({name: "getDataButton"});
	}

	getSendDataButton() {
		return this.getRoot().queryView({name: "sendDataButton"});
	}

	getStatusTemplate() {
		return this.getRoot().queryView({name: "statusTemplate"});
	}

	getColumnsView() {
		return this.getRoot().queryView({name: "columnsView"});
	}

	getCollectionColumnClass() {
		return this.getSubView("collectionColumnClass");
	}

	getTagColumn() {
		return this.getSubView("tagColumn");
	}

	getTagColumnClass() {
		return this.getTagColumn().getTagListClass();
	}

	getValuesColumn() {
		return this.getSubView("valuesColumn");
	}

	getValuesColumnClass() {
		return this.getValuesColumn().getValuesListClass();
	}

	getConfidenceColumn() {
		return this.getSubView("confidenceColumn");
	}

	getConfidenceColumnClass() {
		return this.getConfidenceColumn().getConfidenceListClass();
	}
}
