define([
	"app",
	"views/multichannel_viewer/osd_viewer",
	"views/multichannel_viewer/groups_panel",
	"views/multichannel_viewer/channels_list",
	"views/multichannel_viewer/metadata_popup",
	"views/components/horizontal_collapser",
	"views/components/header_label",
	"views/multichannel_viewer/channels_controls",
	"models/multichannel_view/state_store",
	"models/multichannel_view/tiles_collection",
	"models/multichannel_view/image_metadata",
	"helpers/multichannel_view/drag_and_drop_mediator",
	"helpers/multichannel_view/groups_loader",
	"helpers/ajax",
	"helpers/router",
	"helpers/base_jet_view",
	"helpers/multichannel_view/tiles_service",
	"helpers/debouncer",
	"helpers/organizer_filters",
	"helpers/maker_layer",
	"windows/color_picker_window",
	"windows/groupColorTemplateWindow",
	"constants",
	"libs/lodash/lodash.min"
], function(
	app,
	MultichannelOSDViewer,
	GroupsPanel,
	ChannelList,
	MetadataPopup,
	HorizontalCollapser,
	HeaderLabel,
	ChannelsControls,
	stateStore,
	tilesCollection,
	imageMetadata,
	DragAndDropMediator,
	groupsLoader,
	ajaxActions,
	router,
	BaseJetView,
	TilesService,
	Debouncer,
	OrganizerFilters,
	MakerLayer,
	ColorPickerWindow,
	GroupColorTemplateWindow,
	constants,
	lodash
) {
	'use strict';
	const {routes, navigate} = router;
	const {saveGroups, getSavedGroups} = groupsLoader;

	const MULTICHANNEL_WRAP_ID = "multichannel-wrap";
	const SHOW_METADATA_BUTTON_ID = "show-metadata-button-id";

	class MultichannelView extends BaseJetView {
		constructor(app) {
			super(app);

			this._colorWindow = this.ui(new ColorPickerWindow(app));
			this._osdViewer = new MultichannelOSDViewer(app, {showNavigationControl: false});
			this._channelList = new ChannelList(app);
			this._groupsPanel = new GroupsPanel(app, {gravity: 0.2, minWidth: 200, hidden: true}, this._colorWindow);
			this._channelsListCollapser = new HorizontalCollapser(app, {direction: "left"});
			this._groupsPanelCollapser = new HorizontalCollapser(app, {direction: "right"});
			this._metadataPopup = this.ui(new MetadataPopup(app));

			this._channelsCollection = new webix.DataCollection();
			this._groupsCollection = new webix.DataCollection();

			this._organizerFilters = new OrganizerFilters();
			this._waitForViewerCreation = webix.promise.defer();

			this._channelLayers = {};

			this._groupColorTemplateWindow = this.ui(
				new GroupColorTemplateWindow(
					app,
					this._osdViewer,
					this._channelsCollection,
					this._groupsPanel,
					this._tileService,
					this
				)
			);

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
					const count = this._groupsCollection.count();
					if (count) {
						this._groupsPanelCollapser.expand();
					} else {
						this._groupsPanelCollapser.collapse();
					}
				});

				this._waitForViewerCreation.then(() => {
					const params = router.getParams();
					const groupIndex = params.group || 0;
					this._changeGroupByIndex(groupIndex);
				});

				const generateSceneFromTemplateButton = this._channelList.getGenerateSceneFromTemplateButton();

				if (!this._generateSceneFromTemplateEvent) {
					this._generateSceneFromTemplateEvent = generateSceneFromTemplateButton.attachEvent("onItemClick", () => {
						const groupId = this._groupsPanel.getGroupsList().getSelectedId();
						this._groupsPanel.getRoot().callEvent("generateSceneFromTemplate", [groupId]);
					});
				}
			};

			this.$ondestroy = () => {
				this._image = null;
				this._waitForViewerCreation = webix.promise.defer();
				const generateSceneFromTemplateButton = this._channelList.getGenerateSceneFromTemplateButton();
				if (this._generateSceneFromTemplateEvent) {
					generateSceneFromTemplateButton.detachEvent(this._generateSceneFromTemplateEvent);
				}
			};

			this.$onurlchange = async (params) => {
				const {id, group: groupIndex} = params;
				try {
					await this.handleIdChange(id);
				} catch (err) {
					navigate(routes.userMode);
				}

				if (groupIndex != null) {
					this._waitForViewerCreation.then(() => {
						this._changeGroupByIndex(groupIndex);
					});
				}
			};
		}

		get $ui() {
			this._channelsControls = new ChannelsControls(app, {height: 100, hidden: true});

			return {
				name: "multichannelViewCell",
				css: "multichannel-view",
				id: this._rootId,
				rows: [
					{
						view: "toolbar",
						cols: [
							{
								view: "button",
								type: "icon",
								icon: "mdi mdi-arrow-left",
								width: 80,
								height: 30,
								label: "Back",
								click: () => {
									const metadataPopupRoot = this._metadataPopup.getRoot();
									this._groupColorTemplateWindow.closeWindow();
									this._colorWindow.closeWindow();
									if(metadataPopupRoot) {
										if(metadataPopupRoot.isVisible()) {
											metadataPopupRoot.hide();
										}
									}
									this.app.show("/top/user_mode");
								}
							},
							new HeaderLabel(this.app),
							{gravity: 10},
							{
								view: "button",
								localId: SHOW_METADATA_BUTTON_ID,
								width: 160,
								height: 30,
								label: "Show metadata",
								click: () => {
									const metadataPopupRoot = this._metadataPopup.getRoot();
									if(metadataPopupRoot) {
										metadataPopupRoot.show(this.$$(SHOW_METADATA_BUTTON_ID).getNode());
										this._metadataPopup.setProperties();
									}
								}
							},
						]
					},
					{

						margin: 8,
						localId: MULTICHANNEL_WRAP_ID,
						cols: [
							{
								gravity: 0.2,
								minWidth: 200,
								rows: [
									this._channelList,
									this._channelsControls
								]
							},
							this._channelsListCollapser,
							this._osdViewer,
							this._groupsPanelCollapser,
							this._groupsPanel
						]
					}
				]
			};
		}

		show(imageId) {
			this.app.show(`top/multichannel_view:id=${imageId}`);
		}

		loadImageMetadata(id) {
			imageMetadata.loadImageMetadata(id);
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
				rootView.showOverlay("<div class='empty-overlay'></div>");
				return;
			}
			this._channelsCollection.clearAll();
			this._channelList.unselectAllChannels();
			this._osdViewer.destroy();
			groupsList.unselectAll();
			this._groupsCollection.clearAll();

			this._image = image;

			rootView.hideOverlay("Empty Overlay");

			this.getRoot().showProgress();
			const [channels, savedGroups, tileSources] = await Promise.all([
				tilesCollection.getImageChannels(image),
				getSavedGroups(image),
				this._tileService.getTileSources(image)
			]);

			this.getRoot().hideProgress();
			this._parseChannels(channels);
			this._groupsCollection.parse(savedGroups.map(({name, channels}) => ({name, channels})));

			await this._osdViewer.createViewer({tileSources});
			this._waitForViewerCreation.resolve();
			this.changeBitImage();
			this.loadImageMetadata(this._image._id);
		}

		_parseChannels(channels) {
			this._channelsCollection.parse(channels);
		}

		async validateImage(image) {
			return image &&
			tilesCollection.getImageChannels(image);
		}

		_addGroupHandler({name}) {
			const existedGroup = this._groupsCollection.find((group) => group.name === name, true);
			if (existedGroup) {
				return;
			}

			const selectedChannels = this._channelList.getSelectedChannels();
			const coloredChannels = this._groupsPanel.getColoredChannels(selectedChannels)
				.map((channel) => {
					if(stateStore.bit == constants.SIXTEEN_BIT) {
						return {...constants.DEFAULT_16_BIT_CHANNEL_SETTINGS, ...channel};
					} else {
						return {...constants.DEFAULT_8_BIT_CHANNEL_SETTINGS, ...channel};
					}
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
			const boundsValue = this._osdViewer.getBounds();
			this._osdViewer.removeAllTiles();
			if (!group) {
				return;
			}
			const channelList = this._channelList.getList();
			channelList.unselectAll();
			if (group.channels?.length > 0) {
				await this.showColoredChannels(group.channels);
			}
			this._osdViewer.getRoot().callEvent("restoreZoom", [boundsValue]);
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

		async changeBitImage() {
			let min = lodash.get(this._image, "meta.ioparams.min");
			let max = lodash.get(this._image, "meta.ioparams.max");
			if (min == null || max == null) {
				const [histogramData] = await this._colorWindow.getHistogramData(constants.min, constants.max);
				min = histogramData.min;
				max = histogramData.max;
			}

			this._colorWindow.setMinAndMaxValuesByHistogram(0, max);
			if(max > constants.MAX_EDGE_FOR_8_BIT) {
				stateStore.bit = constants.SIXTEEN_BIT;
			} else {
				stateStore.bit = constants.EIGHT_BIT;
			}
		}

		_compositeFrames(channels, compositeType = "difference") {
			const viewer = this._osdViewer.$viewer();
			const numOfFrames = channels.length;
			const topFrameIndex = numOfFrames - 1;

			if (numOfFrames > 1) {
				for (let i = topFrameIndex - numOfFrames + 1; i < topFrameIndex; i++) {
					const bottomFrameIndex = i;
					const topFrame = viewer.world.getItemAt(bottomFrameIndex + 1);
					topFrame.setCompositeOperation(compositeType);
				}
			} else {
				viewer.viewport.goHome();
			}
		}

		_attachChannelsListEvents() {
			const channelList = this._channelList.getList();
			const groupsList = this._groupsPanel.getGroupsList();
			const groupsChannelList = this._groupsPanel.getGroupChannelsList();

			channelList.attachEvent("onAfterSelect", async (id) => {
				groupsList.unselectAll();
				groupsChannelList.unselectAll();

				const channel = this._channelsCollection.getItem(id);
				const layer = await this.getSingleOSDLayer(channel.index);

				const boundsValue = this._osdViewer.getBounds();
				this._osdViewer.removeAllTiles();
				this._osdViewer.addNewTile(layer.tileSource);
				this._osdViewer.getRoot().callEvent("restoreZoom", [boundsValue]);
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

			channelList.attachEvent("onSelectChange", async () => {
				const selectedChannel = channelList.getSelectedItem();
				const controlsForm = this._channelsControls.$controlForm();
				if (selectedChannel) {
					const layer = await this.getSingleOSDLayer(selectedChannel.index);
					controlsForm.setValues(layer);
					controlsForm.show();
				} else {
					controlsForm.hide();
				}
			});

			this._channelsControls.$brightnessSlider().attachEvent("onSliderDragging", async (value) => {
				this.changeFilterBySliderValue("brightness", value);
			});

			this._channelsControls.$contrastSlider().attachEvent("onSliderDragging", async (value) => {
				this.changeFilterBySliderValue("contrast", value);
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

			osdViewerRoot.attachEvent("restoreZoom", (boundsValue) => {
				this._osdViewer._openseaDragonViewer.addOnceHandler("tile-loaded", (data) => {
					this._osdViewer.setBounds(boundsValue);
				});
			});
		}

		_attachGroupsPanelEvents() {
			const groupsPanel = this._groupsPanel.getRoot();

			groupsPanel.attachEvent("groupSelectChange", (group) => {
				if (group) {
					this._changeURLGroupIndex(group);
					this._selectGroupHandler(group);

					const channels = this._channelList.getSelectedChannels();
					this._channelList.changeButtonVisibility(channels.length && group);
				}
			});

			groupsPanel.attachEvent("generateSceneFromTemplate", (groupId) => {
				this._groupColorTemplateWindow.showWindow(groupId);
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

			groupsPanel.attachEvent("uploadGroups", () => {
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

			groupsPanel.attachEvent("exportGroups", (groups) => {
				groupsLoader.downloadGroup(this._image.name, this._image._id, groups);
			});

			groupsPanel.attachEvent("addGroupFromTemplate", (groupName, channels) => {
				this._addNewGroup(groupName, channels);
			});
		}

		startChannelAdjusting(channel) {
			const groupsPanel = this._groupsPanel.getRoot();
			const groupChannelList = this._groupsPanel.getGroupChannelsList();
			const boundsValue = this._osdViewer.getBounds();
			this._osdViewer.$viewer().addOnceHandler("zoom", () => {
				this._osdViewer.setBounds(boundsValue);
			});

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
			const {max, min} = constants.DEFAULT_16_BIT_CHANNEL_SETTINGS;
			const colorSettings = {
				palette2: channel.color,
				min: channel.min || min,
				max: channel.max || max
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
				this._groupsPanel.getGroupChannelsList().clearAll();
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

		_changeGroupByIndex(index) {
			const groupsList = this._groupsPanel.getGroupsList();
			const groups = this._groupsCollection.data.serialize();
			if (groups[index]) {
				groupsList.select(groups[index].id);
			}
		}

		_changeURLGroupIndex(group) {
			const urlParams = router.getParams();
			if (group == null) {
				delete urlParams.group;
			} else {
				const groupIndex = this._groupsCollection.getIndexById(group.id);
				urlParams.group = groupIndex;
			}
			router.setParams(urlParams);
		}

		getMultichannelWrap() {
			return this.$$(MULTICHANNEL_WRAP_ID);
		}

		async getSingleOSDLayer(id) {
			let layer = this._channelLayers[id];
			if (!layer) {
				const tileSource = await this._tileService
					.getChannelTileSources(this._image, id);
				layer = MakerLayer.makeLayer({tileSource});
				this._channelLayers[id] = layer;
			}

			layer.tiledImage = this._osdViewer
				.$viewer()
				.world
				.getItemAt(0);

			return layer;
		}

		async changeFilterBySliderValue(field, value) {
			const channelList = this._channelList.getList();
			const selectedChannel = channelList.getSelectedItem();
			const layer = await this.getSingleOSDLayer(selectedChannel && selectedChannel.index);
			layer[field] = value;
			const viewer = this._osdViewer.$viewer();
			this._organizerFilters.updateFilters([layer], viewer);
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

		callGenerateScene() {
			const groupId = this._groupsPanel.getGroupsList().getSelectedId();
			this._groupsPanel.getRoot().callEvent("generateSceneFromTemplate", [groupId]);
		}
	}

	return new MultichannelView(app);
});
