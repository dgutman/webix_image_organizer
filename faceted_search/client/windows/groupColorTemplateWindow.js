define([
	"helpers/base_jet_view",
	"views/multichannel_viewer/channels_list",
	"views/multichannel_viewer/templateList",
	"helpers/utils",
	"models/multichannel_view/state_store",
	"windows/color_picker_window",
	"constants",
	"helpers/multichannel_view/tiles_service",
	"helpers/math_calculations"
], function(
	BaseJetView,
	ChannelList,
	TemplateList,
	utils,
	stateStore,
	ColorPickerWindow,
	constants,
	TilesSourcesService,
	MathCalculations
) {
	'use strict';
	const CLOSE_BUTTON_ID = `${constants.CLOSE_BUTTON_ID}-${webix.uid()}`;
	const TEMPLATE_CHANNELS_LIST_ID = `${constants.TEMPLATE_CHANNELS_LIST_ID}-${webix.uid()}`;
	const SAVE_TEMPLATE_BUTTON_ID = `${constants.SAVE_TEMPLATE_BUTTON_ID}-${webix.uid()}`;
	const ADD_TEMPLATE_BUTTON_ID = `${constants.ADD_TEMPLATE_BUTTON_ID}-${webix.uid()}`;
	const DEFAULT_TEMPLATE = webix.copy(constants.DEFAULT_TEMPLATE);

	return class GroupColorTemplateWindow extends BaseJetView {
		constructor(app, osdViewer, channelsCollection, groupsPanel) {
			super(app);
			this._osdViewer = osdViewer;
			this._groupsPanel = groupsPanel;
			this._colorWindow = this.ui(new ColorPickerWindow(this.app));

			this._templateList = this.ui(new TemplateList(app));
			this._channelsList = new ChannelList(app, {gravity: 0.2, minWidth: 200});

			this._channelsCollection = channelsCollection;
			this._templatesCollection = new webix.DataCollection();
			this._templateChannelCollection = new webix.DataCollection();

			this._waitForViewerCreation = webix.promise.defer();

			this.$oninit = () => {
				const channelList = this._channelsList.getList();
				const templateList = this._templateList.getList();
				const templateChannelList = this.getTemplateChannelList();
				this._tileService = new TilesSourcesService();
				channelList.sync(this._channelsCollection);
				templateList.sync(this._templatesCollection);
				templateChannelList.sync(this._templateChannelCollection);

				templateList.attachEvent("onSelectChange", () => {
					this.updateSelectedTemplateTiles();
				});

				templateList.attachEvent("applyTemplate", (id) => {
					this.applyTemplateHandler(id);
				});

				templateList.attachEvent("removeTemplate", (id) => {
					this.removeTemplateHandler(id);
				});

				channelList.attachEvent("onAfterSelect", async (id) => {
					templateList.unselectAll();
					templateChannelList.unselectAll();
					const channel = this._channelsCollection.getItem(id);
					const channelTileSource = await this._tileService.getChannelTileSources(this._image, 	channel.index);
					this._osdViewer.removeAllTiles();
					this._osdViewer.addNewTile(channelTileSource);
				});

				channelList.attachEvent("customSelectionChanged", (channels) => {
					const selectedGroups = templateList.getSelectedItem(true);
					this._channelsList.changeButtonVisibility(channels.length && selectedGroups.length);
				});

				channelList.attachEvent("addToSelectedGroup", (channels) => {
					const selectedGroup = templateList.getSelectedItem();
					this.addChannelsToTemplate(channels, selectedGroup);
					this.updateSelectedTemplateTiles();
					this._channelsList.unselectAllChannels();
				});
			};
		}

		get $ui() {
			const templateChannelList = {
				rows: [
					{
						template: "Template channels:",
						height: 30
					},
					{
						view: "list",
						localId: TEMPLATE_CHANNELS_LIST_ID,
						css: "groups-channels-list",
						drag: true,
						scroll: "auto",
						navigation: false,
						select: false,
						template: (obj) => {
							const showIcon = obj?.opacity ? "mdi mdi-eye" : "mdi mdi-eye-off";
							return `<span class="channel-item__name name ellipsis-text">${obj?.name}</span>
							<div class="icons">
								<span style="color: ${obj?.color};" class="icon palette mdi mdi-square"></span>
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
			};
	
			const controls = {
				cols: [
					{gravity: 5},
					{
						view: "button",
						localId: ADD_TEMPLATE_BUTTON_ID,
						label: "Add template",
						click: () => {
							this.addTemplate();
						}
					},
					{
						view: "button",
						localId: SAVE_TEMPLATE_BUTTON_ID,
						label: "Save templates",
						click: () => {
							this.saveTemplates();
						}
					}
				]
			};
	
			return {
				view: "window",
				// id: COLOR_TEMPLATE_WINDOW_ID,
				id: this._rootId,
				resize: true,
				move: true,
				css: "color-template-window",
				// modal: true,
				width: 800,
				height: 600,
				head: {
					view: "toolbar",
					cols: [
						{
							view: "label",
							width: 140,
							label: "Templates"
						},
						{gravity: 10},
						{
							view: "icon",
							id: CLOSE_BUTTON_ID,
							icon: "wxi-close",
							click: () => {
								this.closeWindow();
							}
						}
					]
				},
				body: {
					rows: [
						{
							cols: [
								this._channelsList,
								this._templateList,
								templateChannelList
							]
						},
						controls
					]
				}
			};
		}

		addTemplate() {
			const templateList = this._templateList.getList();
			const newTemplate = {...DEFAULT_TEMPLATE};
			this._templatesCollection.add(newTemplate);
			templateList.refresh();
		}
	
		saveTemplates() {
			const colorTemplateData = this._templatesCollection.serialize()
				.map((template) => {
					return {name: template.name, channels: template.channels, saved: true};
				});
			utils.setColorTemplateData(colorTemplateData);
			this._templatesCollection.clearAll();
			this._templatesCollection.parse(colorTemplateData);
		}
	
		applyTemplateHandler(id) {
			const templateList = this._templateList.getList();
			const {channels} = templateList.getItem(id);
			const newName = channels.map(((channel) => channel.name)).join("_");

			this._groupsPanel.getRoot().callEvent("addGroupFromTemplate", [newName, channels]);
		}
	
		deleteTemplate() {
			// TODO: implement
			const templateList = this._templateList.getList();
			const selectedTemplateId = templateList.getSelectedId();
			templateList.remove(selectedTemplateId);
		}
	
		updateSelectedTemplateTiles() {
			const templateList = this._templateList.getList();
			const template = templateList.getSelectedItem();
	
			this._templateChannelCollection.clearAll();
			this._template = template;
	
			if(template.channels?.length > 0) {
				this._templateChannelCollection.parse(template.channels);
			}
	
			this._groupsPanel.getRoot().callEvent("groupSelectChange", [template]);
		}
	
		addChannelsToTemplate(channels, template) {
			if(!template) {
				return null;
			}
			const count = template.channels.length;
			const newChannels = channels
				.filter(({index}) => !template.channels.find((channel) => channel.index === index))
				.map((channel, i, arr) => {
					const color = this.createColorByIndex(count + i, arr.length + count);
					if (stateStore.bit === constants.SIXTEEN_BIT) {
						return {...constants.DEFAULT_16_BIT_CHANNEL_SETTINGS, ...channel, color};
					}
					return {...constants.DEFAULT_8_BIT_CHANNEL_SETTINGS, ...channel, color};
				});
			template.channels.push(...newChannels);
			return newChannels;
		}
	
		removeTemplateHandler(id) {
			const templateList = this._templateList.getList();
			const isSelected = templateList.isSelected(id);
			this._templatesCollection.remove(id);
			if (isSelected) {
				this._templateList.unselectAll();
				this.getTemplateChannelList().clearAll();
				const firstId = this._templateList.getFirstId();
				this._templateList.select(firstId);
				if (!firstId) {
					this._osdViewer.setDefaultOSDImage();
				}
			}
		}
	
		showWindow(groupId) {
			try{
				this._templatesCollection.clearAll();
				const colorTemplateData = utils.getColorTemplateData() ?? [];
				const templates = [];
				const groupList = this._groupsPanel.getGroupsList();
				if (groupId) {
					this._template = groupList.getItem(groupId);
					templates.push(this._template);
					templates.push(...colorTemplateData);
				} else {
					if (colorTemplateData.length === 0) {
						this._template = {...DEFAULT_TEMPLATE};
					} else {
						templates.push(...colorTemplateData);
					}
				}
				this._templatesCollection.parse(templates);
				this.getRoot().show();
			} catch(err) {
				console.log(err);
			}
		}

		closeWindow() {
			const currentWindow = this.getRoot();
			currentWindow.hide();
		}
	
		getTemplateChannelList() {
			return this.$$(TEMPLATE_CHANNELS_LIST_ID);
		}
	
		getAddTemplateButton() {
			return this.$$(ADD_TEMPLATE_BUTTON_ID);
		}

		showOrHideChannel(id) {
			const channelList = this.getTemplateChannelList();
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
	
		_waitForChangesFromPaletteWindow(channel) {
			const channelList = this.getTemplateChannelList();
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
				this._groupsPanel.getRoot().callEvent("channelColorAdjustEnd", [channel]);
			});
		}

		// TODO: fix code duplication
		createColorByIndex(index, count = 1) {
			const hue = Math.round(MathCalculations.mapLinear(index, 0, count, 0, 360, true));
			const saturation = 100;
			const lightness = 50;
			return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
		}

		get _image() {
			return stateStore.image;
		}

		get _template() {
			return stateStore.template;
		}

		set _template(template) {
			stateStore.template = template;
		}
	};
});
