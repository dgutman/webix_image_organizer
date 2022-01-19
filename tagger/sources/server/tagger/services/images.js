const mongoose = require("mongoose");
const Images = require("../models/images");
const imageUpdatedDate = require("../models/updatedDate");
const Tags = require("../models/tags");
const Values = require("../models/values");
const confidenceModel = require("../models/confidence");
const Fields = require("../models/updatedFields");
const tagsService = require("./tags");
const fromEntries = require("object.fromentries");
const foldersService = require("./folders");
const imageFilters = require("./imageFilters");
const Tasks = require("../models/user/tasks");
const girderREST = require("./girderServerRequest");

function setTokenIntoUrl(token, symbol) {
	return token ? `${symbol}token=${token}` : "";
}

async function countImagesByTask(taskId, userId) {
	const reviewedCount = await Images.countDocuments({
		taskId: mongoose.Types.ObjectId(taskId),
		userId,
		isReviewed: true
	});
	const allCount = await Images.countDocuments({
		taskId: mongoose.Types.ObjectId(taskId),
		userId
	});
	return {reviewedCount, allCount};
}

function parseTagsAndValues(image, collectionId) {
	const tags = [];
	if (image.hasOwnProperty("meta") && typeof image.meta === "object") {
		if (image.meta.hasOwnProperty("tags")) {
			const entries = typeof image.meta.tags === "object" ? Object.entries(image.meta.tags) : [];
			entries.forEach(([tagName, values]) => {
				if (Array.isArray(values) || typeof values !== "object") {
					if (!Array.isArray(values)) {
						// to check for replies
						values = [values];
					}
					else {
						// to check if array contains object and get value
						values = values
							.filter((value) => {
								if (!Array.isArray(value) && typeof value === "object") {
									return value.value;
								}
								else if (typeof value !== "object") {
									return value;
								}
							}) // transform values to lower case and make objects
							.map((value) => {
								if (!Array.isArray(value) && typeof value === "object") {
									value.value = value.value.toString().toLowerCase();
									return value;
								}
								else if (value && typeof value !== "object") {
									return {value: value.toString().toLowerCase()};
								}
							});
					}
					tagName = tagName.toLowerCase();

					const existedTag = tags.find((tag) => {
						if (tag.name === tagName) {
							tag.values = tag.values.concat(values).unique();
							return true;
						}
					});
					if (!existedTag) {
						tags.push({
							name: tagName,
							values
						});
					}
				}
			});

			// save initial metadata to resolve merge conflicts in the future
			image.oldMeta = image.meta;

			// replace old keys with new lowercase
			image.meta.tags = fromEntries(entries);
		}
		else image.oldMeta = image.meta;
	}
	else image.meta = {};

	tagsService.create(tags, [collectionId]);
}

async function getDefaultTaskImages({taskId, hostApi, token, userId, imageIds}) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	const query = imageIds.map(id => ({$oid: id.toString()}));

	const url = `${hostApi}/item/query?query={"_id": {"$in": ${JSON.stringify(query)}}}&limit=0&offset=0${setTokenIntoUrl(token, "&")}`;
	return girderREST.get(url)
		.then(async (data) => {
			// remove all existing images for that task
			await Images.deleteMany({
				mainId: {$in: imageIds},
				taskId: mongoose.Types.ObjectId(taskId),
				userId
			});

			// add new images
			let images = data.map((image) => {
				image.taskId = taskId;
				image.userId = userId;
				image.mainId = image._id;
				delete image._id;
				return image;
			});

			return Images.insertMany(images);
		});
}

async function getResourceImages({collectionId, hostApi, token, userId, type, taskId, nested}) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	if (!collectionId) throw {name: "ValidationError", message: "Query \"resourceId\" should be an specified"};

	const url = nested ? `${hostApi}/resource/${collectionId}/items?type=${type}&limit=0&offset=0${setTokenIntoUrl(token, "&")}`
		: `${hostApi}/item?folderId=${collectionId}&limit=0&offset=0${setTokenIntoUrl(token, "&")}`;
	return girderREST.get(url)
		.then(async (data) => {
			// remove all existing images for that collection
			if (type === "folder") {
				const folderIds = await foldersService.getNestedFolderIds([collectionId], [collectionId]);
				const queryToDelete = {folderId: {$in: folderIds}, userId};
				if (taskId) queryToDelete.taskId = taskId;
				await Images.deleteMany(queryToDelete);
			}
			else {
				await Images.deleteMany({baseParentId: collectionId, userId});
			}

			// add new images
			const regex = (/\.(gif|jpg|jpeg|tiff|png|bmp)$/i);
			let images = data.filter(item => regex.test(item.name));

			images = images.map((image) => {
				if (!taskId) parseTagsAndValues(image, collectionId);
				else image.taskId = taskId;
				image.userId = userId;
				image.mainId = image._id;
				delete image._id;
				return image;
			});

			return Images.insertMany(images);
		});
}

