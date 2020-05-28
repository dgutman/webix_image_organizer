const Tags = require("../../models/user/tags");
const mongoose = require("mongoose");

async function getTagsWithValuesByTask(taskId, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"}

	const tags = await Tags.aggregate([
		{$match: {taskId: mongoose.mongo.ObjectId(taskId)}},
		{$lookup: {
			from: "users_values",
			localField: "_id",
			foreignField: "tagId",
			as: "values"
		}}
	]);
	return tags;
}

module.exports = {
	getTagsWithValuesByTask
};
