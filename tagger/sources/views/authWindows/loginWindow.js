import {JetView} from "webix-jet";
import "../components/passwordInput";
import authService from "../../services/authentication";
import constants from "../../constants";

export default class LoginWindowView extends JetView {
	config() {
		const loginForm = {
			view: "form",
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
						onTimedKeyPress: () => this.hideErrorLabel()
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
						onTimedKeyPress: () => this.hideErrorLabel()
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
							value: "Cancel",
							click: () => this.cancelLogic()
						},
						{width: 20},
						{
							view: "button",
							css: "btn",
							width: 80,
							name: "loginButton",
							value: "Login",
							hotkey: "enter",
							click: () => this.loginButtonClick()
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
					{gravity: 0.001},
					{
						view: "button",
						type: "icon",
						css: "btn webix_transparent",
						icon: "fas fa-times",
						hotkey: "esc",
						width: 30,
						height: 30,
						align: "right",
						click: () => this.cancelLogic()
					},
					{width: 5}
				]
			},
			body: loginForm
		};

		return loginWindow;
	}

	init(view) {
		this.view = view;
		this.form = this.getRoot().queryView({view: "form"});
		webix.extend(this.view, webix.ProgressBar);
	}

	showLoginWindow() {
		this.getRoot().show();
	}

	getLoginTextView() {
		return this.getRoot().queryView({name: "username"});
	}

	getPasswordTextView() {
		return this.getRoot().queryView({name: "password"});
	}

	hideErrorLabel() {
		const loginValue = this.getLoginTextView().getValue();
		const passwordValue = this.getPasswordTextView().getValue();
		if (!loginValue && !passwordValue) {
			this.form.elements["error-label"].hide();
		}
	}

	loginButtonClick() {
		this.view.showProgress();
		if (this.form.validate()) {
			const app = this.app;
			let errorLabel = this.form.elements["error-label"];
			authService.login(this.form.getValues())
				.then(() => {
					if (authService.isAdmin()) {
						app.show(constants.APP_PATHS.TAGGER_ADMIN_DASHBOARD);
					}
					this.form.clear();
					errorLabel.hide();
					this.view.hideProgress();
					this.cancelLogic();
				})
				.fail((xhr) => {
					if (xhr.status === 401 || xhr.status === 500) {
						errorLabel.setValue("Login failed");
						errorLabel.show();

						this.form.markInvalid("username", "Enter correct username");
						this.form.markInvalid("password", "Enter correct password");
					}
					this.view.hideProgress();
				});
		}
		else {
			this.view.hideProgress();
		}
	}

	cancelLogic() {
		this.form.clearValidation();
		this.form.clear();
		this.getRoot().hide();
		this.form.elements["error-label"].hide();

		this.getLoginTextView().config.invalidMessage = "Enter username";
		this.getPasswordTextView().config.invalidMessage = "Enter password";
	}
}
