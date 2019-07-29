import {JetView} from "webix-jet";
import "../../components/activeList";
import constants from "../../../constants";
import utils from "../../../utils/utils";
import modifiedObjects from "../../../models/modifiedObjects";

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
						constants.COPY_TO_CLIPBOARD_MENU_ID,
						constants.ADD_TAG_TO_IMAGES_MENU_ID
					]
				}
			],
			type: {
				height: 30,
				width: 202
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
					icon: "fas fa-times",
					width: 25,
					height: 25,
					click: (...args) => {
						this.getCartListView().callEvent("onDeleteButtonClick", args);
					}
				}
			},
			onClick: {
				"webix_icon": function (e, id, node) {
					const item = this.getItem(id);
					const itemNode = this.getItemNode(id);
					const listTextNode = itemNode.firstChild.children[2];
					if (!item.imageShown) {
						itemNode.setAttribute("style", "height: 140px !important; color: #0288D1;");
						listTextNode.setAttribute("style", "margin-left: 17px; width: 115px;");
						node.setAttribute("class", "webix_icon fas fa-angle-down");
						item.imageShown = true;
						modifiedObjects.add(item);
					} else {
						itemNode.setAttribute("style", "height: 30px !important; color: rgba(0, 0, 0, 0.8);");
						listTextNode.setAttribute("style", "margin-left: 12px; width: 125px;");
						node.setAttribute("class", "webix_icon fas fa-angle-right");
						item.imageShown = false;
						modifiedObjects.remove(item);
					}
				}
			}
		};

		const createNewTagButton = {
			view: "button",
			type: "icon",
			icon: "plus",
			name: "createNewTagButtonName",
			label: "Create new tag",
			height: 30
		};

		return {
			name: "cartListViewClass",
			rows: [
				downloadingMenu,
				cartList,
				{
					css: "button-icon-button add-tag-button-icon",
					rows: [
						createNewTagButton
					]
				}

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

	getCreateNewTagButton() {
		return this.getRoot().queryView({name: "createNewTagButtonName"});
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