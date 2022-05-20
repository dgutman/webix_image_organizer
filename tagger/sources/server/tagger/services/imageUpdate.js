const imageUpdatedDate = require("../models/updatedDate");
const Images = require("../models/images");
const Tags = require("../models/tags");
const {mongo} = require("mongoose");

async function updateImagesByTag(oldTag, newTagName, newCollectionIds) {
	// find all images linked with the tag
	const images = await Images.find({$and: [
		{[`meta.tags.${oldTag.name}`]: {$exists: true}},
		{baseParentId: {$in: oldTag.collectionIds}}
	]});

	const imageIds = [];
	const imageTagValues = {};
	images.forEach((image) => {
		imageIds.push(image._id);
		imageTagValues[image.id] = image.meta.tags[oldTag.name];
	});

	imageUpdatedDate.setDate();

	// delete old tag from all images linked with it
	await Promise.all(
		images.map((image) => {
			delete image.meta.tags[oldTag.name];
			image.updatedDate = imageUpdatedDate.getDate();
			image.markModified("updatedDate");
			image.markModified("meta");
			return image.save();
		})
	);

	// find images which match tag's collections
	const validImages = await Images.find({$and: [
		{_id: {$in: imageIds}},
		{baseParentId: {$in: newCollectionIds}}
	]});

	// update valid images
	const imagePromises = validImages.map(async (image) => {
		image.meta.tags[newTagName] = imageTagValues[image.id] || [];
		image.updatedDate = imageUpdatedDate.getDate();
		image.markModified("updatedDate");
		image.markModified("meta");
		return image.save();
	});
	return Promise.all(imagePromises);
}

async function updateImagesByValue(oldValue, newValue, newTagIds) {
	// find images with values in tags
	const tagIds = newTagIds.concat(oldValue.tagIds).unique();
	const tags = await Tags.find({_id: {$in: tagIds.map(id => mongo.ObjectId(id))}});
	const queryImages = {
		$or: tags.map(tag => ({$and: [
			{[`meta.tags.${tag.name}`]: {$exists: true}},
			{[`meta.tags.${tag.name}`]: {$elemMatch: {value: oldValue.value}}}
		]}))
	};
	const images = await Images.find(queryImages);

	// update images
	imageUpdatedDate.setDate();
	const imagePromises = images.map(async (image) => {
		const imageTagNames = Object.keys(image.meta.tags);
		imageTagNames.forEach((tagName) => {
			// find old tag values and change it to the new ones
			tags.forEach((tag) => {
				if (tag.name === tagName && newTagIds.includes(tag.id)) {
					image.meta.tags[tagName].forEach((val) => {
						if (val.value === oldValue.value) {
							val.value = newValue.value;
						}
					});
				}
				else if (tag.name === tagName) {
					image.meta.tags[tagName] = image.meta.tags[tagName]
						.filter(val => val.value !== oldValue.value);
				}
			});
			image.meta.tags[tagName].filter(val => val.value === oldValue.value);
		});
		image.updatedDate = imageUpdatedDate.getDate();
		image.markModified("updatedDate");
		image.markModified("meta");
		return image.save();
	});

	return Promise.all(imagePromises);
}

module.exports = {
	updateImagesByTag,
	updateImagesByValue
};
