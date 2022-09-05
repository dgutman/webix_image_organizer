import {JetView} from "webix-jet";
import TaskCreationService from "../../../../services/taskTool/taskCreationService";
import templates from "../../../templates";
import constants from "../../../../constants";
import auth from "../../../../services/authentication";
import UsersSelect from "../../../components/usersSelect";
import taskUsers from "../../../../models/taskUsers";
import TagsForm from "./tagsForm";

const CLEAR_ALL_ID = "task-creation:clear-all";
const CREATE_TASK_ID = constants.CREATE_TASK_BUTTON_ID;
const EDIT_TASK_ID = constants.EDIT_TASK_BUTTON_ID;
const PUBLISH_TASK_ID = constants.PUBLISH_TASK_BUTTON_ID;
const PREVIEW_TASK_ID = constants.PREVIEW_TASK_BUTTON_ID;
const LOAD_JSON_BTN_ID = "task-creation:load-json";
const ADD_NEW_TAG_BTN_ID = "task-creation:add-new-tag";

function getTextTemplate(text) {
	return {
		template: text,
		height: 25,
		borderless: true
	};
}

class TaskCreationForm extends JetView {
	constructor(app) {
		super(app);


		this._tagsForm = new TagsForm(this.app);
		this._usersSelect = new UsersSelect(this.app, taskUsers, {name: "user"});
		this._creatorsSelect = new UsersSelect(this.app, taskUsers, {name: "creator"});
	}

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
			inputHeight: 34
		};

		const groupInput = {
			view: "editCombo",
			name: "group",
			css: "text-field",
			placeholder: "Task group",
			label: "Task group",
			labelPosition: "top",
			invalidMessage: "Please, enter the valid group name",
			inputHeight: 34
		};

		let tagsAndValuesHeader = getTextTemplate("Tags and values");
		tagsAndValuesHeader.width = 140;

		const tagTemplatesLink = {
			view: "template",
			name: "tagTemplatesLink",
			borderless: true,
			template: "<a class='tag-templates-link'>Tag templates</a>"
		};

		const addNewTag = {
			template: () => templates.getPlusButtonTemplate("Add new tag", "add-new-tag"),
			localId: ADD_NEW_TAG_BTN_ID,
			height: 35,
			width: 130,
			css: "new-tag",
			borderless: true
		};

		const loadJSONLayout = {
			cols: [
				{
					template: "or load JSON file",
					css: {"line-height": "30px"},
					width: 110,
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
				this._usersSelect
			]
		};

		const creatorsLayout = {
			rows: [
				getTextTemplate("Share with creators"),
				this._creatorsSelect
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
					value: "Show preview",
					id: PREVIEW_TASK_ID,
					width: 150,
					css: "btn-contour"
				},
				{width: 5},
				{
					view: "button",
					value: "Save the task",
					id: CREATE_TASK_ID,
					width: 150,
					css: "btn"
				},
				{
					view: "button",
					value: "Publish the task",
					id: PUBLISH_TASK_ID,
					hidden: true,
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

		const deadlineDate = {
			view: "datepicker",
			name: "deadline",
			css: "date-field",
			value: new Date(Date.now() + constants.MILLISECONDS_TO_DAYS * constants.DEADLINE_DELAY),
			label: "Task deadline",
			timepicker: true,
			width: 350,
			labelWidth: 120,
			inputHeight: 34
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
				name: value => webix.rules.isNotEmpty(value.trim()),
				group: (value) => {
					const groupValue = !(value === "") && value.trim() === "";
					return !groupValue;
				},
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
								{width: 10},
								groupInput
							]
						},
						{
							cols: [
								tagsAndValuesHeader,
								tagTemplatesLink,
								{gravity: 1}
							]
						},
						this._tagsForm,
						{
							cols: [
								addNewTag,
								loadJSONLayout
							]
						},
						{height: 10},
						assignUsersLayout,
						{height: 10},
						creatorsLayout,
						{height: 10},
						deadlineDate,
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
		document.querySelector(".main-header-admin a").innerHTML = '<span class="webix_icon wxi-angle-left"></span> Cancel';
	}

	get addNewTagTemplateButton() {
		return this.$$(ADD_NEW_TAG_BTN_ID);
	}

	get taskCreationForm() {
		return this.getRoot();
	}

	get tagsForm() {
		return this._tagsForm;
	}

	get clearAllButton() {
		return this.$$(CLEAR_ALL_ID);
	}

	get taskGroupCombo() {
		return this.getRoot().queryView({name: "group"});
	}

	get uploadJSONButton() {
		return this.$$(LOAD_JSON_BTN_ID);
	}

	get tagTemplatesLink() {
		return this.getRoot().queryView({name: "tagTemplatesLink"});
	}

	get usersSelect() {
		return this._usersSelect;
	}

	get creatorsSelect() {
		return this._creatorsSelect;
	}

	collectFormData() {
		const task = this.taskCreationForm.getValues();
		const tags = this._tagsForm.collectTagsData();
		task.tags = tags;
		return task;
	}
}

export default TaskCreationForm;
