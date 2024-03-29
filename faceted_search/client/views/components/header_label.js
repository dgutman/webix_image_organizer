define([
	"helpers/base_jet_view"
], function(BaseJetView) {
	'use strict';

	return class HeaderLabel extends BaseJetView {
		constructor(app, config = {}) {
			super(app, config);
			this._cnf = config;
		}

		get $ui() {
			return {
				...this._cnf,
				id: this._rootId,
				cols: [
					{gravity: 1, height: 44},
					{
						view: "label",
						width: 155,
						template: "<img class='app-logo' src='assets/imgs/bdsa_logo.png'>"
					},
					{
						view: "label",
						width: 300,
						template: "<p class='images-header-p'>BDSA Image Explorer</p>"
					},
					{gravity: 1}
				]
			};
		}
	};
});
