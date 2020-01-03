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

export default {
	getTagValue
};
