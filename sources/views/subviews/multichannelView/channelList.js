import {JetView} from "webix-jet";
import ajaxActions from "../../../services/ajaxActions";
import SelectedItems from "../../../models/selectedItems";
import SortTemplate from "./sortChannelsTemplate";

const LIST_ID = "channels-list";
const TEXT_SEARCH_ID = "channels-search-field";
const ADD_TO_GROUP_BUTTON_ID = "add-to-group";

export default class ChannelList extends JetView {
	constructor(app, config = {}) {
		super(app);

		this._cnf = config;
		this._sort = {
			type: "index",
			order: "asc"
		};

		this._sortTemplate = new SortTemplate(app);
	}

	config() {
		return {
			...this._cnf,
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
					css: "multichannel-view__channel-list",
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
							const icon = this._selectedChannelsModel.isSelected(id) ? "checked fas fa-check-square" : "unchecked far fa-square";
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
				}
			]
		};
	}

	init(view) {
		webix.extend(view, webix.OverlayBox);
		const list = this.getList();
		this._selectedChannelsModel = new SelectedItems(list);
		this._sortTemplate.addListById(list.config.id);

		this.attachListEvents();
	}

	attachListEvents() {
		const list = this.getList();
		this.on(list, "onItemDblClick", (id) => {
			this.handleCustomSelect(id);
		});

		this.on(list, "onItemClick", (id) => {
			list.select(id);
		});
	}

	handleCustomSelect(id) {
		if (this._selectedChannelsModel.isSelected(id)) {
			this._selectedChannelsModel.unselect(id);
		}
		else {
			this._selectedChannelsModel.select(id);
		}
		const list = this.getList();
		list.callEvent("customSelectionChanged", [this._selectedChannelsModel.getSelectedItems()]);
		list.refresh(id); // rerender item
	}

	async _getTileSources(image) {
		const tileSourceOptions = await ajaxActions.getImageTiles(image._id);
		const tileSources = {
			crossOriginPolicy: "Anonymous",
			loadTilesWithAjax: true,
			width: tileSourceOptions.sizeX,
			height: tileSourceOptions.sizeY,
			tileWidth: tileSourceOptions.tileWidth,
			tileHeight: tileSourceOptions.tileHeight,
			minLevel: 0,
			maxLevel: tileSourceOptions.levels - 1,
			getTileUrl(level, x, y) {
				return ajaxActions.getImageTileUrl(image._id, level, x, y);
			}
		};

		return tileSources;
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
		}
		else {
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
}
