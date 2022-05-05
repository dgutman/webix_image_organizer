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
			localId: NP_PANEL_ID,
			view: "toolbar",
			height: 90,
			cols: []
		};
	}

	init() {

	}

	ready() {

	}

	removeButtons() {
		const npPanel = this.getNpPanelView();
		const buttons = npPanel.getChildViews();
		const buttonsIds = [];
		buttons.forEach((view) => {
			buttonsIds.push(view.config.id);
		});
		buttonsIds.forEach((id) => {
			npPanel.removeView(id);
		});
	}

	setButtons(stainArray, clickButtonHandler) {
		const npPanelView = this.getNpPanelView();
		this.removeButtons();
		stainArray.forEach((stain) => {
			if (stain) {
				const buttonConfig = npButton.getConfig({
					value: stain,
					css: "np_button",
					id: `${stain}_button`,
					click: clickButtonHandler
				});
				npPanelView.addView(buttonConfig);
			}
		});
	}

	getButtons() {
		const npPanel = this.getNpPanelView();
		return npPanel.getChildViews();
	}

	getNpPanelView() {
		return this.$$(NP_PANEL_ID);
	}
}
