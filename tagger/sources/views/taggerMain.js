import {JetView} from "webix-jet";
import header from "./subviews/header/header";
import undoFactory from "../models/undoModel";
import auth from "../services/authentication";
import constants from "../constants";

export default class TaggerMainClass extends JetView {
	config() {
		const ui = {
			css: "tagger-app",
			minWidth: 1100,
			minHeight: 620,
			rows: [
				header,
				{$subview: true, minWidth: 1100}
			]
		};

		return ui;
	}

	init() {
		undoFactory.clear();
	}
}
