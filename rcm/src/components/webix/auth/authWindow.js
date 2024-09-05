import * as webix from "webix";
import 'webix/webix.css';
import authService from "../../../services/authService";
import "../components/passwordInput";

export default class AuthWindow {
  constructor(loginPanel, logoutPanel, userInfoTemplate) {
    this.formID = webix.uid();
    this.windowID = webix.uid();
    this.usernameID = webix.uid();
    this.passwordID = webix.uid();
    this._loginPanel = loginPanel;
    this._logoutPanel = logoutPanel;
    this._userInfoTemplate = userInfoTemplate;
  }

  getConfig() {
    const loginForm = {
      view: "form",
      id: this.formID,
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
    const win = webix.$$(this.windowID);
    if (win) {
      win.show();
    }
  }

  getLoginTextView() {
    return webix.$$(this.usernameID)
  }

  getPasswordTextView() {
    return webix.$$(this.passwordID);
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
    return webix.$$(this.formID);
  }

  getWindow() {
    return webix.$$(this.windowID);
  }

  async loginButtonClick() {
    const view = this.getWindow();
    const form = this.getForm();
    if (view && !view.showProgress) {
      webix.extend(view, webix.ProgressBar);
    }
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
        view?.hideProgress();
        if (authService.isLoggedIn()) {
          this._loginPanel.hide();
          this._logoutPanel.show();
          const userInfo = authService.getUserInfo();
          this._userInfoTemplate.parse(userInfo);
        }
      };
    }
    else {
      view.hideProgress();
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

  // export default function LoginWindowView() {
  //   <Webix ui={getUI()} />
  // }
}
