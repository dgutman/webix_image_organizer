define([
	"app"
], function(app) {
	'use strict';
	const routes = {
		adminMode: "top/admin_mode",
		userMode: "top/user_mode",
		multichannelView: "top/multichannel_view"
	}

	function getCurrentPath() {
		return app.path.reduce((acc, val) => {
			acc = acc ? acc.concat(`/${val.page}`) : val.page;
			return acc;
		}, "");
	}

	function parseToString(path, params = {}) {
		const paramsString = Object.entries(params).reduce((acc, [key, value]) => {
			return acc.concat(`:${key}=${value}`);
		}, "");

		return `${path}${paramsString}`;
	}

	function getFullUrl(path, params = {}) {
		return `${window.location.origin}/#!${parseToString(path, params)}`
	}

	function show(path, params) {
		const pathWithParams = parseToString(path, params);
		app.show(pathWithParams);
	}

	function navigate(path, params) {
		const routesArray = Object.values(routes);
		if (!routesArray.find(item => item === path)) {
			return;
		}
		show(path, params);
	}

	function getParamsFromUrl() {
		const test = location.hash;
		let result;
		const pos = test.indexOf(":");
		if (pos !== -1){
			const params = test.substr(pos+1).split(":");
			//detect named params
			const objmode = params[0].indexOf("=") !== -1;

			//create hash of named params
			if (objmode) {
				result = {};
				for (let j = 0; j < params.length; j++) {
					const chunk = params[j].split("=");
					result[chunk[0]] = chunk[1];
				}
			} else {
				result = params;
			}
		}
		return result;
	}

	function getParams(name) {
		if (!name) {
			return getParamsFromUrl();
		}
		const pageObj = app.path.find(({page}) => page === name);

		return pageObj.params;
	}

	function setParams(params) {
		const path = getCurrentPath();
		const url = getFullUrl(path, params);
		window.location.assign(url);
	}

	return {
		routes,
		navigate,
		getParams,
		setParams
	};
});