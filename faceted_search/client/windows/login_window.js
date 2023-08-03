// import authService from "../../services/authentication";

const NAME_PASSWORD_INPUT = "passwordInput";
const NAME_LOGIN_FORM = "loginForm";
const NAME_ERROR_LABEL = "error-label";
const NAME_USER_NAME = "username";
const NAME_PASSWORD = "password";
const NAME_CANCEL_BUTTON = "cancelButton";
const NAME_LOGIN_BUTTON = "loginButton";
const NAME_CLOSE_LOGIN_WINDOW_BUTTON = "closeLoginWindowButton";


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
	name: NAME_PASSWORD_INPUT,
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
		name: NAME_LOGIN_FORM,
		width: 600,
		rules: {
			username: webix.rules.isNotEmpty,
			password: webix.rules.isNotEmpty
		},
		elements: [
			{
				view: "label",
				name: NAME_ERROR_LABEL,
				css: "label-error",
				label: "",
				align: "center",
				hidden: true
			},
			{
				view: "text",
				css: "text-field",
				name: NAME_USER_NAME,
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
				name: NAME_PASSWORD,
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
						name: NAME_CANCEL_BUTTON,
						value: "Cancel"
						// click: () => this.cancelLogic()
					},
					{width: 20},
					{
						view: "button",
						css: "btn",
						width: 80,
						name: NAME_LOGIN_BUTTON,
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
					name: NAME_CLOSE_LOGIN_WINDOW_BUTTON,
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
// 			form.elements[NAME_ERROR_LABEL].hide();
// 		}
// 	}

define([
	"app",
	"helpers/authentication"
], function(app, authService) {
	const window = webix.ui(getWindowConfig());
	webix.extend(window, webix.ProgressBar);

	const form = window.queryView({name: NAME_LOGIN_FORM});
	const usernameField = form.queryView({name: NAME_USER_NAME});
	const passwordField = form.queryView({name: NAME_PASSWORD});
	const loginButton = form.queryView({name: NAME_LOGIN_BUTTON});
	const cancelButton = form.queryView({name: NAME_CANCEL_BUTTON});
	const closeButton = window.queryView({name: NAME_CLOSE_LOGIN_WINDOW_BUTTON});

	function loginButtonClick() {
		window.showProgress();
		if (form.validate()) {
			authService.login(form.getValues())
				.then(() => {
					form.clear();
					form.elements[NAME_ERROR_LABEL].hide();
					window.hideProgress();
					cancelLogic();
				})
				.fail((xhr) => {
					if (xhr.status === 401) {
						const errorLabel = form.elements[NAME_ERROR_LABEL];
						errorLabel.setValue("Login failed");
						errorLabel.show();

						form.markInvalid(NAME_USER_NAME, "Enter correct username");
						form.markInvalid(NAME_PASSWORD, "Enter correct password");
					}
					window.hideProgress();
				});
		} else {
			window.hideProgress();
		}
	}

	function cancelLogic() {
		form.clearValidation();
		form.clear();
		window.hide();
		form.elements[NAME_ERROR_LABEL].hide();

		usernameField.config.invalidMessage = "Enter username";
		passwordField.config.invalidMessage = "Enter password";
	}

	loginButton.attachEvent("onItemClick", () => { loginButtonClick(); });
	cancelButton.attachEvent("onItemClick", () => { cancelLogic(); });
	closeButton.attachEvent("onItemClick", () => { cancelLogic(); });

	return window;
});

