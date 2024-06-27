import hotkeysJS from "hotkeys-js";

import hotkeysSettings from "./hotkeysSettings";
import constants from "../../../../constants";
import hotkeysKeysModel from "../../../../models/hotkeyKeys";

/**
 * Description placeholder
 * @class hotkeysModel
 * @typedef {HotkeysModel}
 */
export default class HotkeysModel {
	/**
	 *
	 * @param {import("../groupChannels").default} scope
	 */
	constructor(scope, hotkeyScope) {
		this._scope = scope;
		this._hotkeyScope = hotkeyScope;
		/** @type {Set} */
		this._assignedKeysSet = new Set();
		/**
		 * @type {webix.DataCollection}
		 */
		this._hotkeysCollection = new webix.DataCollection();
		this._hotkeysNumberValuesCollection = new webix.DataCollection();
		this._allHotkeysValuesCollection = new webix.DataCollection();
		this._hotkeySettings = hotkeysSettings;
		this._lettersUsage = webix.storage.local.get(constants.STORAGE_HOTKEYS_LETTERS_USAGE)
			?? constants.HOTKEYS_LETTERS_STATE.DISABLE_LETTERS;
		this.init();
		this.attachEvent();
	}

	init() {
		const storageHotkeys = webix.storage.local.get(constants.STORAGE_HOTKEYS_CONFIG);
		const numberKeys = hotkeysKeysModel.getNumberKeys();
		const letterKeys = hotkeysKeysModel.getLetterKeys();
		if (storageHotkeys) {
			this._hotkeysCollection.parse(storageHotkeys);
		}
		else {
			const data = numberKeys.concat(letterKeys);
			this._hotkeysCollection.parse(data);
		}
		this._hotkeysNumberValuesCollection.parse(numberKeys);
		this._allHotkeysValuesCollection.parse(numberKeys.concat(letterKeys));
	}

	attachEvent() {
		this._hotkeysCollection.attachEvent("onAfterLoad", () => {
			this.clearHotkeys();
			this._scope.setHotkeys();
		});
	}

	async addHotkey(hotkey, handler) {
		if (this._assignedKeysSet.has(hotkey)) {
			const result = await webix.confirm("This hotkey has been assigned. Please confirm this action", "confirm-warning");
			if (result) {
				hotkeysJS(hotkey, this._hotkeyScope, handler);
			}
		}
		else {
			this._assignedKeysSet.add(hotkey);
			hotkeysJS(hotkey, this._hotkeyScope, handler);
		}
	}

	deleteHotkey(hotkey) {
		if (this._assignedKeysSet.has(hotkey)) {
			hotkeysJS.unbind(hotkey, this._hotkeyScope);
			this._assignedKeysSet.delete(hotkey);
		}
	}

	getHotkeysJSScope() {
		hotkeysJS.getScope();
	}

	setHotkeyScope() {
		hotkeysJS.setScope(this._hotkeyScope);
	}

	clearHotkeyScope() {
		hotkeysJS.deleteScope(this._hotkeyScope);
	}

	getHotkeysCollection() {
		return this._hotkeysCollection;
	}

	getHotkeysValues() {
		return this._hotkeysCollection.serialize().map(obj => obj.value);
	}

	getNumberHotkeysArray() {
		return this._hotkeysNumberValuesCollection.serialize().map(obj => obj.value);
	}

	getNumberHotkeysCollection() {
		return this._hotkeysNumberValuesCollection;
	}

	getAllHotkeysValues() {
		return this._allHotkeysValuesCollection.serialize().map(obj => obj.value);
	}

	getAllHotkeysValuesCollection() {
		return this._allHotkeysValuesCollection;
	}

	getHotkeysSettings() {
		return this._hotkeySettings;
	}

	/**
	 *
	 * @param {Array} data
	 */
	setHotkeys(data) {
		const isValid = this.validateHotkeys(data);
		if (isValid) {
			webix.storage.local.put(constants.STORAGE_HOTKEYS_CONFIG, data);
			webix.storage.local.put(constants.STORAGE_HOTKEYS_LETTERS_USAGE, this._lettersUsage);
			this._hotkeysCollection.clearAll();
			this._hotkeysCollection.parse(data);
		}
	}

	validateHotkeys(data) {
		return !(data.indexOf(undefined) >= 0 || data.indexOf(null) >= 0);
	}

	updateHotkeysCollection() {
		// TODO: IOISFD-514 check storage
		this._hotkeysCollection.clearAll();
		const numberKeys = hotkeysKeysModel.getNumberKeys();
		const letterKeys = hotkeysKeysModel.getLetterKeys();
		if (this._lettersUsage) {
			this._hotkeysCollection.parse(numberKeys.concat(letterKeys));
		}
		else {
			this._hotkeysCollection.parse(numberKeys);
		}
	}

	getLettersUsage() {
		return this._lettersUsage;
	}

	updateLettersUsage(value) {
		this._lettersUsage = value;
	}

	clearHotkeys() {
		this._assignedKeysSet.clear();
		this.clearHotkeyScope();
		this.setHotkeyScope();
	}
}
