import {JetView} from "webix-jet";
import FiltersView from "./filtersView";
import ImagesView from "./imagesView";
import TaskCreationForm from "./taskCreationForm";
import constants from "../../../constants";
import auth from "../../../services/authentication";
import TaskToolService from "../../../services/taskTool/taskToolService";

export default class TaggerTaskTool extends JetView {
	config() {
		const ui = {
			rows: [
				{
					view: "accordion",
					multi: true,
					name: "mainAccordion",
					type: "line",
					cols: [
						{
							header: "Filters",
							body: FiltersView,
							gravity: 1
						},
						{
							// header: "Images",
							body: ImagesView,
							gravity: 3
						},
						{
							body: TaskCreationForm,
							gravity: 2
						}
					]
				}
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
		return this.getRoot().queryView({name: "taskCreationForm"});
	}

	get addNewTagButton() {
		return this.$$("task-creation:add-new-tag");
	}

	get selectDataviewTemplate() {
		return this.imagesLayout.queryView({name: "selectTemplate"});
	}

	get showSelectedButton() {
		return this.imagesLayout.queryView({name: "showSelectedButton"});
	}

	get tagsForm() {
		return this.taskCreationForm.queryView({name: "tagsForm"});
	}

	get createTaskButton() {
		return this.taskCreationForm.$scope.$$(constants.CREATE_TASK_BUTTON_ID);
	}

	get editTaskButton() {
		return this.taskCreationForm.$scope.$$(constants.EDIT_TASK_BUTTON_ID);
	}
}
