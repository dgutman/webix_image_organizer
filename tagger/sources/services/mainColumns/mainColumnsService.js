import transitionalAjax from "../transitionalAjaxService";
import ajaxActions from "../ajaxActions";
import CustomDataPull from "../../models/customDataPullClass";
import undoFactory from "../../models/undoModel";
// import SelectItemsService from "../selectItemsService";
import addValueWindow from "../../views/windows/addValueWindow";
import connectTagToImageWindow from "../../views/windows/connectTagToImageWindow";
import connectValueToImageWindow from "../../views/windows/connectValueToImageWindow";
import connectConfidenceToImageWindow from "../../views/windows/connectConfidenceToImageWindow";
import constants from "../../constants";
import ChangesBeforeSave from "../../models/changesBeforeSave";
import messageBoxes from "../../views/components/messageBoxes";
import auth from "../authentication";

export default class TaggerMainColumnsService {
	constructor(view) {
		this._view = view;
		this._ready();
	}

	async _ready() {
		const scope = this._view.$scope;
		this._app = scope.app;
		this._parentView = this._view.getTopParentView();
		webix.extend(this._parentView, webix.ProgressBar);

		// child views
		this._collectionColumnClass = scope.getCollectionColumnClass();
		this._tagColumnClass = scope.getTagColumnClass();
		this._valuesColumnClass = scope.getValuesColumnClass();
		this._confidenceColumnClass = scope.getConfidenceColumnClass();
		this._getDataButton = scope.getDataButton();
		this._getDataStatusTemplate = scope.getStatusTemplate();
		this._sendDataButton = scope.getSendDataButton();
		this._undoModel = await undoFactory.get("main");

		// windows
		this._addValueWindow = scope.ui(addValueWindow);
		this._connectTagToImageWindow = scope.ui(connectTagToImageWindow);
		this._connectValueToImageWindow = scope.ui(connectValueToImageWindow);
		this._connectConfidenceToImageWindow = scope.ui(connectConfidenceToImageWindow);

		// collection column views
		// this._collectionList = this._collectionColumnClass.getCollectionList();
		this._collectionTree = this._collectionColumnClass.getCollectionTreeView();
		// this._collectionListStore = new CustomDataPull(this._collectionList);
		// this._collectionSelectItemsService = new SelectItemsService(this._collectionList);
		// this._collectionSelectTemplate = this._collectionColumnClass.getSelectAllTemplate();
		// this._collectionSearchInput = this._collectionColumnClass.getSearchInput();

		// tags column views
		this._tagList = this._tagColumnClass.getEditableList();
		this._tagListStore = new CustomDataPull(this._tagList);
		this._tagSearchInput = this._tagColumnClass.getSearchInput();
		this._addTagTemplate = this._tagColumnClass.getAddNewItemTemplate();
		this._saveTagButton = this._tagColumnClass.getSaveBtn();
		this._changesTagsModel = new ChangesBeforeSave(this._tagListStore);

		// values column views
		this._valuesList = this._valuesColumnClass.getEditableList();
		this._valuesListStore = new CustomDataPull(this._valuesList);
		this._addValueTemplate = this._valuesColumnClass.getAddNewItemTemplate();
		this._valuesSearchInput = this._valuesColumnClass.getSearchInput();
		this._saveValueButton = this._valuesColumnClass.getSaveBtn();
		this._changesValuesModel = new ChangesBeforeSave(this._valuesListStore);

		// confidence column views
		this._confidenceList = this._confidenceColumnClass.getEditableList();
		this._confidenceListStore = new CustomDataPull(this._confidenceList);
		this._addConfidenceTemplate = this._confidenceColumnClass.getAddNewItemTemplate();
		this._confidenceSearchInput = this._confidenceColumnClass.getSearchInput();

		this._windowCollectionTree = this._connectTagToImageWindow.getCollectionTreeView();
		this._windowCollectionTree.sync(this._collectionTree);
		this._windowCollectionTree.attachEvent("onBeforeOpen", (id) => {
			const item = this._windowCollectionTree.getItem(id);
			if (!item._wasOpened) {
				this._collectionTree.callEvent("onDataRequest", [id]);
				item._wasOpened = true;
			}
		});
		this._windowCollectionTree.attachEvent("onSelectChange", () => {
			const ids = this._windowCollectionTree.getSelectedId(true);
			this._collectionTree.select([ids]);
		});

		// attaching events
		this._attachTopButtonsEvents();
		this._attachHostChangeEvent();
		this._attachCollectionColumnEvents();
		this._attachTagColumnEvents();
		this._attachValuesColumnEvents();
		this._attachConfidenceColumnEvents();
		this._attachCollectionSelectChangeEvent();
	}

