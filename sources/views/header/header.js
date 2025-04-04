import {JetView, plugins} from "webix-jet";

import LogoutPanel from "./parts/logoutPanel";
import constants from "../../constants";
import logoPath from "../../images/logo.png";
import ajax from "../../services/ajaxActions";
import authService from "../../services/authentication";
import HeaderService from "../../services/header/headerService";
import utils from "../../utils/utils";
import LoginWindow from "../authWindows/loginWindow";

const LOGOUT_PANEL_NAME = "logout-panel";
const LOGIN_PANEL_NAME = "login-panel";
const serverListData = constants.SERVER_LIST;
const singleServer = constants.SINGLE_SERVER;
const logoLabel = constants.LOGO_LABEL ?? "";

export default class Header extends JetView {
	config() {
		const logo = {
			view: "template",
			css: "main-header__logo-container",
			width: 60,
			borderless: true,
			template: `<img class="main-header__logo" src=${logoPath}>`
		};
		const label = {
			template: logoLabel,
			css: "main-header-label",
			borderless: true,
			width: 175
		};

		const loginMenu = {
			template: "<span class='menu-login login-menu-item'>Login</span>",
			css: "login-menu",
			borderless: true,
			width: 150,
			onClick: {
				"menu-login": () => {
					this.loginWindow = this.ui(LoginWindow);
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
			width: 250,
			hidden: !!singleServer,
			options: {
				template: "#value#",
				data: serverListData ?? [],
				body: {
					template: obj => `<span title='${obj.value}'>${obj.value}</span>`,
					css: "ellipsis-text"
				}
			}
		};

		const collectionDropDownBox = {
			view: "richselect",
			icon: utils.getSelectIcon(),
			name: "collectionBoxName",
			css: "select-field ellipsis-text",
			label: "Collections",
			width: 250,
			labelWidth: 100,
			options: {
				body: {
					css: "ellipsis-text",
					template: obj => `<span title='${obj.name}'>${obj.name}</span>` || ""
				}
			}
		};

		const skinSwitcher = {
			name: "skin",
			labelWidth: 70,
			width: 200,
			view: "richselect",
			icon: utils.getSelectIcon(),
			css: "select-field",
			value: this.app.getService("theme").getTheme(),
			label: "Theme",
			options: {
				data: [
					{id: "flat", value: "flat"},
					{id: "material", value: "material"},
					{id: "mini", value: "mini"},
					{id: "compact", value: "compact"},
					{id: "contrast", value: "contrast"}
				],
				body: {
					css: "ellipsis-text"
				}
			}
		};

		const header = {
			height: 60,
			css: "main-header",
			cols: [
				logo,
				{width: 50},
				label,
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

	getCurrentCollection() {
		const box = this.getCollectionBox();
		const list = box.getList();
		return list.getItem(box.getValue());
	}
}
