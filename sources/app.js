import "./styles/app.less";
import {JetApp, plugins} from "webix-jet";
import state from "./models/state";

webix.ready(() => {
	const app = new JetApp({
		id: "",
		version: "",
		start: "/main"
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
	themes.setTheme("flat", true);
	state.app = app;
});
