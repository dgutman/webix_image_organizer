import {JetView} from "webix-jet";

const ID_FORM = `items-form-id-${webix.uid()}`;
const ID_LIST = `list-id-${webix.uid()}`;

export default class Items extends JetView {
	constructor(app, config = {}) {
		super(app, config);
	}

	config() {
		return {
			rows: [
				{
					id: ID_FORM,
					view: "form",
					elements: [
						{view: "label", label: "Items", height: 30},
						{
							height: 30,
							cols: [
								{view: "text", name: "layerName", label: "Name"},
								{view: "button", type: "form", click: this.saveForm, label: "+", width: 24, height: 24}
							]
						},
						// {
						// 	view: "button",
						// 	label: "Save",
						// 	type: "form",
						// 	click: this.saveForm
						// },
						// {
						// 	view: "button",
						// 	label: "Clear",
						// 	click: this.clearForm
						// }
					],
					rules: {
						itemName: webix.rules.isNotEmpty,
					}
				},
				{
					view: "list",
					id: ID_LIST,
					template: "<div style='padding-left:18px'> #layerName#</div>",
					type: {
						height: 30
					},
					select: true,
					autowidth: true,
					autoheight: true,
				},
				{gravity: 1}
			]
		};
	}

	init() {}

	ready(view) {
		this._view = view;
	}

	saveForm() {
		const form = this.$scope.getForm();
		if (form.isDirty()) {
			if (!form.validate()) {
				return;
			}
			form.save();
		}
	}

	clearForm() {
		const form = this.getForm();
		form.clear();
	}

	getForm() {
		return this.getRoot().queryView({id: ID_FORM});
	}
}