async function getCollectionsImages({tag, collectionIds, offset, limit, value, confidence, latest, name, userId}) {
	// validation
	if (!Array.isArray(collectionIds)) throw {message: "Query \"collectionIds\" should be an array", name: "ValidationError"};
	if (!userId) throw {name: "UnauthorizedError"};

	let searchParams = {
		baseParentId: {$in: collectionIds},
		userId
	};

	if (name) {
		searchParams.name = {$regex: name, $options: "i"};
	}

	let markerParams = {
		$cond: [
			{$ifNull: [`$meta.tags.${tag}`, false]},
			true,
			false
		]
	};

	if (value && !confidence) {
		searchParams[`meta.tags.${tag}`] = {$exists: true};
		markerParams = {
			$cond: [
				{$eq: [
					{
						$filter: {
							input: `$meta.tags.${tag}`,
							as: "valueObj",
							cond: {$eq: ["$$valueObj.value", value]}
						}
					},
					[]
				]},
				false,
				true
			]
		};
	}
	else if (value && confidence) {
		searchParams[`meta.tags.${tag}`] = {$elemMatch: {value}};
		markerParams = {$in: [{value, confidence}, `$meta.tags.${tag}`]};
	}

	if (latest) {
		const fieldSearchParams = {};

		// get latest updated image ids assigned to query field
		if (confidence) {
			fieldSearchParams.confidence = confidence;
		}
		if (value) {
			const valueDoc = await Values.findOne({value});
			if (valueDoc) fieldSearchParams.value = valueDoc.id;
		}
		if (tag) {
			const tagDoc = await Tags.findOne({name: tag});
			fieldSearchParams.tag = tagDoc ? tagDoc.id : undefined;
		}
		const updatedField = await Fields.findByCurrentFields(fieldSearchParams);
		const imageIds = updatedField ? updatedField.imageIds : [];
		searchParams._id = {$in: imageIds.map(id => mongoose.Types.ObjectId(id))};
	}

	const aggregatePipeline = [
		{$match: searchParams},
		{
			$project: {
				name: 1,
				meta: 1,
				baseParentId: 1,
				mainId: 1,
				_marker: markerParams
			}
		},
		{$sort: {_marker: -1, name: 1, _id: 1}},
		{$skip: offset},
		{$limit: limit}
	];

	const data = await Images.aggregate(aggregatePipeline);

	const count = await Images.countDocuments(searchParams);

	return {
		data,
		count
	};
}

async function getFoldersImages({tag, folderIds, offset, limit, value, confidence, latest, name, userId}) {
	// validation
	if (!Array.isArray(folderIds)) throw {message: "Query \"folderIds\" should be an array", name: "ValidationError"};
	if (!userId) throw {name: "UnauthorizedError"};

	let nestedFolderIds = await foldersService.getNestedFolderIds(folderIds, folderIds);

	let searchParams = {
		folderId: {$in: nestedFolderIds},
		userId
	};

	if (name) {
		searchParams.name = {$regex: name, $options: "i"};
	}

	let markerParams = {
		$cond: [
			{$ifNull: [`$meta.tags.${tag}`, false]},
			true,
			false
		]
	};

	if (value && !confidence) {
		searchParams[`meta.tags.${tag}`] = {$exists: true};
		markerParams = {
			$cond: [
				{$eq: [
					{
						$filter: {
							input: `$meta.tags.${tag}`,
							as: "valueObj",
							cond: {$eq: ["$$valueObj.value", value]}
						}
					},
					[]
				]},
				false,
				true
			]
		};
	}
	else if (value && confidence) {
		searchParams[`meta.tags.${tag}`] = {$elemMatch: {value}};
		markerParams = {$in: [{value, confidence}, `$meta.tags.${tag}`]};
	}

	if (latest) {
		const fieldSearchParams = {};

		// get latest updated image ids assigned to query field
		if (confidence) {
			fieldSearchParams.confidence = confidence;
		}
		if (value) {
			const valueDoc = await Values.findOne({value});
			if (valueDoc) fieldSearchParams.value = valueDoc.id;
		}
		if (tag) {
			const tagDoc = await Tags.findOne({name: tag});
			fieldSearchParams.tag = tagDoc ? tagDoc.id : undefined;
		}
		const updatedField = await Fields.findByCurrentFields(fieldSearchParams);
		const imageIds = updatedField ? updatedField.imageIds : [];
		searchParams._id = {$in: imageIds.map(id => mongoose.Types.ObjectId(id))};
	}

	const aggregatePipeline = [
		{$match: searchParams},
		{
			$project: {
				name: 1,
				meta: 1,
				parentId: 1,
				mainId: 1,
				_marker: markerParams
			}
		},
		{$sort: {_marker: -1, name: 1, _id: 1}},
		{$skip: offset},
		{$limit: limit}
	];

	const data = await Images.aggregate(aggregatePipeline);

	const count = await Images.countDocuments(searchParams);

	return {
		data,
		count
	};
}

