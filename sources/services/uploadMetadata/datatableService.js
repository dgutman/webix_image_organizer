import dot from "dot-object";
import utils from "../../utils/utils";
import viewMouseEvents from "../../utils/viewMouseEvents";
import constants from "../../constants";
import metaDatatableModel from "../../models/metadataTableModel";
import ajaxActions from "../ajaxActions";
import downloadFiles from "../../models/downloadFiles";


export default class MetaDatatableService {
	constructor({datatable, rootInput, itemsCollection, itemsHash, imageWindow, pdfWindow, loadingWindow, compareWindow, view}) {
		this.datatable = datatable;
		this.itemsCollection = itemsCollection;
		this.itemsHash = itemsHash;
		this.rootInput = rootInput;
		this.imageWindow = imageWindow;
		this.pdfWindow = pdfWindow;
		this.loadingWindow = loadingWindow;
		this.compareWindow = compareWindow;
		this.view = view;
		this.suggestItems = new webix.DataCollection({
			scheme: {
				$init: (obj) => {
					obj.value = obj.name;
				}
			}
		});

		this.setDatatableEventsAndSettings();
	}

	setDatatableEventsAndSettings() {
		this.datatable.define("rules", {
			[constants.ITEM_NAME_COLUMN]: (value) => {
				const item = this.itemsCollection.getItem(value);
				const sidebarTree = this.view.$scope.sidebarTree;
				const selectedFolder = sidebarTree.getSelectedItem();
				return item && selectedFolder && item.folderId === selectedFolder._id;
			}
		});

		this.datatable.getNode().addEventListener("contextmenu", (e) => {
			e.preventDefault();
		});

		// set customizable datatable events
		const settingsValues = utils.getLocalStorageSettingsValues() || utils.getDefaultMouseSettingsValues();
		this.setSettingsMouseEvents(settingsValues);
		this.view.$scope.on(this.view.$scope.app, "change-event-settings", (values) => {
			this.setSettingsMouseEvents(values);
			utils.setLocalStorageSettingsValues(values);
		});

		this.datatable.attachEvent("onBeforeEditStart", (ids) => {
			const currentMetaItem = this.datatable.getItem(ids.row);
			this.datatable.editStop();
			if (currentMetaItem._accepted) return false;
			if (ids.column === constants.ITEM_NAME_COLUMN) {
				this.suggestItems.clearAll();
				const items = this.itemsCollection.data.serialize()
					.filter(item => !item._used);

				const itemId = currentMetaItem[ids.column];
				if (itemId && itemId !== "empty") {
					const item = this.itemsCollection.getItem(itemId) || {
						_type: "invalid",
						id: itemId,
						name: itemId
					};
					items.unshift(item);
				}

				items.unshift({
					_type: "invalid",
					id: "empty",
					name: "empty"
				});
				this.suggestItems.parse(items);
			}
		});

		this.datatable.attachEvent("onAfterEditStart", (cell) => {
			const editor = this.datatable.getEditor(cell);
			if (editor.column !== constants.ITEM_NAME_COLUMN) {
				editor.setValue(this.unescapeSpecChars(editor.value));
			}
		});

		this.datatable.attachEvent("onBeforeEditStop", (vals, editor) => {
			if (editor.column === constants.ITEM_NAME_COLUMN) {
				if (!vals.value && vals.old) {
					vals.value = vals.old;
				}
				const oldItem = this.itemsCollection.getItem(vals.old);
				const item = this.itemsCollection.getItem(vals.value);
				if (oldItem) oldItem._used = false;
				if (item) item._used = true;
			}
			else {
				vals.value = this.escapeSpecChars(vals.value);
			}
		});

		this.datatable.attachEvent("onItemClick", (ids, ev) => {
			const metaItem = this.datatable.getItem(ids.row);
			if (ids.column === "accept") {
				this.datatable.editStop();
				if (ev.target.classList.contains("accept-button-add")) {
					this.view.showProgress();
					if (this.validateMetaItem(metaItem)) {
						this.getComparedMetadata(metaItem)
							.then(compared => this.acceptMetadata(compared))
							.finally(() => {
								this.compareWindow.loadingEnded();
								this.view.hideProgress();
							});
					}
					return false;
				}
				else if (ev.target.classList.contains("accept-button-delete")) {
					this.removeNewMetadata(metaItem);
					return false;
				}
			}
		});

		this.datatable.on_click["adjust-icon"] = (e, obj) => {
			const columnId = obj.column;
			this.datatable.adjustColumn(columnId, "all");
			return false;
		};
	}

