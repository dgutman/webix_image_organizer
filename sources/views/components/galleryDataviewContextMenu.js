import {JetView} from "webix-jet";

export default class GalleryDataviewContextMenu extends JetView {
	config() {
		const contextMenu = {
			view: "contextmenu",
			width: 150
		};

		return contextMenu;
	}
}
