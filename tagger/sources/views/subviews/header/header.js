import {JetView} from "webix-jet";
import HeaderService from "../../../services/header/header";
import undoFactory from "../../../models/undoModel";
import constants from "../../../constants";
import UserPanel from "./parts/userPanel";
import auth from "../../../services/authentication";

const serverListData = process.env.SERVER_LIST;

export default class TaggerHeaderClass extends JetView {
	config() {
		const backButton = {
			view: "button",
			name: "backButton",
			hidden: true,
			css: "btn webix_transparent",
			label: "Back",
			type: "icon",
			icon: "fas fa-arrow-left",
			inputWidth: 90,
			height: 30,
			width: 90,
			click: () => {
				this.app.callEvent("BackButtonClick");
			}
		};

		const undoIcon = {
			view: "icon",
			hidden: true,
			css: "btn undo-btn disabled",
			name: "taggerUndoIcon",
			icon: "fas fa-undo-alt",
			tooltip: "Undo last action",
			width: 40,
			on: {
				onItemClick: () => { this.undoModel.undoLastAction(); }
			}
		};

		const headerLogo = {
			template: "Tagger - Tags manager",
			css: "main-header-logo",
			width: 250,
			borderless: true
		};

		const headerAdmin = {
			template: auth.isAdmin() ? "<a><span class='webix_icon wxi-angle-left'></span> Back to Admin Mode</a>" : "",
			name: "headerAdmin",
			css: "main-header-admin main-header-logo",
			width: auth.isAdmin() ? 200 : 10,
			borderless: true
		};

		const hostDropDownBox = {
			view: "richselect",
			icon: "fas fa-chevron-down",
			name: "hostBox",
			height: 40,
			css: "select-field ellipsis-text",
			label: "Hosts",
			labelWidth: 70,
			width: 300,
			options: {
				template: "#value#",
				data: serverListData
			}
		};

		const taskNameTemplate = {
			name: "taggerTaskName",
			borderless: true,
			hidden: true,
			template: obj => (obj.name ? `<div class='task-name-template'>${obj.name}</div>` : "")
		};

		const ui = {
			height: constants.HEADER_HEIGHT,
			css: "main-header",
			cols: [
				headerAdmin,
				backButton,
				undoIcon,
				{width: 50},
				headerLogo,
				{},
				taskNameTemplate,
				{width: 20},
				{
					rows: [
						{},
						hostDropDownBox,
						{}
					]
				},
				{width: 50},
				{$subview: UserPanel, name: "userPanel"}
			]
		};

		return {
			css: "global-header",
			cols: [
				{width: 50},
				ui,
				{width: 50}
			]
		};
	}

	ready(view) {
		this.loginWindow = this.getLoginWindow();
		this.hostBox = this.getHostBox();
		const undoIcon = this.getUndoButton();
		this.headerService = new HeaderService(view, this.loginWindow);

		this.undoModel = undoFactory.create("main", undoIcon);

		this.on(this.app, "toggleVisibilityOfBackButton", (show) => {
			const button = this.getBackButton();
			if (show) {
				button.show();
			}
			else {
				button.hide();
			}
		});

		if ( auth.isAdmin()) {
			document.querySelector(".main-header-admin a").onclick = () => this.app.show(constants.APP_PATHS.TAGGER_ADMIN_DASHBOARD);
		}
	}

	getHostBox() {
		return this.getRoot().queryView({name: "hostBox"});
	}

	getLogoutPanel() {
		return this.getSubView("userPanel").getLogoutPanel();
	}

	getLogoutMenu() {
		return this.getSubView("userPanel").getLogoutMenu();
	}

	getLoginPanel() {
		return this.getSubView("userPanel").getLoginPanel();
	}

	getLoginWindow() {
		return this.getSubView("userPanel").getLoginWindow();
	}

	getUndoButton() {
		return this.getRoot().queryView({name: "taggerUndoIcon"});
	}

	getTaskNameTemplate() {
		return this.getRoot().queryView({name: "taggerTaskName"});
	}

	getBackButton() {
		return this.getRoot().queryView({name: "backButton"});
	}

	getHeaderAdmin() {
		return this.getRoot().queryView({name: "headerAdmin"});
	}
}
