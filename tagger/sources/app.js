import "@fortawesome/fontawesome-free/css/all.min.css";
import {JetApp, plugins} from "webix-jet";
import "./utils/polyfills";
import "./styles/app.less";
import state from "./models/state";
import constants from "./constants";
import helpers from "./services/helpers";
import taggerView from "./views/taggerMain";
import taggerAdminView from "./views/subviews/adminView";
import taggerUserView from "./views/subviews/userView/userView";
import taggerDashboard from "./views/subviews/dashboardView/dashboardView";
import taggerNotifications from "./views/subviews/notificationsView";
import taggerTaskTool from "./views/subviews/taskTool/taskTool";
import auth from "./services/authentication";
import "./views/components/editCombo";
import "./views/components/multiCombo";
import "./views/components/formTemplate";
import "./views/components/editableList";

webix.ready(() => {
	const appSettings = {
		id: "",
		version: "",
		start: constants.APP_PATHS.TAGGER_ADMIN_DASHBOARD,
		views: {
			[constants.APP_PATHS.TAGGER]: taggerView,
			user: taggerUserView,
			dashboard: taggerDashboard,
			notifications: taggerNotifications,
			task_tool: taggerTaskTool,
			user_view: taggerUserView
		},
		routes: {

			"/user": constants.APP_PATHS.TAGGER_USER,
			"/task_tool": constants.APP_PATHS.TAGGER_TASK_TOOL
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
