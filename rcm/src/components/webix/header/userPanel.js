import authService from "../../../services/authService";
import AuthWindow from "../auth/authWindow"
import { ui, $$ } from "webix";
import foldersModel from "../../../models/foldersModel";
import "../../../styles/userPanel.css";

const LOGOUT_PANEL_ID = "logout-panel-id";
const LOGIN_PANEL_ID = "login-panel-id";
const DROP_DOWN_ID = "images-drop-down-id";
const USER_INFO_TEMPLATE_ID = "user-info-template-id";
const OPTIONS_LIST_ID = "options-list-id";

const authWindow = new AuthWindow(LOGIN_PANEL_ID, LOGOUT_PANEL_ID, USER_INFO_TEMPLATE_ID);

const loginMenu = {
  view: "template",
  template: "<span class='menu-login login-menu-item'>Login</span>",
  css: "user-panel_login-menu",
  borderless: true,
  width: 150,
  onClick: {
    "menu-login": () => {
      // TODO: login
      const authWindowConfig = authWindow.getConfig();
      const authWindowView = ui(authWindowConfig);
      authWindowView.show();
    }
  }
};

const loginPanel = {
  view: "layout",
  id: LOGIN_PANEL_ID,
  css: "user-panel_login-menu",
  hidden: authService.isLoggedIn(),
  cols: [
    {gravity: 1},
    {
      rows: [
        {gravity: 0.8},
        loginMenu,
        {gravity: 0.8},
      ]
    }
  ]
};

const logo = {
  template: "RCM Viewer",
  css: "main-header-logo",
  borderless: true,
  width: 175
};

const DropDown = {
  view: "richselect",
  id: DROP_DOWN_ID,
  icon: "fas fa-chevron-down",
  css: "select-field ellipsis-text",
  width: 250,
  options: {
    template: "#name#",
    data: [],
    body: {
      view: "list",
      id: OPTIONS_LIST_ID,
      template: (obj) => {
        return `<span title='${foldersModel.getFolderName(obj)}'>${foldersModel.getFolderName(obj)}</span>`;
      },
      css: "ellipsis-text"
    }
  },
};

const userInfoTemplate = {
  view: "template",
  css: "user-panel_user-info",
  id: USER_INFO_TEMPLATE_ID,
  template(obj) {
    return `${obj.login || ""}`
  },
  on: {
    onBeforeRender: (data) => {
      if (!data.login) {
        const userInfo = authService.getUserInfo();
        const userInfoTemplateView = $$(USER_INFO_TEMPLATE_ID);
        userInfoTemplateView.parse(userInfo);
      }
    }
  }
};

const logoutMenu = {
  view: "template",
  template: "<span class='menu-logout logout-menu-item'>Logout </span><span class='fas fa-sign-out-alt'></span>",
  css: "user-panel_logout-menu",
  borderless: true,
  width: 150,
  onClick: {
    "menu-logout": () => {
      authService.logout();
      const loginPanel = $$(getLoginPanelID());
      const logoutPanel = $$(getLogoutPanelID());
      logoutPanel.hide();
      loginPanel.show();
    }
  },
  on: {
    
  }
};

const logoutPanel = {
  view: "layout",
  id: LOGOUT_PANEL_ID,
  hidden: !authService.isLoggedIn(),
  rows: [
    userInfoTemplate,
    logoutMenu,
  ]
};

const userPanel = {
  view: "layout",
  css: "user-panel",
  rows: [
    loginPanel,
    logoutPanel
  ]
};

function getUI() {
  return {
    view: "layout",
    css: "header",
    height: 60,
    cols: [
      {width: 20},
      logo,
      {width: 20},
      {
        rows: [
          {gravity: 0.01},
          DropDown,
          {gravity: 0.01},
        ]
      },
      {gravity: 1},
      userPanel,
    ]
  }
}

function getLoginPanelID() {
  return LOGIN_PANEL_ID;
}

function getLogoutPanelID() {
  return LOGOUT_PANEL_ID;
}

function getDropDownID() {
  return DROP_DOWN_ID;
}

function getDropDown() {
  return $$(getDropDownID())
}

function getUserInfoTemplateID() {
  return USER_INFO_TEMPLATE_ID;
}

/** @returns {webix.ui.list} */
function getOptionsList() {
  return $$(OPTIONS_LIST_ID)
}

function updateOptions(folders) {
  const optionsList = getOptionsList();
  optionsList.clearAll();
  optionsList.parse(folders);
}

const module = {
  getUI,
  getLoginPanelID,
  getLogoutPanelID,
  getDropDownID,
  getDropDown,
  getUserInfoTemplateID,
  updateOptions,
  getOptionsList,
}

export default module;
