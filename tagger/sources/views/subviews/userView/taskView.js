import {JetView} from "webix-jet";
import dot from "dot-object";
import galleryImageUrl from "../../../models/galleryImageUrls";
import nonImageUrls from "../../../models/nonImageUrls";
import ajaxService from "../../../services/ajaxActions";
import transitionalAjax from "../../../services/transitionalAjaxService";
import constants from "../../../constants";
import UserDataviewTagIcons from "../../components/dataviewItemIcons";
import auth from "../../../services/authentication";
import roiCoordsCalculator from "../../../services/roiCoordsCalculator";


const PAGER_ID = "user-dataview-pager";
const imageSizeMultipliersKeys = Array.from(constants.DATAVIEW_IMAGE_MULTIPLIERS.keys());

export default class TaggerUserTaskView extends JetView {
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
					template: obj => `<div class='tag-name'>${obj.name}</div>`
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

		const showReviewed = {
			name: "showReviewed",
			height: 40,
			right: 0,
			template: () => `<div class='show-reviewed-links'>
									<a class='show-all'>Hide all</a>
									<a class='show-reviewed'>Hide reviewed</a>
									<a class='show-unreviewed'>Hide unreviewed</a>
								</div>`,
			borderless: true
		};

		const hideAnimationBtn = {
			view: "button",
			css: "btn-contour",
			width: 80,
			height: 40,
			name: "hideAnimation",
			value: "Hide animation"
		};

		const showROIborders = {
			view: "button",
			name: "showROIBorders",
			value: "Hide ROI Borders",
			css: "btn-contour",
			height: 40,
			width: 80,
			hidden: true
		};

