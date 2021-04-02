import {JetView} from "webix-jet";
import MultichannelOSDViewer from "./osdViewer";
import ChannelList from "./channelList";
import GroupsPanel from "./groupsPanel";
// import AddGroupWindow from "./windows/addGroup";
import TilesService from "../../../services/multichannelView/tilesService";
import DragAndDropMediator from "../../../services/multichannelView/dragAndDropMediator";
import TimedOutBehavior from "../../../utils/timedOutBehavior";

export default class MultichannelView extends JetView {
	constructor(app) {
		super(app);

		this._osdViewer = new MultichannelOSDViewer(app, {showNavigationControl: false});
		this._channelList = new ChannelList(app, {gravity: 0.2, minWidth: 200});
		this._groupsPanel = new GroupsPanel(app, {gravity: 0.2, minWidth: 200, hidden: true});

		this._image = null;
		this._tileSources = null;
		this._channelsCollection = new webix.DataCollection();
		this._groupsCollection = new webix.DataCollection();
	}

	config() {
		return {
			name: "multichannelViewCell",
			css: "multichannel-view",
			margin: 8,
			cols: [
				this._channelList,
				this._osdViewer,
				this._groupsPanel
			]
		};
	}

	init() {
		// this._addGroupWindow = this.ui(new AddGroupWindow(this.app));
		this._tileService = new TilesService();
	}

	ready(view) {
		webix.extend(view, webix.OverlayBox);
		webix.extend(view, webix.ProgressBar);
		const groupsList = this._groupsPanel.getGroupsList();
		const channelList = this._channelList.getList();
		// const groupChannelList = this._groupsPanel.getGroupsChannelsList();

		channelList.sync(this._channelsCollection);
		groupsList.sync(this._groupsCollection);

		this._dragAndDropMediator = new DragAndDropMediator({
			main: this,
			groupsPanel: this._groupsPanel,
			channelsList: this._channelList
		});

		this._attachChannelsListEvents();
		this._attachOSDViewEvents();
		this._attachGroupsPanelEvents();
		// this._attachGroupWindowEvents();
	}

	show(item) {
		const rootView = this.getRoot();
		if (!this._validateImage(item)) {
			rootView.showOverlay("<div class='empty-overlay'></>");
			rootView.show();
			return;
		}

		rootView.hideOverlay("Empty Overlay");
		this.setImage(item);
		rootView.show();
	}

	async setImage(image) {
		if (!this._validateImage(image)) {
			this._channelsCollection.clearAll();
			this._osdViewer.destroy();
			this._groupsCollection.clearAll();
			return;
		}

		if (this._image === image) {
			return;
		}

		this._channelsCollection.clearAll();
		this._groupsCollection.clearAll();

		this._image = image;
		await this._tileService.setImage(image);
		this._parseChannels(image.meta.omeSceneDescription);

		this.getRoot().showProgress();
		const tileSources = await this._tileService.getTileSources(image);
		this.getRoot().hideProgress();

		this._osdViewer.destroy();
		this._osdViewer.createViewer({tileSources});
	}

	_parseChannels(channels) {
		channels = channels
			.map((channel, index) => Object.assign({index: index || channel.channel_number}, channel));
		this._channelsCollection.parse(channels);
	}

	_validateImage(image) {
		return image &&
		image._modelType === "item" &&
		image.meta &&
		Array.isArray(image.meta.omeSceneDescription);
	}

	_addGroupHandler({name}) {
		const existedGroup = this._groupsCollection.find(group => group.name === name, true);
		if (existedGroup) {
			// this._addGroupWindow.markInvalidNameInput("Group with the same name already exists");
			return;
		}

		const selectedChannels = this._channelList.getSelectedChannels();
		const coloredChannels = this._groupsPanel.getColoredChannels(selectedChannels)
			.map((channel) => {
				const defaultChannelSettings = {
					opacity: 1,
					min: 500,
					max: 30000
				};

				return {...defaultChannelSettings, ...channel};
			});
		const group = {
			name,
			channels: coloredChannels
		};

		const groupId = this._groupsCollection.add(group);
		this._groupsPanel.getRoot().show();
		this._groupsPanel.getGroupsList().select(groupId);
		this._channelList.unselectAllChannels();
		// this._addGroupWindow.closeWindow();
	}

	async _selectGroupHandler(group) {
		const channelList = this._channelList.getList();
		this._channelList.setSelectedGroupToButton(group);
		channelList.unselectAll();

		this._osdViewer.removeAllTiles();
		await this.showColoredChannels(group.channels);
	}

	async showColoredChannels(channels) {
		const viewer = this._osdViewer.$viewer();
		const tileSources = await this._tileService.getColoredTileSources(channels);

		let counter = 1;
		tileSources.forEach((tileSource, i) => {
			viewer.addTiledImage({
				tileSource,
				opacity: channels[i].opacity,
				success: () => {
					if (counter === channels.length && channels.length > 1) {
						this._compositeFrames(channels);
					}
					counter += 1;
				}
			});
		});
	}

	_compositeFrames(channels, compositeType = "difference") {
		const viewer = this._osdViewer.$viewer();
		let numOfFrames = channels.length;
		let topFrameIndex = numOfFrames - 1;

		if (numOfFrames > 1) {
			for (let i = topFrameIndex - numOfFrames + 1; i < topFrameIndex; i++) {
				let bottomFrameIndex = i;
				let topFrame = viewer.world.getItemAt(bottomFrameIndex + 1);
				topFrame.setCompositeOperation(compositeType);
			}
		}
		else {
			viewer.viewport.goHome();
		}
	}

