import constants from "../constants";

function getTagValue(obj) {
	let value = "";
	switch (typeof obj) {
		case "object": {
			value = obj.value;
			break;
		}
		default: {
			value = obj;
			break;
		}
	}
	value = value.toString().toLowerCase();
	return value;
}

function isAdminView(url) {
	const regex = new RegExp(constants.ADMIN_VIEW_PATTERN);
	return regex.test(url);
}

export default {
	getTagValue,
	isAdminView
};
