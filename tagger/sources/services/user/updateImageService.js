import dot from "dot-object";
import constants from "../../constants";

const DEFAULT_COLORS = constants.DEFAULT_COLORS;
const DEFAULT_HOT_KEYS = constants.DEFAULT_HOT_KEYS;

export default class UpdatedImagesService {
	constructor(dataveiw, dataviewStore, tagSelect, valueSelect) {
		this.dataveiw = dataveiw;
		this.dataviewStore = dataviewStore;
		this.tagSelect = tagSelect;
		this.valueSelect = valueSelect;

		this.changedItems = {};

		this.hotkeys = {};
		this.hotkeyIcons = {};
	}

	getTagSettings(tag, value) {
		let settings = null;
		if (tag && value) {
			settings = {
				tag: tag.name,
				value: value.name,
				type: tag.type,
				selection: tag.selection,
				default: tag.default
			};
		}
		return settings;
	}

	getSelectedTagSettings() {
		const tagList = this.tagSelect.getList();
		const valueList = this.valueSelect.getList();

		const selectedTag = tagList.getItem(this.tagSelect.getValue());
		const selectedValue = valueList.getItem(this.valueSelect.getValue());
		return this.getTagSettings(selectedTag, selectedValue);
	}

	addSelectedTagValueToImage(id) {
		const settings = this.getSelectedTagSettings();
		const image = this.dataviewStore.getItemById(id);
		this.addTagValueToImage(image, settings);
	}

	addTagValueToImage(image, settings) {
		let tagValues = [{value: settings.value}];

		if (settings.selection === constants.TAG_SELECTION.MULTI) {
			tagValues = dot.pick(`meta.tags.${settings.tag}`, image) || [];
			tagValues.push({value: settings.value});
		}

		dot.remove(`meta.tags.${settings.tag}`, image);
		dot.str(`meta.tags.${settings.tag}`, tagValues, image);

		image.isUpdated = true;
		this.updateImage(image);
	}

	removeSelectedTagValueFromImage(id) {
		const settings = this.getSelectedTagSettings();
		const image = this.dataviewStore.getItemById(id);
		this.removeTagValueFromImage(image, settings);
	}

	removeTagValueFromImage(image, settings) {
		let tagValues = dot.pick(`meta.tags.${settings.tag}`, image) || [];

		dot.remove(`meta.tags.${settings.tag}`, image);

		if (settings.selection === constants.TAG_SELECTION.SINGLE) {
			tagValues = settings.type === constants.TAG_TYPES.MULTI_WITH_DEFAULT ? [{value: settings.default}] : [];
		}
		else {
			tagValues = tagValues.filter(obj => obj.value !== settings.value);
		}
		dot.str(`meta.tags.${settings.tag}`, tagValues, image);

		image.isUpdated = true;
		this.updateImage(image);
	}

	collectValueHotkeys() {
		const tagList = this.tagSelect.getList();
		const tags = tagList.data.serialize();
		tags.forEach((tag) => {
			const values = tag.values;
			values.forEach((value) => {
				const hotkey = value.hotkey;
				if (hotkey) {
					this.hotkeys[hotkey] = [tag.name, value.name];

					switch (tag.icontype) {
						case "pervalue": {
							if (value.icon) this.hotkeyIcons[hotkey] = [value.icon, null, value.badgecolor];
							break;
						}
						case "badge": {
							if (tag.icon) this.hotkeyIcons[hotkey] = [tag.icon, value.badgevalue, value.badgecolor];
							break;
						}
						case "badgecolor": {
							if (tag.icon) this.hotkeyIcons[hotkey] = [tag.icon, null, value.badgecolor];
							break;
						}
						default:
							break;
					}
				}
			});
		});
	}

	collectDefaultValueHotkeys(tagId) {
		const tagList = this.tagSelect.getList();
		const tags = tagList.data.serialize();
		tags.forEach((obj, i) => {
			this.hotkeys[`q+${DEFAULT_HOT_KEYS[i]}`] = [obj.name];
		});

		const tag = tagList.getItem(tagId);
		const tagIndex = tagList.getIndexById(tag.id);
		const values = tag.values;
		values.forEach((value, i) => {
			let hotkey = DEFAULT_HOT_KEYS[i];
			if (tag.type === "binary") {
				hotkey = value.name[0];
				this.hotkeyIcons[hotkey] = [this.getBinaryValueIcon(value.name), null, DEFAULT_COLORS[tagIndex]];
			}
			else {
				this.hotkeyIcons[hotkey] = [null, hotkey, DEFAULT_COLORS[tagIndex]];
			}
			this.hotkeys[hotkey] = [tag.name, value.name];
		});
	}

	getBinaryValueIcon(valName) {
		const keys = Object.keys(constants.BINARY_ICONS_FOR_VALUES);
		return keys.reduce((icon, key) => {
			if (constants.BINARY_ICONS_FOR_VALUES[key].includes(valName.toLowerCase())) {
				switch (key) {
					case "YES":
						icon = "fa-check";
						break;
					case "NO":
						icon = "fa-times";
						break;
					default:
						break;
				}
			}
			return icon;
		}, null);
	}

	updateImage(image) {
		this.dataviewStore.updateItem(null, image._id, image);
		this.changedItems[image._id] = dot.pick("meta.tags", image);
	}

	presetChangedValues(images) {
		return images.map((image) => {
			if (this.changedItems[image._id]) {
				let imageTags = dot.pick("meta.tags", image) || {};
				dot.remove("meta.tags", image);

				imageTags = this.changedItems[image._id];
				image.isUpdated = true;

				dot.str("meta.tags", imageTags, image);
			}
			return image;
		});
	}

	updateImageByHotkey(key, image, tag, value) {
		const settings = this.getTagSettings(tag, value);
		const imagesTag = dot.pick(`meta.tags.${settings.tag}`, image);
		if (imagesTag && imagesTag.find(valueObject => valueObject.value === settings.value)) {
			if (settings.default === settings.value) return;
			this.removeTagValueFromImage(image, settings);
		}
		else {
			this.addTagValueToImage(image, settings);
		}
	}

	clearChangedItems() {
		this.changedItems = {};
	}
}
