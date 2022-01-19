function togglePasswordVisibility(elem) {
	if (elem.config.icon === "fa fa-eye") {
		elem.define("type", "password");
		elem.define("icon", "far fa-eye-slash");
	}
	else {
		elem.define("type", "base");
		elem.define("icon", "fa fa-eye");
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
		icon: "far fa-eye-slash"
	}
}, webix.ui.search);

