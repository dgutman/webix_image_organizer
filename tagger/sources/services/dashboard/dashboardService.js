import constants from "../../constants";
import auth from "../authentication";
import transitionalAjax from "../transitionalAjaxService";
import ajaxService from "../ajaxActions";
import taskUsers from "../../models/taskUsers";
import groupsCollection from "../../models/groups";
import UsersPopup from "../../views/windows/usersPopup";
import GroupTasks from "../../views/windows/groupTasks";
import taskJSONCollection from "../../models/taskJSON";
import TagTemplatesPopup from "../../views/windows/tagTemplates";

export default class TaggerDashboardService {
	constructor(view) {
		this._view = view;
		this._ready();
	}

	_ready() {
		webix.extend(this._view, webix.ProgressBar);
		// child views
		const scope = this._view.$scope;
		this._dashboard = scope.dashboard;
		this._textarea = scope.textarea;
		this._sendButton = scope.sendButton;
		this._usersPopup = scope.ui(new UsersPopup(scope.app));
		this._groupTasks = scope.ui(new GroupTasks(scope.app));
		this._tagTemplatesPopup = scope.ui(new TagTemplatesPopup(scope.app));
		this._tagTemplatesLink = scope.tagTemplatesLink;
		this._userPopupList = this._usersPopup.getList();
		this._resultsTemplate = scope.resultsTemplate;
		this._resultsRichselect = scope.resultsRichselect;
		this._tagStatisticTemplate = scope.tagStatisticTemplate;
		this._usersMultiCombo = scope.usersMultiCombo;
		this._usersMultiComboList = this._usersMultiCombo.getPopupList();

		groupsCollection.clearAll();
		taskUsers.clearAll();
		this.getTaskData();

		this._textarea.setValue(this.getTextMessageFromLS());

		this._tagTemplatesLink.define("onClick", {
			"tag-templates-link": () => {
				this._tagTemplatesPopup.showWindow();
			}
		});

		this._usersMultiCombo.attachEvent("customSelectChange", (ids) => {
			if (ids.length) {
				this._sendButton.enable();
			}
			else {
				this._sendButton.disable();
			}
		});

		this._userPopupList.attachEvent("onItemClick", (id, ev) => {
			const user = this._userPopupList.getItem(id);
			const task = this._usersPopup.task;
			const colId = this._usersPopup.columnId;
			if (task && colId && !task.checked_out) {
				let users = webix.copy(task[colId]);
				if (ev.target.classList.contains("checked")) {
					users = task[colId].filter(userId => userId !== user._id);
				}
				else if (ev.target.classList.contains("unchecked")) {
					users.push(user._id);
				}
				this._view.showProgress();
				transitionalAjax.updateTask(task._id, {[colId]: users})
					.then(() => {
						task[colId] = users;
						this._dashboard.updateItem(task.id, task);
						this._usersPopup.included = task[colId];
						this._userPopupList.refresh();
						this._view.hideProgress();
					})
					.catch(() => {
						this._view.hideProgress();
					});
				return false;
			}
		});

		this._resultsRichselect.attachEvent("onChange", (val) => {
			const taskData = this._resultsTemplate.getValues();
			const list = this._resultsRichselect.getPopup().getList();
			const user = list.getItem(val);
			const usersProgress = taskData._progress.find(data => data._id === user._id) || {};
			this._tagStatisticTemplate.setValues(usersProgress);
		});

		this._dashboard.attachEvent("onItemClick", (id, ev) => {
			const item = this._dashboard.getItem(id);
			if (item._modelType === "task") {
				if ((id.column === "userId" || id.column === "creatorId")) {
					const cellNode = this._dashboard.getItemNode(id);
					this._usersPopup.close();
					this._usersPopup.showWindow(item, id.column, cellNode, "bottom");
				}
				else if (id.column === "actions") {
					if (ev.target.classList.contains("delete-button")) {
						this._view.showProgress();
						transitionalAjax.deleteTask(item._id)
							.then((data) => {
								this._dashboard.remove(item.id);
								webix.message(data.message);
								this._view.hideProgress();
							})
							.catch(() => {
								this._view.hideProgress();
							});
					}
					else if (ev.target.classList.contains("edit-button") && !item.checked_out) {
						this._view.showProgress();
						transitionalAjax.getTaskJSON(item._id)
							.then((response) => {
								taskJSONCollection.add(response.data);
								this._view.hideProgress();
								this._view.$scope.app.show(`${constants.APP_PATHS.TAGGER_TASK_TOOL}?edit=${item._id}`);
							})
							.catch(() => {
								this._view.hideProgress();
							});
					}
					else if (ev.target.classList.contains("pattern-on-button")) {
						this._view.showProgress();
						transitionalAjax.getTaskJSON(item._id)
							.then((response) => {
								taskJSONCollection.add(response.data);
								this._view.hideProgress();
								this._view.$scope.app.show(`${constants.APP_PATHS.TAGGER_TASK_TOOL}`);
							})
							.catch(() => {
								this._view.hideProgress();
							});
					}
				}
				else if (id.column === "status") {
					const editor = this._dashboard.getEditor(id);
					const popup = editor.getPopup();
					if (item.checked_out) {
						popup.getList().filter(obj => ["canceled", item.status].includes(obj.id));
					}
					else {
						popup.getList().filter(obj => ["created", "published", "canceled", item.status].includes(obj.id));
					}
					this._dashboard.edit(id);
				}
			}
		});
		this._dashboard.attachEvent("onAfterEditStop", ({value, old}, editor) => {
			const item = this._dashboard.getItem(editor.row);
			if (item._modelType === "task" && editor.column === "status" && value !== old) {
				this._view.showProgress();
				transitionalAjax.updateTask(item._id, {status: value})
					.then((response) => {
						this._dashboard.updateItem(item.id, response.data);
						this._view.hideProgress();
					})
					.catch(() => {
						this._dashboard.updateItem(item.id, {status: old});
						this._view.hideProgress();
					});
			}
		});
		this._dashboard.attachEvent("onBeforeEditStart", (ids) => {
			const item = this._dashboard.getItem(ids.row);
			if (item._modelType !== "task") {
				return false;
			}
		});

		this._dashboard.attachEvent("onSelectChange", () => {
			const selectedItem = this._dashboard.getSelectedItem();
			if (selectedItem) {
				this._sendButton.enable();
				this._usersMultiCombo.enable();
				const users = taskUsers.data.serialize();
				this._usersMultiComboList.clearAll();
				this._usersMultiComboList.parse(users.filter(user => selectedItem.userId.includes(user._id)));
				const listUsers = this._usersMultiComboList.serialize();
				listUsers.forEach((user) => { this._usersMultiCombo.customSelect(user.id, true); });
			}
			else {
				this._sendButton.disable();
				this._usersMultiCombo.disable();
			}
		});

		this._dashboard.attachEvent("onDataRequest", (id) => {
			const group = this._dashboard.getItem(id);
			transitionalAjax.getTaskData(null, group._id)
				.then((response) => {
					if (response.data.length) this._dashboard.parse({parent: id, data: response.data});
				});
		});

		this._dashboard.attachEvent("onBeforeSelect", (id) => {
			const item = this._dashboard.getItem(id);
			if (item._modelType === "task_group") {
				this._dashboard.isBranchOpen(id) ? this._dashboard.close(id) : this._dashboard.open(id);
				return false;
			}
		});

		this._dashboard.attachEvent("onAfterSelect", (id) => {
			const item = this._dashboard.getItem(id);
			const copy = webix.copy(item);
			copy.users = copy.userId.map(userId => taskUsers.find(user => user._id === userId, true));

			const selectList = this._resultsRichselect.getPopup().getList();
			selectList.clearAll();
			const users = taskUsers.data.serialize().filter(user => item.userId.includes(user._id));
			selectList.parse(users);

			if (!copy._progress) {
				transitionalAjax.getTaskResults(item._id)
					.then((response) => {
						copy._progress = response.data;
						item._progress = response.data;
						this._resultsTemplate.setValues(copy);
						this._resultsRichselect.setValue(selectList.getFirstId());
					});
			}
			else {
				this._resultsTemplate.setValues(copy);
				this._resultsRichselect.setValue(selectList.getFirstId());
			}
		});

		this.attachDragAndDropEvents();

		this._sendButton.attachEvent("onItemClick", () => {
			const value = this._textarea.getValue().trim();
			const selectedItem = this._dashboard.getSelectedItem();
			const userIds = {
				[selectedItem._id]: this._usersMultiCombo.getValue().map(user => user._id)
			};

			if (this._textarea.validate()) {
				this._view.showProgress();
				transitionalAjax.sendNotifications(value, userIds)
					.then((data) => {
						const string = data.length > 1 ? "messages were" : "message was";
						webix.message(`${data.length} ${string} successfully sent`);
						this._view.hideProgress();
					})
					.catch(() => {
						this._view.hideProgress();
					});
			}
		});
	}