	_changeTopButtonsState() {
		const ids = this._getCollectionAndSelectedIds();
		const collectionIds = ids.collectionIds;
		const gettingDataStatus = this._getDataStatusTemplate.getValues();
		let getBtnIsEnabled;
		let sendBtnIsEnabled;
		if (gettingDataStatus && gettingDataStatus.value === constants.RECOGNITION_STATUSES.IN_PROGRESS.value) {
			getBtnIsEnabled = false;
			sendBtnIsEnabled = false;
		}
		else if (collectionIds.length) {
			getBtnIsEnabled = true;
			sendBtnIsEnabled = true;
		}
		else {
			getBtnIsEnabled = false;
			sendBtnIsEnabled = true;
		}

		if (!auth.isLoggedIn()) {
			sendBtnIsEnabled = false;
		}

		getBtnIsEnabled ? this._getDataButton.enable() : this._getDataButton.disable();
		sendBtnIsEnabled ? this._sendDataButton.enable() : this._sendDataButton.disable();
	}

	_attachTopButtonsEvents() {
		this._getDataButton.attachEvent("onItemClick", () => {
			const ids = this._getCollectionAndSelectedIds();
			const selectedIds = ids.selectedIds;
			if (selectedIds.length) {
				this._getDataStatusTemplate.show();
				this._getDataStatusTemplate.setValues(constants.RECOGNITION_STATUSES.IN_PROGRESS);
				this._changeTopButtonsState();
				Promise.all(selectedIds.map(selectedId => transitionalAjax.getResourceImages(selectedId, ids.selectedType)))
					.then(() => Promise.all(ids.collectionIds.map(id => transitionalAjax.getResourceFolders(id))))
					.then(() => {
						this._getTagsAfterCollectionSelect(ids.collectionIds);
						this._getDataStatusTemplate.setValues(constants.RECOGNITION_STATUSES.DONE);
					})
					.catch(() => {
						this._getDataStatusTemplate.setValues(constants.RECOGNITION_STATUSES.ERROR);
					})
					.finally(() => { this._changeTopButtonsState(); });
			}
		});

		this._sendDataButton.attachEvent("onItemClick", () => {
			webix.confirm({
				text: "Do you want migrate data with changes?",
				ok: "Yes",
				cancel: "No"
			}).then(() => {
				webix.message("This feature is not implemented yet");
			});
		});
	}

	_attachCollectionColumnEvents() {
		// this._collectionSelectTemplate.define("onClick", {
		// 	"select-all": () => {
		// 		this._collectionSelectItemsService.selectAllItems();
		// 	},
		// 	"unselect-all": () => {
		// 		this._collectionSelectItemsService.unselectAllItems();
		// 	}
		// });

		// this._collectionSearchInput.attachEvent("onChange", () => {
		// 	this._searchStaticItems(this._collectionList, this._collectionSearchInput);
		// 	this._collectionSelectItemsService.markMainSelectedItems();
		// });

		// this._collectionList.attachEvent("onItemClick", (id, ev) => {
		// 	const item = this._collectionListStore.getItemById(id);
		// 	if (ev.target.classList.contains("checkbox-icon") || ev.target.classList.contains("item-name")) {
		// 		this._collectionSelectItemsService.onItemSelect(ev.shiftKey, item);
		// 	}
		// });

		this._collectionTree.attachEvent("onDataRequest", (id) => {
			const item = this._collectionTree.getItem(id);
			const modelType = item._modelType;
			this._parentView.showProgress();
			item._wasOpened = true;
			ajaxActions.getFolder(modelType, item._id)
				.then((data) => {
					this._collectionTree.parse({parent: id, data});
					this._windowCollectionTree.select(id);
					this._parentView.hideProgress();
				})
				.catch(() => {
					this._parentView.hideProgress();
				});
		});
	}

