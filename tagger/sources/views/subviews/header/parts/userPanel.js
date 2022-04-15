import {JetView} from "webix-jet";
import LoginWindow from "../../../authWindows/loginWindow";
import UserPanelService from "../../../../services/header/userPanel";

const LOGOUT_PANEL_NAME = "logout-panel";
const LOGIN_PANEL_NAME = "login-panel";

export default class UserPanel extends JetView {
	config() {
		const loginMenu = {
			name: "loginMenu",
			template: "<span class='menu-login login-menu-item'>Login</span>",
			css: "login-menu",
			borderless: true,
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
			autowidth: true,
			data: [
				{
					id: "name",
					submenu: []
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

		return userPanel;
	}

	ready(view) {
		this.loginWindow = this.ui(LoginWindow);
		this._userPanelService = new UserPanelService(view, this.loginWindow);
	}

	urlChange(...agrs) {
		if (this._userPanelService) {
			this._userPanelService._urlChange(...agrs);
		}
	}

	getLoginWindow() {
		return this.loginWindow;
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
}
