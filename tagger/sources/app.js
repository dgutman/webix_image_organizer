import "@fortawesome/fontawesome-free/css/all.css";
import {JetApp, plugins} from "webix-jet";
import "./styles/app.less";
import state from "./models/state";
import constants from "./constants";
import helpers from "./services/helpers";
import taggerView from "./views/taggerMain";
import taggerAdminView from "./views/subviews/adminView";
import taggerUserView from "./views/subviews/userView";
import taggerDashboard from "./views/subviews/dashboardView";
import taggerNotifications from "./views/subviews/notificationsView";
import auth from "./services/authentication";

import "./utils/polyfills";

webix.ready(() => {
	const appSettings = {
		id: "",
		version: "",
		start: constants.APP_PATHS.TAGGER_USER,
		views: {
			[constants.APP_PATHS.TAGGER]: taggerView,
			admin: taggerAdminView,
			user: taggerUserView,
			dashboard: taggerDashboard,
			notifications: taggerNotifications
		},
		routes: {
			"/admin": constants.APP_PATHS.TAGGER_ADMIN,
			"/user": constants.APP_PATHS.TAGGER_USER
		}
	};

	const app = new JetApp(appSettings);

	app.render();

	app.attachEvent("app:error:resolve", (name, error) => {
		window.console.error(error);
	});

	app.attachEvent("app:guard", (url, view, nav) => {
		if (!auth.isAdmin() && helpers.isAdminView(url)) {
			nav.redirect = constants.APP_PATHS.TAGGER_USER;
		}
	});

	app.use(plugins.Theme);
	const themes = app.getService("theme");
	themes.setTheme("flat", true);
	state.app = app;
});
