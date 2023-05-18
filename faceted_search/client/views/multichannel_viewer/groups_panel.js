define([
	"helpers/base_jet_view",
	"helpers/math_calculations",
	"models/multichannel_view/state_store",
	"windows/color_picker_window",
	"constants",
	"libs/hotkeys-js/dist/hotkeys"
], function(
	BaseJetView,
	MathCalculations,
	stateStore,
	ColorPickerWindow,
	constants,
	hotkeys
) {
	'use strict';
	const GROUPS_LIST_ID = "groups-list";
	const GROUP_CHANNELS_LIST_ID = "groups-channels-list";
	const GROUP_CHANNELS_LAYOUT_ID = "group-channels-layout";
	const GROUPS_TEXT_SEARCH_ID = "groups-search-field";
	const UPLOADER_API_ID = "uploader-api";
	const GROUPS_TITLE_TEMPLATE = "groups-title";
	const GENERATE_SCENE_FROM_TEMPLATE_ID = "apply-color-template-button";
	const GROUP_CHANNELS_OPACITY_SLIDER_ID = "group-channels-opacity-slider";

	return class GroupsPanel extends BaseJetView {
		constructor(app, config = {}, colorWindow) {
			super(app);

			this._cnf = config;
			this._channelsSlidersContainersIds = new Map();
			this._hotkeyCounter = 1;

			this.$oninit = () => {
				const view = this.getRoot();

				webix.extend(view, webix.OverlayBox);
				webix.TooltipControl.addTooltip(this.$$(GROUPS_TITLE_TEMPLATE).$view);

				this._colorWindow = colorWindow;
		
				const groupsList = this.getGroupsList();
				const channelsList = this.getGroupsChannelsList();
				const generateSceneFromTemplateButton = this.getGenerateSceneFromTemplateButton();
		
				groupsList.attachEvent("onSelectChange", () => {
					this.updateSelectedGroupTiles();
				});
		
				channelsList.data.attachEvent("onStoreUpdated", () => {
					const count = channelsList.count();
					const channelsLayout = this.getChannelsLayout();
					if (count) {
						channelsLayout.show();
					}
					else {
						channelsLayout.hide();
					}
				});

				generateSceneFromTemplateButton.attachEvent("onItemClick", () => {
					const groupId = this.getGroupsList().getSelectedId();
					this.getRoot().callEvent("generateSceneFromTemplate", [groupId]);
				});
			};
		}

		get $ui() {
			return {
				...this._cnf,
				id: this._rootId,
				rows: [
					{
						css: "groups-panel__groups-header groups-header",
						localId: GROUPS_TITLE_TEMPLATE,
						borderless: true,
						template: () => `Groups: <div>
								<span class="export icon mdi mdi-download" webix_tooltip="download groups"></span>
								<span class="import icon mdi mdi-upload" title="import groups from file"></span>
							</div>`,
						height: 30,
						onClick: {
							export: () => {
								this.exportGroups();
							},
							import: () => {
								this.importGroups();
							}
						}
					},
					{
						view: "text",
						css: "text-field",
						placeholder: "Search...",
						localId: GROUPS_TEXT_SEARCH_ID,
						on: {
							onTimedKeyPress: () => {
								const value = this.getGroupsSearch().getValue();
								this.getGroupsList().filter(({name}) => {
									if (!value) {
										return true;
									}
									return name.toLowerCase().includes(value.toLowerCase());
								});
							}
						}
					},
					{
						view: "list",
						localId: GROUPS_LIST_ID,
						css: "groups-list",
						drag: "target",
						scroll: "auto",
						navigation: false,
						select: true,
						tooltip: ({name}) => name,
						template: ({name}) => `<span class="group-item__name name ellipsis-text">${name}</span>
							<div class="icons">
								<span class="icon delete mdi mdi-minus-circle"></span>
							</div>`,
						onClick: {
							delete: (ev, id) => {
								this.removeGroup(id);
							}
						}
					},
					{
						cols: [
							{
								view: "button",
								id: GENERATE_SCENE_FROM_TEMPLATE_ID,
								value: "Generate Scene From Template"
							}
						]
					},
					{
						localId: GROUP_CHANNELS_LAYOUT_ID,
						hidden: true,
						rows: [
							{
								template: "Group channels:",
								height: 30
							},
							{
								view: "list",
								localId: GROUP_CHANNELS_LIST_ID,
								css: "groups-channels-list",
								drag: false,
								scroll: "auto",
								navigation: false,
								select: false,
								template: ({name, color, opacity, id}) => {
									const showIcon = opacity ? "mdi mdi-eye" : "mdi mdi-eye-off";
									const focusIcon = "mdi mdi-radiobox-blank";
									const containerId = webix.uid();
									this._channelsSlidersContainersIds.set(id, containerId);
									const iconElementId = webix.uid();
									this.setHotkeyToIcon(iconElementId);
									// Save focusHotkey value before call incrementHotkeyCounter 	function
									const focusHotkey = this._hotkeyCounter;
									this.incrementHotkeyCounter();
									return `<div class="channel-item">
										<div class="channel-item__row-one">
											<span class="channel-item__name name">${name}</span>
											<div class="icons">
												<span style="color: ${color};" class="icon palette mdi mdi-square"></span>
												<span webix_tooltip="Press ${focusHotkey} to show only this channel. Press 0 to show all channels." class="icon focus ${focusIcon}" id="${iconElementId}"></span>
												<span class="icon show ${showIcon}"></span>
												<span class="icon delete mdi mdi-minus-circle"></span>
											</div>
										</div>
										<div class="channel-item__row-two" style="height: 27px">
											<div class="channel-item__range-opacity" id="${containerId}"></div>
											<div class="icons channel-item__position-controls">
												<span class="icon up mdi mdi-chevron-up"></span>
												<span class="icon down mdi mdi-chevron-down"></span>
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
										this.resetHotkeyCounter();
										this.clearHotkeys();
										this.getGroupsChannelsList().refresh();
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
					},
					{
						view: "uploader",
						localId: UPLOADER_API_ID,
						apiOnly: true,
						height: 1,
						autosend: false,
						multiple: false
					}
				]
			};
		}

		createChannelsSliders() {
			const channelList = this.getGroupsChannelsList();
			const channels = channelList.serialize();
			channels.forEach((channel) => {
				const containerId = this._channelsSlidersContainersIds.get(channel.id);
				const sliderContainerElement = document.getElementById(containerId);
				sliderContainerElement.innerHTML = "";
				const channelId = channel.id;
				const sliderView = this.createSlider(containerId, channel.opacity);
				sliderView.attachEvent("onChange", (newValue) => {
					const channelIndex = channelList.getIndexById(channelId);
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
			const channelList = this.getGroupsChannelsList();
			channelList.refresh();
		}
	
		updateChannelOpacity(channelIndex, newValue) {
			this.getRoot().callEvent("changeChannelOpacity", [channelIndex, newValue]);
		}
	
		moveChannelUp(id) {
			const channelsList = this.getGroupsChannelsList();
			const channelIndex = channelsList.getIndexById(id);
			if (channelIndex > 0) {
				channelsList.moveUp(id, 1);
				const newChannelIndex = channelsList.getIndexById(id);
				this.handleChannelsOrderChange(newChannelIndex, channelIndex);
				this.refreshChannelsSliders();
			}
		}
	
		moveChannelDown(id) {
			const channelsList = this.getGroupsChannelsList();
			const channelIndex = channelsList.getIndexById(id);
			channelsList.moveDown(id, 1);
			const newChannelIndex = channelsList.getIndexById(id);
			this.handleChannelsOrderChange(newChannelIndex, channelIndex);
			this.refreshChannelsSliders();
		}
	
		handleChannelsOrderChange(newChannelIndex, oldChannelIndex) {
			this.getRoot().callEvent("channelOrderChange", [newChannelIndex, oldChannelIndex]);
		}

		updateSelectedGroupTiles() {
			const groupsList = this.getGroupsList();
			const channelsList = this.getGroupsChannelsList();
	
			const group = groupsList.getSelectedItem();
			channelsList.clearAll();
			this._group = group;
	
			if (group) {
				channelsList.parse(group.channels);
			}
	
			this.getRoot().callEvent("groupSelectChange", [group]);
		}
	
		addChannelsToGroup(channels, group) {
			if (!group) {
				return null;
			}
			const count = group.channels.length;
			const newChannels = channels
				.filter(({index}) => !group.channels.find((channel) => channel.index === index))
				.map((channel, i, arr) => {
					const color = this.createColorByIndex(count + i, arr.length + count);
					if(stateStore.bit == constants.SIXTEEN_BIT) {
						return {...constants.DEFAULT_16_BIT_CHANNEL_SETTINGS, ...channel, color};
					} else {
						return {...constants.DEFAULT_8_BIT_CHANNEL_SETTINGS, ...channel, color};
					}
				});
			group.channels.push(...newChannels);
			return newChannels;
		}
	
		removeGroup(id) {
			const groupsList = this.getGroupsList();
			const group = groupsList.getItem(id);
			this.getRoot().callEvent("removeGroup", [id, group]);
		}
	
		showOrHideChannel(id) {
			const channelList = this.getGroupsChannelsList();
			const channel = channelList.getItem(id);
			const channelIndex = channelList.getIndexById(id);
	
			const channelOpacity = channel.opacity ? 0 : 1;
	
			channelList.updateItem(id, {opacity: channelOpacity});
	
			this.getRoot().callEvent("changeChannelOpacity", [channelIndex, channelOpacity]);
		}
	
		removeChannel(id) {
			const channelList = this.getGroupsChannelsList();
			const channelIndex = channelList.getIndexById(id);
	
			this._group.channels.splice(channelIndex, 1);
			channelList.remove(id);
			this.getRoot().callEvent("removeChannel", [channelIndex]);
		}
	
		showPaletteWindow(id) {
			const channelList = this.getGroupsChannelsList();
			const channel = channelList.getItem(id);
			const channelNode = channelList.getItemNode(id);
			const {color, max, min} = channel;
	
			stateStore.adjustedChannel = channel;
			this._colorWindow.showWindow({color, max, min}, channelNode, "left");
			this.getRoot().callEvent("channelColorAdjustStart", [channel]);
			this._waitForChangesFromPaletteWindow(channel);
		}

		_waitForChangesFromPaletteWindow(channel) {
			const channelList = this.getGroupsChannelsList();
			const colorWindowRoot = this._colorWindow.getRoot();
	
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
				this.getRoot().callEvent("channelColorAdjustEnd", [channel]);
			});
		}
	
		getColoredChannels(channels) {
			return channels.map((channel, i) => {
				if (channel.color) {
					return channel;
				}
				const rgbColor = this.createColorByIndex(i, channels.length);
				return Object.assign({}, channel, {color: rgbColor});
			});
		}
	
		createColorByIndex(index, count = 1) {
			const hue = Math.round(MathCalculations.mapLinear(index, 0, count, 0, 360, true));
			const saturation = 100;
			const lightness = 50;
			return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
		}
	
		importGroups() {
			this.getRoot().callEvent("uploadGroups");
		}

		setHotkeyToIcon(iconElementId) {
			if (this._hotkeyCounter !== 0) {
				hotkeys(`${this._hotkeyCounter}`, (/* event, handler */) => {
					const iconElement = document.getElementById(iconElementId);
					iconElement?.click();
				});
			}
		}
	
		incrementHotkeyCounter() {
			switch (this._hotkeyCounter) {
				case 9:
					break;
				default:
					this._hotkeyCounter++;
					break;
			}
		}
	
		resetHotkeyCounter() {
			this._hotkeyCounter = 1;
		}
	
		clearHotkeys() {
			for (let i = 1; i < 10; i++) {
				hotkeys.unbind(`${i}`);
			}
		}
	
		getGroupsList() {
			return this.$$(GROUPS_LIST_ID);
		}
	
		getGroupsChannelsList() {
			return this.$$(GROUP_CHANNELS_LIST_ID);
		}
	
		getChannelsLayout() {
			return this.$$(GROUP_CHANNELS_LAYOUT_ID);
		}
	
		getGroupsSearch() {
			return this.$$(GROUPS_TEXT_SEARCH_ID);
		}
	
		getColorWindow() {
			return this._colorWindow;
		}

		getGenerateSceneFromTemplateButton() {
			return this.$$(GENERATE_SCENE_FROM_TEMPLATE_ID);
		}
	
		get _group() {
			return stateStore.group;
		}
	
		set _group(group) {
			stateStore.group = group;
		}
	};
});
