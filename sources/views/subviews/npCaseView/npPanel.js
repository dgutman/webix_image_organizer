import {JetView} from "webix-jet";

import npButton from "./parts/button";

const NP_PANEL_ID = `np-toolbar-id-${webix.uid()}`;

export default class NpPanel extends JetView {
	constructor(app, config = {}) {
		super(app, config);

		this._config = config;
	}

	config() {
		return {
			...this._config,
			id: NP_PANEL_ID,
			localId: NP_PANEL_ID,
			view: "scrollview",
			body: {
				height: 80,
				cols: []
			}
		};
	}

	init() {}

	ready() {}

	removeButtons() {
		const npPanel = this.getNpPanelView();
		const npPanelBody = npPanel.getBody();
		const buttonsIds = npPanelBody.getChildViews().map(button => button.config.id);
		buttonsIds.forEach((id) => {
			npPanelBody.removeView(id);
		});
	}

	setButtons(npSchemaPropertiesArray, clickButtonHandler) {
		const npPanelView = this.getNpPanelView();
		this.removeButtons();
		const npPanelBody = npPanelView.getBody();
		npSchemaPropertiesArray.forEach((property) => {
			if (property) {
				const buttonConfig = npButton.getConfig({
					value: property,
					css: "np_button",
					id: `${property}_button`,
					click: clickButtonHandler
				});
				npPanelBody.addView(buttonConfig);
				npPanelBody.addView({});
			}
		});
	}

	getButtons() {
		const npPanel = this.getNpPanelView();
		const buttons = npPanel.getBody().getChildViews();
		return buttons;
	}

	getNpPanelView() {
		return this.$$(NP_PANEL_ID);
	}

	getNpPanelId() {
		return NP_PANEL_ID;
	}
}
