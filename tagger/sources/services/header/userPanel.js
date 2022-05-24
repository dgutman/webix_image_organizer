import authService from "../authentication";
import constants from "../../constants";

export default class UserPanelService {
	constructor(view, loginWindow) {
		this._view = view;
		this._loginWindow = loginWindow;
		this._init();
	}

	_init() {
		this._parentView = this._view.getTopParentView();
		webix.extend(this._parentView, webix.ProgressBar);

		// child views
		this._loginPanel = this._view.$scope.getLoginPanel();
		this._logoutPanel = this._view.$scope.getLogoutPanel();
		this._logoutMenu = this._view.$scope.getLogoutMenu();

		if (authService.isLoggedIn()) {
			this._setSubItemsToLogoutMenu();
			this._showLogoutPanel();
			this._setUserName();
		}

		this._attachLogoutPanelEvent();
	}

	_urlChange() {
		if (authService.isLoggedIn()) {
			this._setSubItemsToLogoutMenu();
		}
	}

	_attachLogoutPanelEvent() {
		this._logoutMenu.attachEvent("onMenuItemClick", (id) => {
			switch (id) {
				case "logout": {
					authService.logout();
					break;
				}
				case "notifications": {
					this._view.$scope.app.show(constants.APP_PATHS.TAGGER_USER_NOTIFICATIONS);
					break;
				}
				case "dashboard": {
					this._view.$scope.app.show(constants.APP_PATHS.TAGGER_ADMIN_DASHBOARD);
					break;
				}
				case "admin": {
					this._view.$scope.app.show(constants.APP_PATHS.TAGGER_ADMIN);
					break;
				}
				case "task_tool": {
					this._view.$scope.app.show(constants.APP_PATHS.TAGGER_TASK_TOOL);
					break;
				}
				case "user": {
					this._view.$scope.app.show(constants.APP_PATHS.TAGGER_USER);
					break;
				}
				default: {
					break;
				}
			}
		});
	}

	_showLogoutPanel() {
		this._logoutPanel.show(false, false);
	}

	_setSubItemsToLogoutMenu() {
		const subMenu = this._logoutMenu.getSubMenu("name");
		let subItems = [];

		if (authService.isAdmin()) {
			subItems = this._getOptionsForCurrentView(constants.USER_MENU_ITEMS.ADMIN);
		}
		else {
			subItems = this._getOptionsForCurrentView(constants.USER_MENU_ITEMS.USER);
		}

		if (subItems.length) {
			subMenu.clearAll();
			subMenu.parse(subItems, 0);
		}
	}

	_getOptionsForCurrentView(options) {
		const route = this._view.$scope.app.getRouter().get();
		const filteredOptions = options.filter(option => !route.includes(option.id));
		return [...filteredOptions, ...constants.USER_MENU_ITEMS.BOTH];
	}

	_setUserName() {
		const user = authService.getUserInfo();
		const userMenuItem = this._logoutMenu.getItem("name");

		if (!userMenuItem.value) {
			const name = `${user.firstName} ${user.lastName}`;
			userMenuItem.value = `<span style="width: ${this._calcUserMenuWidth(name)}px;">${name}</span>`;
			this._logoutMenu.define("tooltip", name);
			this._logoutMenu.refresh();
		}
	}

	_calcUserMenuWidth(str) {
		return str && str.length ? str.length * 14 : 1;
	}
}