async function getTaskImages({ids, offset, limit, userId, filters}) {
	// validation
	if (!Array.isArray(ids)) throw {message: "Query \"ids\" should be an array", name: "ValidationError"};
	if (!userId) throw {name: "UnauthorizedError"};
	if (filters && (typeof filters !== "object" || Array.isArray(filters))) throw {message: "Query \"filters\" should be an JSON hash", name: "ValidationError"};

	// let nestedFolderIds = await foldersService.getNestedFolderIds(folderIds, folderIds);

	let searchParams = {
		taskId: {$in: ids.map(id => mongoose.Types.ObjectId(id))},
		userId,
		isReviewed: false
	};

	if (filters) {
		Object.assign(searchParams, imageFilters.getMongoQueryByValueFilters(filters));
	}

	const aggregatePipeline = [
		{$match: searchParams},
		{
			$project: {
				name: 1,
				meta: 1,
				parentId: 1,
				mainId: 1,
				isReviewed: 1,
				isUpdated: 1
			}
		},
		{$sort: {name: 1, _id: 1}},
		{$skip: offset},
		{$limit: limit}
	];

	if (!limit) {
		aggregatePipeline.splice(-1, 1);
	}

	const data = await Images.aggregate(aggregatePipeline);

	const count = await Images.countDocuments(searchParams);
	let unfilteredCount = count;
	if (filters) {
		delete searchParams.$and;
		unfilteredCount = await Images.countDocuments(searchParams);
	}

	const totalCount = await Images.countDocuments({taskId: {$in: ids.map(id => mongoose.Types.ObjectId(id))}, userId});

	return {
		data,
		count,
		totalCount,
		unfilteredCount
	};
}

async function updateImage(imageId, tag, action, value, confidence) {
	const image = await Images.findById(imageId);

	// validation
	if (!image) throw "Image not found";

	const defaultConfidence = confidenceModel.getDefault().name;
	if (action !== "delete") {
		if (!image.meta.hasOwnProperty("tags")) image.meta.tags = {};
		if (image.meta.tags.hasOwnProperty(tag.name) && value) {
			if (tag.selection === "single") {
				image.meta.tags[tag.name] = [];
			}
			let existedValue = image.meta.tags[tag.name].find(item => item.value === value.value);
			if (existedValue) {
				Object.assign(existedValue, {value: value.value, confidence: confidence || defaultConfidence});
			}
			else {
				image.meta.tags[tag.name].push({
					value: value.value,
					confidence: confidence || defaultConfidence
				});
			}
		}
		else image.meta.tags[tag.name] = [];

		if (!tag.collectionIds.includes(image.baseParentId)) {
			tag.collectionIds.push(image.baseParentId);
			await tagsService.updateTag(tag);
		}
	}
	else if (image.meta.hasOwnProperty("tags") && image.meta.tags.hasOwnProperty(tag.name)) {
		if (!value) delete image.meta.tags[tag.name];
		else if (value && !confidence) {
			image.meta.tags[tag.name] = image.meta.tags[tag.name].filter(tagValue => tagValue.value !== value.value);
		}
		else {
			const deletedConfidence = defaultConfidence === confidence ? "NULL" : confidence;
			image.meta.tags[tag.name] = image.meta.tags[tag.name].map((tagValue) => {
				if (tagValue.value === value.value) {
					tagValue.confidence = deletedConfidence;
				}
				return tagValue;
			});
		}
	}

	image.updatedDate = imageUpdatedDate.getDate();
	image.markModified("updatedDate");
	image.markModified("meta");
	return image.save();
}