	_attachTagColumnEvents() {
		this._addTagTemplate.define("onClick", {
			"add-new": () => {
				if (this._checkColumnEditMode(this._tagColumnClass)) {
					this._tagListStore.addItem({name: "", type: "single"});
					this._tagList.edit(this._tagList.getLastId());
				}
			}
		});

		this._tagList.data.attachEvent("onStoreUpdated", () => {
			if (!this._tagList.count()) {
				this._tagList.unselectAll();
				this._tagList.callEvent("onSelectChange");
			}
		});

		this._tagList.attachEvent("onAfterEditStart", (id) => {
			this._validateItemText(this._tagList, id, constants.PATTERN_TAGS);
		});

		this._tagList.attachEvent("onAfterEditStop", (state, editor) => {
			messageBoxes.hideValidationPopup();
			// webix.eventRemove(this.editInputEventId);
			const item = this._tagListStore.getItemById(editor.id);
			// validation
			if (state.value && state.value === state.old) {
				return true;
			}
			if (!state.value) {
				webix.message("Tag name can't be empty");
				this._tagListStore.removeItem(editor.id);
			}
			else if (state.value && state.old && !this._checkUniqueName(state.value, this._tagListStore, "name")) {
				this._tagListStore.updateItem(editor.id, null, {name: state.old});
				webix.message("Tag with this name already exists");
			}
			else if (!this._checkUniqueName(state.value, this._tagListStore, "name")) {
				webix.message("Tag with this name already exists");
				this._tagListStore.removeItem(editor.id);
			}
			else if (!state.value) {
				webix.message("Tag name can't be empty");
				this._tagListStore.removeItem(editor.id);
			}
			else {
				const existedChangedItem = this._changesTagsModel.findItemByProperty("name", item.name);
				const copy = webix.copy(item);
				// update existed item in changes model
				if (existedChangedItem) {
					let collectionIds = this._getCollectionAndSelectedIds().collectionIds || [];
					const existedCollectionIds = existedChangedItem.collectionIds || [];
					collectionIds = existedCollectionIds
						.concat(collectionIds)
						.filter((value, index, self) => self.indexOf(value) === index);
					Object.assign(existedChangedItem, item);
					if (existedChangedItem._id) {
						existedChangedItem.collectionIds = collectionIds;
					}
				}
				else if (!state.old) {
					this._undoModel.setActionToUndo(copy, this._tagListStore, "remove");
					this._changesTagsModel.addItem(item, "created");
				}
				else {
					copy.name = state.old;
					this._undoModel.setActionToUndo(copy, this._tagListStore, "update");
					if (!item._id) {
						this._changesTagsModel.addItem(item, "created");
					}
					else {
						this._changesTagsModel.addItem(item, "updated");
					}
				}
				this._tagListStore.updateItem(editor.id, null, {name: state.value});
			}
		});
		this._tagList.attachEvent("onItemClick", (id, ev) => {
			const tag = this._tagListStore.getItemById(id);
			if (ev.target.classList.contains("delete-item-icon")) {
				if (this._checkColumnEditMode(this._tagColumnClass)) {
					messageBoxes.confirmDelete("tag")
						.then(() => {
							const copy = webix.copy(tag);
							this._undoModel.setActionToUndo(copy, this._tagListStore, "add");
							if (tag._id) {
								// const selectedCollections = this._collectionSelectItemsService.getSelectedItems();
								const selectedCollectionIds = this._getCollectionAndSelectedIds().collectionIds;
								// const selectedCollectionIds = selectedCollections.map(collection => collection._id);
								tag.collectionIds = tag.collectionIds.filter(collectionId => !selectedCollectionIds.includes(collectionId));
								this._changesTagsModel.addItem(tag, "updated");
							}
							else {
								this._changesTagsModel.removeItem(tag);
							}
							this._tagListStore.removeItem(id);
						});
				}
			}
			else if (ev.target.classList.contains("image-icon")) {
				if (tag._id) {
					this._connectTagToImageWindow.showWindow(tag, this._tagListStore, this._collectionTree);
				}
				return false;
			}
			else if (ev.target.classList.contains("switch-type")) {
				if (this._checkColumnEditMode(this._tagColumnClass)) {
					tag.type = tag.type === "single" ? "multi" : "single";
					this._tagListStore.updateItem(tag.id, null, tag);
					if (!tag._id) {
						this._changesTagsModel.addItem(tag, "created");
					}
					else {
						this._changesTagsModel.addItem(tag, "updated");
					}
					return false;
				}
			}
		});

		this._tagList.attachEvent("onBeforeSelect", (id) => {
			const item = this._tagListStore.getItemById(id);
			return !!item._id;
		});

		this._tagList.attachEvent("onSelectChange", (tagIds) => {
			tagIds = tagIds || [];
			const createdValues = this._changesValuesModel.getItems("created");
			const updatedValues = this._changesValuesModel.getItems("updated");
			const baseTagIds = tagIds.map((tagId) => {
				const tag = this._tagListStore.getItemById(tagId);
				return tag ? tag._id : null;
			});
			this._valuesListStore.clearAll();
			if (baseTagIds.length) {
				this._parentView.showProgress();
				transitionalAjax.getValuesByTags(baseTagIds)
					.then((data) => {
						data.map((item) => {
							const updatedItemIndex = updatedValues.findIndex(value => value._id === item._id);
							if (updatedItemIndex !== -1) {
								const updatedItem = updatedValues[updatedItemIndex];
								item.tagIds = updatedItem.tagIds;
								item.value = updatedItem.value;
								item.id = updatedItem.id;
							}
							return item;
						});
						this._valuesListStore.parseItems(data);
						this._valuesListStore.parseItems(updatedValues);
						this._valuesListStore.parseItems(createdValues); // Not saved on server values
						this._searchValues();
						this._parentView.hideProgress();
					})
					.fail(() => { this._parentView.hideProgress(); });
			}
		});
		this._tagSearchInput.attachEvent("onChange", () => {
			this._searchStaticItems(this._tagList, this._tagSearchInput);
		});
		this._saveTagButton.attachEvent("onItemClick", () => {
			if (this._tagList.getEditState()) {
				this._tagList.editStop();
			}

			const createdTags = this._changesTagsModel.getItems("created");
			const updatedTags = this._changesTagsModel.getItems("updated");

			// const collections = this._collectionList.getSelectedItem(true);
			const collectionIds = this._getCollectionAndSelectedIds().collectionIds;

			const requestArray = [this._createTags(createdTags, collectionIds), this._updateTags(updatedTags)];
			this._parentView.showProgress();
			Promise.all(requestArray)
				.then(() => {
					this._undoModel.clearDependentModel(this._tagList.config.id);
				})
				.finally(() => {
					this._parentView.hideProgress();
				});
		});
	}

