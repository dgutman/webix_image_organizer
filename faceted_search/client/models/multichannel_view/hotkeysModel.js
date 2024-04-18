
define([
	"constants",
	"models/multichannel_view/hotkeysCollection",
	"libs/hotkeys-js/dist/hotkeys"
], function(
	constants,
	hotkeysCollection,
	hotkeysJS
) {
	"use strict";
	return class HotkeysModel {
		constructor(scope) {
			this._scope = scope;
			/** @type {Set} */
			this._assignedKeysSet = new Set();
			/**
			 * @type {webix.DataCollection}
			 */
			this._hotkeysCollection = new webix.DataCollection();
			this.init();
			this.attachEvent();
		}
	
		init() {
			const storageHotkeysConfig = webix.storage.local.get(constants.STORAGE_HOTKEYS_CONFIG);
			if (storageHotkeysConfig) {
				this._hotkeysCollection.parse(storageHotkeysConfig);
			}
			else {
				const dataForHotkeysCollection = hotkeysCollection.serialize();
				this._hotkeysCollection.parse(dataForHotkeysCollection);
			}
		}
	
		attachEvent() {
			this._hotkeysCollection.attachEvent("onDataUpdate", () => this._scope.setHotkeys());
		}
	
		async addHotkey(hotkey, handler) {
			if (this._assignedKeysSet.has(hotkey)) {
				const result = await webix.confirm("This hotkey has been assigned. Please confirm this action", "confirm-warning");
				if (result) {
					hotkeysJS(hotkey, this._scope, handler);
				}
			}
			else {
				this._assignedKeysSet.add(hotkey);
				hotkeysJS(hotkey, this._scope, handler);
			}
		}
	
		deleteHotkey(hotkey) {
			if (this._assignedKeysSet.has(hotkey)) {
				hotkeysJS.unbind(hotkey, this._scope);
				this._assignedKeysSet.delete(hotkey);
			}
		}
	
		clearHotkeys() {
			this._assignedKeysSet.clear();
		}
	
		getHotkeysJSScope() {
			hotkeysJS.getScope();
		}
	
		getHotkeysArray() {
			return this._hotkeysCollection.serialize().map(obj => obj.value);
		}
	
		/**
		 * 
		 * @param {Array} data
		 */
		setHotkeys(data) {
			const isValid = this.validateHotkeys(data);
			if (isValid) {
				webix.storage.local.put(constants.STORAGE_HOTKEYS_CONFIG, data);
				this._hotkeysCollection.clearAll();
				this._hotkeysCollection.parse(data);
			}
		}
	
		validateHotkeys(data) {
			return !(data.indexOf(undefined) >= 0 || data.indexOf(null) >= 0);
		}
	
		setScope() {
			hotkeysJS.setScope(this._scope);
		}
	};
});
