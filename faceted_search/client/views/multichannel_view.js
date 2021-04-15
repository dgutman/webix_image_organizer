define([
	"app",
	"views/multichannel_viewer/osd_viewer",
	"views/multichannel_viewer/groups_panel",
	"views/multichannel_viewer/channels_list",
	"helpers/base_jet_view",
	"helpers/multichannel_view/tiles_service",
	"helpers/debouncer",
	"models/multichannel_view/state_store",
	"models/multichannel_view/tiles_collection",
	"helpers/multichannel_view/drag_and_drop_mediator",
	"helpers/multichannel_view/groups_loader",
	"helpers/ajax",
	"helpers/router",
	"constants"
], function(
	app,
	MultichannelOSDViewer,
	GroupsPanel,
	ChannelList,
	BaseJetView,
	TilesService,
	Debouncer,
	stateStore,
	tilesCollection,
	DragAndDropMediator,
	groupsLoader,
	ajaxActions,
	router,
	constants
) {
	'use strict';
	const {routes, navigate} = router;
	const {downloadGroup, getImportedGroups, saveGroups, getSavedGroups} = groupsLoader;

	const MULTICHANNEL_WRAP_ID = "multichannel-wrap";

	class MultichannelView extends BaseJetView {
		constructor(app) {
			super(app);

			this._osdViewer = new MultichannelOSDViewer(app, {showNavigationControl: false});
			this._channelList = new ChannelList(app, {gravity: 0.2, minWidth: 200});
			this._groupsPanel = new GroupsPanel(app, {gravity: 0.2, minWidth: 200});

			this._channelsCollection = new webix.DataCollection();
			this._groupsCollection = new webix.DataCollection();

			this.$oninit = () => {
				const view = this.getRoot();
				const wrapper = this.getMultichannelWrap();

				this._tileService = new TilesService();
				webix.extend(wrapper, webix.OverlayBox);
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
	
				this._groupsCollection.data.attachEvent("onStoreUpdated", () => {
					const groupsPanelRoot = this._groupsPanel.getRoot();
					const count = this._groupsCollection.count();
					if (count) {
						groupsPanelRoot.show();
					}
					else {
						groupsPanelRoot.hide();
					}
				});
			};

			this.$ondestroy = () => {
				this._image = null;
			}

			this.$onurlchange = async (params) => {
				const {id} = params;
				try {
					await this.handleIdChange(id)
				}
				catch (err) {
					navigate(routes.userMode);
				}
			}
		}

		get $ui() {
			return {
				name: "multichannelViewCell",
				css: "multichannel-view",
				id: this._rootId,
				rows: [
					{
						cols: [
							{
								view: "button",
								type: "icon",
								icon:"mdi mdi-arrow-left",
								width: 80,
								height: 30,
								label: "Back",
								click: () => {
									this.app.show("/top/user_mode");
								}
							},
							{}
						]
					},
					{

						margin: 8,
						localId: MULTICHANNEL_WRAP_ID,
						cols: [
							this._channelList,
							this._osdViewer,
							this._groupsPanel
						]
					}
				]
			};
		}

		show(imageId) {
			this.app.show(`top/multichannel_view:id=${imageId}`);
		}

		async handleIdChange(id) {
			const image = stateStore.loadedImages[id] || await ajaxActions.getItem(id);

			if (image) {
				this.setImage(image);
			}
		}

		async setImage(image) {
			const rootView = this.getMultichannelWrap();
			const groupsList = this._groupsPanel.getGroupsList();
			if (this._image === image) {
				return;
			}

			const isValid = await this.validateImage(image);

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
		}

		_parseChannels(channels) {
			this._channelsCollection.parse(channels);
		}

		validateImage(image) {
			return image &&
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
					return {...constants.DEFAULT_CHANNEL_SETTINGS, ...channel};
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

			channelList.attachEvent("onAfterSelect", async (id) => {
				groupsList.unselectAll();
				groupsChannelList.unselectAll();

				const channel = this._channelsCollection.getItem(id);
				const channelTileSource = await this._tileService
					.getChannelTileSources(this._image, channel.index);
				this._osdViewer.removeAllTiles();
				this._osdViewer.addNewTile(channelTileSource);
			});

			channelList.attachEvent("customSelectionChanged", (channels) => {
				const selectedGroups = groupsList.getSelectedItem(true);
				this._channelList.changeButtonVisibility(channels.length && selectedGroups.length);
			});

			channelList.attachEvent("addToSelectedGroup", (channels) => {
				const selectedGroup = groupsList.getSelectedItem();
				this._groupsPanel.addChannelsToGroup(channels, selectedGroup);
				this._groupsPanel.updateSelectedGroupTiles();
				this._channelList.unselectAllChannels();
			});
		}

		_attachOSDViewEvents() {
			const osdViewerRoot = this._osdViewer.getRoot();

			osdViewerRoot.attachEvent("resetMainFrameBtnClick", async () => {
				this.setDefaultOSDImage();
			});

			osdViewerRoot.attachEvent("addGroupBtnClick", () => {
				const selectedChannels = this._channelList.getSelectedChannels();
				const name = this._getGroupNameByChannels(selectedChannels);
				if (name) {
					this._addGroupHandler({name});
				}
			});

			osdViewerRoot.attachEvent("uploadGroupBtnClick", () => {
				const groups = this._groupsCollection.data.serialize();

				this.getRoot().showProgress();
				saveGroups(this._image._id, groups)
					.then((image) => {
						webix.message("Groups are successfully saved");
						this._image = image;
					})
					.finally(() => {
						this.getRoot().hideProgress();
					});
			});
		}

		_attachGroupsPanelEvents() {
			const groupsPanel = this._groupsPanel.getRoot();

			groupsPanel.attachEvent("groupSelectChange", (group) => {
				this._selectGroupHandler(group);

				const channels = this._channelList.getSelectedChannels();
				this._channelList.changeButtonVisibility(channels.length && group);
			});

			groupsPanel.attachEvent("changeChannelOpacity", (channelIndex, opacity) => {
				this._osdViewer.setTileOpacity(channelIndex, opacity);
			});

			groupsPanel.attachEvent("removeChannel", (channelIndex) => {
				const viewer = this._osdViewer.$viewer();
				const tileToRemove = viewer.world.getItemAt(channelIndex);
				viewer.world.removeItem(tileToRemove);
			});

			groupsPanel.attachEvent("removeGroup", (id) => {
				this.removeGroupHandler(id);
			});

			groupsPanel.attachEvent("channelColorAdjustStart", (channel) => {
				this.startChannelAdjusting(channel);
			});

			groupsPanel.attachEvent("channelOrderChange", (index, oldIndex) => {
				if (index !== oldIndex) {
					this._osdViewer.flipTiles(index, oldIndex);
				}
			});

			groupsPanel.attachEvent("importGroups", (file) => {
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

			groupsPanel.attachEvent("exportGroups", (groups) => {
				downloadGroup(this._image.name, this._image._id, groups);
			});
		}

		startChannelAdjusting(channel) {
			const groupsPanel = this._groupsPanel.getRoot();
			const groupChannelList = this._groupsPanel.getGroupsChannelsList();

			this._osdViewer.removeAllTiles();
			this.showColoredChannels([{...channel, opacity: 1}]);
			const debounce = new Debouncer(100);

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
			const {max, min} = constants.DEFAULT_CHANNEL_SETTINGS;
			const colorSettings = {
				palette2: channel.color,
				min: channel.min || min,
				max: channel.max || max
			}

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

		getMultichannelWrap() {
			return this.$$(MULTICHANNEL_WRAP_ID);
		}

		get _image() {
			return stateStore.image;
		}

		set _image(image) {
			stateStore.image = image;
			if (image && image._id) {
				stateStore.loadedImages[image._id] = image;
			}
		}
	}

	return new MultichannelView(app);
});
