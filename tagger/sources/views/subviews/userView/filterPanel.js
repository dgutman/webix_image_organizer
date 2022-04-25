import {JetView} from "webix-jet";

const DEVIATION_FILTER_DROP_DOWN = "deviation-filter";

export default class TaggerFilterPanel extends JetView {
	config() {
		const deviationFilterDropDown = {
			view: "richselect",
			css: "select-field",
			localId: DEVIATION_FILTER_DROP_DOWN,
			value: "all",
			options: [
				{id: "all", value: "Show all"},
				{id: "deviations", value: "Show deviations"}
			]
		};

		const selectAllFiltersTemplate = {
			name: "selectAllFiltersTemplate",
			height: 50,
			css: "select-dataview-filters-template",
			template: () => "<div><a class='select-all'>Select all</a></div> <div><a class='unselect-all'>Unselect all</a></div>",
			borderless: true
		};

		const filtersTree = {
			view: "tree",
			name: "filtersTree",
			type: "lineTree",
			scroll: "auto",
			css: "dataview-filters-tree",
			template: (obj, common) => {
				const tree = this.getFiltersTree();
				const checkboxState = tree.isSelected(obj.id) ? "checked fas fa-check-square" : "unchecked far fa-square";
				return `<span onmousedown='return false' onselectstart='return false'>${common.icon(obj, common)} <i class='tree-checkbox ${checkboxState}'></i> <span>${obj.name}</span></span>`;
			}
		};

		const applyFiltersBtn = {
			view: "button",
			css: "btn",
			width: 80,
			name: "applyFiltersBtn",
			value: "Apply"
		};

		const ui = {
			css: "tagger-filters-accordion-item-body",
			padding: 1,
			rows: [
				{
					type: "section",
					template: "Icons"
				},
				deviationFilterDropDown,
				{
					type: "section",
					template: "Images"
				},
				selectAllFiltersTemplate,
				filtersTree,
				{
					padding: 15,
					height: 70,
					cols: [
						{},
						applyFiltersBtn
					]
				}
			]
		};

		return ui;
	}

	getDeviationFilterDropdown() {
		return this.$$(DEVIATION_FILTER_DROP_DOWN);
	}

	getFiltersTree() {
		return this.getRoot().queryView({name: "filtersTree"});
	}

	getSelectAllFiltersTemplate() {
		return this.getRoot().queryView({name: "selectAllFiltersTemplate"});
	}

	getApplyFiltersButton() {
		return this.getRoot().queryView({name: "applyFiltersBtn"});
	}
}
