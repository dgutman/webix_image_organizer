import {JetView} from "webix-jet";
import mainColumns from "./subviews/mainColumns/mainColumns";
import notesView from "./subviews/notesView/notesView";
import header from "./subviews/header/header";
import undoFactory from "../models/undoModel";

export default class TaggerMainClass extends JetView {
	config() {
		const ui = {
			css: "tagger-app",
			rows: [
				{
					view: "accordion",
					type: "line",
					rows: [
						header,
						{body: mainColumns},
						{view: "resizer"},
						{
							header: "Notes list",
							body: notesView
						}
					]
				}
			]
		};

		return ui;
	}

	init() {
		undoFactory.clear();
	}
}
