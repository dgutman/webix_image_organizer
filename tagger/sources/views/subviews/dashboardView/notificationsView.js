import {JetView} from "webix-jet";
import constants from "../../../constants";
import templates from "../../templates";

export default class NotificationsView extends JetView {
	config() {
		const notificationTextarea = {
			view: "textarea",
			css: "textarea-field",
			name: "textarea",
			height: 140,
			inputHeight: 140,
			borderless: true,
			attributes: {maxlength: 500},
			value: constants.DEFAULT_NOTIFICATION_TEXT,
			invalidMessage: "The text of the message can't be empty",
			validate: value => value && webix.rules.isNotEmpty(value.trim())
		};

		const notificationForm = {
			view: "form",
			type: "form",
			css: "notification-users-form",
			borderless: true,
			width: 260,
			elements: [
				{
					css: "overflow_visible",
					cols: [
						{},
						{
							css: "overflow_visible",
							rows: [
								{
									borderless: true,
									name: "usersCardsTemplate",
									css: "notification-users-cards users-cards-template",
									height: 40,
									template: (obj) => {
										const users = obj.users || [];
										let usersTemplates = users
											.map(user => templates.getUsersCard(user.name, user.id));
										const templateNode = this.usersCardTemplate.getNode();
										let templateWidth = templateNode.offsetWidth;
										if (templateWidth === 0) templateWidth = 200;
										const iconsWidth = usersTemplates.length * 22;
										const maxIconsCount = Math.floor((templateWidth - 10) / 22);
										if (templateWidth - 10 < iconsWidth) {
											usersTemplates = usersTemplates.slice(0, maxIconsCount - 1);
											usersTemplates.push("<div class='user-dots-icon'><i class='fas fa-ellipsis-h'></i></div>");
										}

										return usersTemplates.join("");
									}
								},
								{
									view: "multiCombo",
									name: "usersMultiCombo",
									width: 200,
									css: "search-field users-multicombo",
									placeholder: "Please, select the users"
								}
							]
						},
						{}
					]
				},
				{
					cols: [
						{},
						{
							view: "button",
							css: "btn",
							width: 100,
							name: "sendNotificationBtn",
							disabled: true,
							value: "Send"
						},
						{}
					]
				}
			]
		};

		const notificationsLayout = {
			height: 180,
			cols: [
				{
					view: "form",
					type: "form",
					elements: [
						{
							cols: [
								notificationTextarea,
								notificationForm
							]
						}
					]
				}
			]
		};

		return notificationsLayout;
	}

	ready(view) {

	}

	get textarea() {
		return this.getRoot().queryView({view: "textarea"});
	}

	get sendButton() {
		return this.getRoot().queryView({name: "sendNotificationBtn"});
	}

	get usersMultiCombo() {
		return this.getRoot().queryView({name: "usersMultiCombo"});
	}

	get usersCardTemplate() {
		return this.getRoot().queryView({name: "usersCardsTemplate"});
	}
}
