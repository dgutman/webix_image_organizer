import {JetView} from "webix-jet";
import dot from "dot-object";
import galleryImageUrl from "../../models/galleryImageUrls";
import nonImageUrls from "../../models/nonImageUrls";
import ajaxService from "../../services/ajaxActions";
import constants from "../../constants";
import UserViewService from "../../services/user/userService";

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
			value: imageSizeMultipliersKeys[0],
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
			minWidth: 500,
			minHeight: 300,
			tooltip: (obj) => {
				let html = `<div class='webix_strong'>${obj.name}</div>`;
				const tags = dot.pick("meta.tags", obj);
				if (tags) {
					html += "<br /><div>";
					const tagKeys = Object.keys(tags);
					tagKeys.sort().forEach((tagKey) => {
						const valuesNames = tags[tagKey].map(valueObject => valueObject.value);
						const displayedValue = tags[tagKey].length ? `${valuesNames.join(", ")}` : "<span class='half-opacity'>&lt;none&gt;</span>";
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
				const IMAGE_WIDTH = common.width || constants.DATAVIEW_IMAGE_SIZE.WIDTH;
				const getPreviewUrl = galleryImageUrl.getPreviewImageUrl;
				const setPreviewUrl = galleryImageUrl.setPreviewImageUrl;
				const highlightState = obj._updated ? "highlighted" : "";

				if (typeof getPreviewUrl(obj._id) === "undefined") {
					setPreviewUrl(obj._id, "");
					// to prevent sending query more than 1 times
					ajaxService.getImage(obj.mainId, IMAGE_HEIGHT, IMAGE_WIDTH, "thumbnail")
						.then((data) => {
							if (data.type === "image/jpeg") {
								setPreviewUrl(obj._id, URL.createObjectURL(data));
								if (this.dataview.exists(obj.id)) {
									this.dataview.updateItem(obj.id, obj); // to call item render, not whole dataview
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
								</div>
								<img src="${getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}" class="dataview-image">
							</div>
							<div class="dataview-images-name ellipsis-text">${common.tagsState(obj, common)}</div>
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
				tagsState: (obj) => {
					if (obj.meta && obj.meta.tags) {
						const tagsObj = obj.meta.tags;
						const tags = Object.keys(tagsObj);
						if (tags.length === 1) {
							const tagValues = tagsObj[tags[0]];
							const firstValue = typeof tagValues[0] === "object" ? tagValues[0].value : tagValues[0];
							const displayedValue = tagValues.length === 1 ? firstValue : `(${tagValues.length})`;
							return `${tags[0]}: ${displayedValue}`;
						}
						return `Tags: (${tags.length})`;
					}
					return "Tags: (0)";
				}
			}
		};

		const itemsCountTemplate = {
			name: "itemsCountTemplate",

			template: (obj) => {
				if (obj.count) {
					return `<div class='items-count-template'><span>Items ${obj.count} of ${obj.totalCount} left</span></div>`;
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
			template: obj => `<div onmousedown='return false' onselectstart='return false'><i class='icon-btn fas fa-folder'></i> <span class='item-name'>${obj.name}</span></div>`
		};

		const buttons = {
			margin: 5,
			padding: 15,
			height: 70,
			selector: "hidden_view",
			hidden: true,
			borderless: true,
			cols: [
				itemsCountTemplate,
				{},
				{
					view: "button",
					css: "btn",
					width: 80,
					name: "nextButton",
					value: "Next"
				}
			]
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
						cols: [
							{
								header: "Tasks",
								name: "tasksAccordionItem",
								collapsed: true,
								disabled: true,
								headerAltHeight: 44,
								minWidth: 300,
								body: {
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
		this.userViewService = new UserViewService(view);
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
}
