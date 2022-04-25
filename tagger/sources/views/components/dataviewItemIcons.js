import constants from "../../constants";
import IconTemplate from "./iconTemplate";

const {
	PER_VALUE,
	BADGE,
	BADGE_COLOR
} = constants.TAG_ICON_TYPES;

class UserDataviewTagIcons {
	constructor(tagRichselect, valueRichselect, dataview) {
		this.tagSelect = tagRichselect;
		this.tagList = this.tagSelect.getList();
		this.valueSelect = valueRichselect;
		this.valueList = this.valueSelect.getList();
		this.dataview = dataview;

		this.tagList.attachEvent("onAfterLoad", () => {
			this.tagsWithIcons = {};
			this.iconsList = [];
			this.parseTagIcons();
		});

		this.valueSelect.attachEvent("onChange", (id) => {
			this.sortIconListBySelectedValue(id);
			if (id) {
				dataview.refresh();
			}
		});

		this.tagsWithIcons = {};
		this.iconsList = [];
		this.ignoreDefault = false;
	}

	sortIconListBySelectedValue(valueId) {
		const selectedTagId = this.tagSelect.getValue();
		const selectedTag = this.tagList.getItem(selectedTagId);
		if (selectedTag) {
			// find icon related to selected tag-value dependency (mainIcon)
			let mainIcon;
			const tagWithIcon = this.tagsWithIcons[selectedTag.name];
			mainIcon = tagWithIcon ? tagWithIcon.icon : null;

			if (tagWithIcon && tagWithIcon.type === PER_VALUE && valueId) {
				const selectedValue = this.valueList.getItem(valueId);
				mainIcon = tagWithIcon.values[selectedValue.name].icon;
			}

			// put mainIcon to the beginning of the array
			if (mainIcon) {
				const index = this.iconsList.findIndex((icon) => {
					if (Array.isArray(icon) && icon.includes(mainIcon)) {
						return icon;
					}
					return icon === mainIcon;
				});
				if (index !== -1) {
					const main = this.iconsList.splice(index, 1);
					this.iconsList = main.concat(this.iconsList);
				}
			}
		}
	}

	parseTagIcons() {
		const tags = this.tagList.data.serialize();
		tags.forEach((tag) => {
			if (tag.icontype) {
				this.tagsWithIcons[tag.name] = {
					type: tag.icontype,
					selection: tag.selection,
					values: this.collectValueIcons(tag.values, tag.selection),
					icon: tag.icon || null
				};
				if (tag.icon) this.iconsList.push(tag.icon);
			}
		});
	}

	collectValueIcons(arr, selection) {
		const values = {};
		const icons = [];
		arr.forEach((val) => {
			values[val.name] = {
				icon: val.icon,
				badgevalue: val.badgevalue,
				badgecolor: val.badgecolor,
				default: val.default
			}; // val.icon || val.badgevalue || val.badgecolor || null;
			if (val.icon) icons.push(val.icon);
		});
		if (icons.length && selection === "single") this.iconsList.push(icons);
		else if (icons.length) this.iconsList = this.iconsList.concat(icons);
		return values;
	}

	getItemIconsTemplate(item, itemWidth) {
		const icons = {};

		if (item.meta && item.meta.tags) {
			const tags = item.meta.tags;
			const iconTagNames = Object.keys(this.tagsWithIcons);
			iconTagNames.forEach((tagWithIconName) => {
				if (tags.hasOwnProperty(tagWithIconName)) {
					const tagWithIcon = webix.copy(this.tagsWithIcons[tagWithIconName]);

					if (this.ignoreDefault) {
						Object.keys(tagWithIcon.values).forEach((valueName) => {
							const valObj = tagWithIcon.values[valueName];
							if (valObj.default) {
								delete tagWithIcon.values[valueName];
							}
						});
					}

					const itemTag = tags[tagWithIconName];

					let newIcons;
					switch (tagWithIcon.type) {
						case PER_VALUE:
							newIcons = this.getPerValueIcons(itemTag, tagWithIcon);
							break;
						case BADGE:
							newIcons = this.getBadgeIcons(itemTag, tagWithIcon);
							break;
						case BADGE_COLOR:
							newIcons = this.getColorIcons(itemTag, tagWithIcon);
							break;
						default:
							break;
					}
					Object.assign(icons, newIcons);
				}
			});
		}
		let sortedIcons = this.getSortedIcons(icons);
		sortedIcons = this.getCuttedIconsTemplate(sortedIcons, itemWidth);
		return `<div class='item-tag-related-icons'>${sortedIcons.join("")}</div>`;
	}

	getPerValueIcons(itemTag, tagWithIcon) {
		return itemTag.reduce((acc, valObj) => {
			const curValue = tagWithIcon.values[valObj.value];
			if (curValue?.icon) {
				Object.assign(acc, {
					[curValue.icon]: IconTemplate.getSingleIconTemplate(
						curValue.icon,
						null,
						curValue.badgecolor
					)
				});
			}
			return acc;
		}, {});
	}

	getBadgeIcons(itemTag, tagWithIcon) {
		return itemTag.reduce((acc, valObj) => {
			if (tagWithIcon.values.hasOwnProperty(valObj.value)) {
				const curValue = tagWithIcon.values[valObj.value];
				acc[tagWithIcon.icon] = IconTemplate.getSingleIconTemplate(
					tagWithIcon.icon,
					curValue.badgevalue,
					curValue.badgecolor
				);
				return acc;
			}
		}, {});
	}

	getColorIcons(itemTag, tagWithIcon) {
		let iconHolder = {};
		const colors = itemTag
			.filter(valObj => tagWithIcon.values.hasOwnProperty(valObj.value) &&
				tagWithIcon.values[valObj.value].hasOwnProperty(BADGE_COLOR))
			.map(valObj => tagWithIcon.values[valObj.value].badgecolor);
		if (tagWithIcon.icon && colors.length) {
			iconHolder[tagWithIcon.icon] = IconTemplate.getSingleIconTemplate(
				tagWithIcon.icon,
				null,
				colors.sort()
			);
		}
		return iconHolder;
	}

	getSingleIconTemplate(...args) {
		return IconTemplate.getSingleIconTemplate(...args);
	}

	getSortedIcons(icons) {
		// get icons that are in item
		return this.iconsList.flat().filter(icon => icons[icon]).map(name => icons[name]);
	}

	getCuttedIconsTemplate(iconsArray, itemWidth) {
		let iconsCuttedArray = iconsArray;
		const iconWidth = constants.DATAVIEW_TAG_ICON_WRAP_SIZE + 3;
		const desiredWrapWidth = itemWidth - 40;
		const iconsWrapWidth = iconWidth * iconsArray.length;
		if (iconsWrapWidth > desiredWrapWidth) {
			const desiredIconCount = Math.floor(desiredWrapWidth / iconWidth);
			iconsCuttedArray = iconsCuttedArray.slice(0, desiredIconCount);
			iconsCuttedArray[desiredIconCount - 1] = this.getExtraIconsTemplate("fa-plus");
		}
		return iconsCuttedArray;
	}

	getExtraIconsTemplate(iconName) {
		return `<div class='dataview-item-dots-icon'><i class='fas ${iconName}'></i></div>`;
	}

	changeIgnoreDefaultState(ignore) {
		this.ignoreDefault = ignore;
		this.dataview.refresh();
	}
}

export default UserDataviewTagIcons;
