define([
	"helpers/base_jet_view"
], function(
	BaseJetView
) {
	'use strict';
	// const LIST_ID = `templates-list-${webix.uid()}`;
	const FORM_ID = `template-edit-form-${webix.uid()}`;

	return class TemplateList extends BaseJetView {
		constructor(app) {
			super(app);
			this.$oninit = () => {
				const form = this.getForm();
				const list = this.getList();
				form.bind(list);
			};
		}

		get $ui() {
			const templateList = {
				view: "list",
				// localId: LIST_ID,
				id: this._rootId,
				css: "groups-list",
				scroll: "auto",
				navigation: false,
				select: true,
				template: (obj) => {
					const savedIcon = obj?.saved ? "mdi mdi-content-save" : "";
					return `<span class="group-item__name name ellipsis-text">${obj?.name}</span>
					<div class="icons">
						<span title="saved" class="icon ${savedIcon}"></span>
						<span title="apply template" class="icon apply mdi mdi-check"></span>
						<span title="delete template" class="icon delete mdi mdi-minus-circle"></span>
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
							{view: "button", label: "Save", click: this.saveName},
							{view: "button", label: "Clear", click: function() {
webix.$$(FORM_ID).clear();
}}
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

		getList() {
			// return this.$$(LIST_ID);
			return this.getRoot();
		}
	
		getForm() {
			return this.$$(FORM_ID);
		}
	
		saveName() {
			const form = $$(FORM_ID);
			if(form.isDirty()) {
				if(!form.validate()) {
					return false;
				}
				form.save();
			}
		}
	};
});
