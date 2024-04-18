import dot from "dot-object";

import projectMetadata from "./projectMetadata";
import constants from "../constants";
import ajaxActions from "../services/ajaxActions";
import findAndFixErrors from "../services/gallery/fixValidationErrors";
import validate from "../services/gallery/npValidator";

const projectMetadataCollection = projectMetadata.getProjectFolderMetadata();
const wrongMetadataCollection = projectMetadata.getWrongMetadataCollection();

const subFolderType = constants.SUB_FOLDER_MODEL_TYPE;

export default class ItemsModel {
	constructor(finder, dataview, table) {
		if (!ItemsModel.instance) {
			this.finderView = finder;
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

	parseItems(dataArray, parentId, linearDataCount) {
		const finderDataPull = {};
		dataArray.forEach((item) => {
			const id = webix.uid();
			item.id = id;
			if (item._id) {
				finderDataPull[item._id] = item;
			}
		});

		if (parentId) {
			this.parseItemsToFolder(dataArray, parentId, linearDataCount);
		}
		else {
			this.finderView.parse(dataArray);
		}

		Object.assign(this.customFinderDataPull, finderDataPull);
	}

	parseItemsToFolder(dataArray, parentId, linearDataCount) {
		let branch = this.finderView.data.getBranch(parentId) || [];
		const parent = this.findItem(parentId);
		if (parent?.linear) {
			if (!parent.linear.count) {
				parent.linear.count = linearDataCount;
			}
			else {
				parent.linear.count += linearDataCount;
			}
		}
		const count = this.getFolderCount(parent) + dataArray.length;
		let items = dataArray;
		if (count >= constants.FOLDER_MAX_SHOWED_ITEMS && !parent._showMany) {
			if (branch.length === 1 && branch[0]._modelType === subFolderType) {
				parentId = branch[0].id;
			}
			else {
				this.finderView.callEvent("putItemsToSubFolder");
				this.finderView.blockEvent();
				this.finderView.close(parentId);
				branch.forEach(item => this.removeItem(item.id));
				this.finderView.unblockEvent();

				items = [{
					_modelType: subFolderType,
					data: branch.concat(dataArray),
					name: "&lt;items&gt;"
				}];
			}
		}
		this.finderView.parse({data: items, parent: parentId});
		this.finderView.blockEvent();
		this.finderView.open(parent.id);
		this.finderView.unblockEvent();
	}

	openSubFolder(id) {
		const subFolder = this.findItem(id);
		const parent = this.findItem(subFolder.$parent);
		const branch = this.finderView.data.getBranch(id);
		parent._showMany = true;
		this.removeItem(id);
		this.parseItems(branch, parent.id);
	}

	addItem(item) {
		const id = webix.uid();
		item.id = id;
		this.finderView.add(item);
		this.customFinderDataPull[item._id] = item;
	}

	updateItems(items) {
		if (!Array.isArray(items)) {
			items = [items];
		}
		items.forEach((updatedItem) => {
			const foundedItemInFinder = this.customFinderDataPull[updatedItem._id];
			const foundedItemInDataCollection =
				this.dataCollection.find(item => item._id === updatedItem._id, true);
			if (foundedItemInFinder) {
				this.finderView.updateItem(foundedItemInFinder.id, updatedItem);
			}
			if (foundedItemInDataCollection) {
				this.dataCollection.updateItem(foundedItemInDataCollection.id, updatedItem);
			}
		});
	}

	removeItem(id, baseId) {
		let item = null;
		if (id) {
			item = this.finderView.getItem(id);
			delete this.customFinderDataPull[item._id];
			this.finderView.remove(id);
		}
		else if (baseId) {
			item = this.customFinderDataPull[baseId];
			this.finderView.remove(item.id);
			delete this.customFinderDataPull[baseId];
		}
	}

	findItem(id, baseId) {
		let item = null;
		if (id) {
			item = this.finderView.getItem(id);
		}
		else if (baseId) {
			item = this.customFinderDataPull[baseId];
		}
		return item;
	}

	clearAll() {
		this.finderView.clearAll();
		this.customFinderDataPull = {};
	}

	parseToDataCollection(data) {
		this.dataCollection.parse(webix.copy(data));
	}

	getFinderCollection() {
		return this.finderView;
	}

	getDataCollection() {
		return this.dataCollection;
	}

	parseDataToViews(data, isLinearData, folderId, isChildFolderExists, isClearDataCollection) {
		if (
			folderId
			&& this.selectedItem?.id
			&& folderId.toString() === this.selectedItem?.id?.toString()
		) {
			const dataview = this.dataview;
			const pager = dataview.getPager();

			if (!pager.isVisible() && dataview.isVisible()) {
				pager.show();
			}
			if (isClearDataCollection) {
				this.dataCollection.clearAll();
			}

			if (!Array.isArray(data)) {
				data = [data];
			}

			const dataToParse = data.map((item) => {
				item.starColor = this.findStarColorForItem(item);
				item.highlightedValues = this.findHighlightedValues(item);
				// TODO: delete after test
				// start
				const [updatedItem, isUpdated] = this.getItemWithRegionList(item);
				if (isUpdated) {
					ajaxActions.updateItemMetadata(updatedItem._id, updatedItem.meta, updatedItem._modelType);
				}
				// end
				return updatedItem;
			});

			this.dataCollection.parse(dataToParse);
			dataview.refresh();
			const dataForFilter = isLinearData
				? this.dataCollection.data.serialize()
				: dataToParse;

			this.dataCollection.callEvent("parseDataToCollection", [dataForFilter, isChildFolderExists]);
		}
	}

	findStarColorForItem(item) {
		let hasFoundMissingKey = false;
		let hasFoundIncorrectKey = false;
		let starColor;

		if (item.hasOwnProperty("meta") && projectMetadataCollection.count() !== 0) {
			const projectSchemaItem =
				projectMetadataCollection.getItem(projectMetadataCollection.getLastId());
			const projectSchema =
				projectSchemaItem.meta.schema
				|| projectSchemaItem.meta.ProjectSchema
				|| projectSchemaItem.meta.projectSchema
				|| {};

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
						wrongMetadataItem.incorrectKeys =
							wrongMetadataItem.incorrectKeys.filter(value => value !== key);
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
				return starColor;
			}
		}
		else if (item.hasOwnProperty("meta")) {
			// Validate with JSON Schema
			try {
				const {/* valid: isValid, */missedKeys, incorrectKeys} = validate(item?.meta);

				// TODO: uncomment when old validation will be removed
				// if (isValid) {
				// 	starColor = "green";
				// }
				if (incorrectKeys.length === 0 && missedKeys.length !== 0 && starColor !== "red" && starColor !== "yellow") {
					starColor = "orange";
				}
				else if (incorrectKeys.length !== 0 && missedKeys.length === 0 && starColor !== "red" && starColor !== "orange") {
					starColor = "yellow";
				}
				else {
					starColor = "red";
				}
			}
			catch (err) {
				console.error(err);
			}
			return starColor ?? null;
		}
		return null;
	}

	findHighlightedValues(item) {
		const highlight = new Set();

		if (item.hasOwnProperty("meta") && projectMetadataCollection.count() !== 0) {
			const projectSchemaItem =
				projectMetadataCollection.getItem(projectMetadataCollection.getLastId());
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
						highlight.add(key);
					}
				}
				else {
					highlight.add(key);
				}
			});

			try {
				const {isDataValid: isValid, missedKeys, incorrectKeys} = validate(item?.meta);
				if (!isValid) {
					missedKeys.forEach((missedKeyObject) => {
						highlight.add((missedKeyObject.missedKey.replaceAll("/", ".")).slice(1));
					});
					incorrectKeys.forEach((incorrectKeyObject) => {
						highlight.add((incorrectKeyObject.incorrectKey.replaceAll("/", ".")).slice(1));
					});
					const fixedItem = findAndFixErrors(item);
					if (fixedItem?.meta) {
						Object.assign(item.meta, fixedItem.meta);
						ajaxActions.updateItemMetadata(item._id, fixedItem.meta, item._modelType);
					}
				}
			}
			catch (err) {
				console.error(err);
			}
			return Array.from(highlight);
		}
		return Array.from(highlight);
	}

	findAndRemove(id, folder) {
		const array = this.finderView.data.getBranch(id);

		array.forEach(item => this.removeItem(item.id));
		folder.$count = -1; // typical for folders with webix_kids and no actual data
		folder.hasOpened = false;

		webix.dp(this.finderView).ignore(() => {
			this.finderView.updateItem(folder.id, folder);
		});

		this.dataview.getPager().hide();
		this.getDataCollection().clearAll();
	}

	getFolderItems(folderId) {
		const branch = this.finderView.data.getBranch(folderId);
		if (branch.length === 1 && branch[0]._modelType === subFolderType) {
			return this.finderView.data.getBranch(branch[0].id);
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
			const [caseId, regionId] = slidePattern.split("_");
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

	/**
	 * Function which get item and return new item with regionList if npSchema.regionName exists
	 * @param item item with npSchema.regionName property
	 * @returns {any} updated item with regionNameList property
	 */
	getItemWithRegionList(item) {
		const newItem = webix.copy(item);
		let isUpdated = false;
		if (newItem.meta.npSchema?.regionName) {
			if (!Array.isArray(newItem.meta.npSchema.regionNameList)) {
				newItem.meta.npSchema.regionNameList = [];
				newItem.meta.npSchema.regionNameList.push(newItem.meta.npSchema.regionName);
				isUpdated = true;
			}
		}
		return [newItem, isUpdated];
	}

	destroy() {
		ItemsModel.instance = null;
	}
}
