import {JetView} from "webix-jet";
import constants from "../../../constants";
import galleryImageUrl from "../../../models/galleryImageUrls";
import nonImageUrls from "../../../models/nonImageUrls";
import ajaxService from "../../../services/ajaxActions";
import roiCoordsCalculator from "../../../services/roiCoordsCalculator";

const PAGER_ID = "task-tool-dataview-pager";

export default class TaggerTaskToolImagesView extends JetView {
	config() {
		const showSelectedButton = {
			view: "button",
			name: "showSelectedButton",
			value: "Show selected items",
			css: "btn-contour",
			height: 30,
			width: 180
		};

		const showImageName = {
			view: "button",
			name: "showImageName",
			value: "Show image name",
			css: "btn-contour",
			height: 30,
			width: 180
		};

		const showMeta = {
			view: "button",
			name: "showMeta",
			value: "Show metadata",
			css: "btn-contour",
			height: 30,
			width: 180
		};

		const selectAllOnPage = {
			view: "button",
			name: "selectAllOnPage",
			value: "Select all on the page",
			css: "btn-contour select-all-on-page",
			height: 30,
			width: 180
		};
		const selectAll = {
			view: "button",
			name: "selectAll",
			value: "Select all",
			css: "btn-contour select-all",
			height: 30,
			width: 180
		};

		const unselectAll = {
			view: "button",
			name: "unselectAll",
			value: "Unselect al",
			css: "btn-contour unselect-all",
			height: 30,
			width: 180
		};

		const selectTemplate = {
			name: "selectTemplate",
			css: "images-select-template",
			hideIfEmpty: true,
			hidden: true,
			borderless: true,
			rows: [
				selectAllOnPage,
				selectAll,
				unselectAll
			]
		};

		const showROI = {
			view: "button",
			name: "showROI",
			value: "Switch on ROI mode",
			css: "btn-contour hide-roi roi-button",
			height: 30,
			width: 180
		};

		const showROIborders = {
			view: "button",
			name: "showROIBorders",
			value: "Hide ROI Borders",
			css: "btn-contour show-borders",
			height: 30,
			width: 180,
			hidden: true
		};

		const dataview = {
			view: "dataview",
			css: "task-tool-dataview",
			name: "taskToolDataview",
			minWidth: 350,
			minHeight: 290,
			pager: PAGER_ID,
			borderless: true,
			tooltip: obj => obj.name,
			template: (obj, common) => {
				if (obj.roi || obj.meta?.roiList || obj.taggerMode === "ROI" || (obj.meta?.roi_left || obj.meta?.roi_right)) {
					document.querySelector(".roi-button").classList.remove("hide-roi");
				}
				const IMAGE_HEIGHT = (common.height || constants.DATAVIEW_IMAGE_SIZE.HEIGHT) - 30;
				const IMAGE_WIDTH = common.width || constants.DATAVIEW_IMAGE_SIZE.WIDTH - 50;
				const getPreviewUrl = galleryImageUrl.getPreviewImageUrl;
				const setPreviewUrl = galleryImageUrl.setPreviewImageUrl;
				const selectState = this.dataview.isCustomSelected(obj) ? "selected" : "";

				let roiRect = "";

				if (obj.roi || obj.roiBorder) {
					obj.roiBorder = true;
					roiRect = roiCoordsCalculator(obj, IMAGE_HEIGHT, IMAGE_WIDTH, "creatorSmall");
				}

				if (typeof getPreviewUrl(obj._id) === "undefined" || obj.roi || obj.normal) {
					setPreviewUrl(obj._id, "");
					// to prevent sending query more than 1 times

					let thumbnailPromise;
					if (obj.roi || obj.taggerMode === "ROI" || (obj.roi_left || obj.roi_right)) {
						thumbnailPromise = this._getRoiThumbnail(obj);
						obj.roi = false;
					}
					else {
						thumbnailPromise = ajaxService.getImage(obj._id, "thumbnail");
						obj.normal = false;
					}
					thumbnailPromise
						.then((data) => {
							if (data.type === "image/jpeg") {
								obj._id ? obj._id : obj._id = obj.id;
								setPreviewUrl(obj._id, URL.createObjectURL(data));
								if (this.dataview.exists(obj.id)) {
									this.dataview.render(obj.id, obj, "update"); // to call item render, not whole dataview
								}
							}
						});
				}

				return `<div onmousedown='return false' onselectstart='return false' class='dataview-item ${selectState}'>
							<div class="dataview-images-container" style="height: ${IMAGE_HEIGHT}px">
								<div class="dataview-images-icons">
									<div class="dataview-icons-top">
										<i class='checkbox ${common.checkboxState(obj, common)}'></i>
									</div>
									<div class="dataview-icons-bottom">
										<div></div>
										<i webix_tooltip='Show metadata' class='dataview-show-metadata-icon show-metadata fas fa-info-circle'></i> 
									</div>
								</div>
								<div style = "padding: 0; margin: 0; position: relative; height: 100%">
								${roiRect}
								<img src="${getPreviewUrl(obj._id) ? getPreviewUrl(obj._id) : nonImageUrls.getNonImageUrl(obj)}" class="dataview-image">
								</div>
							</div>
							<div class="dataview-images-name ellipsis-text">${obj.name}</div>
						</div>`;
			},
			type: {
				width: 150,
				height: 135,
				checkboxState: obj => (this.dataview.isCustomSelected(obj) ? "checked fas fa-check-square" : "unchecked far fa-square enabled"),
				templateLoading: () => "<div class='dataview-item-loading-overlay'>Loading...</div>"
			}
		};

		const pager = {
			view: "pager",
			name: "taskToolDataviewPager",
			id: PAGER_ID,
			width: 400,
			height: 40,
			size: 70,
			template: (obj, common) => `<div class='user-dataview-pager'>${common.first()} ${common.prev()} <input type='text' class='pager-input' value='${common.page(obj)}'>
				<span class='pager-amount'>of ${obj.limit}</span> ${common.next()} ${common.last()}</div>`
		};

		const ui = {
			name: "imagesLayout",
			padding: 10,
			rows: [
				{
					paddingY: 10,
					cols: [
						{},
						{rows: [
							showROI,
							showROIborders,
							{}
						]},
						selectTemplate,
						{rows: [
							showSelectedButton,
							showImageName,
							showMeta
						]},
						{}
					]
				},
				{selector: "dataview_y_spacer"},
				{
					cols: [
						{hidden: true, selector: "dataview_x_spacer"},
						dataview
					]
				},
				{
					hideIfEmpty: true,
					hidden: true,
					cols: [
						{},
						pager,
						{}
					]
				}
			]
		};

		return ui;
	}

	async _getRoiThumbnail(image) {
		let thumbnail;
		let coords = {
			left: 20,
			top: 20,
			right: 100,
			bottom: 100
		};
		if (image.roi_width) coords.width = image.roi_width;
		if (image.roi_left) coords.left = image.roi_left;
		if (image.roi_top) {
			coords.top = image.roi_top;
		}
		else if (image.roi_bottom && image.roi_height) coords.top = image.roi_bottom - image.roi_height;
		if (image.roi_left && image.roi_width) coords.right = image.roi_left + image.roi_width;
		if (image.roi_bottom) coords.bottom = image.roi_bottom;
		else if (image.roi_top && image.roi_height) coords.bottom = image.roi_top + image.roi_height;
		let id = image.mainId || image._id;
		let url = image.apiUrl || false;
		thumbnail = ajaxService.getRoiImage(id, coords, url);

		return thumbnail;
	}

	get dataview() {
		return this.getRoot().queryView({name: "taskToolDataview"});
	}
}
