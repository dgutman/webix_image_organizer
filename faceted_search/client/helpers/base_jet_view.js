define([
], function() {
	'use strict';
	return class BaseJetView {
		constructor(app) {
			this.app = app;
			this._rootId = `jet-view-${webix.uid()}`;
		}

		getRoot() {
			return $$(this._rootId);
		}

		$$(id) {
			const root = this.getRoot();
			if (root.config.localId === id) {
				return root;
			}
			return root.queryView({localId: id}) || webix.$$(id);
		}

		ui(view) {
			this.app.ui(view);
			return view;
		}
	};
});
