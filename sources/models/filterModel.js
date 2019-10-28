import utils from "../utils/utils";

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
					switch (this.filters[name].type) {
						case "date": {
							const formatToSting = webix.Date.dateToStr("%m/%d/%y");
							const dateString = formatToSting(new Date(item[name]));
							doesItFit = dateString.includes(value);
							break;
						}
						case "itemType": {
							const itemType = utils.searchForFileType(item);
							doesItFit = (value === "all" || itemType === value);
							break;
						}
						case "select": {
							doesItFit = item[name].toLowerCase() === value.toLowerCase();
							break;
						}
						case "warning": {
							doesItFit = item[name];
							break;
						}
						case "star": {
							doesItFit = item[name] === value.substr(0, value.indexOf(" "));
							break;
						}
						default: {
							doesItFit = item[name].toLowerCase().includes(value.toLowerCase());
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
