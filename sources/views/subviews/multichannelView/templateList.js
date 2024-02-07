import {JetView} from "webix-jet";

const LIST_ID = `templates-list-${webix.uid()}`;
const FORM_ID = `template-edit-form-${webix.uid()}`

export default class TemplateList extends JetView {
	constructor(app) {
		super(app);
	}

	config() {
		const templateList = {
			view: "list",
			localId: LIST_ID,
			css: "groups-list",
			scroll: "auto",
			navigation: false,
			select: true,
			template: (obj) => {
				const savedIcon = obj?.saved ? "fas fa-save" : "";
				return `<span class="group-item__name name ellipsis-text">${obj?.name}</span>
				<div class="icons">
					<span title="saved" class="icon ${savedIcon}"></span>
					<span title="apply template" class="icon apply fas fa-check"></span>
					<span title="delete template" class="icon delete fas fa-minus-circle"></span>
				</div>`;
			},
			onClick: {
				delete: (ev, id) => {
					this.getList().callEvent("removeTemplate", [id]);
				},
				apply: (ev, id) => {
					this.getList().callEvent("applyTemplate", [id]);
				}
			}
		};
		const templateEditForm = {
			view: "form",
			id: FORM_ID,
			elements: [
				{view: "text", name: "name", label: "Name"},
				{
					cols: [
						{view: "button", label: "Save name", click: this.saveName},
						{view: "button", label: "Clear name", click() { webix.$$(FORM_ID).clear(); }}
					]
				}
			],
			rules: {
				name: webix.rules.isNotEmpty
			}
		};
		return {
			...this._config,
			rows: [
				{
					template: "Templates",
					height: 30
				},
				templateList,
				templateEditForm
			]
		};
	}

	// init(view) {
	// 	webix.extend(view, webix.OverlayBox);
	// }

	ready() {
		const form = this.getForm();
		const list = this.getList();
		form.bind(list);
	}

	getList() {
		return this.$$(LIST_ID);
	}

	getForm() {
		return this.$$(FORM_ID);
	}

	saveName() {
		const form = $$(FORM_ID);
		if (form.isDirty()) {
			if (!form.validate()) {
				return false;
			}
			form.save();
		}
	}
}
