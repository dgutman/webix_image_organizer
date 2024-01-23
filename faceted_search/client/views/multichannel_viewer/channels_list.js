define([
	"helpers/base_jet_view",
	"models/multichannel_view/selected_items",
	"views/multichannel_viewer/sort_template",
	"constants"
], function(
	BaseJetView,
	SelectedItems,
	SortTemplate,
	constants
) {
	'use strict';
	const LIST_ID = `${constants.LIST_ID}-${webix.uid()}`;
	const TEXT_SEARCH_ID = `${constants.TEXT_SEARCH_ID}-${webix.uid()}`;
	const ADD_TO_GROUP_BUTTON_ID = `${constants.ADD_TO_GROUP_BUTTON_ID}-${webix.uid()}`;
	const GENERATE_SCENE_FROM_TEMPLATE_ID = `${constants.GENERATE_SCENE_FROM_TEMPLATE_ID}-${webix.uid()}`;

	return class ChannelList extends BaseJetView {
		constructor(app, config = {}) {
			super(app);

			this._cnf = config;
			this._sort = {
				type: "index",
				order: "asc"
			};

			this._sortTemplate = new SortTemplate(app);

			this.$oninit = () => {
				const view = this.getRoot();

				webix.extend(view, webix.OverlayBox);
				const list = this.getList();
				this._selectedChannelsModel = new SelectedItems(list);
				this._sortTemplate.addListById(list.config.id);

				this.attachListEvents();
			};
		}

		get $ui() {
			return {
				...this._cnf,
				id: this._rootId,
				rows: [
					{
						view: "text",
						css: "text-field",
						placeholder: "Search...",
						localId: TEXT_SEARCH_ID,
						on: {
							onTimedKeyPress: () => {
								const value = this.getListSearch().getValue();
								this.getList().filter(({name}) => {
									if (!value) {
										return true;
									}

									return name.toLowerCase().includes(value.toLowerCase());
								});
							}
						}
					},
					this._sortTemplate,
					{
						view: "list",
						css: "multichannel-view__channel-list ellipsis-text",
						localId: LIST_ID,
						scroll: "auto",
						navigation: false,
						select: false,
						drag: "source",
						template: ({name, id, index}, common) => `${common.checkboxState(id)}
						<span class="channel-item__name name">${name}</span>
						<span class="channel-item__index index">(${index})</span>`,
						type: {
							checkboxState: (id) => {
								const icon = this._selectedChannelsModel.isSelected(id)
									? "checked mdi mdi-checkbox-marked" : "unchecked mdi mdi-checkbox-blank-outline";
								return `<span class='checkbox ${icon}'></span>`;
							}
						},
						onClick: {
							checkbox: (ev, id) => {
								this.handleCustomSelect(id);
								return false;
							}
						}
					},
					{
						view: "button",
						localId: ADD_TO_GROUP_BUTTON_ID,
						css: "btn ellipsis-text",
						height: 35,
						hidden: true,
						value: "Add to selected group",
						click: () => {
							this.getList().callEvent("addToSelectedGroup", [this.getSelectedChannels()]);
						}
					},
					{
						view: "button",
						id: GENERATE_SCENE_FROM_TEMPLATE_ID,
						width: 250,
						value: "Generate Scene From Template"
					}
				]
			};
		}

		attachListEvents() {
			const list = this.getList();
			list.attachEvent("onItemDblClick", (id) => {
				this.handleCustomSelect(id);
			});

			list.attachEvent("onItemClick", (id) => {
				list.select(id);
			});
		}

		handleCustomSelect(id) {
			if (this._selectedChannelsModel.isSelected(id)) {
				this._selectedChannelsModel.unselect(id);
			} else {
				this._selectedChannelsModel.select(id);
			}
			const list = this.getList();
			list.callEvent("customSelectionChanged", [this._selectedChannelsModel.getSelectedItems()]);
			list.refresh(id); // rerender item
		}

		isSelected(id) {
			return this._selectedChannelsModel.isSelected(id);
		}

		getSelectedChannels() {
			return this._selectedChannelsModel.getSelectedItems();
		}

		unselectAllChannels() {
			const list = this.getList();
			this._selectedChannelsModel.unselectAll();
			list.refresh();
			list.callEvent("customSelectionChanged", [this._selectedChannelsModel.getSelectedItems()]);
		}

		changeButtonVisibility(show) {
			const button = this.getAddToGroupButton();
			if (show) {
				button.show();
			} else {
				button.hide();
			}
		}

		getList() {
			return this.$$(LIST_ID);
		}

		getListSearch() {
			return this.$$(TEXT_SEARCH_ID);
		}

		getAddToGroupButton() {
			return this.$$(ADD_TO_GROUP_BUTTON_ID);
		}

		getGenerateSceneFromTemplateButton() {
			return this.$$(GENERATE_SCENE_FROM_TEMPLATE_ID);
		}
	};
});
