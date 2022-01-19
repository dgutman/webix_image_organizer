import {JetView} from "webix-jet";
import TaskCreationService from "../../../services/taskTool/taskCreationService";
import templates from "../../templates";
import constants from "../../../constants";
import auth from "../../../services/authentication";

const CLEAR_ALL_ID = "task-creation:clear-all";
const CREATE_TASK_ID = constants.CREATE_TASK_BUTTON_ID;
const EDIT_TASK_ID = constants.EDIT_TASK_BUTTON_ID;
const LOAD_JSON_BTN_ID = "task-creation:load-json";

function getTextTemplate(text) {
	return {
		template: text,
		height: 25,
		borderless: true
	};
}

function getUsersTemplate(name) {
	return {
		borderless: true,
		name,
		css: "users-cards-template",
		height: 40,
		hidden: true,
		template: (obj) => {
			const users = obj.users || [];
			return users
				.map(user => templates.getUsersCard(user.name, user.id))
				.join("");
		}
	};
}

function getUsersMultiCombo(name) {
	return {
		view: "multiCombo",
		name,
		css: "search-field",
		placeholder: "Please, select the users",
		invalidMessage: "Please, select the users",
		inputHeight: 34
	};
}

export default class TaskCreationForm extends JetView {
	config() {
		const headerTemplate = {
			height: 40,
			template: () => "<div class='list-header'>Task description</div>",
			borderless: true
		};

		const nameInput = {
			view: "text",
			name: "name",
			css: "text-field",
			placeholder: "Task name",
			label: "Task name",
			labelPosition: "top",
			invalidMessage: "Please, specify the task name",
			width: 250,
			inputHeight: 34
		};

		const groupInput = {
			view: "editCombo",
			name: "group",
			css: "text-field",
			placeholder: "Task group",
			label: "Task group",
			labelPosition: "top",
			width: 250,
			inputHeight: 34
		};

		const tagsAndValuesHeader = getTextTemplate("Tags and values");

		const tagsForm = {
			view: "form",
			name: "tagsForm",
			hidden: true,
			type: "line",
			css: "task-creation-tags-form",
			scroll: "y",
			elements: []
		};

		const addNewTag = {
			template: () => "<a class='add-new-tag'><i class='fas fa-plus-circle'></i> Add new tag </a>",
			id: "task-creation:add-new-tag",
			height: 25,
			borderless: true
		};

		const loadJSONLayout = {
			cols: [
				{
					template: "or load JSON file",
					css: {"line-height": "30px"},
					width: 150,
					borderless: true
				},
				{
					view: "uploader",
					autosend: false,
					id: LOAD_JSON_BTN_ID,
					value: "Load file",
					width: 100
				}
			]
		};

		const assignUsersLayout = {
			rows: [
				getTextTemplate("Assign to"),
				getUsersTemplate("assignUsersTemplate"),
				getUsersMultiCombo("user")
			]
		};

		const creatorsLayout = {
			rows: [
				getTextTemplate("Share with creators"),
				getUsersTemplate("creatorsTemplate"),
				getUsersMultiCombo("creator")
			]
		};

		const bottomButtons = {
			height: 35,
			cols: [
				{
					view: "button",
					value: "Clear all",
					id: CLEAR_ALL_ID,
					width: 150,
					css: "btn"
				},
				{},
				{
					view: "button",
					value: "Publish the task",
					id: CREATE_TASK_ID,
					width: 150,
					css: "btn"
				},
				{
					view: "button",
					value: "Save changes",
					hidden: true,
					id: EDIT_TASK_ID,
					width: 150,
					css: "btn"
				}
			]
		};

		const ui = {
			view: "form",
			name: "taskCreationForm",
			type: "clean",
			scroll: "auto",
			borderless: true,
			minWidth: 700,
			padding: 10,
			rules: {
				name: webix.rules.isNotEmpty,
				user: arr => arr.length,
				creator: arr => arr.length
			},
			elements: [
				{
					rows: [
						headerTemplate,
						{
							borderless: true,
							cols: [
								nameInput,
								{},
								groupInput
							]
						},
						tagsAndValuesHeader,
						tagsForm,
						addNewTag,
						loadJSONLayout,
						{height: 10},
						assignUsersLayout,
						{height: 10},
						creatorsLayout,
						{},
						bottomButtons
					]
				}
			]
		};

		return ui;
	}

	ready(view) {
		if (auth.isAdmin()) {
			this._taskCreationService = new TaskCreationService(view);
		}
	}

	get addNewTagTemplateButton() {
		return this.$$("task-creation:add-new-tag");
	}

	get taskCreationForm() {
		return this.getRoot().queryView({name: "taskCreationForm"});
	}

	get assignUsersTemplate() {
		return this.getRoot().queryView({name: "assignUsersTemplate"});
	}

	get assignUsersMultiCombo() {
		return this.getRoot().queryView({name: "user"});
	}

	get creatorsTemplate() {
		return this.getRoot().queryView({name: "creatorsTemplate"});
	}

	get creatorsMultiCombo() {
		return this.getRoot().queryView({name: "creator"});
	}

	get taskGroupCombo() {
		return this.getRoot().queryView({name: "group"});
	}

	get tagsForm() {
		return this.getRoot().queryView({name: "tagsForm"});
	}

	get uploadJSONButton() {
		return this.$$(LOAD_JSON_BTN_ID);
	}

	get clearAllButton() {
		return this.$$(CLEAR_ALL_ID);
	}
}
