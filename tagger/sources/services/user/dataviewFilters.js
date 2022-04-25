import auth from "../authentication";
import constants from "../../constants";

export default class DataviewFilters {
	constructor(dataview, filtersTree, selectFiltersTemplate, filtersAccordionItem) {
		this.dataview = dataview;
		this.filtersTree = filtersTree;
		this.selectFiltersTemplate = selectFiltersTemplate;
		this.filtersAccordionItem = filtersAccordionItem;
		this.enabled = false;
		this.currentTaskId = null;
		this.init();
	}

	init() {
		const tree = this.filtersTree;
		this.filtersTree.attachEvent("onItemClick", (id) => {
			const item = tree.getItem(id);
			const branch = item.$parent;
			if (tree.isSelected(id)) {
				if (item.$count) {
					const childs = tree.find(obj => obj.$parent === item.id);
					childs.forEach(child => tree.unselect(child.id));
				}
				tree.unselect(id);
			} else {
				if (branch && !tree.isSelected(branch)) {
					tree.select(branch, true);
				}
				if (tree.isBranch(id)) {
					const childs = tree.find(obj => obj.$parent === item.id);
					childs.forEach(child => tree.select(child.id, true));
				} 
				tree.select(id, true);
			} 		
			if (branch && tree.isSelected(branch) && !tree.isSelected(id)) {
					const childs = tree.find(obj => obj.$parent === branch);
					const selected = childs.find(item => tree.isSelected(item.id))
					if(!selected) tree.unselect(branch);
			}
		});

		this.selectFiltersTemplate.define("onClick", {
			"select-all": () => {
				tree.openAll();
				tree.selectAll();
			},
			"unselect-all": () => {
				tree.unselectAll();
			}
		});
	}

	parseFiltersToTree(tags, taskId) {
		this.enabled = false;
		this.filtersTree.clearAll();
		this.currentTaskId = taskId;

		const filters = tags.map((tag) => {
			tag.data = tag.values;
			tag.data.unshift({name: constants.TAGGER_NO_VALUE_FILTER, _id: `${tag.name}_no_value`});
			delete tag.values;
			return tag;
		});
		this.filtersTree.parse(filters);
	}

	applyFilters() {
		const filters = this.filtersTree.getSelectedItem(true);
		this.filtersAccordionItem.define("header", `Filters (${filters.length})`);
		this.filtersAccordionItem.refresh();
		this.setSelectedFiltersToSessionStorage(filters);
		this.enabled = !!filters.length;
	}

	getSelectedFilters() {
		const selected = this.getSelectedFiltersFromSessionStorage() || [];
		return selected.reduce((result, item) => {
			if (item.$parent) {
				const parent = this.filtersTree.getItem(item.$parent);
				result[parent.name] = result[parent.name] || [];
				result[parent.name].push({value: item.name});
			}
			else {
				result[item.name] = [];
			}
			return result;
		}, {});
	}

	setSelectedFiltersToSessionStorage(filters) {
		const ids = filters.map(filter => filter._id);
		if (ids.length) {
			webix.storage.session.put(`taggerFiltersState-${this.currentTaskId}-${auth.getUserId()}`, ids);
		}
		else {
			webix.storage.session.remove(`taggerFiltersState-${this.currentTaskId}-${auth.getUserId()}`);
		}
	}

	getSelectedFiltersFromSessionStorage() {
		const ids = webix.storage.session.get(`taggerFiltersState-${this.currentTaskId}-${auth.getUserId()}`);
		if (ids) {
			const existedFilters = ids
				.map(id => this.filtersTree.find(filter => filter._id === id, true))
				.filter(filterItem => filterItem);
			return existedFilters;
		}
		return [];
	}

	setInitialFiltersState() {
		const initFilters = this.getSelectedFiltersFromSessionStorage();
		this.filtersTree.select(initFilters.map(filter => filter.id));
		this.applyFilters();
	}
}

