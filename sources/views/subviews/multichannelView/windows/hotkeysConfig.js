import {JetView} from "webix-jet";

import constants from "../../../../constants";

export default class hotkeysConfigWindow extends JetView {
	constructor(app, hotkeysModel) {
		super(app);
		/**
		 * @type {import("../model/hotkeysModel").HotkeysModel}
		 */
		this._hotkeysModel = hotkeysModel;
		/**
		 * @type {webix.DataCollection}
		 */
		this._hotkeysSettings = this._hotkeysModel.getHotkeysSettings();
		/**
			 * @type {webix.DataCollection}
			 */
		this._numberHotkeysCollection = hotkeysModel.getNumberHotkeysCollection();
		/**
		 * @type {webix.DataCollection}
		 */
		this._allHotkeysValuesCollection = hotkeysModel.getAllHotkeysValuesCollection();
		this._closeButtonId = `close-button-id-${webix.uid()}`;
		this._hotkeysDatatableId = `layout-id-${webix.uid()}`;
		this._hotkeysDatatableId = `datatable-id-${webix.uid()}`;
		this._switchLettersId = `switch-id-${webix.uid()}`;
		this._settingsColumnId = "setting";
		this._hotkeysColumnId = "hotkey";
	}

	/**
	 * @returns {webix.ui.windowConfig}
	 */
	config() {
		return {
			view: "window",
			resize: true,
			move: true,
			width: 515,
			height: 600,
			position: "center",
			head: {
				view: "toolbar",
				cols: [
					{
						view: "label",
						label: "Hotkeys settings",
						width: 200
					},
					{gravity: 10},
					{
						view: "switch",
						id: this._switchLettersId,
						value: this._hotkeysModel.getLettersUsage(),
						label: "Use letters",
						width: 200,
						// hidden: true
					},
					{
						view: "button",
						localId: this._closeButtonId,
						label: "Close",
						width: 100,
						align: "right",
						click: () => {
							this.closeWindow();
						}
					}
				]
			},
			body: {
				rows: [
					/** @type {webix.ui.datatable} */
					{
						view: "datatable",
						localId: this._hotkeysDatatableId,
						editable: true,
						scroll: "y",
						columns: [
							{
								id: this._settingsColumnId,
								header: "Setting",
								gravity: 1,
								fillspace: true
							},
							{
								id: this._hotkeysColumnId,
								header: "Hotkey",
								gravity: 1,
								editor: "select",
								fillspace: true,
								collection: this._allHotkeysValuesCollection
							},
						]
					},
				]

			}
		};
	}

	init() {
		this.attachEvents();
	}

	ready() {}

	/**
	 *
	 * @return {webix.ui.datatable}
	 */
	getHotkeysDatatable() {
		return this.$$(this._hotkeysDatatableId);
	}

	getLetterSwitch() {
		return this.$$(this._switchLettersId);
	}

	getSwitchValue() {
		const switchView = this.getLetterSwitch();
		return switchView.getValue();
	}

	attachEvents() {
		const datatable = this.getHotkeysDatatable();
		const letterSwitch = this.getLetterSwitch();
		datatable.attachEvent("onEditorChange", async (cell, value) => {
			const item = datatable.getItem(cell.row);
			if (value === "") {
				return;
			}
			const duplicate = datatable.find(
				obj => obj.id !== item.id && obj.hotkey === value
			)[0];
			if (duplicate) {
				duplicate.hotkey = "";
				datatable.refresh();
			}
		});
		datatable.data.attachEvent("onDataUpdate", () => {
			const data = datatable.data.serialize().map(obj => obj.hotkey);
			this._hotkeysModel.setHotkeys(data);
		});
		letterSwitch.attachEvent("onChange", async (value, oldValue) => {
			webix.confirm({
				title: "Hotkeys",
				text: "This action will reset hotkeys to default. Continue?",
				ok: "Continue",
				cancel: "Cancel"
			})
				.then(() => {
					this._hotkeysModel.updateLettersUsage(value);
					this._hotkeysModel.updateHotkeysCollection();
					const data = this._hotkeysModel.getHotkeysValues();
					this._hotkeysModel.setHotkeys(data);
					this.updateDatatable();
				})
				.catch(() => {
					letterSwitch.blockEvent();
					letterSwitch.setValue(oldValue);
					letterSwitch.unblockEvent();
				});
		});
	}

	showWindow() {
		this.getRoot().show();
		this.updateDatatable();
	}

	updateDatatable() {
		const hotkeysDatatable = this.getHotkeysDatatable();
		hotkeysDatatable.clearAll();
		this.updateColumnsConfig();

		const data = [];

		const hotkeysValues = this._hotkeysModel.getHotkeysValues();
		const hotkeysCount = hotkeysValues.length;
		for (let index = 0; index < hotkeysCount; index++) {
			data.push({
				hotkey: hotkeysValues[index],
				setting: this._hotkeysSettings[index]
			});
		}
		hotkeysDatatable.parse(data);
		hotkeysDatatable.refresh();
	}

	updateColumnsConfig() {
		const switchValue = this.getSwitchValue();
		const hotkeysDatatable = this.getHotkeysDatatable();
		const hotkeysColumnConfig = hotkeysDatatable.getColumnConfig(this._hotkeysColumnId);
		hotkeysColumnConfig.collection = switchValue === constants.HOTKEYS_LETTERS_STATE.USE_LETTERS
			? this._allHotkeysValuesCollection
			: this._numberHotkeysCollection;
		hotkeysDatatable.refreshColumns();
		hotkeysDatatable.refresh();
	}

	closeWindow() {
		this.getRoot().hide();
	}
}
