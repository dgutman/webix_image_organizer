import {JetView} from "webix-jet";

import ColorPickerWindow from "./colorPopup";
import constants from "../../../../constants";
import stateStore from "../../../../models/multichannelView/stateStore";
import MathCalculations from "../../../../utils/mathCalculations";
import utils from "../../../../utils/utils";
import ChannelList from "../channelList";
import TemplateList from "../templateList";

// TODO: move IDs  to constants
const CLOSE_BUTTON_ID = `close-color-template-window-button-${webix.uid()}`;
const TEMPLATE_CHANNELS_LIST_ID = `template-channel-list-${webix.uid()}`;
const COLOR_TEMPLATE_WINDOW_ID = `color-template-window-${webix.uid()}`;
const SAVE_TEMPLATE_BUTTON_ID = `save-template-button-${webix.uid()}`;
const ADD_TEMPLATE_BUTTON_ID = `add-template-button-${webix.uid()}`;
const DEFAULT_TEMPLATE = webix.copy(constants.DEFAULT_TEMPLATE);

export default class GroupColorTemplateWindow extends JetView {
	constructor(app, osdViewer, channelsCollection, groupsPanel, tileService, rootScope) {
		super(app);
		this._rootScope = rootScope;
		this._osdViewer = osdViewer;
		this._groupsPanel = groupsPanel;
		this._tileService = tileService;

		this._templateList = new TemplateList(this.app);
		this._channelsList = new ChannelList(this.app, {gravity: 0.2, minWidth: 200});

		this._channelsCollection = channelsCollection;
		this._templatesCollection = new webix.DataCollection();
		this._templateChannelCollection = new webix.DataCollection();
	}

	config() {
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
						const showIcon = obj?.opacity ? "fas fa-eye" : "fas fa-eye-slash";
						return `<div class="channel-item">
							<div class="channel-item__row-one">
								<span class="channel-item__name name ellipsis-text">${obj?.name}</span>
								<div class="icons">
									<span style="color: ${obj?.color};" class="icon palette fas fa-square-full"></span>
									<span class="icon show ${showIcon}"></span>
									<span class="icon delete fas fa-minus-circle"></span>
								</div>
							</div>
							<div class="channel-item__row-two">
								<div class="channel-item__range-opacity"></div>
								<div class="channel-item__position-controls"></div>
							</div>
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
					click: () => { this.addTemplate(); }
				},
				{
					view: "button",
					localId: SAVE_TEMPLATE_BUTTON_ID,
					label: "Save templates",
					click: () => { this.saveTemplates(); }
				}
			]
		};

		return {
			view: "window",
			id: COLOR_TEMPLATE_WINDOW_ID,
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
						click() {
							const currentWindow = webix.$$(COLOR_TEMPLATE_WINDOW_ID);
							currentWindow.hide();
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

	init() {}

	ready() {
		this._colorWindow = this.ui(new ColorPickerWindow(this.app));
		const channelList = this._channelsList.getList();
		const templateList = this._templateList.getList();
		const templateChannelList = this.getTemplateChannelList();

		channelList.sync(this._channelsCollection);
		templateList.sync(this._templatesCollection);
		templateChannelList.sync(this._templateChannelCollection);

		this.attachTemplateListEvents();
		this.attachChannelsListEvent();
	}

	attachTemplateListEvents() {
		const templateList = this._templateList.getList();

		this.on(templateList, "onSelectChange", () => {
			this.updateSelectedTemplateTiles();
		});

		this.on(templateList, "applyTemplate", (id) => {
			this.applyTemplateHandler(id);
		});

		this.on(templateList, "removeTemplate", (id) => {
			this.removeTemplateHandler(id);
		});
	}

	attachChannelsListEvent() {
		const channelList = this._channelsList.getList();
		const templateList = this._templateList.getList();
		const templateChannelList = this.getTemplateChannelList();

		this.on(channelList, "onAfterSelect", async (id) => {
			templateList.unselectAll();
			templateChannelList.unselectAll();

			const channel = this._channelsCollection.getItem(id);
			const channelTileSource = await this
				._tileService
				.getChannelTileSources(this._image, channel.index);
			this._osdViewer.removeAllTiles();
			this._osdViewer.addNewTile(channelTileSource);
		});

		this.on(channelList, "customSelectionChanged", (channels) => {
			const selectedGroups = templateList.getSelectedItem(true);
			this._channelsList.changeButtonVisibility(channels.length && selectedGroups.length);
		});

		this.on(channelList, "addToSelectedGroup", (channels) => {
			const selectedGroup = templateList.getSelectedItem();
			this.addChannelsToTemplate(channels, selectedGroup);
			this.updateSelectedTemplateTiles();
			this._channelsList.unselectAllChannels();
		});
	}

	addTemplate() {
		const templateList = this._templateList.getList();
		const newTemplate = webix.copy(DEFAULT_TEMPLATE);
		this._templatesCollection.add(newTemplate);
		templateList.refresh();
	}

	saveTemplates() {
		const colorTemplateData = this._templatesCollection.serialize()
			.map(template => ({name: template.name, channels: template.channels, saved: true}));
		utils.setColorTemplateData(colorTemplateData);
		this._templatesCollection.clearAll();
		this._templatesCollection.parse(colorTemplateData);
	}

	applyTemplateHandler(id) {
		const templateList = this._templateList.getList();
		const {name, channels} = templateList.getItem(id);

		this._groupsPanel.getRoot().callEvent("addGroupFromTemplate", [name, channels]);
	}

	deleteTemplate() {
		const templateList = this._templateList.getList();
		const selectedTemplateId = templateList.getSelectedId();
		templateList.remove(selectedTemplateId);
	}

	updateSelectedTemplateTiles() {
		const templateList = this._templateList.getList();
		const template = templateList.getSelectedItem();

		this._templateChannelCollection.clearAll();
		this._template = template;

		if (template) {
			this._templateChannelCollection.parse(template.channels);
		}

		this._groupsPanel.getRoot().callEvent("groupSelectChange", [template]);
	}

	addChannelsToTemplate(channels, template) {
		if (!template) {
			return null;
		}
		const count = template.channels.length;
		let newChannels = channels
			.filter(({index}) => !template.channels.find(channel => channel.index === index))
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
		const templateListView = this._templateList.getList();
		const isSelected = templateListView.isSelected(id);
		this._templatesCollection.remove(id);
		if (isSelected) {
			templateListView.unselectAll();
			this.getTemplateChannelList().clearAll();
			const firstId = templateListView.getFirstId();
			templateListView.select(firstId);
			if (!firstId) {
				this.addTemplate();
				templateListView.select();
			}
		}
	}

	showWindow(groupId) {
		try {
			this._templatesCollection.clearAll();
			const colorTemplateData = utils.getColorTemplateData() ?? [];
			const templates = [];
			const groupList = this._groupsPanel.getGroupsList();
			if (groupId) {
				this._template = groupList.getItem(groupId);
				templates.push(this._template);
				templates.push(...colorTemplateData);
			}
			else if (colorTemplateData.length === 0) {
				this._template = webix.copy(DEFAULT_TEMPLATE);
			}
			else {
				templates.push(...colorTemplateData);
			}
			this._templatesCollection.parse(templates);
			if (templates.length === 0) {
				this.addTemplate();
			}
			const templateListView = this._templateList.getList();
			templateListView.select();
			this.getRoot().show();
		}
		catch (err) {
			console.log(err);
		}
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
		let saturation = 100;
		let lightness = 50;
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
}
