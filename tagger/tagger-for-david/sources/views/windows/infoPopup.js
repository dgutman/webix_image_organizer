import {JetView} from "webix-jet";

const SCROLLVIEW_MIN_HEIGHT = 160;

export default class InfoPopup extends JetView {
	constructor(app, name, header) {
		super(app, name);
		this.header = header;
	}

	config() {
		const infoPopup = {
			view: "window",
			css: "tagger-info-popup",
			width: 370,
			move: true,
			head: {
				cols: [
					{
						template: this.header,
						css: "main-subtitle2",
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						icon: "fas fa-times",
						width: 30,
						height: 30,
						click: () => this.closeWindow()
					}
				]
			},
			body: {
				view: "template",
				height: SCROLLVIEW_MIN_HEIGHT,
				css: "tagger-info-help",
				template: (obj) => {
					const helpTemplate = obj.help ? `<div class='info-help-content'>${obj.help}</div>` : "";
					return helpTemplate;
				},
				borderless: true
			}
		};
		return infoPopup;
	}

	getInfoPopup() {
		return this.getRoot();
	}

	showWindow(iconNode, posObj, info) {
		this.posSettings = {
			pos: posObj,
			node: iconNode
		};

		this._wasMoved = false;

		this.eventId = this.getRoot().attachEvent("onViewMove", () => {
			this._wasMoved = true;
			this.getRoot().detachEvent(this.eventId);
			this.eventId = null;
		});

		const template = this.getRoot().queryView({view: "template"});
		const templateNode = template.getNode();
		this.getRoot().show(iconNode, posObj);
		templateNode.style.overflow = "hidden";
		requestAnimationFrame(() => {
			templateNode.style.overflow = "auto";
		});
		this.setNewData(info);
	}

	setNewData(obj) {
		const template = this.getRoot().queryView({view: "template"});
		template.setValues(obj);

		const templateNode = template.getNode().querySelector(".info-help-content");

		template.define("height", Math.min(templateNode.offsetHeight + 15, SCROLLVIEW_MIN_HEIGHT));
		template.resize();
	}

	isVisible() {
		return this.getRoot().isVisible();
	}

	closeWindow() {
		this.getRoot().hide();
		if (this.eventId) {
			this.getRoot().detachEvent(this.eventId);
		}
	}

	setInitPosition() {
		if (!this._wasMoved && this.isVisible()) {
			const {pos, node} = this.posSettings;
			this.getRoot().show(node, pos);
		}
	}
}
