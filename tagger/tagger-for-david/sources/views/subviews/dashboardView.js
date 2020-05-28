import {JetView} from "webix-jet";
import constants from "../../constants";
import auth from "../../services/authentication";
import DashboardService from "../../services/dashboard/dashboardService";

export default class TaggerDashboard extends JetView {
	config() {
		const backButton = {
			view: "button",
			name: "backButton",
			css: "btn",
			label: "Back to main view",
			type: "icon",
			icon: "fas fa-arrow-left",
			inputWidth: 200,
			height: 30,
			width: 200,
			click: () => {
				this.app.show(constants.APP_PATHS.TAGGER_ADMIN);
			}
		};

		const headerTemplate = {
			template: "Table of users and tasks progress",
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

		const datatable = {
			view: "datatable",
			name: "datatable",
			select: true,
			navigation: false,
			editable: false,
			css: "tagger-dashboard",
			resizeColumn: false,
			multiselect: true,
			scheme: {
				$init: (obj) => {
					obj.progress = `${obj.reviewed}/${obj.count}`;
					const format = webix.Date.dateToStr("%d.%m.%Y %H:%i");
					obj.latest = obj.latest ? format(new Date(obj.latest)) : "no info";

					if (obj.deadline) {
						const {days, hours, minutes} = this.getTimeRemaining(new Date(obj.deadline));
						if (days < 0 || hours < 0 || minutes < 0) obj.remaining = "reached";
						else obj.remaining = `${days} days ${hours} h ${minutes} min`;
					}
					else {
						obj.remaining = "no info";
					}
				}
			},
			columns: [
				{
					id: "userName",
					header: ["User", {content: "textFilter"}],
					tooltip: obj => obj.userName || "",
					sort: "text",
					fillspace: 1,
					minWidth: 100
				},
				{
					id: "name",
					header: ["Tasks", {content: "textFilter"}],
					tooltip: obj => obj.task || "",
					sort: "text",
					fillspace: 1,
					minWidth: 100
				},
				{
					id: "latest",
					header: [{css: {"text-align": "center"}, text: "Latest user activity"}, {content: "textFilter"}],
					tooltip: obj => obj.latest || "",
					css: {"text-align": "center"},
					sort: "text",
					width: 180,
					minWidth: 100
				},
				{
					id: "progress",
					header: [
						{
							text: "Progress in images (marked/all)",
							css: "progress-header",
							height: 60
						},
						{
							content: "textFilter"
						}
					],
					tooltip: obj => obj.progress || "",
					css: {"text-align": "center"},
					sort: "text",
					width: 180,
					minWidth: 180
				},
				{
					id: "remaining",
					header: [
						{
							text: "Remaining time to deadline",
							css: "progress-header",
							height: 60
						},
						{
							content: "textFilter"
						}
					],
					tooltip: obj => obj.remaining,
					css: {"text-align": "center"},
					sort: "text",
					width: 180,
					minWidth: 180
				},
				{
					id: "checked_out",
					header: [{text: "Checked", rowspan: 2}],
					sort: "text",
					template: obj => (obj.checked_out ? "<i class='fas fa-check'></i>" : "<i class='fas fa-times'></i>"),
					css: {"text-align": "center"},
					width: 90
				}
			],
			on: { // to fix unfocus bug with built-in filters
				onAfterLoad() {
					this.adjustColumn("userName", "all");
					this.adjustColumn("name", "all");
					this.adjustColumn("latest", "all");
					this.adjustColumn("progress", "data");
					this.refreshColumns();
				}
			},
			data: []
		};

		const notificationTextarea = {
			view: "textarea",
			css: "textarea-field",
			name: "textarea",
			height: 120,
			inputHeight: 120,
			borderless: true,
			attributes: {maxlength: 500},
			value: constants.DEFAULT_NOTIFICATION_TEXT,
			invalidMessage: "The text of the message can't be empty",
			validate: value => value && webix.rules.isNotEmpty(value.trim())
		};

		const notificationForm = {
			view: "form",
			css: "textarea-field",
			value: "Dear Colleague",
			type: "form",
			borderless: true,
			width: 260,
			elements: [
				{},
				{
					cols: [
						{},
						{
							view: "button",
							css: "btn",
							width: 200,
							name: "saveNotificationBtn",
							value: "Save edited text message"
						},
						{}
					]
				},
				{},
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
			height: 170,
			cols: [
				{
					view: "form",
					type: "form",
					elements: [
						{cols: [
							notificationTextarea,
							notificationForm
						]}
					]
				}
			]
		};

		const accordion = {
			view: "accordion",
			type: "clean",
			multi: true,
			rows: [
				{
					padding: 10,
					rows: [datatable]
				},
				{
					header: "Notification text",
					css: "tagger-accordion-item",
					collapsed: true,
					body: notificationsLayout
				}
			]
		};

		const ui = {
			css: "tagger-app",
			rows: [
				header,
				accordion
			]
		};

		return ui;
	}

	ready(view) {
		if (!auth.isAdmin()) {
			this.app.show(constants.APP_PATHS.TAGGER_USER);
		}

		this._dashboardService = new DashboardService(view);
	}

	get dashboard() {
		return this.getRoot().queryView({name: "datatable"});
	}

	get textarea() {
		return this.getRoot().queryView({view: "textarea"});
	}

	get sendButton() {
		return this.getRoot().queryView({name: "sendNotificationBtn"});
	}

	get saveButton() {
		return this.getRoot().queryView({name: "saveNotificationBtn"});
	}

	getTimeRemaining(endtime) {
		let t = Date.parse(endtime) - Date.parse(new Date());
		let seconds = Math.floor((t / 1000) % 60);
		let minutes = Math.floor((t / 1000 / 60) % 60);
		let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
		let days = Math.floor(t / (1000 * 60 * 60 * 24));
		return {
			total: t,
			days,
			hours,
			minutes,
			seconds
		};
	}
}
