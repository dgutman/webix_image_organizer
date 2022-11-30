import {JetView} from "webix-jet";
import ChannelList from "../channelList";
import TemplateList from "../templateList";
import utils from "../../../../utils/utils";
import stateStore from "../../../../models/multichannelView/stateStore";
import ColorPickerWindow from "./colorPopup";
import constants from "../../../../constants";

// TODO: move IDs  to constants
const CLOSE_BUTTON_ID = `close-color-template-window-button-${webix.uid()}`;
const TEMPLATE_CHANNELS_LIST_ID = `template-channel-list-${webix.uid()}`;
const COLOR_TEMPLATE_WINDOW_ID = `color-template-window-${webix.uid()}`;
const SAVE_TEMPLATE_BUTTON_ID = `save-template-button-${webix.uid()}`;
const APPLY_TEMPLATE_BUTTON_ID = `apply-template-button-${webix.uid()}`;
const DELETE_TEMPLATE_BUTTON_ID = `delete-template-button-${webix.uid()}`;
const ADD_TEMPLATE_BUTTON_ID = `add-template-button-${webix.uid()}`;
const DEFAULT_TEMPLATE = {
	name: "Default",
	channels: [],
}

export default class GroupColorTemplateWindow extends JetView {
	constructor(app, osdViewer, channelsCollection, groupsPanel) {
		super(app);
		this._osdViewer = osdViewer;
		this._groupsPanel = groupsPanel;

		this._templateList = new TemplateList(this.app);
		this._channelList = new ChannelList(this.app, {gravity: 0.2, minWidth: 200});

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
						return `<span class="channel-item__name name">${obj?.name}</span>
						<div class="icons">
							<span style="color: ${obj?.color};" class="icon palette fas fa-square-full"></span>
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
		};

		const controls = {
			cols: [
				{gravity: 5},
				{
					view: "button",
					localId: ADD_TEMPLATE_BUTTON_ID,
					label: "Add template",
					click: () => {this.addTemplate()}
				},
				{
					view: "button",
					localId: SAVE_TEMPLATE_BUTTON_ID,
					label: "Save template",
					click: () => {this.saveTemplates()}
				},
				{
					view: "button",
					localId: APPLY_TEMPLATE_BUTTON_ID,
					label: "Apply template",
					click: () => {this.applyTemplate()}
				},
				{
					view: "button",
					localId: DELETE_TEMPLATE_BUTTON_ID,
					label: "Delete template",
					click: () => {this.deleteTemplate}
				}
			]
		}

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
						view:"icon",
						id: CLOSE_BUTTON_ID,
						icon:"wxi-close",
						click: function() {
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
							this._channelList,
							this._templateList,
							templateChannelList
						]
					},
					controls
				]
			}
		}
	}

	init() {
	}

	ready() {
		this._colorWindow = this.ui(new ColorPickerWindow(this.app));
		const channelList = this._channelList.getList();
		const templateList = this._templateList.getList();
		const templateChannelList = this.getTemplateChannelList();

		channelList.sync(this._channelsCollection);
		templateList.sync(this._templatesCollection);
		templateChannelList.sync(this._templateChannelCollection);

		// this._dragAndDropMediator = new DragAndDropMediator({
		// 	main: this,
		// 	groupsPanel: this._templateList,
		// 	channelsList: this._channelList
		// });
		this.attachEvents()
	}

	attachEvents() {
		const templateList = this._templateList.getList();

		this.on(templateList, "onSelectChange", () => {
			this.updateSelectedTemplateTiles();
		});
	}

	addTemplate() {
		const templateList = this._templateList.getList();
		const newTemplate = {...DEFAULT_TEMPLATE};
		this._templatesCollection.add(newTemplate);
		templateList.refresh();
	}

	saveTemplates() {
		const colorTemplateData = this._templatesCollection.serialize();
		utils.setColorTemplateData(colorTemplateData);
	}

	applyTemplate() {
		// TODO: implement
	}

	deleteTemplate() {
		// TODO: implement
		template
	}

	updateSelectedTemplateTiles() {
		const templateList = this._templateList.getList();
		const template = templateList.getSelectedItem();

		this._templateChannelCollection.clearAll();
		this._template = template;

		if(template) {
			this._templateChannelCollection.parse(template.channels);
			const templateChannelsIndexes = this._templateChannelCollection
				.serialize()
				.map(channel => channel.index);
			this._channelList.handleGroupSelect(templateChannelsIndexes);
		}

		this._groupsPanel.getRoot().callEvent("groupSelectChange", [template]);
	}

	addChannelsToGroup(channels, template) {
		if(!template) {
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

	removeTemplate(id) {
		const isSelected = this._templateList.isSelected(id);
		this._templatesCollection.remove(id);
		if (isSelected) {
			this._templateList.unselectAll();
			this.getTemplateChannelList().clearAll();
			const firstId = this._templateList.getFirstId();
			this._templateList.select(firstId);
			if (!firstId) {
				this._osdViewer.setDefaultOSDImage()
			}
		}
	}

	showWindow(groupId) {
		try{
			const colorTemplateData = utils.getColorTemplateData() ?? [];
			const templates = [];
			if (groupId) {
				const groupList = this._groupsPanel.getGroupsList();
				this._template = groupList.getItem(groupId);
				templates.push(this._template);
				templates.push(...colorTemplateData);
				this._templatesCollection.parse(templates);
			} else {
				this._template = {...DEFAULT_TEMPLATE};
			}
			this.getRoot().show();
		}
		catch(err) {
			// TODO: implement
		}
	}

	getTemplateChannelList() {
		return this.$$(TEMPLATE_CHANNELS_LIST_ID);
	}

	getAddTemplateButton() {
		return this.$$(ADD_TEMPLATE_BUTTON_ID);
	}

	get _template() {
		return stateStore.template
	}

	set _template(template) {
		stateStore.template = template
	}

	saveTemplates () {
		const colorTemplateData = utils.getColorTemplateData() ?? [];
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

		this._group.channels.splice(channelIndex, 1);
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
}
