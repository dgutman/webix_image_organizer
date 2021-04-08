export default class DragAndDropMediator {
	constructor({
		main,
		groupsPanel,
		channelsList
	}) {
		this._main = main;
		this._channelsList = channelsList;
		this._groupsPanel = groupsPanel;

		this.attachGroupChannelsListEvents();
		this.attachGroupListEvents();
		this.attachChannelsListEvents();
	}

	attachGroupChannelsListEvents() {
		const groupsChannelList = this.$groupsChannelsList;
		this._main.on(groupsChannelList, "onAfterDrop", (context) => {
			this.handleChannelsDropOrder(context);
		});

		this._main.on(groupsChannelList, "onBeforeDrop", (context) => {
			if (context.from !== context.to) {
				this.handleChannelsDropAdd(context.source);
				return false;
			}
		});
	}

	attachGroupListEvents() {
		const groupsList = this.$groupsList;
		this._main.on(groupsList, "onBeforeDrop", (context) => {
			if (context.from === context.to || !context.target) {
				return false;
			}

			this.handleGroupsDrop(context.target, context.source);
			return false;
		});
	}

	attachChannelsListEvents() {
		const channelsList = this.$channelsList;

		this._main.on(channelsList, "onBeforeDrag", (context) => {
			const isSelected = this._channelsList.isSelected(context.start);
			let items = context.source.map(id => channelsList.getItem(id));
			if (isSelected) {
				items = this._channelsList.getSelectedChannels();
			}
			context.source = items;
		});
	}

	handleGroupsDrop(groupId, channels) {
		const groupsList = this.$groupsList;
		const group = groupsList.getItem(groupId);
		const selectedGroup = groupsList.getSelectedItem();
		this._groupsPanel.addChannelsToGroup(channels, group);
		if (group === selectedGroup) {
			groupsList.callEvent("onSelectChange", [selectedGroup]);
		}
	}

	handleChannelsDropOrder(context) {
		const groupsChannelList = this.$groupsChannelsList;
		const groupsList = this.$groupsList;

		const [channelId] = context.source;
		const channels = groupsChannelList.data.serialize();
		const index = groupsChannelList.getIndexById(channelId);
		const selectedGroup = groupsList.getSelectedItem();
		const oldIndex = selectedGroup.channels
			.findIndex(channel => channel.id === parseInt(channelId));

		if (index !== oldIndex) {
			groupsList.updateItem(selectedGroup.id, {channels});
			this._groupsPanel.getRoot().callEvent("channelOrderChange", [index, oldIndex]);
		}
	}

	handleChannelsDropAdd(channels) {
		const selectedGroup = this.$groupsList.getSelectedItem();
		this._groupsPanel.addChannelsToGroup(channels, selectedGroup);
		this._groupsPanel.updateSelectedGroupTiles();
	}

	get $groupsChannelsList() {
		return this._groupsPanel.getGroupsChannelsList();
	}

	get $groupsList() {
		return this._groupsPanel.getGroupsList();
	}

	get $channelsList() {
		return this._channelsList.getList();
	}
}
