import {JetView} from "webix-jet";
import "../components/activeList";
import constants from "../../constants";
import utils from "../../utils/utils";

export default class CartView extends JetView {
	config() {

		const downloadingMenu = {
			view: "menu",
			css: "downloading-menu",
			submenuConfig: {
				width: 285
			},
			data: [
				{
					value: "<center>Choose Option</center>",
					submenu: [
						constants.IMAGES_ONLY_MENU_ID,
						constants.IMAGES_AND_METADATA_MENU_ID,
						constants.COPY_TO_CLIPBOARD_MENU_ID
					]
				}
			],
			type: {
				height: 30,
				width: 200
			}
		};

		const cartList = {
			view: "activeList",
			css: "cart-list-view",
			width: 200,
			activeContent: {
				deleteButton: {
					view: "button",
					type: "icon",
					icon: "times",
					width: 25,
					height: 25,
					click: (...args) => {
						this.getCartListView().callEvent("onDeleteButtonClick", args);
					}
				}
			}
		};
		return {
			name: "cartViewClass",
			rows: [
				downloadingMenu,
				cartList
			]
		};
	}

	init() {
		this.getRoot().hide();
	}

	getCartListView() {
		return this.getRoot().queryView({view: "activeList"});
	}

	getDownloadingMenu() {
		return this.getRoot().queryView({view: "menu"});
	}

	showList() {
		this.getRoot().show();
		this.changeDataviewYCount();
	}

	hideList() {
		this.getRoot().hide();
		this.changeDataviewYCount();
	}

	changeDataviewYCount() {
		let gallerySelectionId = utils.getDataviewSelectionId();
		if (gallerySelectionId && gallerySelectionId !== constants.DEFAULT_DATAVIEW_COLUMNS) {
			const galleryRichselect = $$(constants.ID_GALLERY_RICHSELECT);
			galleryRichselect.callEvent("onChange", [gallerySelectionId]);
		}
	}
}