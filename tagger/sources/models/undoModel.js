class UndoModel {
	constructor(button) {
		this.undoAction = "";
		this.dataStore = {};
		this.oldItems = [];
		this.undoButton = button;
	}

	setActionToUndo(items, store, action) {
		if (!Array.isArray(items)) {
			items = [items];
		}
		this.undoAction = action;
		this.oldItems = items;
		this.dataStore = store;
		this.changeUndoBtnState(true);
	}

	isEditOn() {
		const view = this.dataStore.getDataStoreView ? this.dataStore.getDataStoreView() : null;
		return view ? view.config.editable : false;
	}

	clearModel() {
		this.changeUndoBtnState();
		this.undoAction = "";
		this.dataStore = {};
		this.oldItems = [];
	}

	undoLastAction(edit) {
		if (edit || this.isEditOn()) {
			this.oldItems.forEach((item) => {
				switch (this.undoAction) {
					case "update": {
						this.dataStore.updateItem(item.id, item._id, item);
						break;
					}
					case "add": {
						this.dataStore.addItem(item);
						break;
					}
					case "remove": {
						this.dataStore.removeItem(item.id);
						break;
					}
					default: {
						break;
					}
				}
				this.dataStore.getDataStoreView().callEvent("undoButtonClicked", [item, this.undoAction]);
			});
			this.clearModel();
		}
	}

	clearDependentModel(dataStoreViewId) {
		if (this.dataStore.hasOwnProperty("dataStoreView")) {
			const dataStoreView = this.dataStore.getDataStoreView();
			if (dataStoreViewId === dataStoreView.config.id) {
				this.clearModel();
			}
		}
	}

	changeUndoBtnState(condition) {
		if (this.undoButton) {
			const buttonNode = this.undoButton.getNode();
			if (buttonNode) {
				if (condition) buttonNode.classList.add("enabled");
				else buttonNode.classList.remove("enabled");
			}
		}
	}
}

class UndoFactory {
	constructor() {
		this.models = {};
	}

	create(id, button) {
		if (!this.models[id]) {
			this.models[id] = new UndoModel(button);
		}
		return this.models[id];
	}

	get(id) {
		return new Promise((resolve) => {
			if (this.models[id]) {
				resolve(this.models[id]);
			}
			else {
				resolve(this.get(id));
			}
		});
	}

	clear() {
		this.models = {};
	}
}

const instance = new UndoFactory();

export default instance;
