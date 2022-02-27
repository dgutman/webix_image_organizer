import {JetView} from "webix-jet";

const SCALE_TOGGLE_ID = "scale-toggle-id";

export default class ScaleToggle extends JetView {
	constructor(app, config = {}, scaleType) {
		super(app, config);

		this._cnf = config;
	}

	config() {
		return {
			...this._cnf,
			localId: SCALE_TOGGLE_ID,
			name: "scaleToggle",
			view: "toggle",
			type: "icon",
			label: "logarithnic/linear scale",
			offIcon: "mdi mdi-toggle-switch-off-outline",
			onIcon: "mdi mdi-toggle-switch"
		};
	}

	getValue() {
		return this.$$(SCALE_TOGGLE_ID).getValue();
	}
}
