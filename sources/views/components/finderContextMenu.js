import {JetView} from "webix-jet";

export default class FinderContextMenu extends JetView{
	config() {
		const contextMenu = {
			view: "contextmenu",
			width: 175,
		};

		return contextMenu;
	}
}