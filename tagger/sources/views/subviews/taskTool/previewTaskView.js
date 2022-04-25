import {JetView} from "webix-jet";
import dot from "dot-object";
import constants from "../../../constants";
import galleryImageUrl from "../../../models/galleryImageUrls";
import nonImageUrls from "../../../models/nonImageUrls";
import ajaxService from "../../../services/ajaxActions";
import PreviewPageService from "../../../services/taskTool/previewService";
import UserDataviewTagIcons from "../../components/dataviewItemIcons";

const PAGER_ID = "preview-task-dataview-pager";
const imageSizeMultipliersKeys = Array.from(constants.DATAVIEW_IMAGE_MULTIPLIERS.keys());

export default class TaggerPreviewTask extends JetView {
	config() {
		const imageSizeSelect = {
			view: "richselect",
			label: "Image size:",
			width: 230,
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
					css: "ellipsis-text tag-list",
					tooltip: "#name#",
					template: (obj) => {
						const list = this.getTagSelect().getList();
						const index = list.data.serialize().findIndex(item => item.id === obj.id);
						return `<div class='tag-name'>${obj.name} <div style='background-color: ${constants.DEFAULT_COLORS[index]}' class='item-tag-related-icon'></div> </div>`;
					}
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
				const HEIGHT = 553;
				const WIDTH = 750;
				const sizeSelect = this.getSelectImageSize();
				const multiplier = constants.DATAVIEW_IMAGE_MULTIPLIERS.get(sizeSelect.getValue());
				const sizesObject = {};

				let getPreviewUrl = galleryImageUrl.getPreviewImageUrl;
				let setPreviewUrl = galleryImageUrl.setPreviewImageUrl;

				if (multiplier === "single") {
					sizesObject.width = common.width || WIDTH;
					sizesObject.height = common.height || HEIGHT;

					getPreviewUrl = galleryImageUrl.getNormalImageUrl;
					setPreviewUrl = galleryImageUrl.setNormalImageUrl;
				}

				const IMAGE_HEIGHT = (common.height || constants.DATAVIEW_IMAGE_SIZE.HEIGHT) - 30;

				const highlightState = obj.isUpdated ? "highlighted" : "";

				if (typeof getPreviewUrl(obj._id) === "undefined") {
					setPreviewUrl(obj._id, "");
					// to prevent sending query more than 1 times
					ajaxService.getImage(obj._id, "thumbnail", sizesObject)
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


		const ui = {
			id: "preview_task",
			rows: [
				{
					view: "scrollview",
					scroll: false,
					css: {"overflow-x": "auto"},
					padding: 10,
					margin: 10,
					body: {
						rows: [
							{
								selector: "task_dropdowns",
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
		this.dataviewIcons = new UserDataviewTagIcons(
			this.getTagSelect(),
			this.getValueSelect(),
			this.dataview
		);
		this.previewPageService = new PreviewPageService(view, this.dataviewIcons);
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

	getTagSelect() {
		return this.getRoot().queryView({name: "userTagSelect"});
	}

	getValueSelect() {
		return this.getRoot().queryView({name: "userValueSelect"});
	}

	getDataviewPager() {
		return this.$$(PAGER_ID);
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
