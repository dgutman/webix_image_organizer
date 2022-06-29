import ajaxService from "./ajaxActions";

export default function roiCoordsCalculator(obj, imgheight, imgwidth, mode, initCoords) {
	let imgFullHeight;
	let imgFullWidth;
	let roiRectBlock = "";

	function getRoiFromUrl(url) {
		let urlObj = new URL(url);
		let urlParams = new URLSearchParams(urlObj.search);
		let urlCoords = {};
		urlCoords.left = +urlParams.get("left");
		urlCoords.top = +urlParams.get("top");
		urlCoords.width = +urlParams.get("regionWidth");
		urlCoords.height = +urlParams.get("regionHeight");
		return urlCoords;
	}

	async function getInitSizes(obj) {
		let coords = await ajaxService.getImageSizes(obj.mainId || obj._id);
		return coords;
	}

	function roiRectCalculator(borderStyle) {
		borderStyle.left = +borderStyle?.left || borderStyle?.right - borderStyle?.width || 20;
		borderStyle.top = +borderStyle?.top || borderStyle?.bottom - borderStyle?.height || 20;
		borderStyle.right = +borderStyle?.right || borderStyle?.left + borderStyle?.width || 200;
		borderStyle.bottom = +borderStyle?.bottom || borderStyle?.top + borderStyle?.height || 200;

		const diff = imgheight / imgFullHeight;
		borderStyle.left = Math.round(borderStyle.left * diff);
		borderStyle.top = Math.round(borderStyle.top * diff);
		borderStyle.right = Math.round(borderStyle.right * diff);
		borderStyle.bottom = Math.round(borderStyle.bottom * diff);

		borderStyle.height = borderStyle.bottom - borderStyle.top;
		borderStyle.width = borderStyle.right - borderStyle.left;


		if (mode === "userSmall" || mode === "creatorSmall") {
			borderStyle.left += (imgwidth - imgFullWidth) / 2;
		}

		const color = obj.boxColor ? `border-color: rgb(${obj.boxColor[0]}, ${obj.boxColor[1]}, ${obj.boxColor[2]});` : "";

		const {top, left, right, bottom, height, width} = borderStyle;
		let roiRect = `<div title='Region of interest' class='roi-image-rect' style='top: ${top}px; left: ${left}px; right: ${right}px; bottom: ${bottom}px; height: ${height}px; width: ${width}px; ${color}'></div>`;


		return roiRect;
	}

	function styleFromObj(obj) {
		let style = {};

		if (obj.meta && obj.meta.style) {
			style = obj.meta.style;
		}
		if (obj.boxLeft || obj.boxWidth || obj.boxRight) {
			style.left = obj.boxLeft || obj.boxRight - obj.boxWidth;
			style.right = obj.boxRight || obj.boxLeft + obj.boxWidth;
			style.top = obj.boxTop || obj.boxBottom - obj.boxHeight;
			style.bottom = obj.boxBottom || obj.boxTop + obj.boxHeight;
		}

		return style;
	}

	if (mode === "userLarge") {
		imgFullHeight = obj.height || 512;
	}

	if (mode === "creatorLarge") {
		imgFullHeight = initCoords?.sizeY || 80000;
		imgFullWidth = initCoords?.sizeX || 120000;
	}

	if (mode === "creatorSmall" || mode === "userSmall") {
		imgFullWidth = obj.roi_width || imgheight;
		imgFullHeight = obj.height || 512;
	}

	let style = obj.style ? styleFromObj(obj.style) : styleFromObj(obj) || {};

	function allRoiInOne(obj) {
		let roiList = obj.allRoi;
		let allRect = "";
		roiList.forEach((item) => {
			const itemStyle = styleFromObj(item);
			let itemRoiCoords = {};
			if (item.apiUrl) itemRoiCoords = getRoiFromUrl(item.apiUrl);
			itemStyle.left += +itemRoiCoords.left;
			itemStyle.top += +itemRoiCoords.top;
			itemStyle.right += itemStyle.left + itemRoiCoords.width;
			itemStyle.bottom += itemStyle.top + itemRoiCoords.height;
			allRect += roiRectCalculator(itemStyle);
		});
		return allRect;
	}

	if (mode === "creatorLarge") {
		roiRectBlock = allRoiInOne(obj);
		return roiRectBlock;
	}

	roiRectBlock += roiRectCalculator(style);

	return roiRectBlock;
}
