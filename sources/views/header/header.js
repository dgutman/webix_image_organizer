import {JetView} from "webix-jet";
import authService from "../../services/authentication";
import ajax from "../../services/ajaxActions";
import HeaderService from "../../services/header/headerService";
import LoginWindow from "../authWindows/loginWindow";
import LogoutPanel from "./parts/logoutPanel";

const LOGOUT_PANEL_NAME = "logout-panel";
const LOGIN_PANEL_NAME = "login-panel";
const serverListData = process.env.SERVER_LIST;

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

		const hostDropDownBox = {
			view: "richselect",
			icon: "fas fa-chevron-down",
			name: "hostBoxName",
			css: "select-field",
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
			icon: "fas fa-chevron-down",
			name: "collectionBoxName",
			css: "select-field",
			label: "Collections",
			width: 330,
			labelWidth: 100,
			options: {
				body: {
					template: obj => obj.name || ""
				}
			}
		};

		/*const skinSwitcher = {
			name: "skin",
			labelWidth: 70,
			width: 300,
			view: "richselect",
			icon: "fas fa-chevron-down",
			css: "select-field",
			value: this.app.getService("theme").getTheme(),
			label: "Theme",
			options: [
				{id: "flat", value: "flat"},
				{id: "compact", value: "compact"},
				{id: "aircompact", value: "aircompact"},
				{id: "clouds", value: "clouds"},
				{id: "air", value: "air"},
				{id: "glamour", value: "glamour"},
				{id: "light", value: "light"},
				{id: "metro", value: "metro"},
				{id: "terrace", value: "terrace"},
				{id: "touch", value: "touch"},
				{id: "web", value: "web"}
			],
			on: {
				onChange: () => this.toggleTheme()
			}
		};*/

		const header = {
			height: 60,
			width: 1220,
			css: "main-header",
			cols: [
				logo,
				{
					rows: [
						{height: 12},
						hostDropDownBox,
						{height: 18}
					]
				},
				{width: 50},
				{
					rows: [
						{height: 12},
						collectionDropDownBox,
						{height: 18}
					]
				},
				userPanel
			]
		};

		return {
			css: "global-header",
			name: "headerClass",
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

	loadCollectionData() {
		return ajax.getCollection().then(collections => collections);
	}

	parseToList(collections) {
		this.getCollectionBox().getList().clearAll();
		this.getCollectionBox().getList().parse(collections);
	}

	getHostBox() {
		return this.getRoot().queryView({name: "hostBoxName"});
	}

	getCollectionBox() {
		return this.getRoot().queryView({name: "collectionBoxName"});
	}

	parseCollectionData() {
		this.loadCollectionData()
			.then((data) => {
				this.parseToList({
					data: webix.copy(data)
				});
				let collectionList = this.getCollectionBox().getList();
				let firstId = collectionList.getFirstId();
				collectionList.select(firstId);
				this.getCollectionBox().setValue(firstId);
			});
	}
}
