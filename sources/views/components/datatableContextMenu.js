import {JetView} from "webix-jet";
import authService from "../../services/authentication";

export default class DatatableContextMenu extends JetView {
	config() {
		const contextMenu = {
			view: "contextmenu",
			width: 100
		};

		return contextMenu;
	}

	init() {
		if (authService.isLoggedIn()) {
			this.getRoot().parse(["Edit"]);
		}
	}
}