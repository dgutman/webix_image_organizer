// TODO: move groupChannel component here
import {JetView} from "webix-jet";

import stateStore from "../../../models/multichannelView/stateStore";

const GROUP_CHANNEL_LAYOUT_ID = `group-channel-layout-${webix.uid()}`;
const GROUP_CHANNEL_TEMPLATE_ID = `group-channel-template-${webix.uid()}`;

export default class GroupChannels extends JetView {
	constructor(app, channel, colorWindow, groupsPanel) {
		super(app);
		this._channel = channel;
		this._colorWindow = colorWindow;
		this._groupsPanel = groupsPanel;
	}

	config() {
		return {
			localId: GROUP_CHANNEL_LAYOUT_ID,
			hidden: true,
			rows: [
				{
					view: "template",
					localId: GROUP_CHANNEL_TEMPLATE_ID,
					name: "channel",
					template: ({name, color, opacity}) => {
						const showIcon = opacity ? "fas fa-eye" : "fas fa-eye-slash";
						return `<span class="channel-item__name name">${name}</span>
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
				},
				{
					cols: [
						{
							view: "slider",
							name: "opacity",
							value: this._channel.opacity,
							min: 0,
							max: 1
						},
						{
							view: "template",
							template: `<span class="down fas fa-angle-down"></span>
							<span class="up fas fa-angle-up"></span>`,
							onClick: {
								down: (ev, id) => {
									this.moveDown(id);
								},
								up: (ev, id) => {
									this.moveUp(id);
								}
							}
						},
						{
							view: "button",
							name: "moveDown",
							type: "icon",
							click: this.moveDown
						}
					]
				}
			]
		};
	}

	ready() {
		const template = this.getChannelTemplate();
		template.parse(this._channel);
	}

	showOrHideChannel(id) {
		const channelList = this._groupsPanel.getGroupsChannelsList();
		const channel = channelList.getItem(id);
		const channelIndex = channelList.getIndexById(id);

		const channelOpacity = channel.opacity ? 0 : 1;

		channelList.updateItem(id, {opacity: channelOpacity});

		this._groupsPanel.getRoot().callEvent("changeChannelOpacity", [channelIndex, channelOpacity]);
	}

	removeChannel(id) {
		const channelList = this.getTemplateChannelList();
		const channelIndex = channelList.getIndexById(id);

		this._template.channels.splice(channelIndex, 1);
		channelList.remove(id);
		this._groupsPanel.getRoot().callEvent("removeChannel", [channelIndex]);
	}

	showPaletteWindow(id) {
		const channelList = this.getTemplateChannelList();
		const channel = channelList.getItem(id);
		const channelNode = channelList.getItemNode(id);
		const {color, max, min} = channel;

		stateStore.adjustedChannel = channel;
		this._colorWindow.showWindow({color, max, min}, channelNode, "left");
		this._groupsPanel.getRoot().callEvent("channelColorAdjustStart", [channel]);
		this._waitForChangesFromPaletteWindow(channel);
	}

	moveUp() {
		// TODO: implement
	}

	moveDown() {
		// TODO: implement
	}

	getChannelTemplate() {
		// TODO: implement
		return this.$$(GROUP_CHANNEL_TEMPLATE_ID);
	}

	getChannelLayout() {
		// TODO: implement
		return this.$$(GROUP_CHANNEL_LAYOUT_ID);
	}
}
