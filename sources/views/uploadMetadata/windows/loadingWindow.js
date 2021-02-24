import {JetView} from "webix-jet";
import "../../components/progressTemplate";
import state from "../../../models/state";

const WIDTH = 600;

export default class LoadingWindow extends JetView {
	config() {
		const closeButton = {
			view: "button",
			css: "btn-contour",
			name: "closeButton",
			value: "Close",
			hotkey: "esc",
			height: 30,
			width: 100,
			click: () => this.closeWindow()
		};

		const countTemplate = {
			name: "countTemplate",
			css: "uploading-progress-template",
			autoheight: true,
			template: (obj) => {
				if (obj && obj.hasOwnProperty("accepted")) {
					return `<span class='text'>Updated <b class='strong-font'>${obj.accepted}</b> out of <b class='strong-font'>${obj.valid}</b> items</span>`;
				}
				return "";
			},
			borderless: true
		};

		const progressTemplate = {
			view: "progress-template",
			name: "progressTemplate",
			autoheight: true,
			borderless: true
		};

		const window = {
			view: "window",
			css: "metadata-uploading-window",
			paddingX: 35,
			width: WIDTH,
			modal: true,
			position: "center",
			type: "clean",
			head: {
				cols: [
					{
						view: "template",
						css: "edit-window-header",
						name: "headerTemplateName",
						template: () => "Metadata updating...",
						borderless: true
					}
				]
			},
			body: {
				paddingX: 10,
				rows: [
					{
						align: "center,middle",
						rows: [
							progressTemplate,
							countTemplate
						]
					},
					{
						cols: [
							{height: 30},
							closeButton
						]
					},
					{height: 10}
				]
			}
		};

		return window;
	}

	ready(view) {
		this.countTemplate = this.getRoot().queryView({name: "countTemplate"});
		this.progressTemplate = this.getRoot().queryView({name: "progressTemplate"});
	}

	set progressInfo(values) {
		this.countTemplate.setValues(values);
		this.progressTemplate.define("maxRange", values.valid || 1);
		this.progressTemplate.setValue(values.accepted || 0);
	}

	get progressInfo() {
		return this.countTemplate.getValues();
	}

	showWindow(values) {
		this.progressTemplate.define("error", false);
		state.unsavedData = true;
		this.progressInfo = values || {};
		const closeButton = this.getRoot().queryView({name: "closeButton"});
		closeButton.hide();
		this.getRoot().show();
	}

	errorOccurred() {
		this.progressTemplate.define("error", true);
		this.progressTemplate.refresh();
	}

	loadingEnded() {
		state.unsavedData = false;
		const closeButton = this.getRoot().queryView({name: "closeButton"});
		closeButton.show();
	}

	closeWindow() {
		this.progressTemplate.define("error", false);
		this.loadingEnded();
		this.countTemplate.setValues({});
		this.getRoot().hide();
	}
}
