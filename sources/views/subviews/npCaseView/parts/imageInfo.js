export default function getConfig(name, id = webix.uid()) {
	return {
		id,
		name,
		view: "template",
		height: 24,
		template: (obj) => {
			const imageName = getItemName(obj) ? `<div class="image-info-property image-info-name">${getItemName(obj) || "No name"}</div>` : "";
			const region = getItemRegion(obj) ? `<div class="image-info-property">${getItemRegion(obj)}</div>` : "";
			const stain = getItemStain(obj) ? `<div class="image-info-property">${getItemStain(obj)}</div>` : "";
			return `<div class="image-info-container">
				${imageName}${region}${stain}
			</div>`;
		}
	};
}

function getItemName(item) {
	return item.name;
}

function getItemStain(item) {
	return item?.meta?.npSchema?.stainID || "";
}

function getItemRegion(item) {
	return item?.meta?.npSchema?.regionName || "";
}
