import ChangesBeforeSave from "../../models/changesBeforeSave";
import CustomDataPull from "../../models/customDataPullClass";
import transitionalAjax from "../transitionalAjaxService";
import tagTemplatesModel from "../../models/tagTemplates";
import constants from "../../constants";

export default class TagTemplatesService {
	constructor(view) {
		this._view = view;
		this._ready();
	}

	_ready() {
		webix.extend(this._view, webix.ProgressBar);
		// child views
		const scope = this._view.$scope;
		const tagCol = scope.tagListColumn;
		this._tagColControls = scope.getColumnControls(tagCol);
		const valueCol = scope.valueListColumn;
		this._valueColControls = scope.getColumnControls(valueCol);
		this._tagListStore = new CustomDataPull(tagTemplatesModel.tagsWithValues);
		this._valuesListStore = new CustomDataPull(this._valueColControls.list);
		this._changesTagsModel = new ChangesBeforeSave(this._tagListStore);
		this._changesValuesModel = new ChangesBeforeSave(this._valuesListStore);

		this.attachColumnEvents(this._tagColControls, this._tagListStore);
		this.attachColumnEvents(this._valueColControls, this._valuesListStore);
		this.attachTagListEvents();
		this.attachValueListEvents();
	}

	attachColumnEvents(controls) {
		const {list, searchField} = controls;
		list.attachEvent("onBeforeEditStop", (state) => {
			if (!state.value && state.old) {
				state.value = state.old;
			}
		});

		searchField.attachEvent("onTimedKeyPress", () => {
			this._searchByName(list, searchField);
		});
	}

	validateName({value, old}, editor, name, store, field) {
		if (!value) {
			webix.message(`${name} name can't be empty`);
			store.removeItem(editor.id);
			return false;
		}
		else if (value && old && !this._checkUniqueName(value, store, field)) {
			store.updateItem(editor.id, null, {name: old});
			webix.message(`${name} with this name already exists`);
			return false;
		}
		else if (!this._checkUniqueName(value, store, field)) {
			webix.message(`${name} with this name already exists`);
			store.removeItem(editor.id);
			return false;
		}
		else if (!value) {
			webix.message(`${name} name can't be empty`);
			store.removeItem(editor.id);
			return false;
		}
		return true;
	}

	getNewTagsData() {
		transitionalAjax.getTagTemplatesWithValues()
			.then((data) => {
				this._tagListStore.clearAll();
				this._tagListStore.parseItems(data);
			});
	}

