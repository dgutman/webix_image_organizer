import dot from "dot-object";
import constants from "../../constants";

export default class UpdatedImagesService {
	constructor(dataveiw, dataviewStore, tagSelect, valueSelect) {
		this.dataveiw = dataveiw;
		this.dataviewStore = dataviewStore;
		this.tagSelect = tagSelect;
		this.valueSelect = valueSelect;

		this.changedItems = {};

		this.hotkeys = {};
		this.predefinedTags = {};
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

		image._updated = true;
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

		image._updated = true;
		this.updateImage(image);
	}

	collectDefaultValuesAndHotkeys() {
		const tagList = this.tagSelect.getList();
		let tagsObject = {};
		const tags = tagList.data.serialize();
		tags.forEach((tag) => {
			this.collectValueHotkeys(tag);
			tagsObject[tag.name] = [];
			if (tag.type === constants.TAG_TYPES.MULTI_WITH_DEFAULT) {
				tagsObject[tag.name].push({value: tag.default});
			}
		});
		this.predefinedTags = webix.copy(tagsObject);
	}

	collectValueHotkeys(tag) {
		const values = tag.values;
		values.forEach((value) => {
			const hotkey = value.hotkey;
			if (hotkey) {
				this.hotkeys[hotkey] = [tag.name, value.name];
			}
		});
	}

	updateImage(image) {
		this.dataviewStore.updateItem(null, image._id, image);
		this.changedItems[image._id] = dot.pick("meta.tags", image);
	}

	presetDefaultValues(images) {
		return images.map((image) => {
			let imageTags = dot.pick("meta.tags", image) || {};
			dot.remove("meta.tags", image);

			if (this.changedItems[image._id]) {
				imageTags = this.changedItems[image._id];
				image._updated = true;
			}
			else {
				Object.assign(imageTags, webix.copy(this.predefinedTags));
			}

			dot.str("meta.tags", imageTags, image);

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
}
