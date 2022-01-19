const UserTags = require("../../models/user/tags");
const Tags = require("../../models/tags");
const mongoose = require("mongoose");
const tagsService = require("../tags"); 

async function getTagsWithValuesByTask(taskId, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"}

	const tags = await UserTags.aggregate([
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

async function getTagTemplatesWithValues(userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"}

	const tags = await Tags.aggregate([
		{$match: {}},
		{$lookup: {
			from: "values",
			let: {tag_id: "$_id"},
			pipeline: [
				{
					$match: {
						$expr: {$in: ["$$tag_id", "$tagIds"]}
					}
				}
			],
			as: "values"
		}}
	]);
	return tags;
}

async function createTagTemplates(tags) {
	tags = tags.map((tag) => {
		delete tag._id;
		tag.values = Object.keys(tag.values).map((key) => {
			const value = tag.values[key];
			value.value = key;
			delete value._v;
			delete value._id;
			return value;
		});
		return tag;
	});

	return tagsService.create(tags);
}

module.exports = {
	getTagsWithValuesByTask,
	getTagTemplatesWithValues,
	createTagTemplates
};
