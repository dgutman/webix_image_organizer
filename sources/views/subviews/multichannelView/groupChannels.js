import hotkeysJS from "hotkeys-js";
import {JetView} from "webix-jet";

import HotkeysModel from "./model/hotkeysModel";
import HotkeysConfigWindow from "./windows/hotkeysConfig";
import stateStore from "../../../models/multichannelView/stateStore";

const GROUP_CHANNEL_LAYOUT_ID = `group-channel-layout-${webix.uid()}`;
const GROUP_CHANNELS_LIST_ID = `group-channel-list-${webix.uid()}`;
const GROUP_CHANNELS_OPACITY_SLIDER_ID = "group-channels-opacity-slider";

export default class GroupChannels extends JetView {
	constructor(app, groupsPanel, groupName, isHotkey) {
		super(app);
		this._isHotkey = isHotkey;
		this._hotkeyScope = isHotkey
			? `group-channels-hotkeys-scope-${webix.uid()}`
			: null;
		this._groupsPanel = groupsPanel;
		this._channelsGroupName = groupName;
		this._channelsSlidersContainersIds = new Map();
		this._hotkeysModel = isHotkey
			? new HotkeysModel(this._hotkeyScope)
			: null;
	}

	config() {
		return {
			localId: GROUP_CHANNEL_LAYOUT_ID,
			hidden: true,
			rows: [
				{
					cols: [
						{
							template: this._channelsGroupName,
							height: 30,
						},
						/** @type {webix.ui.icon} */
						{
							view: "icon",
							icon: "fas fa-tools",
							hidden: !this._isHotkey,
							width: 32,
							height: 32,
							click: () => {
								this._hotkeysConfigWindow.showWindow();
							},
							borderless: true
						}
					]
				},
				{
					view: "list",
					localId: GROUP_CHANNELS_LIST_ID,
					css: "groups-channels-list",
					drag: false,
					dragscroll: false,
					scroll: "auto",
					navigation: false,
					select: false,
					template: ({name, color, opacity, id}) => {
						const showIcon = opacity ? "fas fa-eye" : "fas fa-eye-slash";
						const focusIcon = "fas fa-dot-circle";
						const containerId = webix.uid();
						this._channelsSlidersContainersIds.set(id, containerId);
						const focusHotkey = this._hotkeyCounter;
						const focusTooltip = this._hotkeyCounter !== null
							? `<span webix_tooltip="Press ${focusHotkey} to show only this channel. Press 0 to show all channels." class="icon focus ${focusIcon}"></span>`
							: "";
						this.incrementHotkeyCounter();
						return `<div class="channel-item">
									<div class="channel-item__row-one">
										<span class="channel-item__name name">${name}</span>
										<div class="icons">
											<span style="color: ${color};" class="icon palette fas fa-square-full"></span>
											${focusTooltip}
											<span class="icon show ${showIcon}"></span>
											<span class="icon delete fas fa-minus-circle"></span>
										</div>
									</div>
									<div class="channel-item__row-two" style="height: 27px">
										<div class="channel-item__range-opacity" id="${containerId}"></div>
										<div class="icons channel-item__position-controls">
											<span class="icon up fas fa-chevron-up"></span>
											<span class="icon down fas fa-chevron-down"></span>
										</div>
									</div>
								</div>`;
					},
					type: {
						height: 80
					},
					on: {
						onAfterRender: () => {
							this.createChannelsSliders();
						},
						onDataUpdate: (/* id */) => {
							this.getChannelsList().refresh();
						}
					},
					onClick: {
						show: (ev, id) => {
							this.showOrHideChannel(id);
						},
						focus: (ev, id) => {
							this.focusOnChannel(id);
						},
						delete: (ev, id) => {
							this.removeChannel(id);
						},
						palette: (ev, id) => {
							this.showPaletteWindow(id);
						},
						up: (ev, id) => {
							this.moveChannelUp(id);
						},
						down: (ev, id) => {
							this.moveChannelDown(id);
						}
					}
				}
			]
		};
	}

	init(/* view */) {
		const channelsList = this.getChannelsList();
		this.on(channelsList.data, "onStoreUpdated", () => {
			const count = channelsList.count();
			const channelsLayout = this.getChannelsLayout();
			if (count) {
				channelsLayout.show();
			}
			else {
				channelsLayout.hide();
			}
		});
	}

