import {JetApp, plugins} from "webix-jet";
import "./styles/app.less";
import "./services/globalEvents";
import state from "./models/state";
import utils from "./utils/utils";
import constants from "./constants";
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

	// selection by shift in dataview
	document.body.addEventListener("keydown", (event) => {
		if (event.keyCode === 16) { // key code of shift button
			state.toSelectByShift = true;
		}
	});

	document.body.addEventListener("keyup", (event) => {
		if (event.keyCode === 16) { // key code of shift button
			state.toSelectByShift = false;
		}
	});

	app.use(plugins.Theme);
	const themes = app.getService("theme");
	themes.setTheme(utils.getAppSkinFromLocalStorage() || "flat", true);
	state.app = app;
});
