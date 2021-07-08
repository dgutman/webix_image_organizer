define([
	"helpers/base_jet_view",
	"constants"
], function(BaseJetView, constants) {
	'use strict';
	const SCALE_TOGGLE_ID = "scale-toggle-id";

	return class ScaleToggle extends BaseJetView {
		constructor( app, config = {}, scaleType) {
			super(app, config);

			this._cnf = config;
		}

		get $ui() {
			return {
				...this._cnf,
				id: this._rootId,
				localId: SCALE_TOGGLE_ID,
				name: "scaleToggle",
				view: "toggle",
				type: "icon",
				label: `logarithnic/linear scale`,
				offIcon: "mdi mdi-toggle-switch-off-outline",
				onIcon: "mdi mdi-toggle-switch"
			};
		}

		getValue() {
			return this.$$(SCALE_TOGGLE_ID).getValue();
		}
	};
});
