function formatDateString(dateStr) {
	if (!dateStr) {
		return dateStr;
	}
	const date = new Date(dateStr);
	const format = webix.Date.dateToStr("%F %d, %Y at %h:%i %a");
	return format(date);
}

export default {
	formatDateString
};