	acceptAllMetadata() {
		this.datatable.editStop();
		const data = this.datatable.data.serialize();
		const bottomForm = this.view.$scope.bottomForm;

		const validation = bottomForm.validate();
		if (validation) {
			const allItems = data.filter(metaItem => this.validateMetaItem(metaItem));

			return this.confirmLongLoading(allItems.length)
				.then(() => Promise.all(allItems.map(metaItem => this.getComparedMetadata(metaItem))))
				.then((validMetadata) => {
					this.loadingWindow.showWindow({accepted: 0, valid: allItems.length});
					return this.acceptStepByStep(validMetadata, [])
						.then((items) => {
							const acceptedCount = items.filter(item => item).length;
							const message = acceptedCount ? `Metadata for ${acceptedCount} item(s) was successfully added` : "There are no valid items";
							if (!acceptedCount) this.loadingWindow.closeWindow();
							webix.message(message);
						})
						.finally(() => {
							this.compareWindow.loadingEnded();
							this.loadingWindow.loadingEnded();
						});
				})
				.catch(() => Promise.resolve(false));
		}
		return Promise.resolve(false);
	}

	acceptStepByStep(arr, acceptedData) {
		const templateValues = this.loadingWindow.progressInfo;
		templateValues.accepted = acceptedData.length;
		this.loadingWindow.progressInfo = templateValues;

		if (arr.length) {
			const arrPart = arr.splice(0, constants.ACCEPT_METADATA_LIMIT);
			return Promise.all(arrPart.map(item => this.acceptMetadata(item)
				.catch((err) => {
					if (err instanceof XMLHttpRequest && !err.status) {
						this.loadingWindow.errorOccurred();
						return Promise.reject(err);
					}
				})))
				.then(newAppliedData => this.acceptStepByStep(arr, acceptedData.concat(newAppliedData)));
		}
		return Promise.resolve(acceptedData);
	}

	acceptMetadata(metaItem) {
		const item = this.itemsCollection.getItem(metaItem.itemId);

		const promise = Object.keys(metaItem.meta).length ? ajaxActions.updateItemMetadata(item._id, metaItem.meta) : Promise.resolve(item);
		return promise.then((data) => {
			this.datatable.updateItem(metaItem.metaId, {
				_accepted: true,
				_acceptedMeta: {id: item.id, meta: metaItem.meta, oldMeta: webix.copy(item.meta || {})}
			});
			this.itemsCollection.updateItem(item.id, data);
			return data;
		});
	}

	getComparedMetadata(metaItem) {
		const item = this.itemsCollection.getItem(metaItem[constants.ITEM_NAME_COLUMN]);

		const rootValue = this.rootInput.getValue();
		const metaObj = this.clearMetaObject(metaItem);
		let meta = metaObj;
		if (rootValue) {
			meta = {};
			dot.str(rootValue, metaObj, meta);
		}
		return this.compareWindow.compareMetadata(item, meta, rootValue, metaItem.id);
	}

	validateMetaItem(metaItem) {
		const sidebarTree = this.view.$scope.sidebarTree;
		const selectedFolder = sidebarTree.getSelectedItem();
		const item = this.itemsCollection.getItem(metaItem[constants.ITEM_NAME_COLUMN]);

		return item && item.folderId === selectedFolder._id && !metaItem._accepted;
	}

	removeNewMetadata(metaItem) {
		const item = this.itemsCollection.getItem(metaItem._acceptedMeta.id);

		let fieldsToDelete = Object.keys(metaItem._acceptedMeta.meta || {});
		// substitute fields if it possible to optimize the process
		let fieldsToReturn = Object.keys(metaItem._acceptedMeta.oldMeta).filter(field => fieldsToDelete.includes(field));
		fieldsToDelete = fieldsToDelete.filter(field => !fieldsToReturn.includes(field));
		const metaToReturn = fieldsToReturn
			.reduce((acc, a) => ({...acc, [a]: metaItem._acceptedMeta.oldMeta[a]}), {});

		if (item) {
			const removeMetaPromise = fieldsToDelete.length ? ajaxActions.deleteItemMetadata(item._id, fieldsToDelete, item._modelType) : Promise.resolve(item);
			this.view.showProgress();
			return removeMetaPromise
				.then(data => (fieldsToReturn.length ? ajaxActions.updateItemMetadata(item._id, metaToReturn) : data)) // return old metadata
				.then((data) => {
					delete metaItem._accepted;
					delete metaItem._acceptedMeta;

					this.datatable.updateItem(metaItem.id, metaItem);
					this.itemsCollection.updateItem(item.id, data);
					this.view.hideProgress();
				})
				.catch(() => {
					this.view.hideProgress();
				});
		}
		return Promise.resolve(false);
	}

	clearMetaObject(meta) {
		const copy = webix.copy(meta);
		const keys = Object.keys(copy);
		keys.forEach((key) => {
			switch (key) {
				case "id":
				case "_accepted":
				case "_acceptedMeta":
				case constants.ITEM_NAME_COLUMN: {
					delete copy[key];
					break;
				}
				default: {
					break;
				}
			}
		});
		return copy;
	}