	_attachValuesColumnEvents() {
		this._addValueTemplate.define("onClick", {
			"add-new": () => {
				const tagSelectedId = this._tagList.getSelectedId();
				const selectedTag = this._tagListStore.getItemById(tagSelectedId);
				if (this._checkColumnEditMode(this._valuesColumnClass)) {
					if (!selectedTag) return webix.message("Please choose tag");
					this._addValueWindow.showWindow(selectedTag, this._tagListStore, this._valuesListStore, this._changesValuesModel);
				}
			}
		});

		this._valuesList.data.attachEvent("onStoreUpdated", () => {
			if (!this._valuesList.count()) {
				this._valuesList.unselectAll();
				this._valuesList.callEvent("onSelectChange");
			}
		});

		this._valuesList.attachEvent("onItemClick", (id, ev) => {
			const tagId = this._tagList.getSelectedId();
			const tag = this._tagListStore.getItemById(tagId);
			const value = this._valuesListStore.getItemById(id);
			if (ev.target.classList.contains("delete-item-icon")) {
				if (this._checkColumnEditMode(this._valuesColumnClass) && tagId) {
					messageBoxes.confirmDelete("value")
						.then(() => {
							let copyTagIds = webix.copy(value.tagIds);
							copyTagIds = copyTagIds.filter(tagBaseId => tagBaseId !== tag._id);

							const copy = webix.copy(value);
							this._valuesListStore.updateItem(id, null, {tagIds: copyTagIds});

							if (copyTagIds.length) {
								this._undoModel.setActionToUndo(copy, this._valuesListStore, "add");

								if (value._id) {
									this._changesValuesModel.addItem(value, "updated");
								}
								else {
									this._changesValuesModel.addItem(value, "created");
								}
							}
							else {
								this._undoModel.setActionToUndo(copy, this._valuesListStore, "add");
								if (value._id) this._changesValuesModel.addItem(value, "updated");
								else this._changesValuesModel.removeItem(value, "created");
							}
							this._valuesListStore.removeItem(id);
						});
				}
			}
			else if (ev.target.classList.contains("image-icon")) {
				if (tag && value._id) {
					const obj = {
						value,
						tag
					};
					// const selectedCollections = this._collectionSelectItemsService.getSelectedItems();
					const ids = this._getCollectionAndSelectedIds();
					this._connectValueToImageWindow.showWindow(obj, this._tagListStore, this._valuesListStore, ids);
				}
				return false;
			}
		});

		this._valuesList.attachEvent("onAfterEditStart", (id) => {
			this._validateItemText(this._valuesList, id, constants.PATTERN_VALUES);
		});

		this._valuesList.attachEvent("onAfterEditStop", (state, editor) => {
			messageBoxes.hideValidationPopup();
			const item = this._valuesListStore.getItemById(editor.id);
			let value = state.value;
			if (!state.value || !this._checkUniqueName(state.value, this._valuesListStore, "value")) {
				const message = state.value ? "Value with this name already exists" : "Value name can't be empty";
				webix.message(message);
				value = state.old;
			}
			else {
				if (item._id) {
					this._changesValuesModel.addItem(item, "updated");
				}
				else {
					this._changesValuesModel.addItem(item, "created");
				}
				const copy = webix.copy(item);
				copy.value = state.old;
				this._undoModel.setActionToUndo(copy, this._valuesListStore, "update");
				this._valuesListStore.updateItem(editor.id, null, {value});
			}
		});

		this._valuesList.data.attachEvent("onDataUpdate", () => {
			this._searchValues();
		});

		this._valuesList.data.attachEvent("onAfterAdd", () => {
			this._searchValues();
		});

		this._valuesSearchInput.attachEvent("onChange", () => {
			this._searchValues();
		});

		this._valuesList.attachEvent("onSelectChange", () => {
			const selectedValueId = this._valuesList.getSelectedId();
			this._confidenceListStore.clearAll();
			if (selectedValueId) {
				this._parentView.showProgress();
				transitionalAjax.getConfidenceLevels()
					.then((data) => {
						this._confidenceListStore.parseItems(data);
					})
					.finally(() => { this._parentView.hideProgress(); });
			}
		});

		this._saveValueButton.attachEvent("onItemClick", () => {
			if (this._valuesList.getEditState()) {
				this._valuesList.editStop();
			}
			// if created value name fits updated value name
			this.filterCreatedValues();

			const createdValues = this._changesValuesModel.getItems("created"); // get only new values
			const updatedValues = this._changesValuesModel.getItems("updated");
			this._parentView.showProgress();
			Promise.all([this._createValues(createdValues), this._updateValues(updatedValues)])
				.then(() => {
					this._undoModel.clearDependentModel(this._valuesList.config.id);
					this._searchValues();
				})
				.finally(() => { this._parentView.hideProgress(); });
		});
	}

