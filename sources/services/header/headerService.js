class HeaderService {
	constructor(view, loginPanel, logoutPanel) {
		this._view = view;
		this._loginPanel = loginPanel;
		this._logoutPanel = logoutPanel;
		this._init();
	}

	_init() {
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
}

export default HeaderService;