	ready() {
		webix.TooltipControl.addTooltip(this.$$(GROUP_CHANNELS_LIST_ID).$view);
		if (this._isHotkey) {
			if (hotkeysJS.getScope() !== this._hotkeyScope) {
				hotkeysJS.setScope(this._hotkeyScope);
			}
			this.setHotkeys();
		}
		this._hotkeysConfigWindow = this._isHotkey
			? this.ui(new HotkeysConfigWindow(this.app, this._hotkeysModel))
			: null;
	}

	showOrHideChannel(id) {
		const channelList = this.getChannelsList();
		const channel = channelList.getItem(id);
		const channelIndex = channel.channelIndexInGroup;

		const channelOpacity = channel.opacity ? 0 : 1;

		channelList.updateItem(id, {opacity: channelOpacity});

		this._groupsPanel.getRoot().callEvent("changeChannelOpacity", [channelIndex, channelOpacity]);
	}

	focusOnChannel(id) {
		const channelList = this.getChannelsList();
		channelList.data.each((channel) => {
			const channelOpacity = 0;
			channelList.updateItem(channel.id, {opacity: channelOpacity});
			this.updateChannelOpacity(channel.channelIndexInGroup, channelOpacity);
		});
		const focusedChannel = channelList.getItem(id);
		const focusedChannelIndex = focusedChannel.channelIndexInGroup;
		const channelOpacity = 1;
		channelList.updateItem(id, {opacity: channelOpacity});
		this.updateChannelOpacity(focusedChannelIndex, channelOpacity);
	}

	_waitForChangesFromPaletteWindow(channel) {
		const channelList = this.getChannelsList();
		const colorWindow = this._groupsPanel.getColorWindow();
		const colorWindowRoot = colorWindow.getRoot();

		const changesAppliedEventId = colorWindowRoot.attachEvent("applyColorChange", (values) => {
			channelList.updateItem(channel.id, values);
			colorWindowRoot.detachEvent(changesAppliedEventId);
		});
		const colorChangedEventId = colorWindowRoot.attachEvent("colorChanged", (values) => {
			channelList.updateItem(channel.id, values);
		});
		const hideEventId = colorWindowRoot.attachEvent("onHide", () => {
			colorWindowRoot.detachEvent(changesAppliedEventId);
			colorWindowRoot.detachEvent(colorChangedEventId);
			colorWindowRoot.detachEvent(hideEventId);
			this._groupsPanel.getRoot().callEvent("channelColorAdjustEnd", [channel]);
		});
	}

	removeChannel(id) {
		const channelList = this.getChannelsList();
		const channel = channelList.getItem(id);
		const channelIndex = channel.channelIndexInGroup;
		channelList.remove(id);
		this._groupsPanel.getRoot().callEvent("removeChannel", [channelIndex]);
	}

	showPaletteWindow(id) {
		const channelList = this.getChannelsList();
		const channel = channelList.getItem(id);
		const channelNode = channelList.getItemNode(id);
		const {color, max, min} = channel;

		stateStore.adjustedChannel = channel;
		const colorWindow = this._groupsPanel.getColorWindow();
		colorWindow.showWindow({color, max, min}, channelNode, "left");
		this._groupsPanel.getRoot().callEvent("channelColorAdjustStart", [channel]);
		this._waitForChangesFromPaletteWindow(channel);
	}

	createChannelsSliders() {
		const channelList = this.getChannelsList();
		const channels = channelList.serialize();
		channels.forEach((channel) => {
			const containerId = this._channelsSlidersContainersIds.get(channel.id);
			const sliderContainerElement = document.getElementById(containerId);
			sliderContainerElement.innerHTML = "";
			const channelId = channel.id;
			const sliderView = this.createSlider(containerId, channel.opacity);
			this.on(sliderView, "onChange", (newValue) => {
				const channelIndex = channel.channelIndexInGroup;
				channelList.updateItem(channelId, {opacity: newValue});
				this.updateChannelOpacity(channelIndex, newValue);
			});
		});
	}

	createSlider(containerId, opacity) {
		const slider = {
			view: "slider",
			id: `${GROUP_CHANNELS_OPACITY_SLIDER_ID}-${webix.uid()}`,
			container: `${containerId}`,
			name: "opacity",
			max: 1,
			min: 0,
			step: 0.01,
			value: opacity,
			width: 100,
			height: 50
		};
		const sliderView = webix.ui(slider);
		return sliderView;
	}

