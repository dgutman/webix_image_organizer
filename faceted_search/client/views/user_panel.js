
define([
	"app",
	"constants",
	"windows/login_window",
	"helpers/authentication"
], function (app, constants, loginWindow, auth) {

	function calcUserMenuWidth(str) {
		return str && str.length ? str.length * 14 : 1;
	}

	function setUserName() {
		const user = auth.getUserInfo();
		const logoutMenu = $$(constants.LOGOUT_PANEL_ID).queryView({name: "logoutMenu"});
		const userMenuItem = logoutMenu.getItem("name");

		if (!userMenuItem.value) {
			const name = `${user.firstName} ${user.lastName}`;
			userMenuItem.value = `<span style="width: ${calcUserMenuWidth(name)}px;">${name}</span>`;
			logoutMenu.define("tooltip", name);
			logoutMenu.refresh();
		}
	}

	const loginMenu = {
		name: "loginMenu",
		template: "<span class='menu-login login-menu-item'>Login</span>",
		css: "login-menu",
		borderless: true,
		onClick: {
			"menu-login": () => {
				loginWindow.show();
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
				submenu: [
					{id: "logout", value: "<span class='fas fa-arrow-right'></span> Logout"}
				]
			}
		],
		type: {
			subsign: true
		},
		on: {
			onMenuItemClick: (id) => {
				switch (id) {
					case "logout": {
						auth.logout();
						break;
					}
					default: {
						break;
					}
				}
			}
		}
	};
	
	const loginPanel = {
		id: constants.LOGIN_PANEL_ID,
		cols: [
			loginMenu
		]
	};
	
	const logoutPanel = {
		id: constants.LOGOUT_PANEL_ID,
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
	
	return {
        $ui: userPanel,
        $oninit: function() {
            if (auth.isLoggedIn()) {
				$$(constants.LOGOUT_PANEL_ID).show(false, false);
				setUserName();
			}
        }
    };
});

