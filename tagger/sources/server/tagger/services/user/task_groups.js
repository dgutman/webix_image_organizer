const Groups = require("../../models/user/task_groups");

async function getGroups(userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};

	return Groups.find();
}

async function getGroupByName(name, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};

	return Groups.findOne({name});
}

async function createGroup(name, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};

	const newGroup = new Groups({name});
	return newGroup.save();
}

module.exports = {
	getGroups,
	createGroup,
	getGroupByName
};
