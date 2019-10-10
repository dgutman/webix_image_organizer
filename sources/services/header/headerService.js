import utils from "../../utils/utils";

class HeaderService {
	constructor(view, loginPanel, logoutPanel) {
		this._view = view;
		this._loginPanel = loginPanel;
		this._logoutPanel = logoutPanel;
		this._init();
	}

	_init() {
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
	}

	showLogoutPanel() {
		this._logoutPanel.show(false, false);
	}

	toggleTheme() {
		const value = this._skinSwitcher.getValue();
		utils.setAppSkinToLocalStorage(value);
		window.location.reload();
	}
}

export default HeaderService;
