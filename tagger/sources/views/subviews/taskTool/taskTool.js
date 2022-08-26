import {JetView} from "webix-jet";
import FiltersView from "./filtersView";
import ImagesView from "./imagesView";
import TaskCreationForm from "./taskCreationForm/taskCreationForm";
import PreviewTaskView from "./previewTaskView";
import constants from "../../../constants";
import auth from "../../../services/authentication";
import TaskToolService from "../../../services/taskTool/taskToolService";

export default class TaggerTaskTool extends JetView {
	constructor(app) {
		super(app);
		this._taskCreationForm = new TaskCreationForm(app);
		this._filtersView = new FiltersView(app);
		this._imagesView = new ImagesView(app);
	}

	config() {
		const taskToolUI = {
			id: "task_tool",
			rows: [
				{
					view: "accordion",
					multi: true,
					name: "mainAccordion",
					type: "line",
					cols: [
						{
							header: "Filters",
							body: this._filtersView,
							gravity: 1
						},
						{
							body: this._imagesView,
							gravity: 3
						},
						{
							body: this._taskCreationForm,
							gravity: 2
						}
					]
				}
			]
		};

		const ui = {
			animate: false,
			cells: [
				taskToolUI,
				PreviewTaskView
			]
		};

		return ui;
	}

	ready(view) {
		if (!auth.isAdmin()) {
			this.app.show(constants.APP_PATHS.TAGGER_USER);
		}
		else {
			this.taskToolSerivce = new TaskToolService(view);
		}
	}

	get accordion() {
		return this.getRoot().queryView({name: "mainAccordion"});
	}

	get filtersLayout() {
		return this.getRoot().queryView({name: "filtersLayout"});
	}

	get foldersGroupList() {
		return this.filtersLayout.queryView({name: "foldersGroupList"});
	}

	get imagesLayout() {
		return this.getRoot().queryView({name: "imagesLayout"});
	}

	get dataview() {
		return this.imagesLayout.queryView({name: "taskToolDataview"});
	}

	get dataviewPager() {
		return this.imagesLayout.queryView({name: "taskToolDataviewPager"});
	}

	get viewsToHide() {
		return this.getRoot().queryView({hideIfEmpty: true}, "all");
	}

	get taskCreationForm() {
		return this._taskCreationForm.getRoot();
	}

	get addNewTagButton() {
		return this.$$("task-creation:add-new-tag");
	}

	get selectDataviewTemplate() {
		return this.imagesLayout.queryView({name: "selectTemplate"});
	}

	get selectAll() {
		return this.imagesLayout.queryView({name: "selectAll"});
	}

	get selectAllOnPage() {
		return this.imagesLayout.queryView({name: "selectAllOnPage"});
	}

	get unselectAll() {
		return this.imagesLayout.queryView({name: "unselectAll"});
	}

	get tagTemplatesLink() {
		return this.taskCreationForm.queryView({name: "tagTemplatesLink"});
	}

	get showSelectedButton() {
		return this.imagesLayout.queryView({name: "showSelectedButton"});
	}

	get showImageName() {
		return this.imagesLayout.queryView({name: "showImageName"});
	}

	get showMeta() {
		return this.imagesLayout.queryView({name: "showMeta"});
	}

	get showROI() {
		return this.imagesLayout.queryView({name: "showROI"});
	}

	get showROIBorders() {
		return this.imagesLayout.queryView({name: "showROIBorders"});
	}

	get tagsForm() {
		return this._taskCreationForm.tagsForm;
	}

	get createTaskButton() {
		return this.taskCreationForm.$scope.$$(constants.CREATE_TASK_BUTTON_ID);
	}

	get publishTaskButton() {
		return this.taskCreationForm.$scope.$$(constants.PUBLISH_TASK_BUTTON_ID);
	}

	get editTaskButton() {
		return this.taskCreationForm.$scope.$$(constants.EDIT_TASK_BUTTON_ID);
	}

	get previewButton() {
		return this.taskCreationForm.$scope.$$(constants.PREVIEW_TASK_BUTTON_ID);
	}
}
