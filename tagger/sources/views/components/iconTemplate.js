import constants from "../../constants";

export default class IconTemplate {
	static getSingleIconTemplate(icon, badge, colors) {
		let badgeTemplate = badge ? `<span class='icon-badge'>${badge}</span>` : "";
		let iconTemplate = "";
		let gradient = "";
		let isBGColorized = colors ? "colorized" : "";
		if (colors) {
			gradient = this._getColorsGradientString(colors);
		}
		if (icon) {
			iconTemplate = `<div style='${gradient} width: ${constants.DATAVIEW_TAG_ICON_WRAP_SIZE}px; height: ${constants.DATAVIEW_TAG_ICON_WRAP_SIZE}px;' class='item-tag-related-icon ${isBGColorized}'>
				<i class='fas ${icon}'>${badgeTemplate}</i>
			</div>`;
		}
		return iconTemplate;
	}

	static _getColorsGradientString(colors) {
		if (typeof colors === "string") return `background-color: ${colors};`;
		const fullCircleDegrees = 360;
		const singleColorRange = Math.round(fullCircleDegrees / colors.length);
		const colorGradient = colors.map((color, i) => `${color} 0 ${singleColorRange * (i + 1)}deg`);
		return `background: conic-gradient(${colorGradient.join(", ")});`;
	}
}
