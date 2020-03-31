import {JetView, plugins} from "webix-jet";
import authService from "../../services/authentication";
import ajax from "../../services/ajaxActions";
import HeaderService from "../../services/header/headerService";
import LoginWindow from "../authWindows/loginWindow";
import LogoutPanel from "./parts/logoutPanel";
import utils from "../../utils/utils";

const LOGOUT_PANEL_NAME = "logout-panel";
const LOGIN_PANEL_NAME = "login-panel";
const serverListData = process.env.SERVER_LIST;

export default class Header extends JetView {
	config() {
		const logo = {
			template: "Image Organizer",
			css: "main-header-logo",
			borderless: true,
			width: 165
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

		const hostDropDownBox = {
			view: "richselect",
			icon: utils.getSelectIcon(),
			name: "hostBoxName",
			css: "select-field ellipsis-text",
			label: "Hosts",
			labelWidth: 70,
			width: 300,
			options: {
				template: "#value#",
				data: serverListData
			}
		};

		const collectionDropDownBox = {
			view: "richselect",
			icon: utils.getSelectIcon(),
			name: "collectionBoxName",
			css: "select-field ellipsis-text",
			label: "Collections",
			width: 330,
			labelWidth: 100,
			options: {
				body: {
					template: obj => obj.name || ""
				}
			}
		};

		const skinSwitcher = {
			name: "skin",
			labelWidth: 70,
			width: 300,
			view: "richselect",
			icon: utils.getSelectIcon(),
			css: "select-field",
			value: this.app.getService("theme").getTheme(),
			label: "Theme",
			options: [
				{id: "flat", value: "flat"},
				{id: "material", value: "material"},
				{id: "mini", value: "mini"},
				{id: "compact", value: "compact"},
				{id: "contrast", value: "contrast"}
			]
		};

		const header = {
			height: 60,
			css: "main-header",
			cols: [
				logo,
				{width: 50},
				{
					rows: [
						{},
						skinSwitcher,
						{}
					]
				},
				{width: 50},
				{
					rows: [
						{},
						hostDropDownBox,
						{}
					]
				},
				{width: 50},
				{
					rows: [
						{},
						collectionDropDownBox,
						{}
					]
				},
				{width: 50},
				userPanel
			]
		};

		return {
			rows: [
				{
					css: "global-header",
					name: "headerClass",
					cols: [
						{},
						header,
						{}
					]
				},
				{$subview: true}
			]
		};
	}

	init(view) {
		// URL-NAV enable URL params with /
		this.use(plugins.UrlParam, ["host", "collection"]);

		this.loginPanel = this.getRoot().queryView({name: LOGIN_PANEL_NAME});
		this.logoutPanel = this.getRoot().queryView({name: LOGOUT_PANEL_NAME});
		this.loginWindow = this.ui(LoginWindow);
		this.headerService = new HeaderService(
			view,
			this.loginPanel,
			this.logoutPanel,
			this.getHostBox(),
			this.getCollectionBox()
		);
		if (authService.isLoggedIn()) {
			this.headerService.showLogoutPanel();
			ajax.getUserInfo();
		}
	}

	// URL-NAV
	urlChange(...args) {
		if (this.headerService) {
			this.headerService._urlChange(...args);
		}
	}

	getHostBox() {
		return this.getRoot().queryView({name: "hostBoxName"});
	}

	getCollectionBox() {
		return this.getRoot().queryView({name: "collectionBoxName"});
	}

	getSkinSwitcher() {
		return this.getRoot().queryView({name: "skin"});
	}
}
