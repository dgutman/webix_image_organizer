define([
	"helpers/base_jet_view",
	"helpers/math_calculations",
	"models/multichannel_view/state_store",
	"windows/color_picker_window",
	"constants",
	"libs/hotkeys-js/dist/hotkeys",
	"views/multichannel_viewer/group_channels"
], function(
	BaseJetView,
	MathCalculations,
	stateStore,
	ColorPickerWindow,
	constants,
	hotkeys,
	GroupChannels
) {
	'use strict';
	const GROUPS_LIST_ID = "groups-list";
	const GROUPS_TEXT_SEARCH_ID = "groups-search-field";
	const UPLOADER_API_ID = "uploader-api";
	const GROUPS_TITLE_TEMPLATE = "groups-title";
	const GENERATE_SCENE_FROM_TEMPLATE_ID = "apply-color-template-button";

	return class GroupsPanel extends BaseJetView {
		constructor(app, config = {}, colorWindow) {
			super(app);

			this._cnf = config;
			this._channelsSlidersContainersIds = new Map();
			this._groupChannelsList = new GroupChannels(app, this, "GroupChannels", true);
			this._segmentChannelsList = new GroupChannels(app, this, "Segment channels", false);

			this.$oninit = () => {
				const view = this.getRoot();

				webix.extend(view, webix.OverlayBox);
				webix.TooltipControl.addTooltip(this.$$(GROUPS_TITLE_TEMPLATE).$view);

				this._colorWindow = colorWindow;

				const groupsList = this.getGroupsList();
				const generateSceneFromTemplateButton = this.getGenerateSceneFromTemplateButton();

				groupsList.attachEvent("onSelectChange", () => {
					this.updateSelectedGroupTiles();
				});

				generateSceneFromTemplateButton.attachEvent("onItemClick", () => {
					const groupId = this.getGroupsList().getSelectedId();
					this.getRoot().callEvent("generateSceneFromTemplate", [groupId]);
				});
			};
		}

		get $ui() {
			return {
				...this._cnf,
				id: this._rootId,
				rows: [
					{
						css: "groups-panel__groups-header groups-header",
						localId: GROUPS_TITLE_TEMPLATE,
						borderless: true,
						template: () => `Groups: <div>
								<span class="export icon mdi mdi-download" webix_tooltip="download groups"></span>
								<span class="import icon mdi mdi-upload" title="import groups from file"></span>
							</div>`,
						height: 30,
						onClick: {
							export: () => {
								this.exportGroups();
							},
							import: () => {
								this.importGroups();
							}
						}
					},
					{
						view: "text",
						css: "text-field",
						placeholder: "Search...",
						localId: GROUPS_TEXT_SEARCH_ID,
						on: {
							onTimedKeyPress: () => {
								const value = this.getGroupsSearch().getValue();
								this.getGroupsList().filter(({name}) => {
									if (!value) {
										return true;
									}
									return name.toLowerCase().includes(value.toLowerCase());
								});
							}
						}
					},
					{
						view: "list",
						localId: GROUPS_LIST_ID,
						css: "groups-list",
						drag: "target",
						scroll: "auto",
						navigation: false,
						select: true,
						tooltip: ({name}) => name,
						template: ({name}) => `<span class="group-item__name name ellipsis-text">${name}</span>
							<div class="icons">
								<span class="icon delete mdi mdi-minus-circle"></span>
							</div>`,
						onClick: {
							delete: (ev, id) => {
								this.removeGroup(id);
							}
						}
					},
					{
						cols: [
							{
								view: "button",
								id: GENERATE_SCENE_FROM_TEMPLATE_ID,
								value: "Generate Scene From Template"
							}
						]
					},
					this._groupChannelsList,
					this._segmentChannelsList,
					{
						view: "uploader",
						localId: UPLOADER_API_ID,
						apiOnly: true,
						height: 1,
						autosend: false,
						multiple: false
					}
				]
			};
		}

		handleChannelsOrderChange(newChannelIndex, oldChannelIndex) {
			this.getRoot().callEvent("channelOrderChange", [newChannelIndex, oldChannelIndex]);
		}

		updateSelectedGroupTiles() {
			const groupsList = this.getGroupsList();
			const channelsList = this.getGroupsChannelsList();
			const segmentationList = this.getSegmentalChannelsList();

			const group = groupsList.getSelectedItem();
			this.clearGroupChannelsList();
			this._group = group;

			if (group) {
				// Set channel index in group to work with channels correctly
				const channels = group.channels.map((channel, index) => {
					channel.channelIndexInGroup = index;
					return channel;
				});
				const groupChannels = channels.filter(
					channel => !constants.SEGMENT_CHANNELS.includes(channel.name)
				);
				const segmentChannels = group.channels.filter(
					channel => constants.SEGMENT_CHANNELS.includes(channel.name)
				);
				channelsList.parse(groupChannels);
				segmentationList.parse(segmentChannels);
			}

			this.getRoot().callEvent("groupSelectChange", [group]);
		}

		addChannelsToGroup(channels, group) {
			if (!group) {
				return null;
			}
			const count = group.channels.length;
			const newChannels = channels
				.filter(({index}) => !group.channels.find((channel) => channel.index === index))
				.map((channel, i, arr) => {
					const color = this.createColorByIndex(count + i, arr.length + count);
					if(stateStore.bit == constants.SIXTEEN_BIT) {
						return {...constants.DEFAULT_16_BIT_CHANNEL_SETTINGS, ...channel, color};
					} else {
						return {...constants.DEFAULT_8_BIT_CHANNEL_SETTINGS, ...channel, color};
					}
				});
			group.channels.push(...newChannels);
			return newChannels;
		}

		removeGroup(id) {
			const groupsList = this.getGroupsList();
			const group = groupsList.getItem(id);
			this.getRoot().callEvent("removeGroup", [id, group]);
		}

		getColoredChannels(channels) {
			return channels.map((channel, i) => {
				if (channel.color) {
					return channel;
				}
				const rgbColor = this.createColorByIndex(i, channels.length);
				return Object.assign({}, channel, {color: rgbColor});
			});
		}

		createColorByIndex(index, count = 1) {
			const hue = Math.round(MathCalculations.mapLinear(index, 0, count, 0, 360, true));
			const saturation = 100;
			const lightness = 50;
			return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
		}

		exportGroups() {
			const groups = this.getGroupsList().data.serialize();
			if (!groups.length) {
				return;
			}

			this.getRoot().callEvent("exportGroups", [groups]);
		}

		importGroups() {
			this.getRoot().callEvent("uploadGroups");
		}

		clearGroupChannelsList() {
			const channelsList = this.getGroupsChannelsList();
			const segmentationList = this.getSegmentalChannelsList();
			channelsList.clearAll();
			segmentationList.clearAll();
		}

		getGroupsList() {
			return this.$$(GROUPS_LIST_ID);
		}

		getGroupsChannelsList() {
			return this._groupChannelsList.getChannelsList();
		}

		getSegmentalChannelsList() {
			return this._segmentChannelsList.getChannelsList();
		}

		getGroupsSearch() {
			return this.$$(GROUPS_TEXT_SEARCH_ID);
		}

		getColorWindow() {
			return this._colorWindow;
		}

		getGenerateSceneFromTemplateButton() {
			return this.$$(GENERATE_SCENE_FROM_TEMPLATE_ID);
		}

		get _group() {
			return stateStore.group;
		}

		set _group(group) {
			stateStore.group = group;
		}
	};
});
