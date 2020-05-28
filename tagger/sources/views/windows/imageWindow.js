import {JetView} from "webix-jet";
import ajaxService from "../../services/ajaxActions";
import galleryImageUrl from "../../models/galleryImageUrls";
import nonImageUrls from "../../models/nonImageUrls";

const HEIGHT = 553;
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

				if (obj._id && !obj.emptyObject) {
					if (typeof getPreviewUrl(obj._id) === "undefined") {
						this.view.showProgress();
						setPreviewUrl(obj._id, "");
						ajaxService.getImage(obj.mainId, imageType, {height: HEIGHT, width: WIDTH})
							.then((data) => {
								setPreviewUrl(obj._id, URL.createObjectURL(data));
								this.view.hideProgress();
								this.getLargeTemplateView().refresh();
							}).fail(() => {
								this.view.hideProgress();
							});
					}
					return `<img src="${getPreviewUrl(obj._id) || nonImageUrls.getNonImageUrl(obj)}">`;
				} return "<div></div>";
			},
			borderless: true
		};

		const windowBody = {
			view: "window",
			css: "metadata-window-body",
			paddingX: 35,
			width: WIDTH,
			height: HEIGHT,
			modal: true,
			position: "center",
			type: "clean",
			resize: true,
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

	showWindow(obj) {
		// define when to init Seadragon
		this.getHeaderTemplateView().parse(obj);
		this.getLargeTemplateView().parse(obj);
		this.getLargeTemplateView().define("scroll", "false");
		this.getLargeTemplateView().define("move", "true");
		this.getRoot().show();
	}

	close() {
		// to clear setted template
		this.getLargeTemplateView().parse({emptyObject: true});
		this.getRoot().hide();
	}
}
