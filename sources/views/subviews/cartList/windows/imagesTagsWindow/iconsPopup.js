const iconData = [
	{icon: "bug"},
	{icon: "ban"},
	{icon: "circle"},
	{icon: "certificate"},
	{icon: "ellipsis-h"},
	{icon: "ellipsis-v"},
	{icon: "fire"},
	{icon: "flag-o"},
	{icon: "heartbeat"},
	{icon: "magic"},
	{icon: "map-pin"},
	{icon: "pencil"},
	{icon: "eyedropper"},
	{icon: "tint"},
	{icon: "tag"},
	{icon: "tags"},
	{icon: "thermometer-full"},
	{icon: "universal-access"},
	{icon: "mars"},
	{icon: "venus"},
	{icon: "venus-mars "}
];

const IconsPopupConfig = {
	view: "popup",
	body: {
		view: "template",
		name: "iconsPopupTemplateName",
		width: 185,
		height: 112,
		template: (obj) => {
			let templateIcons = "";
			if (obj.hasOwnProperty("iconData")) {
				obj.iconData.forEach((icon) => {
					templateIcons+=`<span class="webix_icon fas fa-${icon.icon} icon-popup-icons" id="${icon.icon}"></span>`;
				});
			}
			return templateIcons;
		},
		data: {
			iconData: iconData
		}
	}
};

function getIconsPopupConfig() {
	return IconsPopupConfig;
}

export default {
	getIconsPopupConfig
};