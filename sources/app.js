import {JetApp, plugins} from "webix-jet";

import "./styles/app.less";
import "./services/globalEvents";
import constants from "./constants";
import state from "./models/state";
import utils from "./utils/utils";
import Header from "./views/header/header";
import MainView from "./views/main/main";
import UploadMetadataView from "./views/uploadMetadata/root";

webix.ready(() => {
	const app = new JetApp({
		id: "",
		version: "",
		start: constants.APP_PATHS.MAIN,
		views: {
			app: Header,
			main: MainView,
			"upload-metadata": UploadMetadataView
		}
	});

	app.render();

	app.attachEvent("app:error:resolve", (name, error) => {
		window.console.error(error);
	});

	app.use(plugins.Theme);
	const themes = app.getService("theme");
	themes.setTheme(utils.getAppSkinFromLocalStorage() || "flat", true);
	state.app = app;
});
