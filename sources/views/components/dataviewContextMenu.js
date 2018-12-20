import {JetView} from "webix-jet";

export default class DataviewContextMenu extends JetView {
	config() {
		const contextMenu = {
			view: "contextmenu",
			width: 150
		};

		return contextMenu;
	}
}