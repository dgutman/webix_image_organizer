import dot from "dot-object";
import projectMetadata from "./projectMetadata";
import constants from "../constants";

const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
const wrongMetadataCollection = projectMetadata.getWrongMetadataCollection();

const subFolderType = constants.SUB_FOLDER_MODEL_TYPE;

export default class ItemsModel {
	constructor(finder, dataview, table) {
		if (!ItemsModel.instance) {
			this.finderCollection = finder;
			this.dataCollection = new webix.DataCollection();
			this.customFinderDataPull = {};
			this.dataview = dataview;
			this.table = table;
			this.selectedItem = null;

			ItemsModel.instance = this;
		}
		return ItemsModel.instance;
	}

	static getInstanceModel() {
		return ItemsModel.instance;
	}

	parseItems(dataArray, parentId) {
		const finderDataPull = {};
		dataArray.forEach((item) => {
			const id = webix.uid();
			item.id = id;
			finderDataPull[item._id] = item;
		});

		if (parentId) {
			this.parseItemsToFolder(dataArray, parentId);
		}
		else {
			this.finderCollection.parse(dataArray);
		}

		Object.assign(this.customFinderDataPull, finderDataPull);
	}

	parseItemsToFolder(dataArray, parentId) {
		let branch = this.finderCollection.data.getBranch(parentId) || [];
		const parent = this.findItem(parentId);
		const count = this.getFolderCount(parent) + dataArray.length;
		let items = dataArray;
		if (count >= constants.FOLDER_MAX_SHOWED_ITEMS && !parent._showMany) {
			if (branch.length === 1 && branch[0]._modelType === subFolderType) {
				parentId = branch[0].id;
			}
			else {
				this.finderCollection.callEvent("putItemsToSubFolder");
				this.finderCollection.blockEvent();
				this.finderCollection.close(parentId);
				branch.forEach(item => this.removeItem(item.id));
				this.finderCollection.unblockEvent();

				items = [{
					_modelType: subFolderType,
					data: branch.concat(dataArray),
					name: "&lt;items&gt;"
				}];
			}
		}
		this.finderCollection.parse({data: items, parent: parentId});
		this.finderCollection.blockEvent();
		this.finderCollection.open(parent.id);
		this.finderCollection.unblockEvent();
	}

	openSubFolder(id) {
		const subFolder = this.findItem(id);
		const parent = this.findItem(subFolder.$parent);
		const branch = this.finderCollection.data.getBranch(id);
		parent._showMany = true;
		this.removeItem(id);
		this.parseItems(branch, parent.id);
	}

	addItem(item) {
		const id = webix.uid();
		item.id = id;
		this.finderCollection.add(item);
		this.customFinderDataPull[item._id] = item;
	}

	updateItems(items) {
		if (!Array.isArray(items)) {
			items = [items];
		}
		items.forEach((updatedItem) => {
			const foundedItemInFinder = this.customFinderDataPull[updatedItem._id];
			const foundedItemInDataCollection = this.dataCollection.find(item => item._id === updatedItem._id, true);
			if (foundedItemInFinder) {
				this.finderCollection.updateItem(foundedItemInFinder.id, updatedItem);
			}
			if (foundedItemInDataCollection) {
				this.dataCollection.updateItem(foundedItemInDataCollection.id, updatedItem);
			}
		});
	}

	removeItem(id, baseId) {
		let item = null;
		if (id) {
			item = this.finderCollection.getItem(id);
			delete this.customFinderDataPull[item._id];
			this.finderCollection.remove(id);
		}
		else if (baseId) {
			item = this.customFinderDataPull[baseId];
			this.finderCollection.remove(item.id);
			delete this.customFinderDataPull[baseId];
		}
	}

	findItem(id, baseId) {
		let item = null;
		if (id) {
			item = this.finderCollection.getItem(id);
		}
		else if (baseId) {
			item = this.customFinderDataPull[baseId];
		}
		return item;
	}

	clearAll() {
		this.finderCollection.clearAll();
		this.customFinderDataPull = {};
	}

	parseToDataCollection(data) {
		this.dataCollection.parse(webix.copy(data));
	}

	getFinderCollection() {
		return this.finderCollection;
	}

	getDataCollection() {
		return this.dataCollection;
	}

	parseDataToViews(data, linearData, folderId, isChildFolderExists) {
		if (this.selectedItem && folderId === this.selectedItem.id) {
			const dataview = this.dataview;
			const pager = dataview.getPager();

			if (!pager.isVisible() && dataview.isVisible()) {
				pager.show();
			}
			if (!linearData) {
				this.dataCollection.clearAll();
			}

			if (!Array.isArray(data)) {
				data = [data];
			}

			data.forEach((item) => {
				item.starColor = this.findStarColorForItem(item);
				item.highlightedValues = this.findHighlightedValues(item);
			});

			this.dataCollection.parse(data);
			dataview.refresh();
			let dataForFilter = data;
			if (linearData) {
				dataForFilter = this.dataCollection.data.serialize();
			}

			this.dataCollection.callEvent("parseDataToCollection", [dataForFilter, isChildFolderExists]);
		}
	}

