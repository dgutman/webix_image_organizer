define([
	"helpers/base_jet_view",
	"models/multichannel_view/hotkeysCollection",
	"models/multichannel_view/hotkeysSettingCollection"
], function(
	BaseJetView,
	hotkeysCollection,
	hotkeysSettingsCollection
) {
	"use strict";

	return class HotkeysConfigWindow extends BaseJetView {
		constructor(app, hotkeysModel) {
			super(app);
			/**
			 * @type {import("../model/hotkeysModel").HotkeysModel}
			 */
			this._hotkeysModel = hotkeysModel;
			const dataForHotkeysCollection = [{value: ""}];
			dataForHotkeysCollection.push(...hotkeysCollection.serialize());
			this._hotkeysCollection = new webix.DataCollection();
			this._hotkeysCollection.parse(dataForHotkeysCollection);
			/**
			 * @type {webix.DataCollection}
			 */
			this._closeButtonId = `close-button-id-${webix.uid()}`;
			this._hotkeysDatatableId = `layout-id-${webix.uid()}`;
			this.$oninit = () => {
				this.attachEvents();
			};
		}

		/**
		 * @returns {webix.ui.windowConfig}
		 */
		get $ui() {
			return {
				view: "window",
				id: this._rootId,
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
							value: 1,
							label: "Use letters",
							width: 200
						},
						{
							view: "button",
							localId: this._closeButtonId,
							label: "Close",
							width: 100,
							align: "right",
							click: () => {
								this.getRoot().hide();
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
							columns: [
								{
									id: "setting",
									header: "Setting",
									gravity: 1,
									fillspace: true
								},
								{
									id: "hotkey",
									header: "Hotkey",
									gravity: 1,
									editor: "select",
									fillspace: true,
									collection: this._hotkeysCollection
								}
							]
						}
					]

				}
			};
		}


		/**
		 *
		 * @returns {webix.ui.datatable}
		 */
		getHotkeysDatatable() {
			return this.$$(this._hotkeysDatatableId);
		}

		attachEvents() {
			const datatable = this.getHotkeysDatatable();
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
					duplicate.refresh();
				}
			});
			datatable.data.attachEvent("onDataUpdate", () => {
				const data = datatable.data.serialize().map(obj => obj.hotkey);
				this._hotkeysModel.setHotkeys(data);
			});
		}

		showWindow() {
			this.getRoot().show();
			const hotkeysDatatable = this.getHotkeysDatatable();
			hotkeysDatatable.clearAll();
			const data = [];
			const hotkeys = this._hotkeysModel.getHotkeysArray();
			const hotkeysCollectionElementsCount = hotkeysCollection.count();
			for (let index = 0; index < hotkeysCollectionElementsCount; index++) {
				const settingId = hotkeysSettingsCollection.getIdByIndex(index);
				data.push({
					hotkey: hotkeys[index],
					setting: hotkeysSettingsCollection.getItem(settingId).value
				});
			}
			hotkeysDatatable.parse(data);
		}
	};
});
