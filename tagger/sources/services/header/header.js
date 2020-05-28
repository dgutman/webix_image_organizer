import authService from "../authentication";
import ajaxService from "../ajaxActions";
import notificationsModel from "../../models/notificationsModel";
import constants from "../../constants";

export default class TaggerHeaderService {
	constructor(view, loginWindow) {
		this._view = view;
		this._loginWindow = loginWindow;
		this._init();
	}

	_init() {
		this._parentView = this._view.getTopParentView();
		webix.extend(this._parentView, webix.ProgressBar);

		// child views
		this._hostBox = this._view.$scope.getHostBox();
		this._loginPanel = this._view.$scope.getLoginPanel();
		this._logoutPanel = this._view.$scope.getLogoutPanel();
		this._logoutMenu = this._view.$scope.getLogoutMenu();
		this._undoIcon = this._view.$scope.getUndoButton();
		this._taskNameTemplate = this._view.$scope.getTaskNameTemplate();

		this._setValueAndParseData();

		if (authService.isLoggedIn()) {
			this._showLogoutPanel();
			this._setUserName();
			if (!authService.isAdmin()) {
				notificationsModel.collection.waitData
					.then(() => {
						this._updateNotificationsBadge();
					});
				this._view.$scope.on(notificationsModel.collection.data, "onStoreUpdated", () => {
					this._updateNotificationsBadge();
				});
			}
		}

		this._view.$scope.on(this._view.$scope.app, "OnTaskSelect", (task) => {
			this._taskNameTemplate.setValues(task);
		});

		this._view.$scope.on(this._view.$scope.app, "getCollectionData", () => {
			if (authService.isAdmin()) {
				this._parseCollectionData();
			}
		});

		this._attachHostBoxEvent();
		this._attachLogoutPanelEvent();
		this._rebuildHeaderUIForUser();
	}

	_attachHostBoxEvent() {
		this._hostBox.attachEvent("onChange", (newId, oldId) => {
			if (oldId && newId !== oldId) {
				webix.confirm({
					title: "Attention!",
					type: "confirm-warning",
					text: "Are you sure you want to change host? All data will be cleared.",
					cancel: "No",
					ok: "Yes",
					callback: (result) => {
						if (result) {
							this._putValuesAfterHostChange(newId);
							// this._view.$scope.app.refresh();
							window.location.reload();
						}
						else {
							this._hostBox.blockEvent();
							this._hostBox.setValue(oldId);
							this._hostBox.unblockEvent();
						}
					}
				});
			}
		});
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
				default: {
					break;
				}
			}
		});
	}

	_putValuesAfterHostChange(hostId) {
		const hostBoxItem = this._hostBox.getList().getItem(hostId);
		const hostAPI = hostBoxItem.hostAPI;
		webix.storage.local.put("hostId", hostId);
		webix.storage.local.put("hostAPI", hostAPI);
	}

	// setting hosts value
	_setValueAndParseData() {
		const localStorageHostId = webix.storage.local.get("hostId");
		const firstHostItemId = process.env.SERVER_LIST[0].id;
		const hostId = localStorageHostId || firstHostItemId;
		this._putValuesAfterHostChange(hostId);
		this._hostBox.setValue(hostId);
	}

	_showLogoutPanel() {
		this._logoutPanel.show(false, false);
	}

	_setUserName() {
		const user = authService.getUserInfo();
		const userMenuItem = this._logoutMenu.getItem("name");
		const subMenu = this._logoutMenu.getSubMenu("name");

		let subItem = {
			id: "notifications",
			value: "<span class='fas fa-bell'></span> Notifications"
		};

		if (authService.isAdmin()) {
			subItem = {
				id: "dashboard",
				value: "<span class='fas fa-table'></span> Dashboard"
			};
		}
		subMenu.add(subItem, 0);

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

	_parseCollectionData() {
		this._parentView.showProgress();
		ajaxService.getCollection()
			.then((collections) => {
				this._view.$scope.app.callEvent("collectionDataReceived", [collections]);
				this._parentView.hideProgress();
			})
			.fail(() => {
				this._parentView.hideProgress();
			});
	}

	_rebuildHeaderUIForUser() {
		if (!authService.isLoggedIn() || !authService.isAdmin()) {
			this._taskNameTemplate.show();
			this._undoIcon.hide();
		}
	}

	_updateNotificationsBadge() {
		const newItems = notificationsModel
			.collection.data
			.serialize()
			.filter(not => !not.isRead);

		const subMenu = this._logoutMenu.getSubMenu("name");
		subMenu.updateItem("notifications", {badge: newItems.length});
	}
}