	findStarColorForItem(item) {
		let hasFoundMissingKey = false;
		let hasFoundIncorrectKey = false;
		let starColor;

		if (item.hasOwnProperty("meta") && projectMetadataCollection.count() !== 0) {
			const projectSchemaItem = projectMetadataCollection.getItem(projectMetadataCollection.getLastId());
			const projectSchema = projectSchemaItem.meta.schema || projectSchemaItem.meta.ProjectSchema || projectSchemaItem.meta.projectSchema || {};

			const schemaKeys = Object.keys(projectSchema);

			schemaKeys.forEach((key) => {
				const metadataValue = dot.pick(`meta.${key}`, item);

				if (metadataValue !== undefined) {
					const correctValue = projectSchema[key].find(value => metadataValue === value);
					const wrongMetadataItem = wrongMetadataCollection.getItem(item._id);

					if (!correctValue) {
						if (wrongMetadataItem) {
							wrongMetadataItem.incorrectKeys.push(key);
						}
						else {
							wrongMetadataCollection.add({
								id: item._id,
								incorrectKeys: [key]
							});
						}

						hasFoundIncorrectKey = true;
					}
					else if (wrongMetadataItem) {
						wrongMetadataItem.incorrectKeys = wrongMetadataItem.incorrectKeys.filter(value => value !== key);
						if (!wrongMetadataItem.incorrectKeys.length) {
							wrongMetadataCollection.remove(item._id);
						}
						else {
							wrongMetadataCollection.updateItem(item._id, wrongMetadataItem);
						}
					}
				}
				else {
					hasFoundMissingKey = true;
				}
			});

			if (!hasFoundIncorrectKey && !hasFoundMissingKey) {
				starColor = "green";
			}
			else if (!hasFoundIncorrectKey && hasFoundMissingKey) {
				starColor = "orange";
			}
			else if (hasFoundIncorrectKey && !hasFoundMissingKey) {
				starColor = "yellow";
			}
			else {
				starColor = "red";
			}
			return starColor;
		}
		return null;
	}

	findHighlightedValues(item) {
		const highlight = [];

		if (item.hasOwnProperty("meta") && projectMetadataCollection.count() !== 0) {
			const projectSchemaItem = projectMetadataCollection.getItem(projectMetadataCollection.getLastId());
			const projectSchema = projectSchemaItem.meta.schema
				|| projectSchemaItem.meta.ProjectSchema
				|| projectSchemaItem.meta.projectSchema
				|| {};

			const schemaKeys = Object.keys(projectSchema);

			schemaKeys.forEach((key) => {
				const metadataValue = dot.pick(`meta.${key}`, item);

				if (metadataValue !== undefined) {
					const correctValue = projectSchema[key].find(value => metadataValue === value);
					if (!correctValue) {
						highlight.push(key);
					}
				}
				else {
					highlight.push(key);
				}
			});
		}
		return highlight;
	}

	findAndRemove(id, folder) {
		const array = this.finderCollection.data.getBranch(id);

		array.forEach(item => this.removeItem(item.id));
		folder.$count = -1; // typical for folders with webix_kids and no actual data
		folder.hasOpened = false;

		webix.dp(this.finderCollection).ignore(() => {
			this.finderCollection.updateItem(folder.id, folder);
		});

		this.dataview.getPager().hide();
		this.getDataCollection().clearAll();
	}

	getFolderItems(folderId) {
		const branch = this.finderCollection.data.getBranch(folderId);
		if (branch.length === 1 && branch[0]._modelType === subFolderType) {
			return this.finderCollection.data.getBranch(branch[0].id);
		}
		return branch;
	}

	getFolderCount(folder) {
		return this.getFolderItems(folder.id).length;
	}

	createCaseFolders(itemsToParse, folderId) {
		const caseFolders = [];
		const folderNames = [];
		itemsToParse.forEach((item) => {
			const firstDotIndex = item.name.indexOf(".");
			let slidePattern = item.name.substr(0, firstDotIndex);
			const caseId = slidePattern.substr(0, slidePattern.indexOf("_"));
			slidePattern = slidePattern.slice(slidePattern.indexOf("_") + 1);
			const regionId = slidePattern.substr(0, slidePattern.indexOf("_"));
			const caseFolderName = `${caseId}_${regionId}`;
			const found = folderNames.find((folderName) => {
				if (caseFolderName === folderName) {
					return true;
				}
				return false;
			});
			if (!found) {
				folderNames.push(caseFolderName);
			}
		});
		folderNames.forEach((folderName) => {
			caseFolders.push({
				name: folderName,
				parentCollection: "folder",
				parentId: folderId,
				caseview: true,
				_id: webix.uid(),
				_modelType: "folder"
			});
		});
		this.parseItems(caseFolders, folderId);
		// const linearData = false;
		// this.parseDataToViews(webix.copy(caseFolders), linearData, folderId);
	}

	destroy() {
		ItemsModel.instance = null;
	}
}
