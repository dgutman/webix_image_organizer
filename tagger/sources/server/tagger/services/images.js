const mongoose = require("mongoose");
const Images = require("../models/images");
const imageUpdatedDate = require("../models/updatedDate");
const Tags = require("../models/tags");
const Values = require("../models/values");
const confidenceModel = require("../models/confidence");
const Fields = require("../models/updatedFields");
const tagsService = require("./tags");
const http = require("http");
const fromEntries = require("object.fromentries");
const foldersService = require("./folders");
const imageFilters = require("./imageFilters");
const Tasks = require("../models/user/tasks");

const successStatusCode = 200;

function setTokenIntoUrl(token, symbol) {
	return token ? `${symbol}token=${token}` : "";
}

async function getResourceImages(collectionId, hostApi, token, userId, type, taskId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};

	const url = `${hostApi}/resource/${collectionId}/items?type=${type}&limit=0&offset=0${setTokenIntoUrl(token, "&")}`;
	return new Promise((resolve, reject) => {
		http.get(url, (response) => {
			let body = "";
			const {statusCode} = response;
			if (statusCode !== successStatusCode) {
				const errorMessage = body && body.message ? `with message: ${body.message}` : "&lt;none&gt;";
				const error = new Error(
					`Request to ${url} failed\n
					${errorMessage}\n
					Status Code: ${statusCode}`
				);
				return reject(error);
			}
			// A chunk of data has been recieved.
			response.on("data", (data) => {
				body += data;
			});
			// The whole response has been received. Print out the result.
			response.on("end", async () => {
				// remove all existing images for that collection
				if (type === "folder") {
					const folderIds = await foldersService.getNestedFolderIds([collectionId], [collectionId]);
					await Images.deleteMany({folderId: {$in: folderIds}, userId});
				}
				else {
					await Images.deleteMany({baseParentId: collectionId, userId});
				}

				// add new images
				body = JSON.parse(body);

				const regex = (/\.(gif|jpg|jpeg|tiff|png|bmp)$/i);
				let images = body.filter(item => regex.test(item.name));
				const tags = [];

				images = images.map((image) => {
					if (image.hasOwnProperty("meta") && typeof image.meta === "object") {
						if (image.meta.hasOwnProperty("tags")) {
							const entries = typeof image.meta.tags === "object" ? Object.entries(image.meta.tags) : [];
							entries.forEach((entry) => {
								if (Array.isArray(entry[1]) || typeof entry[1] !== "object") {
									if (!Array.isArray(entry[1])) {
										// to check for replies
										entry[1] = [entry[1]];
									}
									else {
										// to check if array contains object and get value
										entry[1] = entry[1]
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

									entry[0] = entry[0].toLowerCase();

									const existedTag = tags.find((tag) => {
										if (tag.name === entry[0]) {
											tag.values = tag.values.concat(entry[1]).unique();
											return true;
										}
									});
									if (!existedTag) {
										tags.push({
											name: entry[0],
											values: entry[1]
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
					// if image does not contain meta we'll create one
					else image.meta = {};
					image.userId = userId;
					image.mainId = image._id;
					if (taskId) image.taskId = taskId;
					delete image._id;
					return image;
				});

				const createdImages = await Images.insertMany(images);
				await tagsService.create(tags, [collectionId]);

				resolve(createdImages);
			});
		}).on("error", (err) => {
			throw err;
		});
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
				expireDate: 1,
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

	const update = collectionIds.filter(async (collectionId) => {
		const firstImage = await Images.findOne({baseParentId: collectionId});
		if (!firstImage || firstImage.expireDate < new Date()) {
			return collectionId;
		}
	});

	return {
		data,
		update,
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
				expireDate: 1,
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

async function getTaskImages({folderIds, offset, limit, userId, filters}) {
	// validation
	if (!Array.isArray(folderIds)) throw {message: "Query \"ids\" should be an array", name: "ValidationError"};
	if (!userId) throw {name: "UnauthorizedError"};
	if (filters && (typeof filters !== "object" || Array.isArray(filters))) throw {message: "Query \"filters\" should be an JSON hash", name: "ValidationError"};

	let nestedFolderIds = await foldersService.getNestedFolderIds(folderIds, folderIds);

	let searchParams = {
		folderId: {$in: nestedFolderIds},
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
				expireDate: 1,
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

	const data = await Images.aggregate(aggregatePipeline);

	const count = await Images.countDocuments(searchParams);
	let unfilteredCount = count;
	if (filters) {
		delete searchParams.$and;
		unfilteredCount = await Images.countDocuments(searchParams);
	}

	const totalCount = await Images.countDocuments({folderId: {$in: nestedFolderIds}, userId});

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
			if (tag.type === "single") {
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
	return {data: reviewedImages};
}

async function unreviewTaskImages(taskIds, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	if (!Array.isArray(taskIds)) throw "Field \"taskIds\" should be an array";
	const tasks = await Tasks.validateByUserId(taskIds, userId);
	const folderIds = tasks.map(task => mongoose.Types.ObjectId(task.folderId));
	const nestedFolderIds = await foldersService.getNestedFolderIds(folderIds, folderIds);

	const imagesData = await Images.updateMany(
		{ // filter
			userId: mongoose.Types.ObjectId(userId),
			isReviewed: true,
			folderId: {$in: nestedFolderIds}
		},
		{$set: { // updated fields
			isReviewed: false,
			updatedDate: imageUpdatedDate.getDate()
		}}
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
	unreviewTaskImages
};