	_attachChannelsListEvents() {
		const channelList = this._channelList.getList();
		const groupsList = this._groupsPanel.getGroupsList();
		const groupsChannelList = this._groupsPanel.getGroupsChannelsList();

		this.on(channelList, "onAfterSelect", async (id) => {
			groupsList.unselectAll();
			groupsChannelList.unselectAll();

			const channel = this._channelsCollection.getItem(id);
			const channelTileSource = await this._tileService
				.getChannelTileSources(this._image, channel.index);
			this._osdViewer.removeAllTiles();
			this._osdViewer.addNewTile(channelTileSource);
		});

		this.on(channelList, "customSelectionChanged", (channels) => {
			const selectedGroups = groupsList.getSelectedItem(true);
			this._channelList.changeButtonVisibility(channels.length && selectedGroups.length);
		});

		this.on(channelList, "addToSelectedGroup", (channels) => {
			const selectedGroup = groupsList.getSelectedItem();
			this._groupsPanel.addChannelsToGroup(channels, selectedGroup);
			this._groupsPanel.updateSelectedGroupTiles();
		});
	}

	_attachOSDViewEvents() {
		const osdViewerRoot = this._osdViewer.getRoot();

		this.on(osdViewerRoot, "resetMainFrameBtnClick", async () => {
			this.setDefaultOSDImage();
		});

		this.on(osdViewerRoot, "addGroupBtnClick", () => {
			const selectedChannels = this._channelList.getSelectedChannels();
			const name = this._getGroupName(selectedChannels);
			if (name) {
				this._addGroupHandler({name});
			}
		});
	}

	// _attachGroupWindowEvents() {
	// 	this.on(this._addGroupWindow.getRoot(), "addGroup", (group) => {
	// 		this._addGroupHandler(group);
	// 	});
	// }

	_attachGroupsPanelEvents() {
		const groupsPanel = this._groupsPanel.getRoot();
		this.on(groupsPanel, "afterGroupSelect", (group) => {
			this._selectGroupHandler(group);
		});

		this.on(groupsPanel, "changeChannelOpacity", (channelIndex, opacity) => {
			this._osdViewer.setTileOpacity(channelIndex, opacity);
		});

		this.on(groupsPanel, "removeChannel", (channelIndex) => {
			const viewer = this._osdViewer.$viewer();
			const tileToRemove = viewer.world.getItemAt(channelIndex);
			viewer.world.removeItem(tileToRemove);
		});

		this.on(groupsPanel, "removeGroup", (id) => {
			this.removeGroupHandler(id);
		});

		this.on(groupsPanel, "channelColorAdjustStart", (channel) => {
			this.startChannelAdjusting(channel);
		});

		this.on(groupsPanel, "channelOrderChange", (index, oldIndex) => {
			this._osdViewer.flipSlides(index, oldIndex);
		});
	}

	startChannelAdjusting(channel) {
		const groupsPanel = this._groupsPanel.getRoot();
		const groupChannelList = this._groupsPanel.getGroupsChannelsList();

		this._osdViewer.removeAllTiles();
		this.showColoredChannels([{...channel, opacity: 1}]);
		const debounce = new TimedOutBehavior(100);

		const dataUpdateEventId = groupChannelList.attachEvent("onDataUpdate", async (id) => {
			debounce.execute(this._updateShownChannel, this, [{...channel, opacity: 1}, id]);
		});
		const hideWindowEventId = groupsPanel.attachEvent("channelColorAdjustEnd", () => {
			debounce.cancel();
			groupChannelList.detachEvent(dataUpdateEventId);
			groupsPanel.detachEvent(hideWindowEventId);
			// show group frames (channels)
			this._groupsPanel.updateSelectedGroupTiles();
		});
	}

	async _updateShownChannel(channel, id) {
		if (parseInt(id) !== channel.id) {
			return;
		}
		const colorSettings = {
			palette2: channel.color,
			min: channel.min || 500, // default value
			max: channel.max || 30000 // default value
		};
		const tileSource = await this._tileService.getColoredChannelTileSource(
			this._image,
			channel.index,
			colorSettings
		);
		this._osdViewer.replaceTile(tileSource, 0);
	}

	async setDefaultOSDImage() {
		this._setUnselectedState();
		const tileSource = await this._tileService.getTileSources(this._image);
		this._osdViewer.addNewTile(tileSource);
	}

	_setUnselectedState() {
		const channelList = this._channelList.getList();
		const groupsList = this._groupsPanel.getGroupsList();
		channelList.unselectAll();
		groupsList.unselectAll();

		this._osdViewer.removeAllTiles();
	}

	removeGroupHandler(id) {
		const groupsList = this._groupsPanel.getGroupsList();
		const isSelected = groupsList.isSelected(id);
		this._groupsCollection.remove(id);

		if (isSelected) {
			groupsList.unselectAll();
			this._groupsPanel.getGroupsChannelsList().clearAll();
			const firstId = groupsList.getFirstId();
			groupsList.select(firstId);
		}

		const count = this._groupsCollection.count();
		if (!count) {
			this._groupsPanel.getRoot().hide();
			this.setDefaultOSDImage();
		}
	}

	_getGroupName(channels) {
		// eslint-disable-next-line camelcase
		return channels.map(({channel_name}) => channel_name)
			.join("_");
	}
}
