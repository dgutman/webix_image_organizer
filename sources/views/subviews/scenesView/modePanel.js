import {JetView} from "webix-jet";

import constants from "../../../constants";

const MODE_PANEL_ID = "mode-panel-id";
const MODE_RADIO_BUTTON_ID = "mode-radio-button";
const COMBINE_CONTROL_ID = "combine-control";
const SYNC_CONTROL_ID = "sync-control";
const POINTS_RADIO_BUTTON_ID = "points-radio-button";
const IMAGES_ORIENTATION_SWITCH_ID = "images-orientation-switch-id";

const CHANGE_MODE_EVENT = constants.SCENES_VIEW_CHANGE_MODE_EVENT_NAME;
const CHANGE_POINTS_MODE_EVENT = constants.SCENES_VIEW_CHANGE_POINTS_MODE_EVENT_NAME;
const REPOSITION_IMAGES_EVENT = constants.REPOSITION_IMAGES_EVENT_NAME;

export default class ModePanelView extends JetView {
	constructor(app, config = {}) {
		super(app, config);

		this._cnf = config;
		this._modePanelId = `${MODE_PANEL_ID}-${webix.uid()}`;
		this._modeRadioButtonId = `${MODE_RADIO_BUTTON_ID}-${webix.uid()}`;
		this._combineControlId = `${COMBINE_CONTROL_ID}-${webix.uid()}`;
		this._syncControlId = `${SYNC_CONTROL_ID}-${webix.uid()}`;
		this._pointsRadioButtonId = `${POINTS_RADIO_BUTTON_ID}-${webix.uid()}`;
		this._imagesOrientationSwitchId = `${IMAGES_ORIENTATION_SWITCH_ID}-${webix.uid()}`;
	}

	config() {
		const imagesOrientationSwitchConfig = {
			view: "switch",
			localId: this._imagesOrientationSwitchId,
			onLabel: "Vertical",
			offLabel: "Horizontal",
			width: 250,
			hidden: true,
			label: "Arrange images: ",
			labelWidth: 120,
		};
		return {
			...this._cnf,
			localId: MODE_PANEL_ID,
			paddingX: 5,
			margin: 15,
			cols: [
				{
					view: "radio",
					localId: this._modeRadioButtonId,
					label: "Mode:",
					labelWidth: 50,
					width: 210,
					value: "single",
					options: [
						{id: "single", value: "Single"},
						{id: "split", value: "Split"}
					]
				},
				this._createCheckbox({
					label: "Combine",
					labelWidth: 70,
					width: 90,
					localId: this._combineControlId,
					hidden: true
				}),
				this._createCheckbox({
					label: "Sync",
					labelWidth: 40,
					width: 60,
					localId: this._syncControlId,
					hidden: true
				}),
				{width: 15},
				{
					view: "radio",
					localId: this._pointsRadioButtonId,
					label: "Points:",
					labelWidth: 60,
					width: 300,
					hidden: true,
					value: "off",
					options: [
						{id: "add", value: "Add"},
						{id: "remove", value: "Remove"},
						{id: "off", value: "Off"}
					]
				},
				{width: 15},
				imagesOrientationSwitchConfig,
				{},
			]
		};
	}

	ready() {
		this._attachControlEvents();
	}

	_attachControlEvents() {
		const modeRadioButton = this.$modeRadioButton();
		const combineCheckbox = this.$combineCheckbox();
		const syncCheckbox = this.$syncCheckbox();
		const pointsRadio = this.$pointsRadio();
		const imagesOrientationSwitch = this.$imageOrientationSwitch();

		this.on(modeRadioButton, "onChange", (id) => {
			let hideSyncCheckbox = true;
			const isSplit = id === "split";
			if (isSplit) {
				pointsRadio.show();
				hideSyncCheckbox = combineCheckbox.getValue();
			}
			this._togglePointsRadioVisibility(!isSplit);
			this._toggleCombineCheckboxVisibility(!isSplit);
			// TODO: uncomment after osd view fix
			// TODO: recreate osd templates by makeSplitView
			// this._toggleImagesOrientationSwitchVisibility(!isSplit);
			this._toggleSyncCheckboxVisibility(hideSyncCheckbox);
			this._callModeChangeEvent(id);
		});

		this.on(combineCheckbox, "onChange", (value) => {
			if (value) {
				this._callModeChangeEvent("combine");
			}
			else {
				this._callModeChangeEvent("uncombine");
			}
			this._togglePointsRadioVisibility(value);
			this._toggleSyncCheckboxVisibility(value);
		});

		this.on(syncCheckbox, "onChange", (value) => {
			if (value) {
				this._callModeChangeEvent("sync");
			}
			else {
				this._callModeChangeEvent("unsync");
			}
		});

		this.on(pointsRadio, "onChange", (value) => {
			this._callPointsChangeEvent(value);
		});

		this.on(imagesOrientationSwitch, "onChange", (value) => {
			this._callRepositionImagesEvent(value);
		});
	}

	_toggleSyncCheckboxVisibility(hide) {
		const syncCheckbox = this.$syncCheckbox();
		syncCheckbox.blockEvent();
		if (hide) {
			syncCheckbox.setValue(0);
			syncCheckbox.hide();
		}
		else {
			syncCheckbox.show();
		}
		syncCheckbox.unblockEvent();
	}

	_toggleCombineCheckboxVisibility(hide) {
		const combineCheckbox = this.$combineCheckbox();
		combineCheckbox.blockEvent();
		if (hide) {
			combineCheckbox.setValue(0);
			combineCheckbox.hide();
		}
		else {
			combineCheckbox.show();
		}
		combineCheckbox.unblockEvent();
	}

	_togglePointsRadioVisibility(hide) {
		const pointsRadio = this.$pointsRadio();
		if (hide) {
			pointsRadio.hide();
		}
		else {
			pointsRadio.show();
		}
	}

	_toggleImagesOrientationSwitchVisibility(hide) {
		const switchButton = this.$imageOrientationSwitch();
		if (hide) {
			switchButton.hide();
		}
		else {
			switchButton.show();
		}
	}

	_createCheckbox(config) {
		return {
			...config,
			view: "checkbox",
			css: "checkbox-ctrl"
		};
	}

	_callModeChangeEvent(value) {
		this.getRoot().callEvent(CHANGE_MODE_EVENT, [value]);
	}

	_callPointsChangeEvent(value) {
		this.getRoot().callEvent(CHANGE_POINTS_MODE_EVENT, [value]);
	}

	_callRepositionImagesEvent(value) {
		this.getRoot().callEvent(REPOSITION_IMAGES_EVENT, [value]);
	}

	$modeRadioButton() {
		return this.$$(this._modeRadioButtonId);
	}

	$combineCheckbox() {
		return this.$$(this._combineControlId);
	}

	$syncCheckbox() {
		return this.$$(this._syncControlId);
	}

	$pointsRadio() {
		return this.$$(this._pointsRadioButtonId);
	}

	$modePanel() {
		return this.$$(this._modePanelId);
	}

	$imageOrientationSwitch() {
		return this.$$(this._imagesOrientationSwitchId);
	}
}
