import {JetView} from "webix-jet";
import HeaderService from "../../../services/header/header";
import LoginWindow from "../../authWindows/loginWindow";
import undoFactory from "../../../models/undoModel";
import constants from "../../../constants";

const serverListData = process.env.SERVER_LIST;
const LOGOUT_PANEL_NAME = "logout-panel";
const LOGIN_PANEL_NAME = "login-panel";

export default class TaggerHeaderClass extends JetView {
	config() {
		const undoIcon = {
			view: "icon",
			css: "btn undo-btn disabled",
			name: "taggerUndoIcon",
			icon: "fas fa-undo-alt",
			tooltip: "Undo last action",
			width: 40,
			on: {
				onItemClick: () => { this.undoModel.undoLastAction(); }
			}
		};

		const headerLogo = {
			template: "Tagger - Tags manager",
			css: "main-header-logo",
			width: 250,
			borderless: true
		};

		const hostDropDownBox = {
			view: "richselect",
			icon: "fas fa-chevron-down",
			name: "hostBox",
			height: 40,
			css: "select-field ellipsis-text",
			label: "Hosts",
			labelWidth: 70,
			width: 300,
			options: {
				template: "#value#",
				data: serverListData
			}
		};

		const loginMenu = {
			name: "loginMenu",
			template: "<span class='menu-login login-menu-item'>Login</span>",
			css: "login-menu",
			borderless: true,
			// width: 150,
			onClick: {
				"menu-login": () => {
					this.loginWindow.showLoginWindow();
				}
			}
		};

		const logoutMenu = {
			view: "menu",
			name: "logoutMenu",
			css: "logout-menu",
			openAction: "click",
			width: 185,
			data: [
				{
					id: "name",
					submenu: [
						{id: "logout", value: "<span class='fas fa-arrow-right'></span> Logout"}
					]
				}
			],
			type: {
				subsign: true
			}
		};

		const loginPanel = {
			name: LOGIN_PANEL_NAME,
			cols: [
				loginMenu
			]
		};

		const logoutPanel = {
			name: LOGOUT_PANEL_NAME,
			rows: [
				{},
				logoutMenu,
				{}
			]
		};

		const userPanel = {
			view: "multiview",
			css: "userbar",
			width: 150,
			cells: [
				loginPanel,
				logoutPanel
			]
		};

		const taskNameTemplate = {
			name: "taggerTaskName",
			borderless: true,
			hidden: true,
			template: obj => (obj.name ? `<div class='task-name-template'>${obj.name}</div>` : "")
		};

		const ui = {
			height: constants.HEADER_HEIGHT,
			css: "main-header",
			cols: [
				undoIcon,
				{width: 50},
				headerLogo,
				{},
				taskNameTemplate,
				{width: 20},
				{
					rows: [
						{},
						hostDropDownBox,
						{}
					]
				},
				{width: 50},
				userPanel
			]
		};

		return {
			css: "global-header",
			cols: [
				{width: 50},
				ui,
				{width: 50}
			]
		};
	}

	init(view) {
		this.loginWindow = this.ui(LoginWindow);
		this.hostBox = this.getHostBox();
		const undoIcon = this.getUndoButton();
		this.headerService = new HeaderService(view, this.loginWindow);

		this.undoModel = undoFactory.create("main", undoIcon);
	}

	getHostBox() {
		return this.getRoot().queryView({name: "hostBox"});
	}

	getLogoutPanel() {
		return this.getRoot().queryView({name: LOGOUT_PANEL_NAME});
	}

	getLogoutMenu() {
		return this.getRoot().queryView({name: "logoutMenu"});
	}

	getLoginPanel() {
		return this.getRoot().queryView({name: LOGIN_PANEL_NAME});
	}

	getUndoButton() {
		return this.getRoot().queryView({name: "taggerUndoIcon"});
	}

	getTaskNameTemplate() {
		return this.getRoot().queryView({name: "taggerTaskName"});
	}
}
