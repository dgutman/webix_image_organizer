import transitionalAjax from "../transitionalAjaxService";
import ajaxService from "../ajaxActions";
import taskUsers from "../../models/taskUsers";
import groupsCollection from "../../models/groups";
import "../globalEvents";
import TagSettingsWindow from "../../views/windows/tagSettings";
import TaskCreationFormConfigs from "../../models/taskCreationFormConfigs";
import constants from "../../constants";
import ajv from "../../models/ajvValidationSchemas";
import taskJSONCollection from "../../models/taskJSON";


export default class TaskCreationService {
	constructor(view) {
		this._view = view;
		this._ready();
	}

	_ready() {
		const scope = this._view.$scope;
		this._taskGroupCombo = scope.taskGroupCombo;
		this._tagsForm = scope.tagsForm;
		this._addNewTagButton = scope.addNewTagTemplateButton;
		this._assignUsersMultiCombo = scope.assignUsersMultiCombo;
		this._assignUsersTemplate = scope.assignUsersTemplate;
		this._assignUsersList = this._assignUsersMultiCombo.getPopupList();
		this._creatorsMultiCombo = scope.creatorsMultiCombo;
		this._creatorsTemplate = scope.creatorsTemplate;
		this._creatorsList = this._creatorsMultiCombo.getPopupList();
		this._tagSettingsWindow = scope.ui(TagSettingsWindow);
		this._uploader = scope.uploadJSONButton;
		this._clearAllButton = scope.clearAllButton;

		webix.extend(this._view, webix.ProgressBar);

		this._taskCreationFormConfigs = new TaskCreationFormConfigs(
			this._view, this._tagsForm, this._tagSettingsWindow
		);

		this._assignUsersList.sync(taskUsers);
		this._creatorsList.sync(taskUsers);
		this._taskGroupCombo.getPopupList().sync(groupsCollection);

		groupsCollection.clearAll();
		taskUsers.clearAll();
		this._getGroupsAndUsers()
			.then(() => {
				const taskJSON = taskJSONCollection.get();
				if (taskJSON) {
					this._taskCreationFormConfigs.removeTagForms();
					this._taskCreationFormConfigs.setFormValuesByJSON(taskJSON.task);
					taskJSONCollection.remove();
				}
			});
		this._attachAddedUsersEvents(this._assignUsersTemplate, this._assignUsersMultiCombo);
		this._attachAddedUsersEvents(this._creatorsTemplate, this._creatorsMultiCombo);
		this._attachUploaderEvents();

		this._addNewTagButton.define("onClick", {
			"add-new-tag": () => {
				this._taskCreationFormConfigs.addNewTagHandler(constants.DEFAULT_TAG_SETTINGS);
			}
		});

		this._clearAllButton.attachEvent("onItemClick", () => {
			this._taskCreationFormConfigs.removeTagForms();
			this._view.clear();
		});
	}

	_getGroupsAndUsers() {
		this._view.showProgress();
		return Promise.all([
			transitionalAjax.getGroups(),
			ajaxService.getUsers()
		])
			.then(([groups, users]) => {
				groupsCollection.parse(groups);
				taskUsers.parse(users);
			})
			.finally(() => {
				this._view.hideProgress();
			});
	}

	_attachAddedUsersEvents(template, combo) {
		template.define("onClick", {
			"preview-info": (ev, _id, node) => {
				const id = node.getAttribute("user_id");
				combo.customUnselect(id);
			}
		});
		combo.attachEvent("customSelectChange", (ids) => {
			const users = ids.map(userId => taskUsers.find(user => +userId === +user.id, true));

			template.setValues({users});
			if (!users.length) template.hide();
			else template.show();
		});
	}

	_attachUploaderEvents() {
		this._uploader.attachEvent("onBeforeFileAdd", (file) => {
			this._view.showProgress();
			this._parseFile(file)
				.then((data) => {
					this._taskCreationFormConfigs.removeTagForms();
					this._taskCreationFormConfigs.setFormValuesByJSON(data);
					this._view.hideProgress();
				})
				.catch((message) => {
					webix.message(message);
					this._view.hideProgress();
				});
		});

		// to prevent the dropping of any item except the file
		this._uploader.attachEvent("onBeforeFileDrop", files => !!files.length);
	}

	_parseFile(file) {
		return new Promise((resolve, reject) => {
			let message = `Not allowed filetype: ${file.type}`;

			if (file.type === "json") {
				const fr = new FileReader();
				fr.addEventListener("load", () => {
					const json = fr.result;
					const object = JSON.parse(json);
					const valid = ajv.validate("task", {task: object});
					if (!valid) reject("Validation error");

					resolve(object);
				}, false);

				fr.addEventListener("error", (err) => {
					throw err;
				}, false);

				fr.readAsText(file.file);
			}
			else {
				reject(message);
			}
		});
	}
}