	refreshChannelsSliders() {
		const channelList = this.getChannelsList();
		channelList.refresh();
	}

	updateChannelOpacity(channelIndex, newValue) {
		this._groupsPanel.getRoot().callEvent("changeChannelOpacity", [channelIndex, newValue]);
	}

	moveChannelUp(id) {
		const channelsList = this.getChannelsList();
		const channelIndex = channelsList.getIndexById(id);
		const channel = channelsList.getItem(id);
		const channelIndexInGroup = channel.channelIndexInGroup;
		if (channelIndex > 0) {
			channelsList.moveUp(id, 1);
			const switchedChannelId = channelsList.getIdByIndex(channelIndex);
			const switchedChannel = channelsList.getItem(switchedChannelId);
			const newChannelIndexInGroup = switchedChannel.channelIndexInGroup;
			channel.channelIndexInGroup = newChannelIndexInGroup;
			switchedChannel.channelIndexInGroup = channelIndexInGroup;
			this.handleChannelsOrderChange(newChannelIndexInGroup, channelIndexInGroup);
			this.refreshChannelsSliders();
		}
	}

	moveChannelDown(id) {
		const channelsList = this.getChannelsList();
		const channelIndex = channelsList.getIndexById(id);
		const channel = channelsList.getItem(id);
		const channelIndexInGroup = channel.channelIndexInGroup;
		if (channelIndex < channelsList.count()) {
			channelsList.moveDown(id, 1);
			const switchedChannelId = channelsList.getIdByIndex(channelIndex);
			const switchedChannel = channelsList.getItem(switchedChannelId);
			const newChannelIndexInGroup = switchedChannel.channelIndexInGroup;
			channel.channelIndexInGroup = newChannelIndexInGroup;
			switchedChannel.channelIndexInGroup = channelIndexInGroup;
			this.handleChannelsOrderChange(newChannelIndexInGroup, channelIndexInGroup);
			this.refreshChannelsSliders();
		}
	}

	setHotkeys() {
		const opacityResetHandler = this.resetOpacity.bind(this);
		const hotkeysArray = this._hotkeysModel.getHotkeysArray();
		this._hotkeysModel.addHotkey(hotkeysArray[0], opacityResetHandler);
		for (let index = 0; index < hotkeysArray.length; index++) {
			if (hotkeysArray[index + 1] !== "") {
				const hotkeyPressHandler = this.hotkeyPressHandler.bind(this, index);
				this._hotkeysModel.addHotkey(`${hotkeysArray[index + 1]}`, hotkeyPressHandler);
			}
		}
	}

	hotkeyPressHandler(channelIndexInGroup) {
		const channelList = this.getChannelsList();
		const item = channelList.find(obj => obj.channelIndexInGroup === channelIndexInGroup)[0];
		if (item) {
			this.focusOnChannel(item.id);
		}
	}

	resetOpacity() {
		const channelList = this.getChannelsList();
		channelList?.data?.each((channel) => {
			const channelOpacity = 1;
			channelList.updateItem(channel.id, {opacity: channelOpacity});
			this.updateChannelOpacity(channel.channelIndexInGroup, channelOpacity);
		});
	}

	incrementHotkeyCounter() {
		if (this._hotkeyCounter !== null) {
			switch (this._hotkeyCounter) {
				case 9:
					break;
				default:
					this._hotkeyCounter++;
					break;
			}
		}
	}

	clearHotkeys() {
		if (this._hotkeyCounter !== null) {
			for (let i = 1; i < 10; i++) {
				hotkeysJS.unbind(`${i}`);
			}
		}
	}

	clearList() {
		const list = this.getChannelsList();
		list.clearAll();
	}

	handleChannelsOrderChange(newChannelIndex, oldChannelIndex) {
		this._groupsPanel.handleChannelsOrderChange(newChannelIndex, oldChannelIndex);
	}

	/**
	 *
	 * @returns {webix.ui.list}
	 */
	getChannelsList() {
		return this.$$(GROUP_CHANNELS_LIST_ID);
	}

	getChannelsLayout() {
		return this.$$(GROUP_CHANNEL_LAYOUT_ID);
	}
}
