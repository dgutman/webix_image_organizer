const xbsEslint = require("eslint-config-xbsoftware");
const {INDENT, QUOTES, PLUGINS} = require("eslint-config-xbsoftware/constants");

module.exports = {
	extends: [
		xbsEslint({
			config: {
				indent: INDENT.TABS,
				quotes: QUOTES.DOUBLE
			}
		})
	],
	env: {
		browser: true,
		es6: true
	},
	globals: {
		webix: true,
		APPNAME: true,
		VERSION: true,
		PRODUCTION: true,
		$$: true,
		console: true,
		require: true,
		__dirname: true,
		process: true
	},
	parserOptions: {
		sourceType: "module",
		ecmaVersion: "latest"
	},
	rules: {
		"no-extra-parens": "warn",
		"valid-jsdoc": "warn",
		"no-console": "off"
	}
};
