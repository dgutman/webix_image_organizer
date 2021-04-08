import {JetView} from "webix-jet";
import ProjectMetadataWindow from "./windows/projectMetadataWindow";
import constants from "../../../constants";
import utils from "../../../utils/utils";
import ItemsModel from "../../../models/itemsModel";
import tilesCollection from "../../../models/imageTilesCollection";

const SPACER_FOR_PAGER_ID = "spacer-for-pager";
const [thumbnailOption] = constants.MAIN_MULTIVIEW_OPTIONS;

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
							value: thumbnailOption.id,
							options: {
								data: constants.MAIN_MULTIVIEW_OPTIONS,
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

		this._switcherView = this.getSwitcherView();
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

	scenesViewOptionToggle(item) {
		const imagesCollection = ItemsModel.getInstanceModel();
		const scenesViewOption = constants.SCENES_VIEW_OPTION;
		if (!item) {
			this.removeViewOption(scenesViewOption);
			return;
		}

		const folder = item._modelType === "folder" ? item : imagesCollection.findItem(item.$parent);
		if (folder.meta && folder.meta.dsaDefaultView === "XBSViewOne") {
			this.setNewViewOption(scenesViewOption);
		}
		else {
			this.removeViewOption(scenesViewOption);
		}
	}

	async multichannelViewOptionToggle(item) {
		const multichannelViewOption = constants.MULTICHANNEL_VIEW_OPTION;
		if (!item || item._modelType !== "item") {
			this.removeViewOption(multichannelViewOption);
			return;
		}

		const channelsInfo = await tilesCollection.getImageChannels(item);
		if (channelsInfo && channelsInfo.length) {
			this.setNewViewOption(multichannelViewOption);
		}
		else {
			this.removeViewOption(multichannelViewOption);
		}
	}

	removeViewOption(viewOption) {
		const switcherList = this._switcherView.getList();
		const isOptionExists = switcherList.exists(viewOption.id);
		if (isOptionExists) {
			switcherList.remove(viewOption.id);
			this._switcherView.setValue(thumbnailOption.id);
		}
	}

	setNewViewOption(viewOption) {
		const switcherList = this._switcherView.getList();
		const isOptionExists = switcherList.exists(viewOption.id);
		if (!isOptionExists) {
			switcherList.add(viewOption);
		}
		this._switcherView.setValue(viewOption.id);
	}
}