	_attachConfidenceColumnEvents() {
		this._confidenceList.attachEvent("onItemClick", (id, ev) => {
			const tag = this._tagList.getSelectedItem();
			const value = this._valuesList.getSelectedItem();
			const confidence = this._confidenceListStore.getItemById(id);
			if (ev.target.classList.contains("image-icon")) {
				const obj = {
					value,
					tag,
					confidence
				};
				const stores = {
					tagStore: this._tagListStore,
					valuesStore: this._valuesListStore,
					confidenceStore: this._confidenceListStore
				};
				if (tag && value) {
					// const selectedCollections = this._collectionSelectItemsService.getSelectedItems();
					const ids = this._getCollectionAndSelectedIds();
					this._connectConfidenceToImageWindow.showWindow(obj, stores, ids);
				}
				return false;
			}
		});

		this._confidenceSearchInput.attachEvent("onChange", () => {
			this._searchStaticItems(this._confidenceList, this._confidenceSearchInput);
		});
	}

	_attachHostChangeEvent() {
		this._view.$scope.app.callEvent("getCollectionData");

		this._view.$scope.on(this._view.$scope.app, "collectionDataReceived", (collections) => {
			// this._collectionListStore.parseItems(collections);
			this._collectionTree.parse(collections);
		});
	}

