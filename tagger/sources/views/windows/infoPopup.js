import {JetView} from "webix-jet";
import JSONFormatter from "json-formatter-js";

const SCROLLVIEW_MIN_HEIGHT = 160;

export default class InfoPopup extends JetView {
	constructor(app, name, header, isJSONViewer) {
		super(app, name);
		this.header = header;
		this.isJSONViewer = isJSONViewer;
	}

	config() {
		const infoPopup = {
			view: "window",
			css: "tagger-info-popup tagger-window",
			width: 370,
			move: true,
			head: {
				cols: [
					{
						template: obj => `<span webix_tooltip='${obj.header}'>${obj.header}</span>`,
						name: "header",
						data: {header: this.header},
						css: "main-subtitle2 ellipsis-text",
						borderless: true
					},
					{
						view: "button",
						type: "icon",
						css: "btn webix_transparent",
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
					const helpTemplate = `<div class='info-help-content'>${obj.help || ""}</div>`;
					return helpTemplate;
				},
				borderless: true
			}
		};
		return infoPopup;
	}

	ready() {
		const header = this.getRoot().queryView({name: "header"});
		const template = this.getRoot().queryView({view: "template"});
		webix.TooltipControl.addTooltip(template.$view);
		webix.TooltipControl.addTooltip(header.$view);
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
		templateNode.style.overflow = "auto";

		if (this.isJSONViewer) {
			template.setValues(info);
			this.createJSONViewer(info);
		}
		else {
			this.setNewData(info);
		}
	}

	setNewData(obj) {
		const template = this.getRoot().queryView({view: "template"});
		template.setValues(obj);

		const templateNode = template.getNode().querySelector(".info-help-content");

		template.define("height", Math.min(templateNode.offsetHeight + 15, SCROLLVIEW_MIN_HEIGHT));
		template.resize();
	}

	createJSONViewer(item) {
		const header = this.getRoot().queryView({name: "header"});
		header.setValues({header: item.name});

		const metadata = JSON.parse(JSON.stringify(item.meta || {}));
		const template = this.getRoot().queryView({view: "template"});
		template.refresh();
		const templateNode = template.getNode().querySelector(".info-help-content");
		const formatter = new JSONFormatter(metadata);
		templateNode.appendChild(formatter.render());
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
			let {pos, node} = this.posSettings;
			if (this.isJSONViewer) {
				this.closeWindow();
			}
			else {
				this.getRoot().show(node, pos);
			}
		}
	}
}
