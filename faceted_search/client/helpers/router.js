define([
	"app"
], function(app) {
	'use strict';
	const routes = {
		adminMode: "top/admin_mode",
		userMode: "top/user_mode",
		multichannelView: "top/multichannel_view"
	}

	function show(path, params) {
		const paramsString = Object.entries(params).reduce((acc, [key, value]) => {
			acc.concat(`:${key}=${value}`);
		}, "");
		app.show(`${path}${paramsString}`);
	}

	function navigate(name, params) {
		if (!routes[name]) {
			return;
		}
		show(routes[name], params);
	}
	return {
		routes,
		navigate
	}
});