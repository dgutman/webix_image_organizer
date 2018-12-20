import {JetView} from "webix-jet";
import authService from "../../services/authentication";
import ajax from "../../services/ajaxActions";
import HeaderService from "../../services/header/headerService";
import LoginWindow from "../authWindows/loginWindow";
import LogoutPanel from "./parts/logoutPanel";

const LOGOUT_PANEL_NAME = "logout-panel";
const LOGIN_PANEL_NAME = "login-panel";

export default class Header extends JetView {
	config() {
		const logo = {
			template: "Image Organizer",
			css: "main-header-logo",
			borderless: true,
		};

		const loginMenu = {
			template: "<span class='menu-login login-menu-item'>Login</span>",
			css: "login-menu",
			borderless: true,
			width: 150,
			onClick: {
				"menu-login": () => {
					this.loginWindow.showLoginWindow();
				}
			}
		};

		const loginPanel = {
			name: LOGIN_PANEL_NAME,
			cols: [
				{},
				loginMenu
			]
		};

		const logoutPanel = {
			name: LOGOUT_PANEL_NAME,
			cols: [
				LogoutPanel
			]
		};

		const userPanel = {
			view: "multiview",
			css: "userbar",
			cells: [
				loginPanel,
				logoutPanel
			]
		};

		const header = {
			height: 60,
			width: 1220,
			css: "main-header",
			cols: [
				logo,
				userPanel
			]
		};

		return {
			css: "global-header",
			rows: [
				{
					cols: [
						{},
						header,
						{}
					]
				}
			]
		};
	}

	init(view) {
		this.loginPanel = this.getRoot().queryView({name: LOGIN_PANEL_NAME});
		this.logoutPanel = this.getRoot().queryView({name: LOGOUT_PANEL_NAME});
		this.loginWindow = this.ui(LoginWindow);
		this.headerService = new HeaderService(
			view,
			this.loginPanel,
			this.logoutPanel
		);
		if (authService.isLoggedIn()) {
			this.headerService.showLogoutPanel();
			ajax.getUserInfo();
		}
	}
}
