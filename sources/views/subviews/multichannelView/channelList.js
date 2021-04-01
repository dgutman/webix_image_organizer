/* eslint-disable camelcase */
import {JetView} from "webix-jet";
import ajaxActions from "../../../services/ajaxActions";
import SelectedItems from "../../../models/selectedItems";

export default class ChannelList extends JetView {
	constructor(app, config = {}) {
		super(app);

		this._cnf = config;
	}

	config() {
		return {
			...this._cnf,
			view: "list",
			css: "multichannel-view__channel-list",
			navigation: false,
			select: false,
			drag: "source",
			template: ({channel_name, id}, common) => `${common.checkboxState(id)} <span class="channel-item__name name">${channel_name}</span>`,
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
				},
				name: (ev, id) => {
					this.getList().select(id);
				}
			}
		};
	}

	init(view) {
		webix.extend(view, webix.OverlayBox);
		const list = this.getList();
		this._selectedChannelsModel = new SelectedItems(list);

		this.attachListEvents();
	}

	attachListEvents() {
		const list = this.getList();
		this.on(list, "onItemDblClick", (id) => {
			this.handleCustomSelect(id);
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

	async _getTileSources(image) { // Change it!!!
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

	getSelectedChannels() {
		return this._selectedChannelsModel.getSelectedItems();
	}

	unselectAllChannels() {
		this._selectedChannelsModel.unselectAll();
		this.getList().refresh();
	}

	getList() {
		return this.getRoot();
	}
}
