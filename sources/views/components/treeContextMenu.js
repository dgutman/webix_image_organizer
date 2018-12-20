import {JetView} from "webix-jet";

export default class TreeContextMenuView extends JetView{
	config() {
		const contextMenu = {
			view: "contextmenu",
			width: 175,
		};

		return contextMenu;
	}
}