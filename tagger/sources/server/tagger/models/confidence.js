const CONFIDENCE_LEVELS = [
	{id: "YES", name: "YES", default: true}, // "yes" by default, TO DO change it after clarification
	{id: "NO", name: "NO"},
	{id: "NOT_SURE", name: "NOT SURE"},
	{id: "NULL", name: "NULL"}
];

function getAll() {
	return CONFIDENCE_LEVELS;
}

function getDefault() {
	return CONFIDENCE_LEVELS.find(item => item.default);
}

module.exports = {
	getAll,
	getDefault
};
