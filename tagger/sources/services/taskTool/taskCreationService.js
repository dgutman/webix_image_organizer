import transitionalAjax from "../transitionalAjaxService";
import ajaxService from "../ajaxActions";
import taskUsers from "../../models/taskUsers";
import groupsCollection from "../../models/groups";
import "../globalEvents";
import constants from "../../constants";
import taskValidator from "../taskValidator";
import taskJSONCollection from "../../models/taskJSON";
import utils from "../../utils/utils";

class TaskCreationService {
	constructor(view) {
		this._view = view;
		this._ready();
	}

	_ready() {
		const scope = this._view.$scope;
		this._taskGroupCombo = scope.taskGroupCombo;
		this._tagsForm = scope.tagsForm;
		this._addNewTagButton = scope.addNewTagTemplateButton;
		this._uploader = scope.uploadJSONButton;
		this._clearAllButton = scope.clearAllButton;
		this._usersSelect = scope.usersSelect;
		this._creatorsSelect = scope.creatorsSelect;

		webix.extend(this._view, webix.ProgressBar);

		this._taskGroupCombo.getPopupList().sync(groupsCollection);

		groupsCollection.clearAll();
		taskUsers.clearAll();
		this._getGroupsAndUsers()
			.then(() => {
				const taskJSON = taskJSONCollection.get();
				if (taskJSON) {
					this._tagsForm.removeTagForms();
					this._setFormValuesByJSON(taskJSON.task);
					this._tagsForm.redefineFormSize();
					taskJSONCollection.remove();
				}
			});
		this._attachUploaderEvents();

		this._addNewTagButton.define("onClick", {
			"add-new-tag": () => {
				this._tagsForm.addNewTagForm(constants.DEFAULT_TAG_SETTINGS);
			}
		});

		this._clearAllButton.attachEvent("onItemClick", () => {
			this._tagsForm.removeTagForms();
			this._tagsForm.redefineFormSize();
			this._view.clear();
		});
	}

	_setFormValuesByJSON(json) {
		let {name, group, tags, user, creator, deadline} = json;
		this._view.clear();

		if (deadline) deadline = new Date(deadline);

		const userIds = utils.transformToArray(user).map((id) => {
			const found = taskUsers.find(obj => obj._id === id, true);
			return found ? found.id : null;
		}).filter(id => id);
		const creatorIds = utils.transformToArray(creator).map((id) => {
			const found = taskUsers.find(obj => obj._id === id, true);
			return found ? found.id : null;
		}).filter(id => id);

		this._view.setValues({name, group: group || "", creator: creatorIds, user: userIds, deadline});

		this._tagsForm.pupulateTagsByObject(tags);
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

	_attachUploaderEvents() {
		this._uploader.attachEvent("onBeforeFileAdd", (file) => {
			this._view.showProgress();
			this._parseFile(file)
				.then((data) => {
					this._tagsForm.removeTagForms();
					this._setFormValuesByJSON(data);
					this._view.hideProgress();
				})
				.catch((message) => {
					webix.message({type: "error", text: message});
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
					const valid = taskValidator({task: object});
					if (!valid) reject(new Error("Validation error"));

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


export default TaskCreationService;