	_attachCollectionSelectChangeEvent() {
		// this._collectionList.attachEvent("customSelectChange", (collections) => {
		// 	const collectionIds = collections.map(collection => collection._id);


		// 	this._changesTagsModel.clearItems();
		// 	this._changesValuesModel.clearItems();
		// 	this._undoModel.clearModel();
		// 	this._getTagsAfterCollectionSelect(collectionIds);
		// 	if (collectionIds.length) {
		// 		this._tagColumnClass.getRoot().enable();
		// 		this._valuesColumnClass.getRoot().enable();
		// 		this._confidenceColumnClass.getRoot().enable();
		// 	}
		// 	else {
		// 		this._tagColumnClass.getRoot().disable();
		// 		this._valuesColumnClass.getRoot().disable();
		// 		this._confidenceColumnClass.getRoot().disable();
		// 	}
		// 	this._changeTopButtonsState();
		// });

		this._collectionTree.attachEvent("onSelectChange", () => {
			const ids = this._getCollectionAndSelectedIds();
			const collectionIds = ids.collectionIds;

			this._changesTagsModel.clearItems();
			this._changesValuesModel.clearItems();
			this._undoModel.clearModel();
			this._getTagsAfterCollectionSelect(collectionIds);
			if (collectionIds.length) {
				this._tagColumnClass.getRoot().enable();
				this._valuesColumnClass.getRoot().enable();
				this._confidenceColumnClass.getRoot().enable();
			}
			else {
				this._tagColumnClass.getRoot().disable();
				this._valuesColumnClass.getRoot().disable();
				this._confidenceColumnClass.getRoot().disable();
			}
			this._changeTopButtonsState();
			// this._collectionTree.callEvent("customSelectChange", [ids]);
		});
	}

	_getTagsAfterCollectionSelect(collectionIds) {
		if (auth.isLoggedIn()) {
			if (collectionIds.length) {
				this._parentView.showProgress();
				transitionalAjax.getTagsByCollection(collectionIds)
					.then((data) => {
						this._tagListStore.clearAll();
						this._tagListStore.parseItems(data);
						this._searchStaticItems(this._tagList, this._tagSearchInput);
						this._parentView.hideProgress();
					})
					.fail(() => { this._parentView.hideProgress(); });
			}
		}
	}

	_searchStaticItems(dataView, searchInput) {
		const searchValue = searchInput.getValue();
		const lowerCaseSearchValue = searchValue.toLowerCase();
		dataView.filter((obj) => {
			const lowerCaseName = obj.name.toString().toLowerCase();
			if (lowerCaseSearchValue) {
				return lowerCaseName.includes(lowerCaseSearchValue);
			}
			return true;
		});
	}

	_searchValues() {
		const tagId = this._tagList.getSelectedId();
		const searchValue = this._valuesSearchInput.getValue();
		const lowerCaseSearchValue = searchValue.toLowerCase();
		let item = {_id: ""};
		if (tagId) {
			item = this._tagListStore.getItemById(tagId);
		}
		this._valuesList.filter((value) => {
			const lowerCaseName = value.value.toString().toLowerCase();
			if (lowerCaseSearchValue) {
				return value.tagIds.includes(item._id) && lowerCaseName.includes(lowerCaseSearchValue);
			}
			return value.tagIds.includes(item._id);
		});
	}

	_checkColumnEditMode(viewClass) {
		return viewClass.getRoot().getNode().classList.contains("enabled-editing");
	}

	_checkUniqueName(name, store, nameField) {
		const itemsArray = store.getArrayOfItems();
		const filteredArray = itemsArray.filter(obj => obj[nameField].toString().toLowerCase() === name.toString().toLowerCase());
		return filteredArray.length <= 1;
	}

