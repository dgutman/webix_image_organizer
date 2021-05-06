define([
	"helpers/base_jet_view",
	"helpers/math_calculations",
	"models/multichannel_view/state_store",
	"constants"
], function(BaseJetView, MathCalculations, stateStore, constants) {
	'use strict';
	const GROUPS_LIST_ID = "groups-list";
	const GROUP_CHANNELS_LIST_ID = "groups-channels-list";
	const GROUP_CHANNELS_LAYOUT_ID = "group-channels-layout";
	const GROUPS_TEXT_SEARCH_ID = "groups-search-field";
	const UPLOADER_API_ID = "uploader-api";
	const GROUPS_TITLE_TEMPLATE = "groups-title";

	return class GroupsPanel extends BaseJetView {
		constructor(app, config = {}, colorWindow) {
			super(app);

			this._cnf = config;
			this.$oninit = () => {
				const view = this.getRoot();

				webix.extend(view, webix.OverlayBox);
				webix.TooltipControl.addTooltip(this.$$(GROUPS_TITLE_TEMPLATE).$view);

				this._colorWindow = colorWindow;
		
				const groupsList = this.getGroupsList();
				const channelsList = this.getGroupsChannelsList();
		
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
								<span class="upload icon mdi mdi-upload" title="upload groups"></span>
							</div>`,
						height: 30,
						onClick: {
							upload: () => {
								this.uploadGroups();
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
								drag: true,
								scroll: "auto",
								navigation: false,
								select: false,
								template: ({name, color, opacity}) => {
									const showIcon = opacity ? "mdi mdi-eye" : "mdi mdi-eye-off";
									return `<span class="channel-item__name name">${name}</span>
									<div class="icons">
										<span style="color: ${color};" class="icon palette mdi mdi-square"></span>
										<span class="icon show ${showIcon}"></span>
										<span class="icon delete mdi mdi-minus-circle"></span>
									</div>`;
								},
								onClick: {
									show: (ev, id) => {
										this.showOrHideChannel(id);
									},
									delete: (ev, id) => {
										this.removeChannel(id);
									},
									palette: (ev, id) => {
										this.showPaletteWindow(id);
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
			let newChannels = channels
				.filter(({index}) => !group.channels.find(channel => channel.index === index))
				.map((channel, i, arr) => {
					const color = this.createColorByIndex(count + i, arr.length + count);
					if(stateStore.bit = constants.SIXTEEN_BIT) {
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
			let saturation = 100;
			let lightness = 50;
			return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
		}
	
		uploadGroups() {
			this.getRoot().callEvent("uploadGroups");
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
	
		get _group() {
			return stateStore.group;
		}
	
		set _group(group) {
			stateStore.group = group;
		}
	};
});
