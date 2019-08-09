import ajax from "../../../../services/ajaxActions";
import galleryImageUrl from "../../../../models/galleryImageUrls";
import {JetView} from "webix-jet";
import JSONFormatter from "json-formatter-js";

const HEIGHT = 553;
const WIDTH = 750;
const OpenSeadragon = require("openseadragon");

let params = {};

export default class ImageWindowView extends JetView {
	config() {
		/* const derivativeComboBox = {
			view: "combo",
			css: "select-field",
			options: {
				body: {
					template: "#name#"
				}
			},
			on: {
				onChange: (id) => {
				}
			}
		}; */

		const templateViewer = {
			view: "template",
			css: "absolute-centered-image-template",
			name: "largeImageTemplate",
			template: (obj) => {
				const imageType = obj.label ? "images/label" : "thumbnail";
				const getPreviewUrl = obj.label ? galleryImageUrl.getLabelPreviewImageUrl : galleryImageUrl.getNormalImageUrl;
				const setPreviewUrl = obj.label ? galleryImageUrl.setPreviewLabelImageUrl : galleryImageUrl.setNormalImageUrl;

				if (obj._id && !obj.emptyObject) {
					if (typeof getPreviewUrl(obj._id) === "undefined") {
						this.view.showProgress();
						setPreviewUrl(obj._id, "");
						ajax.getImage(obj._id, HEIGHT, WIDTH, imageType)
							.then((data) => {
								setPreviewUrl(obj._id, URL.createObjectURL(data));
								this.view.hideProgress();
								this.getLargeTemplateView().refresh();
							}).fail(() => {
								this.view.hideProgress();
							});
					}
					return `<img src="${getPreviewUrl(obj._id) || ""}">`;
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
			move: true,
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
						icon: "fas fa-times",
						width: 30,
						height: 30,
						click: () => this.close()
					}
				]
			},
			body: {
				rows: [
					// {
					// 	margin: 10,
					// 	cols: [
					// 		derivativeComboBox,
					// 	]
					// },
					{
						margin: 10,
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

	showWindow(obj, viewer) {
		// define when to init Seadragon
		this.getHeaderTemplateView().parse(obj);
		if (viewer === "standard") {
			this.getLargeTemplateView().parse(obj);
			this.getLargeTemplateView().define("scroll", "false");
			this.getLargeTemplateView().define("move", "true");
		}
		this.getRoot().show();
		const templateNode = this.getLargeTemplateView().getNode();
		if (viewer === "seadragon") {
			this.view.showProgress();
			ajax.getImageTiles(obj._id)
				.then((data) => {
					params = {
						width: data.sizeX,
						height: data.sizeY,
						tileWidth: data.tileWidth,
						tileHeight: data.tileHeight,
						minLevel: 0,
						maxLevel: data.levels - 1
					};
					this.createOpenSeadragonViewer(obj, templateNode.firstChild);
					this.view.hideProgress();
				})
				.fail(() => {
					this.view.hideProgress();
				});
		}
		else if (viewer === "jsonviewer") {
			this.view.showProgress();
			ajax.getJSONFileData(obj._id)
				.then((data) => {
					this.createJSONViewer(data, templateNode.firstChild);
					this.view.hideProgress();
				})
				.fail(() => {
					this.view.hideProgress();
				});
		}
	}

	// Initializing Seadragon, setting needed options
	setTileSources(obj) {
		return {
			width: params.width,
			height: params.height,
			tileWidth: params.tileWidth,
			tileHeight: params.tileHeight,
			minLevel: params.minLevel,
			maxLevel: params.maxLevel,
			getTileUrl(level, x, y) {
				return ajax.getImageTileUrl(obj._id, level, x, y);
			}
		};
	}

	createOpenSeadragonViewer(obj, templateNode) {
		this.viewer = new OpenSeadragon.Viewer({
			element: templateNode,
			prefixUrl: "sources/images/images/",
			imageLoaderLimit: 1,
			tileSources: this.setTileSources(obj)
		});
		return this.viewer;
	}

	createJSONViewer(data, templateNode) {
		const formatter = new JSONFormatter(data);
		templateNode.appendChild(formatter.render());
	}

	close() {
		// to clear setted template
		// to destroy Open Seadragon viewer
		if (this.viewer) {
			this.viewer.destroy();
		}
		this.getLargeTemplateView().parse({emptyObject: true});
		this.getRoot().hide();
	}
}
