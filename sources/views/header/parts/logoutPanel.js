import {JetView} from "webix-jet";
import authService from "../../../services/authentication";

export default class LogoutPanelView extends JetView {
	config() {

		const cols = [
			{},
			{
				rows: [
					{},
					{
						view: "menu",
						width: this.calcUserMenuWidth(this.getUserName()),
						data: [
							{
								id: "name",
								value: this.getUserName(),
								submenu: [
									{id: "logout", value: "<span class='webix_icon fa-arrow-right'></span> Logout"}
								]
							}
						],
						type: {
							subsign: true
						},
						on: {
							onMenuItemClick(id) {
								switch (id) {
									case "logout": {
										authService.logout();
										break;
									}
									default: {
										break;
									}
								}
							}
						}
					},
					{}
				]
			}
		];

		return {cols};
	}

	getUserName() {
		const user = authService.getUserInfo();
		const name = `${user.firstName || ""} ${user.lastName || ""}`;
		return name;
	}

	calcUserMenuWidth(str) {
		return str && str.length ? str.length * 20 : 1;
	}
}
