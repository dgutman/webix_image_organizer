const Tags = require("../models/tags");
const Values = require("../models/values");
const Fields = require("../models/updatedFields");
const valuesService = require("./values");
const imageUpdateService = require("./imageUpdate");

async function create(tags, collectionIds) {
	// validation
	if (!Array.isArray(tags)) throw "Field \"tags\" should be an array";
	if (!Array.isArray(collectionIds)) throw "Field \"collectionIds\" should be an array";

	return Promise.all(tags.map(async (tag) => {
		let name = tag;
		let values = [];

		if (typeof tag === "object") {
			name = tag.name;
			if (tag.values) {
				values = Array.isArray(tag.values) ? tag.values : [tag.values];
			}
		}

		name = name.toLowerCase();
		const existedTag = await Tags.findOne({name});
		let createdTag;

		if (existedTag) {
			existedTag.collectionIds = existedTag.collectionIds.concat(collectionIds).unique();
			existedTag.save();
		}
		else {
			const newTag = new Tags({name});
			newTag.collectionIds = collectionIds;
			newTag.type = tag.type || (values.length > 1 ? "multi" : "single");
			createdTag = await newTag.save();
		}

		if (values.length) {
			const tagIds = existedTag ? [existedTag._id] : [createdTag._id];
			await valuesService.create(values, tagIds);
		}

		return existedTag || createdTag;
	}));
}

async function getAll() {
	const tags = await Tags.find().sort({name: 1});
	return tags;
}

async function getByCollection(collectionIds) {
	// validation
	if (!Array.isArray(collectionIds)) throw "Field \"collectionIds\" should be an array";

	const tags = await Tags.find({collectionIds: {$in: collectionIds}}).sort({name: 1});
	return tags;
}

async function updateTag(item) {
	const tag = await Tags.findById(item._id);

	// validation
	if (!tag) throw "Tag not found";

	const oldTag = {
		collectionIds: tag.collectionIds,
		name: tag.name,
		id: tag.id
	};

	if (tag.name !== item.name) {
		const existedTag = await Tags.findOne({name: item.name});
		if (existedTag) {
			tag.collectionIds = Array.isArray(tag.collectionIds) ? tag.collectionIds : [];
			existedTag.collectionIds = existedTag.collectionIds.concat(tag.collectionIds).unique();

			await Tags.deleteOne({_id: tag._id});
			const values = await valuesService.getByTags([tag._id]);
			const valuePromises = values.map((value) => {
				value.tagIds = value.tagIds.filter(tagId => tagId !== tag._id || tagId !== existedTag._id);
				value.tagIds.push(existedTag._id);
				return value.save();
			});
			await Promise.all(valuePromises);

			// update images which linked with this tag
			await imageUpdateService.updateImagesByTag(oldTag, item.name, existedTag.collectionIds);

			return existedTag.save();
		}
	}

	// to remove or add tags to different collections
	if (item.hasOwnProperty("collectionIds")) tag.collectionIds = item.collectionIds;
	delete item.collectionIds;

	// update images which linked with this tag
	await imageUpdateService.updateImagesByTag(oldTag, item.name, tag.collectionIds);

	if (!tag.collectionIds.length) {
		return _delete(tag._id);
	}

	// copy item properties to tag
	Object.assign(tag, item);
	return tag.save();
}

async function updateMany(item) {
	// validation
	if (!Array.isArray(item)) throw "Field \"tags\" should be an array";

	return Promise.all(item.map(async item => updateTag(item)));
}

async function _delete(tagId) {
	await Fields.deleteMany({tag: tagId});
	await Values.updateMany({tagIds: tagId}, {$pull: {tagIds: tagId}});
	await Values.deleteOne({tagIds: {$size: 0}});
	return Tags.findOneAndDelete({_id: tagId});
}

async function deleteMany(tagIds) {
	// validation
	if (!Array.isArray(tagIds)) throw "Field \"tagIds\" should be an array";

	return Promise.all(tagIds.map(async tagId => _delete(tagId)));
}

module.exports = {
	getAll,
	getByCollection,
	create,
	updateMany,
	updateTag,
	_delete,
	deleteMany
};
