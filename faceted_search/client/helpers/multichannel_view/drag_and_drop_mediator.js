define([], function() {
	'use strict';
	return  class DragAndDropMediator {
		constructor({
			groupsPanel,
			channelsList
		}) {
			this._channelsList = channelsList;
			this._groupsPanel = groupsPanel;
	
			this.attachGroupChannelsListEvents();
			this.attachGroupListEvents();
			this.attachChannelsListEvents();
		}
	
		attachGroupChannelsListEvents() {
			const groupsChannelList = this.$groupsChannelsList;
	
			groupsChannelList.attachEvent("onBeforeDrop", (context, ev) => {
				if (context.from !== context.to) {
					this.handleChannelsDropAdd(context.source);
				}
				else {
					const listItem = ev.target.closest(".webix_list_item");
					const id = listItem ? listItem.getAttribute("webix_l_id") : groupsChannelList.getLastId();
					this.handleChannelsDropOrder(context.source, id);
				}
				return false;
			});
		}
	
		attachGroupListEvents() {
			const groupsList = this.$groupsList;
			groupsList.attachEvent("onBeforeDrop", (context) => {
				if (context.from === context.to || !context.target) {
					return false;
				}
	
				this.handleGroupsDrop(context.target, context.source);
				return false;
			});
		}
	
		attachChannelsListEvents() {
			const channelsList = this.$channelsList;
	
			channelsList.attachEvent("onBeforeDrag", (context) => {
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
				this._groupsPanel.updateSelectedGroupTiles();
			}
		}
	
		handleChannelsDropOrder(source, targetId) {
			const groupsChannelList = this.$groupsChannelsList;
			const groupsList = this.$groupsList;
	
			const [channelId] = source;
			const channels = groupsChannelList.data.serialize();

			const index = groupsChannelList.getIndexById(channelId);
			const selectedGroup = groupsList.getSelectedItem();
			const oldIndex = groupsChannelList.getIndexById(targetId);
	
			if (index !== oldIndex) {
				channels[index] = groupsChannelList.getItem(targetId);
				channels[oldIndex] = groupsChannelList.getItem(channelId);
				groupsChannelList.clearAll();
				groupsChannelList.parse(channels);
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
});