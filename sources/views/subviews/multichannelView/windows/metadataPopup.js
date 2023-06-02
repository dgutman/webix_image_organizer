import {JetView} from "webix-jet";

import stateStore from "../../../../models/multichannelView/stateStore";
import PropertyAccordion from "../../../components/propertyAccordion";

const CLOSE_BUTTON_ID = "close-button-id";

export default class MetadataPopup extends JetView {
	constructor(app) {
		super(app);

		this._propertyAccordion = new PropertyAccordion(this.app, {
			scrollviewOptions: {
				maxWidth: 1000,
				minWidth: 300
			}
		});
	}

	config() {
		return {
			view: "window",
			resize: true,
			move: true,
			width: 400,
			head: {
				view: "toolbar",
				cols: [
					{
						view: "label",
						width: 140,
						label: "Image Metadata"
					},
					{gravity: 10},
					{
						view: "button",
						localId: CLOSE_BUTTON_ID,
						label: "Close",
						width: 100,
						align: "right",
						click: () => {
							this.getRoot().hide();
						}
					}
				]
			},
			body: {
				rows: [
					{
						cols: [
							this._propertyAccordion
						]
					}
				]
			}
		};
	}

	destroy() {
		super.destroy();
		stateStore.imageMetadata = null;
	}

	setProperties() {
		this._propertyAccordion.setProperties(stateStore.imageMetadata.data);
	}
}
