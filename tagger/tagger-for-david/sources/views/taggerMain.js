import {JetView} from "webix-jet";
import header from "./subviews/header/header";
import undoFactory from "../models/undoModel";
import auth from "../services/authentication";
import constants from "../constants";

export default class TaggerMainClass extends JetView {
	config() {
		const ui = {
			css: "tagger-app",
			minWidth: 1180,
			minHeight: 770,
			rows: [
				header,
				{$subview: true, minWidth: 1180}
			]
		};

		return ui;
	}

	init() {
		undoFactory.clear();
	}

	urlChange() {
		if (auth.isAdmin()) {
			this.app.show(constants.APP_PATHS.TAGGER_ADMIN);
		}
		else {
			this.app.show(constants.APP_PATHS.TAGGER_USER);
		}
	}
}
