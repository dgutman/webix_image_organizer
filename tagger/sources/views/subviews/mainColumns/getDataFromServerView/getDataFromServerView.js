import {JetView} from "webix-jet";
import constants from "../../../../constants";
import auth from "../../../../services/authentication";

export default class GetDataFromServerView extends JetView {
	config() {
		const getDataButton = {
			view: "button",
			name: "getDataButton",
			css: "btn",
			label: "Get collection data",
			disabled: true,
			width: 200
		};

		const statusTemplate = {
			name: "statusTemplate",
			height: 40,
			css: "get-data-status-template",
			width: 380,
			template: (obj) => {
				if (obj.value) {
					let timeInfo = "";
					let tooltip = "Click to hide";
					if (obj.value === constants.RECOGNITION_STATUSES.IN_PROGRESS.value) {
						tooltip = "";
						timeInfo = "This process may take hours. ";
					}
					return `${timeInfo}Status: ${obj.value}
							<span style="color: ${obj.iconColor}" class="status-icon ${obj.icon}" webix_tooltip='${tooltip}'></span>`;
				}
				return "";
			},
			onClick: {
				"status-icon": () => {
					const statusTemplateView = this.getRoot().queryView({name: "statusTemplate"});
					const statusObj = statusTemplateView.getValues();
					if (statusObj.value !== constants.RECOGNITION_STATUSES.IN_PROGRESS.value) {
						statusTemplateView.hide();
					}
				}
			},
			borderless: true
		};

		const sendDataButton = {
			view: "button",
			name: "sendDataButton",
			css: "btn",
			label: "Send collection data",
			disabled: !auth.isLoggedIn(),
			width: 200
		};

		const ui = {
			name: "getDataFromServerView",
			margin: 10,
			padding: 10,
			borderless: true,
			cols: [
				getDataButton,
				statusTemplate,
				sendDataButton
			]
		};

		return ui;
	}

	ready(view) {
		const statusTemplate = view.queryView({name: "statusTemplate"});
		webix.TooltipControl.addTooltip(statusTemplate.$view);
	}
}