	getTaskData() {
		this._view.showProgress();
		Promise.all([
			transitionalAjax.getTaskData(),
			transitionalAjax.getGroups(),
			ajaxService.getUsers()
		])
			.then(([tasks, groups, users]) => {
				groupsCollection.parse(groups);
				this._dashboard.parse(groups);
				taskUsers.parse(users);

				const groupIds = {};
				const ungrouped = tasks.data.filter((task) => {
					if (task.groupId) {
						const group = this._dashboard.find(obj => obj._id === task.groupId, true);
						if (groupIds[group.id]) groupIds[group.id].push(task);
						else groupIds[group.id] = [task];
						return false;
					}
					return true;
				});

				Object.entries(groupIds).forEach(([groupId, data]) => {
					this._dashboard.parse({parent: groupId, data});
				});
				this._dashboard.parse(ungrouped);


				this._dashboard.parse(tasks.data);
				this._view.hideProgress();
			})
			.catch(() => {
				this._view.hideProgress();
			});
	}

	getTaskGroups() {
		transitionalAjax.getGroups()
			.then((groups) => {
				groupsCollection.parse(groups);
				this._dashboard.parse(groups);
			});
	}

	putTextToLocalStorage(text) {
		if (auth.isAdmin()) {
			webix.storage.local.put(`notification-message-${auth.getUserId()}`, text);
		}
	}

