import utils from "../utils/utils";
import dot from "dot-object";

export default class FilterModel {
	constructor(dataCollection) {
		this.dataCollection = dataCollection;
		this.filters = {};
	}

	addFilter(name, value, type) {
		if (type === "star" || type === "itemType" || type === "warning") { // Types from one filter control
			delete this.filters.starColor;
			delete this.filters.itemType;
			delete this.filters.imageWarning;
		}

		if (!value) {
			delete this.filters[name];
		}
		else {
			this.filters[name] = {value, type};
		}

		this.filterDataCollection();
		return this.filters[name];
	}

	filterDataCollection() {
		const filterNames = Object.keys(this.filters);
		if (!filterNames.length) {
			this.dataCollection.filter();
		}
		else {
			this.dataCollection.filter((item) => {
				const condition = filterNames.every((name) => {
					let doesItFit = false;
					const value = this.filters[name].value;
					const itemFiledValue = dot.pick(name, item) || dot.pick(name, item.meta) || "";
					switch (this.filters[name].type) {
						case "date": {
							const formatToSting = webix.Date.dateToStr("%m/%d/%y");
							const dateString = formatToSting(new Date(itemFiledValue));
							doesItFit = dateString.includes(value);
							break;
						}
						case "itemType": {
							const itemType = utils.searchForFileType(item);
							doesItFit = (value === "all" || itemType === value);
							break;
						}
						case "select": {
							if (value === "empty_value") {
								doesItFit = !itemFiledValue;
							}
							else {
								doesItFit = itemFiledValue.toString().toLowerCase() === value.toString().toLowerCase();
							}
							break;
						}
						case "warning": {
							doesItFit = itemFiledValue;
							break;
						}
						case "star": {
							doesItFit = itemFiledValue === value.substr(0, value.indexOf(" "));
							break;
						}
						default: {
							doesItFit = itemFiledValue.toString().toLowerCase().includes(value.toString().toLowerCase());
							break;
						}
					}
					return doesItFit;
				});
				return condition;
			});
		}
	}

	clearFilters() {
		this.filters = {};
		this.dataCollection.filter();
	}
}
