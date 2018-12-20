import "./styles/app.less";
import {JetApp, plugins} from "webix-jet";
import state from "./models/state";

webix.ready(() => {
	const app = new JetApp({
		id: APPNAME,
		version: VERSION,
		start: "/main",
	});

	app.render();

	app.attachEvent("app:error:resolve", function (name, error) {
		window.console.error(error);
	});

	app.use(plugins.Theme);
	const themes = app.getService("theme");
	themes.setTheme("flat", true);
	state.app = app;
});