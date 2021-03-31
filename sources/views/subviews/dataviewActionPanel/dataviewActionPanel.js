import {JetView} from "webix-jet";
import ProjectMetadataWindow from "./windows/projectMetadataWindow";
import constants from "../../../constants";
import utils from "../../../utils/utils";

const SPACER_FOR_PAGER_ID = "spacer-for-pager";

const {THUMBNAIL_VIEW, METADATA_TABLE_VIEW, Z_STACK_VIEW} = constants.VIEW_OPTION_IDS;

export default class DataviewActionPanelClass extends JetView {
	get viewSwitcherId() {
		return "viewSwitcherId";
	}

	config() {
		const projectFolderWindowButton = {
			view: "button",
			css: "transparent-button",
			value: "Show project metadata",
			name: "projectFolderWindowButtonName",
			width: 180,
			hidden: true,
			click: () => {
				this.projectMetadataWindow.showWindow();
			}
		};

		const recognitionOptionDropDown = {
			view: "richselect",
			name: "recognitionOptionDropDown",
			css: "select-field",
			icon: utils.getSelectIcon(),
			label: "Filter results",
			labelWidth: 120,
			width: 300,
			hidden: true,
			options: []
		};

		const pager = {
			view: "pager",
			width: 405,
			size: 70,
			template: (obj, common) => `${common.first()} ${common.prev()} <input type='text' class='pager-input' value='${common.page(obj)}'>
							<span class='pager-amount'>of ${obj.limit} ${this.getItemsCount(obj)}</span> ${common.next()} ${common.last()}`
		};

		const filterBySelection = {
			view: "richselect",
			css: "select-field",
			icon: utils.getSelectIcon(),
			name: "filterTableBySelectionName",
			width: 305,
			label: "Filter table",
			labelWidth: 90,
			placeholder: "Select file type",
			options: {
				body: {
					template: ({value}) => {
						if (value) {
							if (value === "folders") {
								return `Show ${value.toUpperCase()}`;
							}
							return `Show ${value.toUpperCase()} files`;
						}
						return "";
					}
				}
			}
		};

		const multiview = {
			view: "multiview",
			animate: false,
			cells: [
				pager,
				filterBySelection,
				{
					localId: SPACER_FOR_PAGER_ID
				}
			]
		};

		const cartButton = {
			view: "button",
			name: "hideOrShowCartListButtonName",
			css: "transparent-button",
			width: 120,
			hidden: true
		};

		const recognitionProgressTemplate = {
			name: "recognitionProgressTemplate",
			template: (obj) => {
				if (obj.value) {
					const timeInfo = obj.value === constants.LOADING_STATUSES.IN_PROGRESS.value ? "This process may take hours. " : "";
					const progressCount = obj.count ? `(${obj.recognized || 0}/${obj.count})` : "";
					const tooltip = "Show results";

					return `<div class="recognition-status-template">
								${timeInfo}Recognition status: ${obj.value} ${progressCount}
								<span style="color: ${obj.iconColor}" class="${obj.icon}" title='${tooltip}'></span>
								${obj.errorsCount || ""}
							</div>`;
				}
				return "";
			},
			height: 30,
			borderless: true,
			hidden: true
		};

		return {
			padding: 7,
			rows: [
				{
					name: "dataviewActionPanelClass",
					cols: [
						{width: 75},
						projectFolderWindowButton,
						{},
						{
							view: "richselect",
							localId: this.viewSwitcherId,
							icon: utils.getSelectIcon(),
							css: "select-field ellipsis-text",
							width: 200,
							value: THUMBNAIL_VIEW,
							options: {
								data: [
									{id: THUMBNAIL_VIEW, value: "Images thumbnail view"},
									{id: METADATA_TABLE_VIEW, value: "Metadata table view"},
									{id: Z_STACK_VIEW, value: "Zstack"}
								],
								body: {
									css: "ellipsis-text"
								}
							}
						},
						recognitionOptionDropDown,
						{},
						multiview,
						{},
						cartButton,
						{width: 40}
					]
				},
				recognitionProgressTemplate
			]
		};
	}

	ready() {
		this.projectMetadataWindow = this.ui(ProjectMetadataWindow);
		const recognitionProgressTemplate = this.getRecognitionProgressTemplate();
		webix.TooltipControl.addTooltip(recognitionProgressTemplate.$view);
	}

	getItemsCount(pagerObj) {
		let count = pagerObj.count;
		let page = pagerObj.page + 1; // because first page in object is 0
		let pageSize = pagerObj.size;
		if (count < pageSize) {
			return `(${count} of ${count})`;
		}
		let pageCount = pageSize * page;
		if (pageCount > count) {
			pageCount = count;
		}
		return `(${pageCount} of ${count})`;
	}

	getSwitcherView() {
		return this.$$(this.viewSwitcherId);
	}

	getPagerView() {
		return this.getRoot().queryView({view: "pager"});
	}

	getCartButton() {
		return this.getRoot().queryView({name: "hideOrShowCartListButtonName"});
	}

	getProjectFolderWindowButton() {
		return this.getRoot().queryView({name: "projectFolderWindowButtonName"});
	}

	getFilterTableView() {
		return this.getRoot().queryView({name: "filterTableBySelectionName"});
	}

	getRecognitionProgressTemplate() {
		return this.getRoot().queryView({name: "recognitionProgressTemplate"});
	}

	getRecognitionOptionDropDown() {
		return this.getRoot().queryView({name: "recognitionOptionDropDown"});
	}

	getSpacerForPager() {
		return this.$$(SPACER_FOR_PAGER_ID);
	}
}
