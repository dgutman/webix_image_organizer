import {JetView} from "webix-jet";
import constants from "../../../constants";
import auth from "../../../services/authentication";
import DashboardService from "../../../services/dashboard/dashboardService";
import templates from "../../templates";
import taskUsers from "../../../models/taskUsers";

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

		const tagTemplatesLink = {
			view: "template",
			name: "tagTemplatesLink",
			borderless: true,
			template: "<a class='tag-templates-link'>Tag templates</a>"
		};

		const newTasksButton = {
			view: "button",
			css: "btn",
			width: 200,
			name: "newTasksButton",
			value: "Add a new task",
			click: () => {
				this.app.show(constants.APP_PATHS.TAGGER_TASK_TOOL);
			}

		};

		const treetable = {
			view: "treetable",
			name: "treetable",
			select: true,
			navigation: false,
			editable: true,
			css: "tagger-dashboard",
			resizeColumn: false,
			drag: true,
			scheme: {
				$change: (obj) => {
					if (obj._modelType === "task_group") {
						obj.webix_kids = true;
					}

					obj.progress = `${obj.reviewed}/${obj.count}`;
					const format = webix.Date.dateToStr("%d.%m.%Y %H:%i");
					obj._latest = obj.latest ? format(new Date(obj.latest)) : "no info";
					obj._created = format(new Date(obj.created));

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
					id: "name",
					header: ["Task name", {content: "textFilter"}],
					tooltip: obj => obj.name || "",
					template: (obj, common) => `${common.treetable(obj, common)} ${obj.name}`,
					sort: "text",
					fillspace: 2,
					minWidth: 100
				},
				{
					id: "status",
					header: ["Status", {content: "selectFilter"}],
					tooltip: obj => obj.status || "",
					sort: "text",
					fillspace: 1,
					minWidth: 50,
					editor: "richselect",
					editaction: "custom",
					options: [
						"created", "published", "canceled", "in_progress", "finished"
					]
				},
				{
					id: "created",
					header: ["Creation date", {content: "textFilter"}],
					tooltip: obj => obj._created || "",
					template: obj => obj._created || "",
					sort: "text",
					fillspace: 1,
					minWidth: 50
				},
				{
					id: "userId",
					header: [{css: {"text-align": "center"}, text: "Assign to"}, {content: "selectFilter"}],
					width: 150,
					minWidth: 100,
					css: "dashboard-users-column",
					template: (obj, common) => `<div class='dashboard-users assigned-users'>${common.users(obj, common, "userId")}</div>`
				},
				{
					id: "creatorId",
					header: [{css: {"text-align": "center"}, text: "Creators"}, {content: "selectFilter"}],
					width: 150,
					minWidth: 100,
					css: "dashboard-users-column",
					template: (obj, common) => `<div class='dashboard-users creators'>${common.users(obj, common, "creatorId")}</div>`
				},
				{
					id: "latest",
					header: [{css: {"text-align": "center"}, text: "Latest activity"}, {content: "textFilter"}],
					tooltip: obj => obj._latest || "",
					template: obj => obj._latest || "",
					css: {"text-align": "center"},
					sort: "text",
					width: 180,
					minWidth: 100
				},
				{
					id: "remaining",
					header: [
						{
							text: "Remaining to deadline",
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
					id: "actions",
					header: [{css: {"text-align": "center"}, text: "Actions"}],
					template: obj => templates.getDashboardActionsCol(obj),
					width: 160,
					minWidth: 160
				}
			],
			type: {
				users: (obj, common, colId) => {
					if (obj._modelType === "task") {
						const columnConf = this.getRoot().queryView({name: "treetable"}).getColumnConfig(colId);
						let userTemplates = obj[colId].map((id) => {
							const userObj = taskUsers.find(user => id === user._id, true);
							return templates.getUsersCard(userObj ? userObj.name : "unknown", id);
						});

						if (columnConf.node.offsetWidth - 10 <= userTemplates.length * 15) {
							userTemplates = userTemplates.slice(0, Math.floor((columnConf.node.offsetWidth - 10) / 15) - 1);
							userTemplates.push("<div class='dashboard-user-dots-icon'><i class='fas fa-ellipsis-h'></i></div>");
						}

						return userTemplates.join("");
					}
					return "";
				}
			},
			on: { // to fix unfocus bug with built-in filters
				onAfterLoad() {
					this.adjustColumn("name", "all");
					this.adjustColumn("latest", "all");
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
							view: "multiCombo",
							name: "usersMultiCombo",
							width: 200,
							css: "search-field",
							placeholder: "Please, select the users"
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

		const resultsLayout = {
			css: "results-layout",
			width: 300,
			scroll: "auto",
			rows: [
				{
					name: "resultsTemplate",
					template: obj => templates.getUserProgressTemplate(obj),
					borderless: true,
					autoheight: true
				},
				{height: 10},
				{
					view: "richselect",
					css: "select-field",
					name: "resultsRichselect",
					options: {
						data: taskUsers,
						body: {
							template: obj => obj.name
						}
					}
				},
				{height: 10},
				{
					name: "tagStatisticTemplate",
					template: obj => templates.getTagsStatisticTemplate(obj),
					borderless: true,
					autoheight: true
				},
				{}
			]
		};

		const accordion = {
			view: "accordion",
			type: "clean",
			multi: true,
			rows: [
				{height: 10},
				{
					view: "accordion",
					type: "clean",
					cols: [
						{
							rows: [
								{
									padding: 10,
									cols: [
										tagTemplatesLink,
										{},
										newTasksButton
									]
								},
								{
									padding: 10,
									rows: [treetable]
								}
							]
						},
						{
							header: "Results",
							css: "tagger-accordion-item",
							body: resultsLayout,
							collapsed: true
						}
					]
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

	get tagTemplatesLink() {
		return this.getRoot().queryView({name: "tagTemplatesLink"});
	}

	get dashboard() {
		return this.getRoot().queryView({name: "treetable"});
	}

	get textarea() {
		return this.getRoot().queryView({view: "textarea"});
	}

	get sendButton() {
		return this.getRoot().queryView({name: "sendNotificationBtn"});
	}

	get resultsTemplate() {
		return this.getRoot().queryView({name: "resultsTemplate"});
	}

	get resultsRichselect() {
		return this.getRoot().queryView({name: "resultsRichselect"});
	}

	get tagStatisticTemplate() {
		return this.getRoot().queryView({name: "tagStatisticTemplate"});
	}

	get usersMultiCombo() {
		return this.getRoot().queryView({name: "usersMultiCombo"});
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
