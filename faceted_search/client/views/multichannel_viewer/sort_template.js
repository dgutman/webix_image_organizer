define([
	"helpers/base_jet_view"
], function(BaseJetView) {
	'use strict';
	const SORT_TEMPLATE_ALPHA = "alpha-sort";
	const SORT_TEMPLATE_INDEX = "index-sort";

	const ASC = "asc";
	const DESC = "desc";

	return class SortTemplate extends BaseJetView {
		constructor(app) {
			super(app);

			this._list = null;
			this._sort = {
				type: "index",
				order: ASC
			};
		}

		get $ui() {
			return {
				height: 35,
				id: this._rootId,
				margin: 2,
				cols: [
					this._getSortTemplateConfig({
						id: SORT_TEMPLATE_ALPHA,
						type: "aplha",
						icon: "mdi-sort-alphabetical",
						sortField: "name",
						initOrder: DESC
					}),
					this._getSortTemplateConfig({
						id: SORT_TEMPLATE_INDEX,
						type: "index",
						icon: "mdi-sort-numeric",
						sortField: "index",
						sortFieldType: "int",
						initOrder: ASC
					}),
					{}
				]
			};
		}

		addListById(id) {
			this._list = webix.$$(id);
			this._list.attachEvent("onAfterSort", () => {
				this.$$(SORT_TEMPLATE_INDEX).refresh();
				this.$$(SORT_TEMPLATE_ALPHA).refresh();
			});
		}

		getList() {
			return this._list;
		}

		_getSortTemplateConfig(settings) {
			const {
				id,
				type,
				icon,
				sortField,
				sortFieldType = "string",
				initOrder
			} = settings;

			return {
				width: 35,
				borderless: true,
				css: "sort-icon-template",
				localId: id,
				template: () => {
					const isActive = this._sort.type === type ? "active" : "";
					return `<span class='${isActive} icon mdi ${icon}'></span>`;
				},
				data: {
					order: initOrder
				},
				autoheight: true,
				onClick: {
					icon: () => {
						const template = this.$$(id);
						const {order} = template.getValues();
						let newOrder = order;

						const isActive = this._sort.type === type;
						if (isActive) {
							newOrder = order === ASC ? DESC : ASC;
						}
						template.setValues({order: newOrder});
						this._sort = {type, order: newOrder};
						this.getList().sort(sortField, newOrder, sortFieldType);
					}
				}
			};
		}
	};
});
