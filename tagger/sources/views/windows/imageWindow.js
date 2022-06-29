import {JetView} from "webix-jet";
import ajaxService from "../../services/ajaxActions";
import galleryImageUrl from "../../models/galleryImageUrls";
import nonImageUrls from "../../models/nonImageUrls";
import roiCoordsCalculator from "../../services/roiCoordsCalculator";

const HEIGHT = 563;
const WIDTH = 750;

export default class ImageWindowView extends JetView {
	config() {
		const templateViewer = {
			view: "template",
			css: "absolute-centered-image-template",
			name: "largeImageTemplate",
			template: (obj) => {
				const imageType = "thumbnail";
				const getPreviewUrl = galleryImageUrl.getNormalImageUrl;
				const setPreviewUrl = galleryImageUrl.setNormalImageUrl;
				let roiRect = "";
				if (obj._id && !obj.emptyObject) {
					if (typeof getPreviewUrl(obj._id) === "undefined") {
						this.view.showProgress();
						setPreviewUrl(obj._id, "");
						let imgPromise;
						if (this.isROI && this.mode === "userLarge") {
							imgPromise = this._getRoiImage(obj);
						}
						else {
							imgPromise = ajaxService.getImage(obj.mainId || obj._id, imageType, {height: HEIGHT, width: WIDTH});
						}
						imgPromise
							.then((data) => {
								setPreviewUrl(obj._id, URL.createObjectURL(data));
								this.view.hideProgress();
								this.getLargeTemplateView().refresh();
							});
					}

					// switch off/on ROI border
					const borderHidden = document.querySelector(".hide-border");

					if (this.isROI && !borderHidden) {
						if (this.mode === "userLarge") roiRect += roiCoordsCalculator(obj, HEIGHT, WIDTH, this.mode);
						if (this.mode === "creatorLarge") roiRect += roiCoordsCalculator(obj, HEIGHT, WIDTH, this.mode);
					}
					return `<div class='img-container'><img src="${getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}">${roiRect}</div>`;
				}
				return "<div></div>";
			},
			borderless: true
		};

		const windowBody = {
			view: "window",
			css: "metadata-window-body unselectable-block",
			paddingX: 35,
			width: WIDTH,
			height: HEIGHT,
			modal: true,
			position: "center",
			type: "clean",
			head: {
				cols: [
					{
						view: "template",
						css: "large-image-name",
						name: "headerTemplate",
						template: obj => obj.name,
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						css: "btn webix_transparent",
						icon: "fas fa-times",
						hotkey: "esc",
						width: 30,
						height: 30,
						click: () => this.close()
					}
				]
			},
			body: {
				rows: [
					{
						type: "clean",
						cols: [
							templateViewer
						]
					}
				]
			}
		};
		return windowBody;
	}

	init(view) {
		this.view = view;
		webix.extend(this.view, webix.ProgressBar);
	}

	// image template
	getLargeTemplateView() {
		return this.getRoot().queryView({name: "largeImageTemplate"});
	}

	// window header template
	getHeaderTemplateView() {
		return this.getRoot().queryView({name: "headerTemplate"});
	}

	async _getRoiImage(image) {
		let thumbnail;
		let coords = {
			left: 20,
			top: 20,
			right: 100,
			bottom: 100,
			width: 700
		};
		if (image.meta) {
			if (image.meta.roi_left) coords.left = image.meta.roi_left;
			if (image.meta.roi_top) coords.left = image.meta.roi_top;
			if (image.meta.roi_left && image.meta.roi_width) coords.left = image.meta.roi_left + image.meta.roi_width;
			if (image.meta.roi_top && image.meta.roi_height) coords.bottom = image.meta.roi_top + image.meta.roi_height;
		}
		let url = image.apiUrl || false;
		thumbnail = ajaxService.getRoiImage(image.mainId || image._id, coords, url);

		return thumbnail;
	}

	showWindow(obj, isROI, showROIBorders, mode) {
		this.isROI = isROI;
		this.showROIBorders = showROIBorders;
		this.mode = mode;
		this.getHeaderTemplateView().parse(obj);
		this.getLargeTemplateView().parse(obj);
		this.getLargeTemplateView().define("scroll", "false");
		this.getLargeTemplateView().define("move", "true");
		this.getRoot().show();
	}

	close() {
		// to clear setted template
		this.isROI = false;
		this.getLargeTemplateView().parse({emptyObject: true});
		this.getRoot().hide();
	}
}
