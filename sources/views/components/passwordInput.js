function togglePasswordVisibility(elem) {
	if (elem.config.icon === "eye") {
		elem.define("type", "base");
		elem.define("icon", "eye-slash");
	}
	else {
		elem.define("type", "password");
		elem.define("icon", "eye");
	}
	elem.refresh();
}

webix.protoUI({
	name: "passwordInput",
	$cssName: "search",
	$init() {
		this.attachEvent("onSearchIconClick", (ev) => {
			togglePasswordVisibility($$(ev.target));
		});
	},
	defaults: {
		type: "password",
		icon: "eye"
	}
}, webix.ui.search);