	setValidItems(arr) {
		return arr.map((obj) => {
			delete obj[""];
			const itemName = obj[constants.ITEM_NAME_COLUMN];
			if (!itemName) {
				obj[constants.ITEM_NAME_COLUMN] = "empty";
				return obj;
			}
			const item = this.itemsCollection.getItem(itemName) || this.itemsHash[itemName];
			if (item) {
				obj[constants.ITEM_NAME_COLUMN] = item.id;
				item._used = true;
			}
			return obj;
		});
	}

	getColumnConfig(fields) {
		const columnConfig = fields.map((field) => {
			if (!field) return null;
			if (field === constants.ITEM_NAME_COLUMN) {
				return this.getItemNameColumn();
			}
			return {
				id: field,
				header: (() => {
					const name = field.charAt(0).toUpperCase() + field.slice(1);
					return `<div class='upload-metadata-column-header'>
						<span title='${name}' class='column-header-name ellipsis-text'>${name}</span>
						<i title='Adjust column' class="adjust-icon fas fa-arrows-alt-h"></i>
					</div>`;
				})(),
				tooltip: obj => obj[field] || "",
				editor: "text",
				sort: "raw",
				width: 150,
				minWidth: 20
			};
		});

		columnConfig.push({
			id: "accept",
			header: "Accept",
			template: (obj) => {
				const icon = obj._accepted ? "fa-minus-circle accept-button-delete" : "fa-plus-circle accept-button-add";
				return `<div title='Accept metadata' style='text-align: center'><i class='accept-button fas ${icon}'></i></div>`;
			},
			width: 70
		});
		return columnConfig.filter(column => column);
	}

	getItemNameColumn() {
		return {
			id: constants.ITEM_NAME_COLUMN,
			header: "Filename",
			sort: "raw",
			adjust: true,
			fillspace: true,
			minWidth: 250,
			editor: "combo",
			template: (obj) => {
				const itemId = obj[constants.ITEM_NAME_COLUMN];
				const item = this.itemsCollection.getItem(itemId);
				return item ? metaDatatableModel.setFaIconsForDatatable(item) : `<span style='color: red'>${itemId}</span>`;
			},
			suggest: {
				body: {
					data: this.suggestItems,
					css: "ellipsis-text",
					template: obj => `<span title='${obj.name}'>${obj.name}</span>`
				},
				filter: (obj, value) => obj.name.toString().toLowerCase().includes(value.toLowerCase())
			}
		};
	}

	setSettingsMouseEvents(values) {
		const valueKeys = Object.keys(values);
		valueKeys.forEach((key) => {
			const event = viewMouseEvents.getMouseWebixEvent(key);
			this.setSingleMouseEvent(values[key], event);
		});
	}

	setSingleMouseEvent(action, event) {
		// prevent select for datatable
		this.datatable.attachEvent("onBeforeSelect", () => false);
		this.datatable.detachEvent(event);
		switch (action) {
			case "open": {
				this.datatable.attachEvent(event, (ids) => {
					const metaItem = this.datatable.getItem(ids.row);
					const item = this.itemsCollection.getItem(metaItem[constants.ITEM_NAME_COLUMN]);
					if (item) downloadFiles.openOrDownloadFiles(item, this.imageWindow, this.pdfWindow);
				});
				break;
			}
			case "edit": {
				this.datatable.attachEvent(event, (ids, e) => {
					e.preventDefault();
					const config = this.datatable.getColumnConfig(ids.column);
					if (config.editor) {
						this.datatable.edit(ids);
					}
					return false;
				});
				break;
			}
			case "select": {
				this.datatable.attachEvent(event, (ids) => {
					if (ids.column !== "accept") {
						this.datatable.blockEvent();
						this.datatable.select(ids.row);
						this.datatable.unblockEvent();
						this.datatable.callEvent("onAfterSelect", [ids]);
					}
				});
				break;
			}
			default:
				break;
		}
	}

	confirmLongLoading(count) {
		const milliseconds = constants.ESTIMATED_LOADING_TIME / 100 * count;
		const minutes = Math.round(milliseconds / 60000);
		if (!minutes) return Promise.resolve(true);
		return webix.confirm({
			text: `This process may take ${minutes} minute(s). Do you want to continue?`,
			type: "confirm-warning",
			ok: "Yes",
			cancel: "No"
		});
	}

	escapeSpecChars(string) {
		return string
			.replace(/>/g, "&gt;")
			.replace(/</g, "&lt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;");
	}

	unescapeSpecChars(string) {
		return string
			.replace(/&gt;/g, ">")
			.replace(/&lt;/g, "<")
			.replace(/&quot;/g, "\"")
			.replace(/&apos;/g, "'");
	}
}