		const borderROIColorpicker = {
			view: "colorpicker",
			placeholder: "Select border color",
			name: "borderROIColorpicker",
			height: 40,
			width: 120,
			css: "btn-user-colorpicker",
			value: "#ffffff",
			label: "Border color",
			hidden: true
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

		// TODO: write custom tooltip for images with custom positioning instead of current temp. solution
		webix.protoUI({
			name: "imageTooltip"
		}, webix.ui.tooltip);

		const dataview = {
			view: "dataview",
			css: "user-dataview",
			name: "userDataview",
			minWidth: 350,
			minHeight: 330,
			tooltip: {
				view: "imageTooltip",
				template: (obj) => {
					let html = "";
					const tags = dot.pick("meta.tags", obj);
					if (tags) {
						html += "<div class='webix_strong image-tooltip'>";
						const tagKeys = Object.keys(tags);
						tagKeys.sort().forEach((tagKey) => {
							const valuesNames = tags[tagKey].map(valueObject => valueObject.value);
							const displayedValue = tags[tagKey].length ? `${valuesNames.sort().join(", ")}` : "<span class='half-opacity'>&lt;none&gt;</span>";
							html += `${tagKey}: ${displayedValue}<br />`;
						});
						html += "</div>";
					}
					return html;
				}
			},
			pager: PAGER_ID,
			borderless: true,
			template: (obj, common) => {
				const thisDataview = this.getUserDataview();
				const HEIGHT = 603;
				const WIDTH = 750;
				const sizeSelect = this.getSelectImageSize();
				const multiplier = constants.DATAVIEW_IMAGE_MULTIPLIERS.get(sizeSelect.getValue());
				const sizesObject = {};
				let getPreviewUrl = galleryImageUrl.getPreviewImageUrl;
				let setPreviewUrl = galleryImageUrl.setPreviewImageUrl;

				if (multiplier === "single" && !common.roi()) {
					sizesObject.width = common.width || WIDTH;
					sizesObject.height = common.height || HEIGHT;

					getPreviewUrl = galleryImageUrl.getNormalImageUrl;
					setPreviewUrl = galleryImageUrl.setNormalImageUrl;
				}

				const IMAGE_HEIGHT = (common.height || constants.DATAVIEW_IMAGE_SIZE.HEIGHT) - 50;
				const IMAGE_WIDTH = common.width || constants.DATAVIEW_IMAGE_SIZE.WIDTH - 50;

				const highlightState = obj.isUpdated ? "highlighted" : "";
				let roiRect = "";

				if (obj.roi) {
					roiRect = roiCoordsCalculator(obj, IMAGE_HEIGHT, IMAGE_WIDTH, "userSmall");
				}
				if (typeof getPreviewUrl(obj._id) === "undefined") {
					setPreviewUrl(obj._id, "");
					let thumbnailPromise;
					if (obj.roi || obj.taggerMode === "ROI") {
						thumbnailPromise = this._getRoiThumbnail(obj);
					}
					else {
						thumbnailPromise = ajaxService.getImage(obj.mainId, "thumbnail", sizesObject);
					}
					thumbnailPromise
						.then((data) => {
							if (data.type === "image/jpeg") {
								setPreviewUrl(obj._id, URL.createObjectURL(data));
								if (thisDataview.exists(obj.id)) {
									thisDataview.render(obj.id, obj, "update"); // to call item render, not whole dataview
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
								<div style = "padding: 0; margin: 0; position: relative; height: 100%">

								<div style = "padding: 0; margin: 0; position: relative; height: 100%">
								${roiRect}
								<img src="${getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}" class="dataview-image">
								</div>
								</div>
							</div>
							<div class="icons-spacer"></div>
							<div class="dataview-images-name ellipsis-text">${obj.name}</div>
						</div>`;
			},
			type: {
				width: 150,
				height: 155,
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
				tagIcons: (obj, common) => this._dataviewIcons.getItemIconsTemplate(obj, common.width),
				templateLoading: () => "<div class='dataview-item-loading-overlay'>Loading...</div>",
				roi: () => this.getUserDataview().config.roiMode
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

		// TODO: think about implementation with undomodel
		const undoButton = {
			view: "button",
			css: "btn",
			width: 80,
			name: "undoButton",
			hidden: false,
			value: "Undo last submit"
		};

		const buttons = {
			margin: 5,
			padding: 15,
			height: 70,
			borderless: true,
			cols: [
				itemsCountTemplate,
				{},
				auth.isLoggedIn() ? undoButton : {},
				{width: 20},
				{
					view: "button",
					css: "btn-contour",
					width: 80,
					name: "backButton",
					hidden: true,
					value: "Unsubmit all"
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
				},
				{
					view: "button",
					css: "btn",
					width: 180,
					name: "completeButton",
					hidden: true,
					value: "Finalize the task"
				}
			]
		};

		const ui = {
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
				{
					cols: [
						{width: 40},
						{
							rows: [
								auth.isLoggedIn() ? hideAnimationBtn : {},
								{height: 5}]

						},
						{width: 5},
						{
							rows: [
								showROIborders,
								{height: 5}]
						},
						{width: 5},
						{
							rows: [
								borderROIColorpicker,
								{height: 5}]
						},
						{gravity: 2},
						auth.isLoggedIn() ? showReviewed : {}
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
		};

		return ui;
	}

	ready() {
		this._dataviewIcons = new UserDataviewTagIcons(
			this.getTagSelect(),
			this.getValueSelect(),
			this.getUserDataview()
		);
	}

	getDataviewIcons() {
		return this._dataviewIcons;
	}

	async _getRoiThumbnail(image) {
		let thumbnail;
		let coords = {
			left: 20,
			top: 20,
			right: 100,
			bottom: 100
		};
		if (image.width) coords.width = image.width;
		if (image.left) coords.left = image.left;
		if (image.top) {
			coords.top = image.top;
		}
		else if (image.bottom && image.height) coords.top = image.bottom - image.height;
		if (image.left && image.width) coords.right = image.left + image.width;
		if (image.bottom) {
			coords.bottom = image.bottom;
		}
		else if (image.top && image.height) coords.bottom = image.top + image.height;
		let id = image.mainId || image._id;
		let url = image.apiUrl || false;
		thumbnail = ajaxService.getRoiImage(id, coords, url);

		return thumbnail;
	}

	countROICoords(roi) {
		const coords = {
			left: Math.max(roi.left, 0),
			top: Math.max(roi.top, 0),
			right: Math.min(roi.right, roi.sizeX),
			bottom: Math.min(roi.bottom, roi.sizeY)
		};
		return coords;
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

	getUndoButton() {
		return this.getRoot().queryView({name: "undoButton"});
	}

	getNextButton() {
		return this.getRoot().queryView({name: "nextButton"});
	}

	getBackButton() {
		return this.getRoot().queryView({name: "backButton"});
	}

	getCompleteButton() {
		return this.getRoot().queryView({name: "completeButton"});
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

	getShowReviewTemplate() {
		return this.getRoot().queryView({name: "showReviewed"});
	}

	getAnimationButton() {
		return this.getRoot().queryView({name: "hideAnimation"});
	}

	getROIBorderButton() {
		return this.getRoot().queryView({name: "showROIBorders"});
	}

	getROIBorderColorpicker() {
		return this.getRoot().queryView({name: "borderROIColorpicker"});
	}
}
