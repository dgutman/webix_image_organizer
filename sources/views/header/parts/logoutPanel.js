import {JetView} from "webix-jet";
import authService from "../../../services/authentication";
import SettingsWindow from "../windows/settings";
import galleryImageUrl from "../../../models/galleryImageUrls";

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
						openAction: "click",
						data: [
							{
								id: "name",
								value: this.getUserName(),
								submenu: [
									{id: "settings", value: "<span class='webix_icon fas fa-cog'></span> Settings"},
									{$template: "Separator"},
									{id: "logout", value: "<span class='webix_icon fas fa-arrow-right'></span> Logout"}
								]
							}
						],
						type: {
							subsign: true
						},
						on: {
							onMenuItemClick: (id) => {
								switch (id) {
									case "settings": {
										this.settingsWindow.showWindow();
										break;
									}
									case "logout": {
										galleryImageUrl.clearPreviewUrls();
										galleryImageUrl.clearPreviewLabelUrls();
										galleryImageUrl.clearPreviewMacroImageUrl();
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

	ready() {
		this.settingsWindow = this.ui(SettingsWindow);
	}

	getUserName() {
		const user = authService.getUserInfo();
		let name = "";
		if (user) {
			name = `${user.firstName || ""} ${user.lastName || ""}`;
		}
		return name;
	}

	calcUserMenuWidth(str) {
		return str && str.length ? str.length * 14 : 1;
	}
}
