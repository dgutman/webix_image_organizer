function formatDateString(dateStr) {
	if (!dateStr) {
		return dateStr;
	}
	const date = new Date(dateStr);
	const format = webix.Date.dateToStr("%F %d, %Y at %H:%i:%s");
	return format(date);
}

export default {
	formatDateString
};