	attachTagListEvents() {
		const {list, saveButton, addButton} = this._tagColControls;
		list.sync(tagTemplatesModel.tagsWithValues);
		this.getNewTagsData();

		addButton.attachEvent("onItemClick", () => {
			this._tagListStore.addItem({name: "", selection: "single"});
			list.edit(list.getLastId());
		});

		list.attachEvent("onAfterEditStop", (state, editor) => {
			const item = this._tagListStore.getItemById(editor.id);
			// validation
			state.value = state.value.trim();
			if (state.value && state.value === state.old) {
				return true;
			}
			const validate = this.validateName(state, editor, "Tag", this._tagListStore, "name");

			if (validate) {
				const existedChangedItem = this._changesTagsModel.findItemByProperty("name", item.name);
				const copy = webix.copy(item);
				// update existed item in changes model
				if (existedChangedItem) {
					Object.assign(existedChangedItem, item);
				}
				else if (!state.old) {
					this._changesTagsModel.addItem(item, "created");
				}
				else {
					copy.name = state.old;
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

		list.data.attachEvent("onStoreUpdated", () => {
			if (!list.count()) {
				list.unselectAll();
				list.callEvent("onSelectChange");
			}
		});

		list.attachEvent("onAfterEditStart", (id) => {
			this._validateItemText(list, id, constants.PATTERN_TAGS);
		});

		list.attachEvent("onItemClick", (id, ev) => {
			if (ev.target.classList.contains("delete-item-icon")) {
				const tag = this._tagListStore.getItemById(id);
				if (tag._id) {
					this._changesTagsModel.addItem(tag, "removed");
				}
				else {
					this._changesTagsModel.removeItem(tag);
				}
				this._tagListStore.removeItem(id);
				this._valuesListStore.clearAll();
				return false;
			}
		});

		list.attachEvent("onSelectChange", () => {
			this._valuesListStore.clearAll();
			this._changesValuesModel.clearItems();
			const selectedTag = list.getSelectedItem();
			if (selectedTag) {
				this._valuesListStore.parseItems(selectedTag.values);
				this._searchByName(this._valueColControls.list, this._valueColControls.searchField);
			}
		});

		saveButton.attachEvent("onItemClick", () => {
			if (list.getEditState()) {
				list.editStop();
			}

			const createdTags = this._changesTagsModel.getItems("created");
			const updatedTags = this._changesTagsModel.getItems("updated");
			const removedTags = this._changesTagsModel.getItems("removed");

			const requestArray = [this._createTags(createdTags), this._updateTags(updatedTags), this._removeTags(removedTags)];
			this._view.showProgress();
			Promise.all(requestArray)
				.then((data) => {
					this.getNewTagsData();
				})
				.finally(() => {
					this._view.hideProgress();
				});
		});
	}

	_createTags(createdTags) {
		if (createdTags.length) {
			return transitionalAjax.createTags(createdTags)
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

	_removeTags(removedTags) {
		if (removedTags.length) {
			const tagIds = removedTags.map(tag => tag._id);
			return transitionalAjax.deleteTags(tagIds)
				.then(() => {
					this._changesTagsModel.clearItems("removed");
				});
		}
		return Promise.resolve(false);
	}

	attachValueListEvents() {
		const {list, saveButton, addButton} = this._valueColControls;
		this.getNewTagsData();
		addButton.attachEvent("onItemClick", () => {
			const selectedTag = this._tagColControls.list.getSelectedItem();
			if (selectedTag) {
				this._valuesListStore.addItem({value: "", tagIds: [selectedTag._id]});
				list.edit(list.getLastId());
			}
		});

		list.attachEvent("onAfterEditStop", (state, editor) => {
			const item = this._valuesListStore.getItemById(editor.id);
			// validation
			state.value = state.value.trim();
			if (state.value && state.value === state.old) {
				return true;
			}
			const validate = this.validateName(state, editor, "Value", this._valuesListStore, "value");

			if (validate) {
				const existedChangedItem = this._changesValuesModel.findItemByProperty("name", item.name);
				const copy = webix.copy(item);
				// update existed item in changes model
				if (existedChangedItem) {
					Object.assign(existedChangedItem, item);
				}
				else if (!state.old) {
					this._changesValuesModel.addItem(item, "created");
				}
				else {
					copy.name = state.old;
					if (!item._id) {
						this._changesValuesModel.addItem(item, "created");
					}
					else {
						this._changesValuesModel.addItem(item, "updated");
					}
				}
				this._valuesListStore.updateItem(editor.id, null, {name: state.value});
			}
		});

		list.attachEvent("onAfterEditStart", (id) => {
			this._validateItemText(list, id, constants.PATTERN_VALUES);
		});

		list.attachEvent("onItemClick", (id, ev) => {
			const tagId = this._tagColControls.list.getSelectedId();
			const tag = this._tagListStore.getItemById(tagId);
			const value = this._valuesListStore.getItemById(id);

			if (ev.target.classList.contains("delete-item-icon")) {
				let copyTagIds = webix.copy(value.tagIds);
				copyTagIds = copyTagIds.filter(tagBaseId => tagBaseId !== tag._id);

				this._valuesListStore.updateItem(id, null, {tagIds: copyTagIds});

				if (copyTagIds.length > 0) {
					if (value._id) {
						this._changesValuesModel.addItem(value, "removed");
					}
					else {
						this._changesValuesModel.removeItem(value);
					}
				}
				else if (value._id) this._changesValuesModel.addItem(value, "removed");
				else this._changesValuesModel.removeItem(value, "created");

				this._valuesListStore.removeItem(id);
				const selectedTag = list.getSelectedItem();
				if (selectedTag) {
					this._valuesListStore.parseItems(selectedTag.values);
					this._searchByName(this._valueColControls.list, this._valueColControls.searchField);
				}
				return false;
			}
		});

		saveButton.attachEvent("onItemClick", () => {
			if (list.getEditState()) {
				list.editStop();
			}

			const createdValues = this._changesValuesModel.getItems("created");
			const updatedValues = this._changesValuesModel.getItems("updated");
			const removedValues = this._changesValuesModel.getItems("removed");
			const requestArray = [this._createValues(createdValues), this._updateValues(updatedValues), this._removeValues(removedValues)];
			this._view.showProgress();
			Promise.all(requestArray)
				.then(() => this.getNewTagsData())
				.finally(() => {
					this._view.hideProgress();
				});
			this._valuesListStore.clearAll();
			this.getNewTagsData();
			return false;
		});
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

	_removeValues(removedValues) {
		if (removedValues.length) {
			const valuesIds = removedValues.map(value => value._id);
			return transitionalAjax.deleteValues(valuesIds)
				.then(() => {
					this._changesValuesModel.clearItems("removed");
				});
		}
		return Promise.resolve(false);
	}

	_checkUniqueName(name, store, nameField) {
		const itemsArray = store.getArrayOfItems();
		const filteredArray = itemsArray.filter(obj => obj[nameField].toString().toLowerCase() === name.toString().toLowerCase());
		return filteredArray.length <= 1;
	}

	_searchByName(list, searchField) {
		const value = searchField.getValue();
		if (value) {
			list.filter(obj => (obj.value ? obj.value.includes(value) : obj.name.includes(value)));
		}
		else {
			list.filter();
		}
	}

	_validateItemText(view, id, pattern) {
		const editor = view.getEditor(id);
		const editorInput = editor.getInputNode();
		// validate text
		this.editInputEventId = webix.event(editorInput, "input", () => {
			const value = editor.getValue();
			const regex = new RegExp(pattern, "g");

			let validValue = value.match(regex) ? value.match(regex).join("") : "";
			editor.setValue(validValue);
			editorInput.focus();
		});
	}

	closeWindow() {
		this._valueColControls.searchField.setValue("");
		this._tagColControls.searchField.setValue("");
		this._valueColControls.list.filter();
		this._tagColControls.list.filter();
		// this._changesTagsModel.clearItems();
		// this._changesValuesModel.clearItems();
	}
}
