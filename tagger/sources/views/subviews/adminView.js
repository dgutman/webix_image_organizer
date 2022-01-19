import {JetView} from "webix-jet";
import mainColumns from "./mainColumns/mainColumns";
import notesView from "./notesView/notesView";
import constants from "../../constants";
import auth from "../../services/authentication";

export default class TaggerAdminView extends JetView {
	config() {
		const ui = {
			rows: [
				{
					view: "accordion",
					type: "line",
					rows: [
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

	ready() {
		if (!auth.isAdmin()) {
			this.app.show(constants.APP_PATHS.TAGGER_USER);
		}
	}
}