	getTextMessageFromLS() {
		return webix.storage.local.get(`notification-message-${auth.getUserId()}`) || constants.DEFAULT_NOTIFICATION_TEXT;
	}

	attachDragAndDropEvents() {
		this._dashboard.attachEvent("onBeforeDrag", (context) => {
			const item = this._dashboard.getItem(context.start);
			if (item._modelType === "task_group") return false;
		});

		this._dashboard.attachEvent("onBeforeDragIn", (context) => {
			const target = context.target;
			if (!target || context.start === target.row) return false;
		});

		this._dashboard.attachEvent("onBeforeDrop", (context) => {
			const {source, target} = context;
			if (
				context.from !== context.to ||
				(target && context.start === target.row)
			) {
				return false;
			}
			const targetItem = target ? this._dashboard.getItem(target.row) : null;

			this._view.showProgress();
			let promise;
			if (!targetItem) {
				promise = this.groupTasks(source.map(id => this._dashboard.getItem(id)._id), null, 0);
			}
			else if (targetItem.$parent || targetItem._modelType === "task_group") {
				const parent = this._dashboard.getItem(targetItem.$parent || targetItem.id);
				promise = this.groupTasks(source.map(id => this._dashboard.getItem(id)._id), parent._id, parent.id);
			}
			else {
				promise = this._groupTasks.showWindow()
					.then((group) => {
						let parentId;
						if (!this._dashboard.exists(group.id)) {
							parentId = this._dashboard.add(group, 0);
						}
						else {
							parentId = group.id;
						}
						const ids = source.concat(target.row)
							.map((id) => {
								const item = this._dashboard.getItem(id);
								return item._id;
							});
						return this.groupTasks(ids, group._id, parentId);
					});
			}
			promise.finally(() => {
				this._view.hideProgress();
			});
			return false;
		});
	}

	groupTasks(ids, groupId, parentId) {
		ids = ids.filter((id) => {
			const task = this._dashboard.find(obj => obj._id === id, true);
			return task.$parent != parentId;
		});
		if (ids.length) {
			return transitionalAjax.groupTasks(ids, groupId)
				.then((response) => {
					response.data.forEach((task) => {
						const item = this._dashboard.find(obj => obj._id === task._id, true);
						this._dashboard.updateItem(item.id, task);
						this._dashboard.move(item.id, -1, this._dashboard, {parent: parentId});
					});
				});
		}
		return Promise.resolve();
	}
}
