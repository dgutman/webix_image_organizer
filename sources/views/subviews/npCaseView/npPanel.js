import {JetView} from "webix-jet";

import npButton from "./parts/button";

export default class NpPanel extends JetView {
	constructor(app, config = {}) {
		super(app, config);

		this.npPanelId = `np-toolbar-id-${webix.uid()}`;
		this._config = config;
	}

	config() {
		return {
			...this._config,
			id: this.npPanelId,
			localId: this.npPanelId,
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
		return this.$$(this.npPanelId);
	}

	getNpPanelId() {
		return this.npPanelId;
	}
}
