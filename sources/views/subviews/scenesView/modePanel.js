import {JetView} from "webix-jet";
import constants from "../../../constants";

const MODE_PANEL_ID = "mode-panel-id";
const MODE_RADIO_BUTTON_ID = "mode-radio-button";
const COMBINE_CONTROL_ID = "combine-control";
const SYNC_CONTROL_ID = "sync-control";
const POINTS_RADIO_BUTTON_ID = "points-radio-button";

const CHANGE_MODE_EVENT = constants.SCENES_VIEW_CHANGE_MODE_EVENT_NAME;
const CHANGE_POINTS_MODE_EVENT = constants.SCENES_VIEW_CHANGE_POINTS_MODE_EVENT_NAME;

export default class ModePanelView extends JetView {
	constructor(app, config = {}) {
		super(app, config);

		this._cnf = config;
	}

	config() {
		return {
			...this._cnf,
			localId: MODE_PANEL_ID,
			paddingX: 5,
			margin: 15,
			cols: [
				{
					view: "radio",
					localId: MODE_RADIO_BUTTON_ID,
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
					localId: COMBINE_CONTROL_ID,
					hidden: true
				}),
				this._createCheckbox({
					label: "Sync",
					labelWidth: 40,
					width: 60,
					localId: SYNC_CONTROL_ID,
					hidden: true
				}),
				{width: 15},
				{
					view: "radio",
					localId: POINTS_RADIO_BUTTON_ID,
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
				{}
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

		this.on(modeRadioButton, "onChange", (id) => {
			let hideSyncCheckbox = true;
			const isSplit = id === "split";
			if (isSplit) {
				pointsRadio.show();
				hideSyncCheckbox = combineCheckbox.getValue();
			}
			this._togglePointsRadioVisibility(!isSplit);
			this._toggleCombineCheckboxVisibility(!isSplit);
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

	$modeRadioButton() {
		return this.$$(MODE_RADIO_BUTTON_ID);
	}

	$combineCheckbox() {
		return this.$$(COMBINE_CONTROL_ID);
	}

	$syncCheckbox() {
		return this.$$(SYNC_CONTROL_ID);
	}

	$pointsRadio() {
		return this.$$(POINTS_RADIO_BUTTON_ID);
	}

	$modePanel() {
		return this.$$(MODE_PANEL_ID);
	}
}
