import {JetView} from "webix-jet";
import dot from "dot-object";
import galleryImageUrl from "../../models/galleryImageUrls";
import nonImageUrls from "../../models/nonImageUrls";
import ajaxService from "../../services/ajaxActions";
import constants from "../../constants";
import UserViewService from "../../services/user/userService";
import UserDataviewTagIcons from "../components/dataviewItemIcons";

const PAGER_ID = "user-dataview-pager";
const imageSizeMultipliersKeys = Array.from(constants.DATAVIEW_IMAGE_MULTIPLIERS.keys());

export default class TaggerUserView extends JetView {
	config() {
		const imageSizeSelect = {
			view: "richselect",
			label: "Image size:",
			width: 210,
			labelWidth: 90,
			name: "userSelectImageSize",
			css: "select-field",
			options: imageSizeMultipliersKeys

		};

		const tagInfoTemplate = this.getInfoViewConfig("tagInfoTemplate", "fa-question-circle");

		const hotkeysInfoTemplate = this.getInfoViewConfig("hotkeysInfoTemplate", "fa-info-circle");

		const tagsDropDown = {
			view: "richselect",
			name: "userTagSelect",
			maxWidth: 700,
			labelWidth: 90,
			label: "Tag name:",
			css: "select-field ellipsis-text",
			options: {
				body: {
					css: "ellipsis-text",
					tooltip: "#name#",
					template: "#name#"
				}
			}
		};

		const valuesDropDown = {
			view: "richselect",
			name: "userValueSelect",
			maxWidth: 700,
			labelWidth: 60,
			label: "Value:",
			css: "select-field ellipsis-text",
			options: {
				body: {
					css: "ellipsis-text",
					tooltip: (obj) => {
						const defaultString = obj.default ? "(default)" : "";
						return `${obj.name} ${defaultString}`;
					},
					template: (obj) => {
						const defaultString = obj.default ? "(default)" : "";
						return `${obj.name} ${defaultString}`;
					}
				}
			}
		};

		const pager = {
			view: "pager",
			id: PAGER_ID,
			width: 400,
			height: 40,
			size: 70,
			template: (obj, common) => `<div class='user-dataview-pager'>${common.first()} ${common.prev()} <input type='text' class='pager-input' value='${common.page(obj)}'>
				<span class='pager-amount'>of ${obj.limit}</span> ${common.next()} ${common.last()}</div>`
		};

		const dataview = {
			view: "dataview",
			css: "user-dataview",
			name: "userDataview",
			minWidth: 350,
			minHeight: 290,
			tooltip: (obj) => {
				let html = `<div class='webix_strong'>${obj.name}</div>`;
				const tags = dot.pick("meta.tags", obj);
				if (tags) {
					html += "<br /><div>";
					const tagKeys = Object.keys(tags);
					tagKeys.sort().forEach((tagKey) => {
						const valuesNames = tags[tagKey].map(valueObject => valueObject.value);
						const displayedValue = tags[tagKey].length ? `${valuesNames.sort().join(", ")}` : "<span class='half-opacity'>&lt;none&gt;</span>";
						html += `${tagKey}: ${displayedValue}<br />`;
					});
					html += "</div>";
				}
				return html;
			},
			pager: PAGER_ID,
			borderless: true,
			template: (obj, common) => {
				const IMAGE_HEIGHT = (common.height || constants.DATAVIEW_IMAGE_SIZE.HEIGHT) - 30;
				// const IMAGE_WIDTH = common.width || constants.DATAVIEW_IMAGE_SIZE.WIDTH;
				const getPreviewUrl = galleryImageUrl.getPreviewImageUrl;
				const setPreviewUrl = galleryImageUrl.setPreviewImageUrl;
				const highlightState = obj.isUpdated ? "highlighted" : "";

				if (typeof getPreviewUrl(obj._id) === "undefined") {
					setPreviewUrl(obj._id, "");
					// to prevent sending query more than 1 times
					ajaxService.getImage(obj.mainId, "thumbnail")
						.then((data) => {
							if (data.type === "image/jpeg") {
								setPreviewUrl(obj._id, URL.createObjectURL(data));
								if (this.dataview.exists(obj.id)) {
									this.dataview.render(obj.id, obj, "update"); // to call item render, not whole dataview
								}
							}
						});
				}

				return `<div onmousedown='return false' onselectstart='return false' class='dataview-item ${highlightState}'>
							<div class="dataview-images-container" style="height: ${IMAGE_HEIGHT}px">
								<div class="dataview-images-icons">
									<div class="dataview-icons-top">
										<i class='checkbox ${common.checkboxState(obj, common)}'></i>
									</div>
									<div class="dataview-icons-bottom">
										${common.tagIcons(obj, common)}
										<i webix_tooltip='Show metadata' class='dataview-show-metadata-icon show-metadata fas fa-info-circle'></i>
									</div>
								</div>
								<img src="${getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}" class="dataview-image">
							</div>
							<div class="dataview-images-name ellipsis-text">${obj.name}</div>
						</div>`;
			},
			type: {
				width: 150,
				height: 135,
				checkboxState: (obj) => {
					let str = "unchecked far fa-square enabled";
					const tagSelect = this.getTagSelect();
					const valueSelect = this.getValueSelect();
					const tagList = tagSelect.getList();
					const valueList = valueSelect.getList();

					const selectedTag = tagList.getItem(tagSelect.getValue());
					const selectedValue = valueList.getItem(valueSelect.getValue());

					const imageTag = dot.pick(`meta.tags.${selectedTag.name}`, obj);

					if (imageTag && imageTag.find(valueObject => valueObject.value === selectedValue.name)) {
						const disabledState = selectedValue.default ? "disabled" : "enabled";
						str = `checked fas fa-check-square ${disabledState}`;
					}
					return str;
				},
				tagIcons: (obj, common) => this.dataviewIcons.getItemIconsTemplate(obj, common.width),
				templateLoading: () => "<div class='dataview-item-loading-overlay'>Loading...</div>"
			}
		};

		const itemsCountTemplate = {
			name: "itemsCountTemplate",
			template: (obj) => {
				const shown = obj.unfilteredCount !== obj.count ? ` (shown by filters ${obj.count})` : "";
				if (obj.unfilteredCount) {
					return `<div class='items-count-template'><span class='bold'>Items ${obj.unfilteredCount} of ${obj.totalCount} left</span>${shown}</div>`;
				}
				return "";
			},
			borderless: true
		};

		const taskList = {
			view: "list",
			name: "userTasksList",
			css: "ellipsis-text user-collection-list",
			borderless: true,
			select: true,
			scroll: "auto",
			tooltip: obj => obj.name,
			template: obj => `<div class='ellipsis-text' onmousedown='return false' onselectstart='return false'><i class='icon-btn fas fa-folder'></i> <span class='item-name'>${obj.name}</span></div>`
		};

		const buttons = {
			margin: 5,
			padding: 15,
			height: 70,
			borderless: true,
			cols: [
				itemsCountTemplate,
				{},
				{
					view: "button",
					css: "btn-contour",
					width: 80,
					name: "backButton",
					hidden: true,
					value: "Show reviewed"
				},
				{width: 20},
				{
					view: "button",
					css: "btn",
					width: 80,
					name: "nextButton",
					selector: "hidden_view",
					hidden: true,
					value: "Submit"
				}
			]
		};

		const selectAllFiltersTemplate = {
			name: "selectAllFiltersTemplate",
			height: 50,
			css: "select-dataview-filters-template",
			template: () => "<div><a class='select-all'>Select all</a></div> <div><a class='unselect-all'>Unselect all</a></div>",
			borderless: true
		};

		const filtersTree = {
			view: "tree",
			name: "filtersTree",
			type: "lineTree",
			scroll: "auto",
			css: "dataview-filters-tree",
			template: (obj, common) => {
				const tree = this.getFiltersTree();
				const checkboxState = tree.isSelected(obj.id) ? "checked fas fa-check-square" : "unchecked far fa-square";
				return `<span onmousedown='return false' onselectstart='return false'>${common.icon(obj, common)} <i class='tree-checkbox ${checkboxState}'></i> <span>${obj.name}</span></span>`;
			}
		};

		const applyFiltersBtn = {
			view: "button",
			css: "btn",
			width: 80,
			name: "applyFiltersBtn",
			value: "Apply"
		};

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
								body: {
									css: "tagger-tasks-accordion-items-body",
									paddingX: 1,
									rows: [taskList]
								}
							},
							{
								gravity: 3,
								rows: [
									{
										selector: "task_dropdowns",
										hidden: true,
										padding: {
											top: 10, bottom: 0, left: 10, right: 10
										},
										cols: [
											{gravity: 0.1},
											{
												rows: [
													tagsDropDown,
													tagInfoTemplate
												]
											},
											{width: 50},
											{
												rows: [
													valuesDropDown,
													hotkeysInfoTemplate
												]
											},
											{gravity: 0.1}
										]
									},
									{
										selector: "hidden_view",
										hidden: true,
										padding: 10,
										cols: [
											{},
											pager,
											{
												cols: [
													{},
													imageSizeSelect
												]
											}
										]
									},
									{hidden: true, selector: "dataview_y_spacer"},
									{
										cols: [
											{hidden: true, selector: "dataview_x_spacer"},
											dataview
										]
									},
									buttons
								]
							},
							{
								header: "Filters (0)",
								name: "filtersAccordionItem",
								css: "tagger-accordion-item",
								collapsed: true,
								disabled: true,
								headerAltHeight: 44,
								minWidth: 230,
								body: {
									css: "tagger-filters-accordion-item-body",
									padding: 1,
									rows: [
										selectAllFiltersTemplate,
										filtersTree,
										{
											padding: 15,
											height: 70,
											cols: [
												{},
												applyFiltersBtn
											]
										}
									]
								}
							}
						]
					}
				}
			]
		};

		return ui;
	}

	ready(view) {
		this.dataview = this.getUserDataview();
		this.dataviewIcons = new UserDataviewTagIcons(this.getTagSelect(), this.getValueSelect());
		this.userViewService = new UserViewService(view, this.dataviewIcons);
	}

	getInfoViewConfig(name, icon) {
		return {
			view: "template",
			name,
			autoheight: true,
			borderless: true,
			css: "info-template",
			template: obj => `<i class="info-template-icon fas ${icon}"></i>
						<div class='info-content'>
							<div class='info-description'>
								<span>${obj.description || ""}</span>
							</div>
						</div>`
		};
	}

	getInitiallyHiddenViews() {
		return this.getRoot().queryView({selector: "hidden_view"}, "all");
	}

	getUserDataview() {
		return this.getRoot().queryView({name: "userDataview"});
	}

	getAccordion() {
		return this.getRoot().queryView({view: "accordion"});
	}

	getTaskAccordionItem() {
		return this.getRoot().queryView({name: "tasksAccordionItem"});
	}

	getTaskList() {
		return this.getRoot().queryView({name: "userTasksList"});
	}

	getTagSelect() {
		return this.getRoot().queryView({name: "userTagSelect"});
	}

	getValueSelect() {
		return this.getRoot().queryView({name: "userValueSelect"});
	}

	getDataviewPager() {
		return this.$$(PAGER_ID);
	}

	getNextButton() {
		return this.getRoot().queryView({name: "nextButton"});
	}

	getBackButton() {
		return this.getRoot().queryView({name: "backButton"});
	}

	getSelectImageSize() {
		return this.getRoot().queryView({name: "userSelectImageSize"});
	}

	getTagInfoTemplate() {
		return this.getRoot().queryView({name: "tagInfoTemplate"});
	}

	getHotkeysInfoTemplate() {
		return this.getRoot().queryView({name: "hotkeysInfoTemplate"});
	}

	getItemsCountTemplate() {
		return this.getRoot().queryView({name: "itemsCountTemplate"});
	}

	getFiltersAccordionItem() {
		return this.getRoot().queryView({name: "filtersAccordionItem"});
	}

	getFiltersTree() {
		return this.getRoot().queryView({name: "filtersTree"});
	}

	getSelectAllFiltersTemplate() {
		return this.getRoot().queryView({name: "selectAllFiltersTemplate"});
	}

	getApplyFiltersButton() {
		return this.getRoot().queryView({name: "applyFiltersBtn"});
	}
}
