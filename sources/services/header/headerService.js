import utils from "../../utils/utils";
import ajax from "../ajaxActions";

class HeaderService {
	constructor(view, loginPanel, logoutPanel, hostBox, collectionBox) {
		this._view = view;
		this._loginPanel = loginPanel;
		this._logoutPanel = logoutPanel;
		this._hostBox = hostBox;
		this._collectionBox = collectionBox;
		this._init();
	}

	_init() {
		this.setValueAndParseData();

		this._skinSwitcher = this._view.$scope.getSkinSwitcher();

		this._skinSwitcher.attachEvent("onChange", () => {
			this.toggleTheme();
		});

		this._view.$scope.on(this._view.$scope.app, "login", () => {
			this.showLogoutPanel();
		});

		this._view.$scope.on(this._view.$scope.app, "logout", () => {
			this._loginPanel.show();
		});

		this._hostBox.attachEvent("onChange", (newId, oldId) => {
			if (oldId && newId !== oldId) {
				webix.confirm({
					title: "Attention!",
					type: "confirm-warning",
					text: "Are you sure you want to change host? All data will be cleared.",
					ok: "Yes",
					cancel: "No",
					callback: (result) => {
						if (result) {
							this._view.$scope.app.callEvent("hostChange", [newId]);
							// URL-NAV
							this._view.$scope.setParam("host", newId, true);
							this.putValuesAfterHostChange(newId);

							// this._view.$scope.app.refresh();
							// to give webix some time to set new URL before reload
							webix.delay(() => {
								window.location.reload();
							}, 100);
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

		this._collectionBox.attachEvent("onChange", (id, oldId) => {
			const collectionItem = this._collectionBox.getList().getItem(id);
			this._view.$scope.setParam("collection", collectionItem.name, true);
			this._view.$scope.app.callEvent("collectionChange", [id, collectionItem, oldId]);
		});
	}

	// URL-NAV get host and collection from URL params and select it
	_urlChange(view, url) {
		this.urlChangeHost(view);
		this.urlChangeCollection(view);
	}

	urlChangeHost(view) {
		const host = view.$scope.getParam("host");
		if (!host) {
			const firstHostItemId = process.env.SERVER_LIST[0].id;
			view.$scope.setParam("host", this._hostBox.getValue() || firstHostItemId, true);
			return false;
		}
		const paramsHost = process.env.SERVER_LIST.find(item => item.id === host);
		if (paramsHost) {
			this._hostBox.setValue(paramsHost.id);
		}
		return true;
	}

	urlChangeCollection() {
		const collection = this.getCollectionFromParams();

		const collectionBoxValue = this._collectionBox.getValue();
		if (collection) this._collectionBox.setValue(collection.id);
		else if (collectionBoxValue) {
			const collectionItem = this._collectionBox.getList().getItem(collectionBoxValue);
			this._view.$scope.setParam("collection", collectionItem.name, true);
			this._view.$scope.app.callEvent("collectionChange", [collectionBoxValue, collectionItem]);
		}
	}

	showLogoutPanel() {
		this._logoutPanel.show(false, false);
	}

	toggleTheme() {
		const value = this._skinSwitcher.getValue();
		utils.setAppSkinToLocalStorage(value);
		window.location.reload();
	}

	putValuesAfterHostChange(hostId) {
		const hostBoxItem = this._hostBox.getList().getItem(hostId);
		const hostAPI = hostBoxItem.hostAPI;
		webix.storage.local.put("hostId", hostId);
		webix.storage.local.put("hostAPI", hostAPI);
	}

	// setting hosts value and parsing data to collection and tree
	setValueAndParseData() {
		const paramsHostId = this._view.$scope.getParam("host");

		const firstHostItemId = process.env.SERVER_LIST[0].id;
		const paramsHost = process.env.SERVER_LIST.find(item => item.id === paramsHostId);
		if (paramsHost) {
			const hostId = paramsHost.id;
			this.putValuesAfterHostChange(hostId);
			this._hostBox.setValue(hostId);
			this.parseCollectionData();
		}
		else {
			this._view.$scope.setParam("host", firstHostItemId, true);
			this.setValueAndParseData();
		}
	}

	getCollectionFromParams() {
		const collectionName = this._view.$scope.getParam("collection");
		if (collectionName) {
			const collectionList = this._collectionBox.getList();
			return collectionList.find(obj => utils.compareURLStrings(obj.name, collectionName), true);
		}
		return null;
	}

	parseCollectionData() {
		ajax.getCollection()
			.then((data) => {
				this.parseToList({
					data: webix.copy(data)
				});
				let collectionList = this._collectionBox.getList();
				const paramsCollection = this.getCollectionFromParams();
				let selectedId = paramsCollection ? paramsCollection.id : collectionList.getFirstId();
				this._collectionBox.setValue(selectedId);
			});
	}

	parseToList(collections) {
		this._collectionBox.getList().clearAll();
		this._collectionBox.getList().parse(collections);
	}
}

export default HeaderService;
