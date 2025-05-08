const ORIENTATION_MODE = "scenes-orientation-mode";
const VERTICAL = "vertical";
const HORIZONTAL = "horizontal";

function getOrientationMode() {
	const value = webix.storage.local.get(ORIENTATION_MODE) ?? HORIZONTAL;
	return convertValueToFlag(value);
}

// flag could be 1 or 0
function setOrientationMode(flag) {
	const value = convertFlagToValue(flag);
	webix.storage.local.put(ORIENTATION_MODE, value);
}

function convertValueToFlag(value) {
	return value === VERTICAL ? 1 : 0;
}

function convertFlagToValue(flag) {
	return flag ? VERTICAL : HORIZONTAL;
}

const Mode = {
	getOrientationMode,
	setOrientationMode,
};

export default Mode;
