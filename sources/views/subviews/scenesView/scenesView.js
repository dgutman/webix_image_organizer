import {JetView} from "webix-jet";
import ImagesRowSlider from "./imagesRowSlider";
import ScenesViewer from "./sceneViewer";

export default class ScenesView extends JetView {
	constructor(app, config) {
		super(app, config);

		this._imagesSlider = new ImagesRowSlider(app, {height: 160});
		this._scenesViewer = new ScenesViewer(app, {});
	}

	config() {
		return {
			name: "scenesViewCell",
			margin: 8,
			rows: [
				this._imagesSlider,
				this._scenesViewer
			]
		};
	}

	ready() {
		const dataviewSlider = this._imagesSlider.$sliderDataview();
		this.on(dataviewSlider.data, "onSyncApply", () => {
			const images = dataviewSlider.data.serialize();
			this._scenesViewer.setLayers(images);
			if (images.length) {
				dataviewSlider.select(images[0].id);
			}
		});

		this.on(dataviewSlider, "onAfterSelect", async (id) => {
			const image = dataviewSlider.getItem(id);
			this._scenesViewer.onImageSelect(image);
		});
	}

	syncSlider(dataCollection) {
		this._imagesSlider.syncSlider(dataCollection);
	}
}
