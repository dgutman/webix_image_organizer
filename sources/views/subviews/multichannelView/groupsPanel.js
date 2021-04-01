/* eslint-disable camelcase */
import {JetView} from "webix-jet";
import formats from "../../../utils/formats";
import ColorPickerWindow from "./windows/colorPopup";

const GROUPS_LIST_ID = "groups-list";
const GROUP_CHANNELS_LIST_ID = "groups-channels-list";

const GROUP_CHANNELS_LAYOUT_ID = "group-channels-layout";

export default class GroupsPanel extends JetView {
	constructor(app, config = {}) {
		super(app);

		this._cnf = config;
		this._group = null;
	}

	config() {
		return {
			...this._cnf,
			rows: [
				{
					template: "Groups:",
					height: 30
				},
				{
					view: "list",
					localId: GROUPS_LIST_ID,
					css: "groups-list",
					navigation: false,
					select: true,
					template: ({name}) => `<span class="group-item__name name">${name}</span>
						<div class="icons">
							<span class="icon delete fas fa-minus-circle"></span>
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
							drag: "order",
							navigation: false,
							select: false,
							template: ({channel_name, color, opacity}) => {
								const showIcon = opacity ? "fas fa-eye" : "fas fa-eye-slash";
								return `<span class="channel-item__name name">${channel_name}</span>
								<div class="icons">
									<span style="color: ${color};" class="icon palette fas fa-square-full"></span>
									<span class="icon show ${showIcon}"></span>
									<span class="icon delete fas fa-minus-circle"></span>
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
				}
			]
		};
	}

	init(view) {
		webix.extend(view, webix.OverlayBox);

		const groupsList = this.getGroupsList();
		const channelsList = this.getGroupsChannelsList();

		this.on(groupsList, "onSelectChange", () => {
			const group = groupsList.getSelectedItem();
			channelsList.clearAll();
			this._group = group;
			if (!group) {
				return;
			}

			channelsList.parse(group.channels);
			this.getRoot().callEvent("afterGroupSelect", [group]);
		});

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

		this.on(channelsList, "onAfterDrop", (context) => {
			const [channelId] = context.source;
			const channels = channelsList.data.serialize();
			const index = channelsList.getIndexById(channelId);
			const oldIndex = this._group.channels
				.findIndex(channel => channel.id === parseInt(channelId));

			if (index !== oldIndex) {
				groupsList.updateItem(this._group.id, {channels});
				this.getRoot().callEvent("channelOrderChange", [index, oldIndex]);
			}
		});
	}

	ready() {
		this._colorWindow = this.ui(new ColorPickerWindow(this.app));
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
			const rgbColor = this.createColorByIndex(i, channels.length);
			return Object.assign({}, channel, {color: rgbColor});
		});
	}

	createColorByIndex(index, count = 1) {
		let colorStep = Math.floor(360 / count); // 360 is HSL max hue
		let saturation = 100;
		let lightness = 50;
		let frameColorRgb = formats.HSLToRGB(index * colorStep, saturation, lightness);
		return frameColorRgb; // formats.RGBtoHEX(frameColorRgb);
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
}
