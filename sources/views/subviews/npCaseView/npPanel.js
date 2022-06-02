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
			view: "toolbar",
			height: 80,
			cols: [] // init in npCaseView
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

	setButtons(npSchemaPropertiesArray, clickButtonHandler) {
		const npPanelView = this.getNpPanelView();
		this.removeButtons();
		npPanelView.addView({});
		npSchemaPropertiesArray.forEach((property) => {
			if (property) {
				const buttonConfig = npButton.getConfig({
					value: property,
					css: "np_button",
					id: `${property}_button`,
					click: clickButtonHandler
				});
				npPanelView.addView(buttonConfig);
				npPanelView.addView({});
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

	getNpPanelId() {
		return NP_PANEL_ID;
	}
}
