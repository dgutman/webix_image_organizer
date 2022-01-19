import {JetView} from "webix-jet";
import constants from "../../constants";
import auth from "../../services/authentication";
import NotificationsService from "../../services/notifications/notificationsService";

export default class TaggerNotifications extends JetView {
	config() {
		const backButton = {
			view: "button",
			name: "backButton",
			css: "btn",
			label: "Back to tasks",
			type: "icon",
			icon: "fas fa-arrow-left",
			inputWidth: 200,
			height: 30,
			width: 200,
			click: () => {
				this.app.show(constants.APP_PATHS.TAGGER_USER);
			}
		};

		const headerTemplate = {
			template: "Notifications from Administration",
			css: "dashboard-header",
			borderless: true
		};

		const header = {
			css: "global-header",
			height: constants.HEADER_HEIGHT,
			cols: [
				{
					cols: [
						backButton,
						{}
					]
				},
				headerTemplate,
				{}
			]
		};

		const notList = {
			view: "list",
			css: "user-notifications-list",
			name: "notificationsList",
			borderless: true,
			template: (obj) => {
				const format = webix.Date.dateToStr("%d.%m.%Y %H:%i");
				const isNew = !obj.isRead ? "<i class='new-flag fas fa-circle'></i>" : "";
				const removeIcon = obj._pending ? "<i class='fas fa-spin fa-sync'></i>" : "<i class='remove-icon fas fa-trash-alt'></i>";
				return `<div class='user-notification'>
							<div class='user-notification-header'>
								<span class='task-name'>${obj.taskName}${isNew}</span>
								<span class='date'>${format(new Date(obj.created))} ${removeIcon}</span>
							</div>
							<div class='user-notification-body' style='white-space: pre-wrap'>${obj.text}</div>
						</div>`;
			},
			type: {
				height: "auto"
			}
		};

		const ui = {
			css: "tagger-app",
			rows: [
				header,
				notList
			]
		};

		return ui;
	}

	ready(view) {
		if (auth.isAdmin()) {
			this.app.show(constants.APP_PATHS.TAGGER_ADMIN_DASHBOARD);
		}

		this._notificationsService = new NotificationsService(view);
	}

	get notificationsList() {
		return this.getRoot().queryView({name: "notificationsList"});
	}
}
