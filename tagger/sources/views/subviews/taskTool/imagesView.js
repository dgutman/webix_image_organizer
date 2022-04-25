import {JetView} from "webix-jet";
import constants from "../../../constants";
import galleryImageUrl from "../../../models/galleryImageUrls";
import nonImageUrls from "../../../models/nonImageUrls";
import ajaxService from "../../../services/ajaxActions";

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

		const selectTemplate = {
			name: "selectTemplate",
			height: 70,
			css: "images-select-template",
			hideIfEmpty: true,
			hidden: true,
			template: () => `<div class='first-column'>
							<a class='select-all-on-page'>Select all on the page</a>
							<a class='select-all'>Select all</a>
							<a class='unselect-all'>Unselect all</a>
						</div>
						<div class='second-column'>
							<a class='tag-templates'>Tag templates</a>
							<a class='dataview-button'>Show preview</a>
						</div>`,
			borderless: true
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
				const IMAGE_HEIGHT = (common.height || constants.DATAVIEW_IMAGE_SIZE.HEIGHT) - 30;
				const getPreviewUrl = galleryImageUrl.getPreviewImageUrl;
				const setPreviewUrl = galleryImageUrl.setPreviewImageUrl;
				const selectState = this.dataview.isCustomSelected(obj) ? "selected" : "";
				if (typeof getPreviewUrl(obj._id) === "undefined") {
					setPreviewUrl(obj._id, "");
					// to prevent sending query more than 1 times
					ajaxService.getImage(obj._id, "thumbnail")
						.then((data) => {
							if (data.type === "image/jpeg") {
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
								<img src="${getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}" class  ="dataview-image">
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
							showSelectedButton,
							showImageName,
							showMeta
						]}

					]
				},
				selectTemplate,
				{hidden: true, selector: "dataview_y_spacer"},
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

	get dataview() {
		return this.getRoot().queryView({name: "taskToolDataview"});
	}
}
