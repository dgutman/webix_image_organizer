import dot from "dot-object";
import utils from "../utils/utils";
import constants from "../constants";

export default class FilterModel {
	constructor(itemsModel, richSelectDataviewFilter, richSelectTableFilter) {
		this.dataCollection = itemsModel.getDataCollection();
		this.finder = itemsModel.getFinderCollection();
		this.itemsModel = itemsModel;
		this.richSelectDataviewFilter = richSelectDataviewFilter;
		this.richSelectTableFilter = richSelectTableFilter;
		this.filters = {};
		this.modelType = "item";
		this.filtersArray = [];

		this.dataCollection.attachEvent("clear-filters", () => {
			this.clearFilters();
		});

		this.dataCollection.attachEvent("parseDataToCollection", (data, isFolderExists) => {
			this.prepareDataToFilter(data, isFolderExists);
		});

		this.dataCollection.data.attachEvent("onDataUpdate", (id) => {
			const item = this.dataCollection.getItem(id);
			const starColor = this.itemsModel.findStarColorForItem(item);
			const highlightedValues = this.itemsModel.findHighlightedValues(item);
			if (starColor && starColor !== item.starColor) {
				this.addFilterValue(`${starColor} star`);
				this.parseFilterToRichSelectList();
				item.starColor = starColor;
				item.highlightedValues = highlightedValues;
				this.itemsModel.dataview.render(item.id, item, "update");
			}
		});

		this.richSelectTableFilter.getList().sync(this.richSelectDataviewFilter.getList());
		this.richSelectTableFilter.bind(this.richSelectDataviewFilter);
	}

	prepareDataToFilter(dataArray, isChildFolderExists) {
		const oldValue = this.richSelectDataviewFilter.getValue("");
		this.richSelectDataviewFilter.blockEvent();
		this.richSelectDataviewFilter.setValue("");
		this.richSelectDataviewFilter.unblockEvent();
		this.clearFilterValues();

		if (isChildFolderExists) {
			this.addFilterValue("folders");
		}

		dataArray.forEach((item) => {
			const itemType = utils.searchForFileType(item);
			const itemStarColor = item.starColor;
			const itemWarningStatus = item.imageWarning;
			this.addFilterValue(itemType);
			if (itemStarColor) this.addFilterValue(`${itemStarColor} star`);
			if (itemWarningStatus) this.addFilterValue("warning");
			// if (item.hasOwnProperty("meta") && item.meta.hasOwnProperty("tag")) {
			// 	const tagsImageId = imagesTagsCollection.getLastId();
			// 	const tagsImage = imagesTagsCollection.getItem(tagsImageId);
			// 	item.meta.tag.forEach((tag) => {
			// 		for (let key in tag) {
			// 			if (Array.isArray(tag[key])) {
			// 				tag[key].forEach((tagId) => {
			// 					addFilterValue(getTagValue(tagsImage, tagId, key, "id", "value"));
			// 				});
			// 			} else {
			// 				const tagId = tag[key];
			// 				addFilterValue(getTagValue(tagsImage, tagId, key, "id", "value"));
			// 			}
			// 		}
			// 	});
			// }
		});
		this.clearFilterRichSelectList();
		this.addNoFiltersSelection();
		this.parseFilterToRichSelectList();
		const valueToSet = this.richSelectDataviewFilter.getList().getItem(oldValue) ? oldValue : "all";
		this.richSelectDataviewFilter.setValue(valueToSet);
	}

	parseFilterToRichSelectList() {
		this.richSelectDataviewFilter.getList().parse(this.filtersArray);
	}

	addFilterValue(filterValue) {
		if (!this.filtersArray.find(obj => obj === filterValue)) {
			this.filtersArray.push(filterValue);
		}
	}

	addNoFiltersSelection() {
		this.richSelectDataviewFilter.getList().parse({
			id: "all",
			value: "all"
		});
	}

	clearFilterValues() {
		this.filtersArray = [];
	}

	clearFilterRichSelectList() {
		this.richSelectDataviewFilter.getList().clearAll();
	}

	addFilter(name, value, type) {
		if (type === "star" || type === "itemType" || type === "warning" || type === "modelType") { // Types from one filter control
			delete this.filters.starColor;
			delete this.filters.itemType;
			delete this.filters.imageWarning;
			if (this.filters.hasOwnProperty("modelType")) {
				this.setItemsByModelType("item");
				delete this.filters.modelType;
			}
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

	setItemsByModelType(type) {
		if (this.modelType !== type) {
			const selectedItem = this.finder.getSelectedItem();
			if (selectedItem._modelType === "folder") {
				const parentFolderId = this.finder.getSelectedId();
				let itemsArray = parentFolderId
					? this.finder.data.getBranch(parentFolderId)
					: this.finder.data.serialize();
				if (itemsArray.length === 1
					&& itemsArray[0]._modelType === constants.SUB_FOLDER_MODEL_TYPE) {
					itemsArray = this.finder.data.getBranch(itemsArray[0].id);
				}
				const nestedItems = itemsArray.filter(obj => obj._modelType === type);
				this.dataCollection.clearAll();
				this.dataCollection.parse(nestedItems);
			}
			this.modelType = type;
		}
	}

	filterDataCollection() {
		const filterNames = Object.keys(this.filters);
		if (!filterNames.length) {
			this.dataCollection.filter();
		}
		else {
			if (this.filters.hasOwnProperty("modelType")) {
				this.setItemsByModelType("folder");
			}
			this.dataCollection.filter((item) => {
				const condition = filterNames.every((name) => {
					let doesItFit = false;
					const value = this.filters[name].value;
					const itemFiledValue = dot.pick(name, item) || this.returnString(dot.pick(name, item.meta)) || "";
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
						case "modelType": {
							doesItFit = true;
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

	returnString(val) {
		if (typeof val === "number" || typeof val === "boolean") {
			return val.toString();
		}
		return val;
	}
}
