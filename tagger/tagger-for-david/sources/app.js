import {JetApp, plugins} from "webix-jet";
import "./styles/app.less";
import state from "./models/state";
import constants from "./constants";
import taggerView from "./views/taggerMain";
import taggerAdminView from "./views/subviews/adminView";
import taggerUserView from "./views/subviews/userView";

import "./utils/polyfills";

webix.ready(() => {
	const appSettings = {
		id: "",
		version: "",
		start: constants.APP_PATHS.TAGGER,
		views: {
			admin: taggerAdminView,
			user: taggerUserView
		}
	};

	appSettings.views[constants.APP_PATHS.TAGGER] = taggerView;

	const app = new JetApp(appSettings);

	app.render();

	app.attachEvent("app:error:resolve", (name, error) => {
		window.console.error(error);
	});

	app.use(plugins.Theme);
	const themes = app.getService("theme");
	themes.setTheme("flat", true);
	state.app = app;
});