	_createTags(createdTags, collectionIds) {
		if (createdTags.length) {
			return transitionalAjax.createTags(createdTags, collectionIds)
				.then((response) => {
					const data = response.data;
					data.forEach((tag) => {
						const foundedTag = createdTags.find(item => item.name.toString().toLowerCase() === tag.name.toString().toLowerCase());
						if (foundedTag) {
							this._tagListStore.updateItem(foundedTag.id, null, tag);
						}
					});
					this._changesTagsModel.clearItems("created");
					return data;
				});
		}
		return Promise.resolve(false);
	}

	_updateTags(updatedTags) {
		if (updatedTags.length) {
			return transitionalAjax.updateTags(updatedTags)
				.then((response) => {
					response.data.forEach((tag) => {
						if (tag) {
							const foundedTag = updatedTags.find(item => item.name.toString().toLowerCase() === tag.name.toString().toLowerCase());
							if (foundedTag) {
								this._tagListStore.updateItem(foundedTag.id, tag._id, tag);
							}
						}
					});
					this._changesTagsModel.clearItems("updated");
					return response.data;
				});
		}
		return Promise.resolve(false);
	}

	_createValues(createdValues) {
		if (createdValues.length) {
			return transitionalAjax.createValues(createdValues)
				.then((data) => {
					data.forEach((value) => {
						const foundedValue = this._valuesListStore.getArrayOfItems().find(item => item.value.toString().toLowerCase() === value.value.toString().toLowerCase());
						if (foundedValue) {
							this._valuesListStore.updateItem(foundedValue.id, null, value);
						}
					});
					this._changesValuesModel.clearItems("created");
					return data;
				});
		}
		return Promise.resolve(false);
	}

	_updateValues(updatedValues) {
		if (updatedValues.length) {
			return transitionalAjax.updateValues(updatedValues)
				.then((response) => {
					response.data.forEach((value) => {
						if (value) {
							const foundedValue = this._valuesListStore.getArrayOfItems().find(item => item.value.toString().toLowerCase() === value.value.toString().toLowerCase());
							if (foundedValue) {
								this._valuesListStore.updateItem(foundedValue.id, value._id, value);
							}
						}
					});
					// remove unsaved values
					const itemsArray = this._valuesListStore.getArrayOfItems();
					itemsArray.forEach((item) => {
						if (!item._id) {
							this._valuesListStore.removeItem(item.id);
						}
					});
					this._changesValuesModel.clearItems("updated");
					return response.data;
				});
		}
		return Promise.resolve(false);
	}

	_validateItemText(view, id, pattern) {
		const maxCharCount = 50;
		const editor = view.getEditor(id);
		const editorInput = editor.getInputNode();
		// validate text
		this.editInputEventId = webix.event(editorInput, "input", () => {
			const value = editor.getValue();
			const regex = new RegExp(pattern, "g");
			let text = "";

			let validValue = value.match(regex) ? value.match(regex).join("") : "";
			if (value !== validValue) {
				text = "Invalid character";
			}
			else {
				validValue = validValue.slice(0, maxCharCount);
				text = `Symbols left - ${maxCharCount - validValue.length}`;
			}
			editor.setValue(validValue); // max char count is 50
			messageBoxes.showValidationPopup(editorInput, text);
			editorInput.focus();
		});
	}

	_getCollectionAndSelectedIds() {
		const ids = this._collectionTree.getSelectedId(true);
		const firstItem = this._collectionTree.getItem(ids[0]);
		const _ids = ids
			.filter((id) => {
				const item = this._collectionTree.getItem(id);
				return item.$level === firstItem.$level;
			})
			.map((id) => {
				const item = this._collectionTree.getItem(id);
				return item._id;
			});
		let collectionIds = [];
		let selectedType = "collection";
		if (firstItem) {
			if (firstItem._modelType === "collection") {
				collectionIds = _ids;
			}
			else {
				collectionIds = [firstItem.baseParentId];
				selectedType = "folder";
			}
		}
		return {collectionIds, selectedIds: _ids, selectedType};
	}

	filterCreatedValues() {
		const createdValues = this._changesValuesModel.getItems("created");
		const updatedValues = this._changesValuesModel.getItems("updated");
		createdValues.forEach((val) => {
			updatedValues.some((updVal) => {
				if (updVal.value.toLowerCase() === val.value.toLowerCase()) {
					updVal.tagIds = updVal.tagIds.concat(val.tagIds).unique();
					this._changesValuesModel.removeItem(val, "created");
				}
			});
		});
	}
}
