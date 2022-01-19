define([
], function() {
	'use strict';
	return class SelectedItems {
		constructor(webixView) {
			this._dataStore = webixView.data;
	
			this._selectedItems = new Map();
		}
	
		select(item) {
			const items = this._convertToArray(item);
	
			items.forEach((obj) => {
				if (!obj || !obj.id) {
					return;
				}
				obj.id = parseInt(obj.id);
	
				this._selectedItems.set(obj.id, webix.copy(obj));
			});
		}
	
		unselect(item) {
			const items = this._convertToArray(item);
	
			items.forEach((obj) => {
				this._selectedItems.delete(obj.id);
			});
		}
	
		isSelected(id) {
			if (!this._dataStore.pull) {
				return;
			}
			const item = this._dataStore.getItem(id);
			return this._selectedItems.has(item.id);
		}
	
		unselectAll() {
			this._selectedItems.clear();
		}
	
		selectAll() {
			const items = this._dataStore.serialize();
			this.select(items);
		}
	
		getSelectedIds() {
			return Array.from(this._selectedItems.keys());
		}
	
		getSelectedItems() {
			return Array.from(this._selectedItems.values());
		}
	
		_convertToArray(items) {
			if (!Array.isArray(items)) {
				items = [items];
			}
			return items.map((itemOrId) => {
				if (typeof itemOrId === "object" && itemOrId) {
					return itemOrId;
				}
				return this._dataStore.getItem(itemOrId);
			}).filter(item => item);
		}
	}	
});