import {JetView} from "webix-jet";
import MultichannelOSDViewer from "./osdViewer";
import ChannelList from "./channelList";
import GroupsPanel from "./groupsPanel";
import TilesService from "../../../services/multichannelView/tilesService";
import DragAndDropMediator from "../../../services/multichannelView/dragAndDropMediator";
import TimedOutBehavior from "../../../utils/timedOutBehavior";
import {downloadGroup, getImportedGroups, saveGroups, getSavedGroups} from "../../../services/multichannelView/groupsLoader";
import tilesCollection from "../../../models/imageTilesCollection";
import ItemsModel from "../../../models/itemsModel";
import stateStore from "../../../models/multichannelView/stateStore";


import OpenSeadragon from "openseadragon";

export default class MultichannelView extends JetView {
	constructor(app) {
		super(app);

		this._osdViewer = new MultichannelOSDViewer(this.app, {showNavigationControl: false});
		this._channelList = new ChannelList(this.app, {gravity: 0.2, minWidth: 200});
		this._groupsPanel = new GroupsPanel(this.app, {gravity: 0.2, minWidth: 200});


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
			//	this._infoPanel
			]
		};
	}

	init() {
		this._tileService = new TilesService();
	}

	ready(view) {
		webix.extend(view, webix.OverlayBox);
		webix.extend(view, webix.ProgressBar);
		const groupsList = this._groupsPanel.getGroupsList();
		const channelList = this._channelList.getList();

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

		this.on(this._groupsCollection.data, "onStoreUpdated", () => {
			const groupsPanelRoot = this._groupsPanel.getRoot();
			const count = this._groupsCollection.count();
			if (count) {
				groupsPanelRoot.show();
			}
			else {
				groupsPanelRoot.hide();
			}
		});
	}

	show() {
		const rootView = this.getRoot();
		rootView.show();
	}

	async setImage(image) {
		const rootView = this.getRoot();
		const groupsList = this._groupsPanel.getGroupsList();
		if (this._image === image) {
			return;
		}

		const isValid = await this._validateImage(image);

		if (!isValid) {
			rootView.showOverlay("<div class='empty-overlay'></>");
			return;
		}
		this._channelsCollection.clearAll();
		this._channelList.unselectAllChannels();
		this._osdViewer.destroy();
		groupsList.unselectAll();
		this._groupsCollection.clearAll();

		this._image = image;

		rootView.hideOverlay("Empty Overlay");

		const channels = await tilesCollection.getImageChannels(image);
		this._parseChannels(channels);

		const groups = await getSavedGroups(image);
		groups.forEach((group) => {
			this._addNewGroup(group.name, group.channels);
		});

		this.getRoot().showProgress();
		const tileSources = await this._tileService.getTileSources(image);
		this.getRoot().hideProgress();

		this._osdViewer.createViewer({tileSources});

		console.log(this._osdViewer);

		const viewer = this._osdViewer.$viewer();
		console.log(viewer);
		viewer.addHandler("open", () => {
			const tracker = new OpenSeadragon.MouseTracker({
				element: viewer.container,
				moveHandler(event) {
					const webPoint = event.position;
					const viewportPoint = viewer.viewport.pointFromPixel(webPoint);
					const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
					const zoom = viewer.viewport.getZoom(true);
					const imageZoom = viewer.viewport.viewportToImageZoom(zoom);

					        $$("mousetrack").setHTML(`Web:<br>${webPoint.toString()
					}<br><br>Viewport:<br>${viewportPoint.toString()
					}<br><br>Image:<br>${imagePoint.toString()}`);
					//                updateZoom();
				}
			});

			tracker.setTracking(true);

			viewer.addHandler("animation", updateZoom);
		});
	}

	_parseChannels(channels) {
		this._channelsCollection.parse(channels);
	}

	_validateImage(image) {
		return image &&
		image._modelType === "item" &&
		image.meta &&
		tilesCollection.getImageChannels(image);
	}

	_addGroupHandler({name}) {
		const existedGroup = this._groupsCollection.find(group => group.name === name, true);
		if (existedGroup) {
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

		const groupId = this._addNewGroup(name, coloredChannels);
		this._groupsPanel.getGroupsList().select(groupId);
		this._channelList.unselectAllChannels();
	}

	_addNewGroup(name, channels) {
		const group = {
			name,
			channels
		};

		return this._groupsCollection.add(group);
	}

	async _selectGroupHandler(group) {
		this._osdViewer.removeAllTiles();
		if (!group) {
			return;
		}
		const channelList = this._channelList.getList();
		channelList.unselectAll();
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
			this._channelList.unselectAllChannels();
		});
	}

	_attachOSDViewEvents() {
		const osdViewerRoot = this._osdViewer.getRoot();

		this.on(osdViewerRoot, "resetMainFrameBtnClick", async () => {
			this.setDefaultOSDImage();
		});

		this.on(osdViewerRoot, "addGroupBtnClick", () => {
			const selectedChannels = this._channelList.getSelectedChannels();
			const name = this._getGroupNameByChannels(selectedChannels);
			if (name) {
				this._addGroupHandler({name});
			}
		});

		this.on(osdViewerRoot, "uploadGroupBtnClick", () => {
			const groups = this._groupsCollection.data.serialize();

			this.getRoot().showProgress();
			saveGroups(this._image._id, groups)
				.then((image) => {
					webix.message("Groups are successfully saved");
					this._image = image;
					ItemsModel.getInstanceModel().updateItems(image);
				})
				.finally(() => {
					this.getRoot().hideProgress();
				});
		});
	}

	_attachGroupsPanelEvents() {
		const groupsPanel = this._groupsPanel.getRoot();

		this.on(groupsPanel, "groupSelectChange", (group) => {
			this._selectGroupHandler(group);

			const channels = this._channelList.getSelectedChannels();
			this._channelList.changeButtonVisibility(channels.length && group);
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
			this._osdViewer.flipTiles(index, oldIndex);
		});

		this.on(groupsPanel, "importGroups", (file) => {
			getImportedGroups(file)
				.then(({imageId, groups}) => {
					if (imageId !== this._image._id) {
						webix.message(`Incorrect image id: "${imageId}"`);
						return;
					}

					groups.forEach((group) => {
						this._addNewGroup(group.name, group.channels);
					});
				}).catch((err) => {
					if (err && typeof err === "string") {
						webix.message(err);
					}
					else {
						webix.message("Something went wrong");
					}
				});
		});

		this.on(groupsPanel, "exportGroups", (groups) => {
			downloadGroup(this._image.name, this._image._id, groups);
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
		this._osdViewer.removeAllTiles();
		const tileSource = await this._tileService.getTileSources(this._image);
		this._osdViewer.addNewTile(tileSource);
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
			if (!firstId) {
				this.setDefaultOSDImage();
			}
		}
	}

	_setUnselectedState() {
		const channelList = this._channelList.getList();
		const groupsList = this._groupsPanel.getGroupsList();
		channelList.unselectAll();
		groupsList.unselectAll();
	}

	_getGroupNameByChannels(channels) {
		return channels.map(({name}) => name)
			.join("_");
	}

	get _image() {
		return stateStore.image;
	}

	set _image(image) {
		stateStore.image = image;
	}
}
