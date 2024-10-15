import { uid, rules, $$, extend, ProgressBar } from "webix";
import 'webix/webix.css';
import authService from "../../../services/authService";
import "../components/passwordInput";

export default class AuthWindow {
  constructor(loginPanelID, logoutPanelID, userInfoTemplateID) {
    this.formID = uid();
    this.windowID = uid();
    this.usernameID = uid();
    this.passwordID = uid();
    this._loginPanelID = loginPanelID;
    this._logoutPanelID = logoutPanelID;
    this._userInfoTemplateID = userInfoTemplateID;
  }

  getConfig() {
    const loginForm = {
      view: "form",
      id: this.formID,
      width: 600,
      rules: {
        username: rules.isNotEmpty,
        password: rules.isNotEmpty
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
          id: this.usernameID,
          css: "search-field",
          name: "username",
          label: "Login or email",
          placeholder: "Enter login or email",
          invalidMessage: "Enter login or email",
          on: {
            onTimedKeyPress: () => this.hideErrorLabel()
          }
        },
        {
          view: "passwordInput",
          id: this.passwordID,
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
      id: this.windowID,
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
            icon: "far fa-times-circle",
            width: 30,
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


  showLoginWindow() {
    const win = $$(this.windowID);
    if (win) {
      win.show();
    }
  }

  getLoginTextView() {
    return $$(this.usernameID)
  }

  getPasswordTextView() {
    return $$(this.passwordID);
  }

  getLoginPanel() {
    return $$(this._loginPanelID);
  }

  getLogoutPanel() {
    return $$(this._logoutPanelID);
  }

  getUserInfoTemplate() {
    return $$(this._userInfoTemplateID)
  }

  getLoginPanel() {
    return webix.$$(this._loginPanelID);
  }

  getLogoutPanel() {
    return webix.$$(this._logoutPanelID);
  }

  getUserInfoTemplate() {
    return webix.$$(this._userInfoTemplateID)
  }

  hideErrorLabel() {
    const loginValue = this.getLoginTextView().getValue();
    const passwordValue = this.getPasswordTextView().getValue();
    const form = this.getForm();
    if (!loginValue && !passwordValue) {
      form?.elements["error-label"].hide();
    }
  }

  getForm() {
    return $$(this.formID);
  }

  getWindow() {
    return $$(this.windowID);
  }

  async loginButtonClick() {
    const view = this.getWindow();
    const form = this.getForm();
    if (view && !view.showProgress) {
      extend(view, ProgressBar);
      view?.showProgress();
      if (form.validate()) {
        try {
          await authService.login(form.getValues())
          form.clear();
          form.elements["error-label"].hide();
          this.cancelLogic();
        }
        catch(error) {
          console.error(error);
        }
        finally {
          if (view?.isVisible()) {
            view?.hideProgress();
          }
          if (authService.isLoggedIn()) {
            const loginPanel = this.getLoginPanel();
            loginPanel?.hide();
            const logoutPanel = this.getLogoutPanel();
            logoutPanel.show();
            const userInfo = authService.getUserInfo();
            const userInfoTemplate = this.getUserInfoTemplate();
            userInfoTemplate.parse(userInfo);
          }
        };
      }
      else {
        view?.hideProgress();
      }
    }
  }

  cancelLogic() {
    const form = this.getForm();
    const win = this.getWindow();
    form?.clearValidation();
    form?.clear();
    win?.close();
    form?.elements["error-label"].hide();
  }
}
