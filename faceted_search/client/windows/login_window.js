// import authService from "../../services/authentication";

function togglePasswordVisibility(elem) {
	if (elem.config.icon === "mdi mdi-eye-off") {
		elem.define("type", "base");
		elem.define("icon", "mdi mdi-eye");
	} else {
		elem.define("type", "password");
		elem.define("icon", "mdi mdi-eye-off");
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
		icon: "mdi mdi-eye-off"
	}
}, webix.ui.search);

function getWindowConfig() {
	const loginForm = {
		view: "form",
		name: "loginForm",
		width: 600,
		rules: {
			username: webix.rules.isNotEmpty,
			password: webix.rules.isNotEmpty
		},
		elements: [
			{
				view: "label",
				name: "error-label",
				css: "label-error",
				label: "",
				align: "center",
				hidden: true
			},
			{
				view: "text",
				css: "text-field",
				name: "username",
				label: "Username",
				placeholder: "Enter username",
				invalidMessage: "Enter username",
				on: {
					// onTimedKeyPress: () => this.hideErrorLabel()
				}
			},
			{
				view: "passwordInput",
				css: "search-field",
				name: "password",
				label: "Password",
				placeholder: "Enter password",
				invalidMessage: "Enter password",
				on: {
					// onTimedKeyPress: () => this.hideErrorLabel()
				}
			},
			{
				cols: [
					{},
					{
						view: "button",
						css: "btn-contour",
						width: 80,
						name: "cancelButton",
						value: "Cancel"
						// click: () => this.cancelLogic()
					},
					{width: 20},
					{
						view: "button",
						css: "btn",
						width: 80,
						name: "loginButton",
						value: "Login",
						hotkey: "enter"
						// click: () => this.loginButtonClick()
					}
				]
			}
		],
		elementsConfig: {
			labelWidth: 120
		}
	};

	const loginWindow = {
		view: "window",
		css: "window-with-header",
		modal: true,
		position: "center",
		headHeight: 30,
		move: true,
		head: {
			view: "toolbar",
			css: "window-header-toolbar",
			borderless: true,
			type: "clean",
			height: 32,
			cols: [
				{
					template: "Login",
					css: "window-header-toolbar-text main-subtitle2",
					borderless: true,
					autoheight: true
				},
				{gravity: 0.1},
				{
					view: "button",
					type: "icon",
					icon: "mdi mdi-close",
					hotkey: "esc",
					width: 30,
					height: 30,
					align: "right"
					// click: () => this.cancelLogic()
				},
				{width: 5}
			]
		},
		body: loginForm
	};
	return loginWindow;
}

// 	hideErrorLabel() {
// 		const loginValue = this.getLoginTextView().getValue();
// 		const passwordValue = this.getPasswordTextView().getValue();
// 		if (!loginValue && !passwordValue) {
// 			form.elements["error-label"].hide();
// 		}
// 	}

define([
	"app",
	"helpers/authentication"
], function(app, authService) {
	const window = webix.ui(getWindowConfig());
	webix.extend(window, webix.ProgressBar);

	const form = window.queryView({name: "loginForm"});
	const usernameField = form.queryView({name: "username"});
	const passwordField = form.queryView({name: "password"});
	const loginButton = form.queryView({name: "loginButton"});
	const cancelButton = form.queryView({name: "cancelButton"}); 

	function loginButtonClick() {
		window.showProgress();
		if (form.validate()) {
			authService.login(form.getValues())
				.then(() => {
					form.clear();
					form.elements["error-label"].hide();
					window.hideProgress();
					cancelLogic();
				})
				.fail((xhr) => {
					if (xhr.status === 401) {
						const errorLabel = form.elements["error-label"];
						errorLabel.setValue("Login failed");
						errorLabel.show();

						form.markInvalid("username", "Enter correct username");
						form.markInvalid("password", "Enter correct password");
					}
					window.hideProgress();
				});
		}
		else {
			window.hideProgress();
		}
	}

	function cancelLogic() {
		form.clearValidation();
		form.clear();
		window.hide();
		form.elements["error-label"].hide();

		usernameField.config.invalidMessage = "Enter username";
		passwordField.config.invalidMessage = "Enter password";
	}

	loginButton.attachEvent("onItemClick", () => { loginButtonClick(); });
	cancelButton.attachEvent("onItemClick", () => { cancelLogic(); });

	return window;
});

