import constants from "../../constants";

export default class UserDataviewTagIcons {
	constructor(tagRichselect, valueRichselect) {
		this.tagSelect = tagRichselect;
		this.tagList = this.tagSelect.getList();
		this.valueSelect = valueRichselect;
		this.valueList = this.valueSelect.getList();

		this.tagList.attachEvent("onAfterLoad", () => {
			this.tagsWithIcons = {};
			this.iconsList = [];
			this.parseTagIcons();
		});

		this.valueSelect.attachEvent("onChange", (id) => {
			this.sortIconListBySelectedValue(id);
		});

		this.tagsWithIcons = {};
		this.iconsList = [];
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
			values[val.name] = val.icon || val.badgevalue || val.badgecolor || null;
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
					const tagWithIcon = this.tagsWithIcons[tagWithIconName];
					const itemTag = tags[tagWithIconName];
					if (tagWithIcon.type === "pervalue") {
						itemTag.forEach((valObj) => {
							if (tagWithIcon.values[valObj.value]) {
								icons[tagWithIcon.values[valObj.value]] = this.getSingleIconTemplate(tagWithIcon.values[valObj.value]);
							}
						});
					}
					else if (tagWithIcon.type === "badge") {
						let tagIcon = null;
						itemTag.forEach((valObj) => {
							if (tagWithIcon.values.hasOwnProperty(valObj.value)) {
								const curValue = tagWithIcon.values[valObj.value];
								tagIcon = this.getSingleIconTemplate(tagWithIcon.icon, curValue);
							}
						});
						if (tagIcon) icons[tagWithIcon.icon] = tagIcon;
					}
					else if (tagWithIcon.type === "badgecolor" && itemTag.length) {
						const colors = itemTag
							.filter(valObj => tagWithIcon.values.hasOwnProperty(valObj.value))
							.map(valObj => tagWithIcon.values[valObj.value]);
						if (tagWithIcon.icon) {
							icons[tagWithIcon.icon] = this.getSingleIconTemplate(tagWithIcon.icon, null, colors);
						}
					}
				}
			});
		}
		let sortedIcons = this.getSortedIcons(icons);
		sortedIcons = this.getCuttedIconsTemplate(sortedIcons, itemWidth);
		return `<div class='item-tag-related-icons'>${sortedIcons.join("")}</div>`;
	}

	getSingleIconTemplate(icon, badge, colors) {
		const badgeTemplate = badge ? `<span class='icon-badge'>${badge}</span>` : "";
		let iconTemplate = "";
		let gradient = "";
		let isBGColorized = colors ? "colorized" : "";
		if (colors) {
			gradient = this.getColorsGradientString(colors);
		}
		if (icon) {
			iconTemplate = `<div style='${gradient} width: ${constants.DATAVIEW_TAG_ICON_WRAP_SIZE}px; height: ${constants.DATAVIEW_TAG_ICON_WRAP_SIZE}px;' class='item-tag-related-icon ${isBGColorized}'>
				<i class='fas ${icon}'>${badgeTemplate}</i>
			</div>`;
		}
		return iconTemplate;
	}

	getColorsGradientString(colors) {
		const fullCircleDegrees = 360;
		const singleColorRange = Math.round(fullCircleDegrees / colors.length);
		const colorGradient = colors.map((color, i) => `${color} 0 ${singleColorRange * (i + 1)}deg`);
		return `background: conic-gradient(${colorGradient.join(", ")});`;
	}

	getSortedIcons(icons) {
		// get icons that are in item
		const iconNames = this.iconsList.flat().filter(icon => icons[icon]);
		return iconNames.map(name => icons[name]);
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

	sortIconListBySelectedValue(valueId) {
		const selectedTagId = this.tagSelect.getValue();
		const selectedTag = this.tagList.getItem(selectedTagId);

		if (selectedTag) {
			// find icon related to selected tag-value dependency (mainIcon)
			let mainIcon;
			const tagWithIcon = this.tagsWithIcons[selectedTag.name];
			mainIcon = tagWithIcon ? tagWithIcon.icon : null;

			if (tagWithIcon && tagWithIcon.type === "pervalue" && valueId) {
				const selectedValue = this.valueList.getItem(valueId);
				mainIcon = tagWithIcon.values[selectedValue.name];
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

	getExtraIconsTemplate(iconName) {
		return `<div class='dataview-item-dots-icon'><i class='fas ${iconName}'></i></div>`;
	}
}
