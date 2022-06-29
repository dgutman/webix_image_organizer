import {JetView} from "webix-jet";
import auth from "../../../services/authentication";
import constants from "../../../constants";
import UserViewService from "../../../services/user/userService";
import UserDataviewTagIcons from "../../components/dataviewItemIcons";
import FiltersPanel from "./filterPanel";
import TasksPanel from "./tasksPanel";
import UserTaskView from "./taskView";

export default class TaggerUserView extends JetView {
	constructor(app) {
		super(app);
		this._filtersPanel = new FiltersPanel(app);
		this._tasksPanel = new TasksPanel(app);
		this._taskView = new UserTaskView(app);
	}

	config() {
		const ui = {
			rows: [
				{
					view: "scrollview",
					scroll: false,
					css: {"overflow-x": "auto"},
					padding: 10,
					margin: 10,
					body: {
						view: "accordion",
						type: "clean",
						multi: true,
						cols: [
							{
								header: "Tasks",
								name: "tasksAccordionItem",
								css: "tagger-accordion-item",
								collapsed: true,
								disabled: true,
								headerAltHeight: 44,
								minWidth: 230,
								body: this._tasksPanel
							},
							this._taskView,
							{
								header: "Filters (0)",
								name: "filtersAccordionItem",
								css: "tagger-accordion-item right",
								collapsed: true,
								disabled: true,
								headerAltHeight: 44,
								minWidth: 230,
								body: this._filtersPanel
							}
						]
					}
				}
			]
		};

		return ui;
	}

	ready(view) {
		if (auth.isAdmin()) {
			document.querySelector('.main-header-admin a').innerHTML = '<span class="webix_icon wxi-angle-left"></span> Back to Admin Mode';
		}

		const dataviewIcons = this._taskView.getDataviewIcons();
		this.userViewService = new UserViewService(view, dataviewIcons);
	}

	getInitiallyHiddenViews() {
		return this._taskView.getInitiallyHiddenViews();
	}

	getUserDataview() {
		return this._taskView.getUserDataview();
	}

	getAccordion() {
		return this.getRoot().queryView({view: "accordion"});
	}

	getTaskAccordionItem() {
		return this.getRoot().queryView({name: "tasksAccordionItem"});
	}

	getTaskList() {
		return this._tasksPanel.getTaskList();
	}

	getTagSelect() {
		return this._taskView.getTagSelect();
	}

	getValueSelect() {
		return this._taskView.getValueSelect();
	}

	getDataviewPager() {
		return this._taskView.getDataviewPager();
	}

	getNextButton() {
		return this._taskView.getNextButton();
	}

	getUndoButton() {
		return this._taskView.getUndoButton();
	}

	getBackButton() {
		return this._taskView.getBackButton();
	}

	getCompleteButton() {
		return this._taskView.getCompleteButton();
	}

	getSelectImageSize() {
		return this._taskView.getSelectImageSize();
	}

	getTagInfoTemplate() {
		return this._taskView.getTagInfoTemplate();
	}

	getHotkeysInfoTemplate() {
		return this._taskView.getHotkeysInfoTemplate();
	}

	getItemsCountTemplate() {
		return this._taskView.getItemsCountTemplate();
	}

	getShowReviewTemplate() {
		return this._taskView.getShowReviewTemplate();
	}

	getAnimationButton() {
		return this._taskView.getAnimationButton();
	}

	getROIBorderButton() {
		return this._taskView.getROIBorderButton();
	}

	getFiltersAccordionItem() {
		return this.getRoot().queryView({name: "filtersAccordionItem"});
	}

	getFiltersTree() {
		return this._filtersPanel.getFiltersTree();
	}

	getSelectAllFiltersTemplate() {
		return this._filtersPanel.getSelectAllFiltersTemplate();
	}

	getApplyFiltersButton() {
		return this._filtersPanel.getApplyFiltersButton();
	}

	getDeviationFilterDropdown() {
		return this._filtersPanel.getDeviationFilterDropdown();
	}
}