async function updateMany(addIds, removeIds, tagId, valueId, confidence, userId) {
	const tag = await Tags.findById(tagId);
	const value = valueId ? await Values.findById(valueId) : false;

	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	if (!Array.isArray(addIds)) throw "Field \"addIds\" should be an array";
	if (!Array.isArray(removeIds)) throw "Field \"removeIds\" should be an array";
	if (!tag) throw "You can only add or delete existing tag";
	if (!value && valueId) throw "You can only add or delete existing value";

	const allIds = addIds.concat(removeIds);
	imageUpdatedDate.setDate(Date.now());

	// save last changed image ids assigned to tag/value/confidence
	const fieldParams = {};
	if (tag) {
		fieldParams.tag = tag._id;
	}
	if (value) {
		fieldParams.value = value._id;
		fieldParams.confidence = confidence || confidenceModel.getDefault().name;
	}
	if (confidence) {
		fieldParams.confidence = confidence;
	}
	await Fields.updateOrCreate(fieldParams, {imageIds: allIds});

	const addPromises = Promise.all(addIds.map(id => updateImage(id, tag, "add", value, confidence)));
	const removePromises = Promise.all(removeIds.map(id => updateImage(id, tag, "delete", value, confidence)));

	return Promise.all([addPromises, removePromises]);
}

async function reviewImage(id, tags, taskIds, userId, preliminarily, isUpdated) {
	// validation
	if (typeof tags !== "object" || Array.isArray(tags)) throw "Field \"tags\" in image should be an hash";
	if (!Array.isArray(taskIds)) throw "Field \"taskIds\" should be an array";
	await Tasks.validateByUserId(taskIds, userId);

	const image = await Images.findOne({_id: mongoose.Types.ObjectId(id), userId, isReviewed: false});

	if (!image) throw "Image not found";

	image.meta = image.meta || {};
	image.meta.tags = image.meta.tags || {};

	Object.assign(image.meta.tags, tags);
	image.isReviewed = !preliminarily;
	image.isUpdated = isUpdated;
	image.updatedDate = imageUpdatedDate.getDate();

	image.markModified("updatedDate");
	image.markModified("meta");
	return image.save();
}

async function reviewImages(images, taskIds, userId, preliminarily) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	if (!Array.isArray(images)) throw "Field \"images\" should be an array";
	if (!Array.isArray(taskIds)) throw "Field \"taskIds\" should be an array";
	await Tasks.validateByUserId(taskIds, userId);

	const reviewedImages = await Promise.all(images.map(image => reviewImage(image._id, image.tags, taskIds, userId, preliminarily, image.isUpdated)));
	// update task status by reviewed images
	await Promise.all(
		taskIds.map(async (id) => {
			const {reviewedCount, allCount} = await countImagesByTask(id, userId);
			if (allCount === reviewedCount) {
				return Tasks.findByIdAndUpdate(id, {$set: {status: "finished"}});
			}
			return Promise.resolve(false);
		})
	);
	return {data: reviewedImages};
}

async function unreviewTaskImages(taskIds, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	if (!Array.isArray(taskIds)) throw "Field \"taskIds\" should be an array";
	await Tasks.validateByUserId(taskIds, userId);

	const imagesData = await Images.updateMany(
		{ // filter
			userId: mongoose.Types.ObjectId(userId),
			isReviewed: true,
			taskId: {$in: taskIds.map(id => mongoose.Types.ObjectId(id))}
		},
		{$set: { // updated fields
			isReviewed: false,
			updatedDate: imageUpdatedDate.getDate()
		}}
	);

	await Promise.all(
		taskIds.map(async id => Tasks.findOneAndUpdate({_id: mongoose.Types.ObjectId(id), status: {$ne: "in_progress"}}, {$set: {status: "in_progress"}}))
	);

	return imagesData;
}

async function setTagsByTask(images, defaultTagValues) {
	return Promise.all(images.map((image) => {
		if (!image.meta.tags) image.meta.tags = {};
		Object.assign(image.meta.tags, defaultTagValues);
		image.markModified("meta");
		return image.save();
	}));
}

module.exports = {
	getCollectionsImages,
	getFoldersImages,
	getTaskImages,
	getResourceImages,
	updateMany,
	reviewImages,
	setTagsByTask,
	unreviewTaskImages,
	getDefaultTaskImages
};
