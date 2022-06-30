const axios = require("axios");
const sharp = require("sharp");
const mongoose = require("mongoose");
const NodeCache = require("node-cache");
const Rois = require("../../models/user/rois");
const RoisReviewHistoryModel = require("../../models/user/roisReviewHistory");
const RoisModifiedByUserModel = require("../../models/user/roisModifiedByUser");
const Tasks = require("../../models/user/tasks");
const Images = require("../../models/images");
const girderREST = require("../girderServerRequest");
const imageFilters = require("../imageFilters");

const roiThumbnailCache = new NodeCache();

function setTokenIntoUrl(token, symbol) {
	return token ? `${symbol}token=${token}` : "";
}

async function getCroppedImage(roiId, userId, hostAPI, token) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	if (!roiId) throw {message: "Field \"id\" should be set"};

	const roi = await Rois.findById(mongoose.Types.ObjectId(roiId));
	if (!roi) throw {message: "Image not found"};

	if (roi && (!roi.sizeX || !roi.sizeY)) {
		const sizes = await girderREST.get(`${hostAPI}/item/${roiId}/tiles/region${setTokenIntoUrl(token, "&")}`, {
			headers: {
				"Girder-Token": token
			}
		});

		Object.assign(roi, sizes);
		await roi.save();
	}

	const cachedBuffer = roiThumbnailCache.get(`roi-thumbnail-${roiId}`);

	let buffer;
	let image;

	if (!cachedBuffer && roi) {
		const url = `${hostAPI}/item/${roi.mainId ? roi.mainId : roi._id}/tiles/thumbnail?width=${roi.sizeX}&height=${roi.sizeY}`;
		const response = await axios.get(url, {
			headers: {
				"Girder-Token": token
			},
			responseType: "arraybuffer"
		});

		const uintArray = new Uint8Array(response.data);
		buffer = Buffer.from(uintArray, "binary");

		const coords = {
			left: Math.max(roi.left, 0),
			top: Math.max(roi.top, 0),
			width: Math.min(roi.right, roi.sizeX) - roi.left,
			height: Math.min(roi.bottom, roi.sizeY) - roi.top
		};

		image = await sharp(buffer)
			.extract(coords)
			.toBuffer();

		roiThumbnailCache.set(`roi-thumbnail-${roiId}`, image, 10800000); // for 3 hours
	}
	else {
		image = cachedBuffer;
	}

	return image;
}

async function create(images) {
	const rois = [];
	const imageIds = [];
	images.forEach((image) => {
		imageIds.push(image._id);
		if (!image.roiImg) {
			return false;
		}
		rois.push(image);
	});
	await Rois.deleteMany({_id: {$in: imageIds}});
	return Rois.insertMany(images);
}

async function getTaskROIs({id, offset, limit, userId, filters}) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	if (!id) throw {message: "Query \"id\" should be set"};
	if (filters && (typeof filters !== "object" || Array.isArray(filters))) throw {message: "Query \"filters\" should be an JSON hash"};

	const images = await Rois.find({taskId: mongoose.Types.ObjectId(id), userId});
	const imageIds = images.map(image => image._id);

	let searchParams = {
		_id: {$in: imageIds},
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
				mainId: 1,
				isReviewed: 1,
				isUpdated: 1,
				left: 1,
				top: 1,
				right: 1,
				bottom: 1,
				taskId: 1,
				apiUrl: 1,
				style: 1,
				boxColor: 1
			}
		},
		{$sort: {name: 1, _id: 1}},
		{$skip: offset},
		{$limit: limit}
	];

	if (!limit) {
		aggregatePipeline.splice(-1, 1);
	}

	const data = await Rois.aggregate(aggregatePipeline);

	const count = await Rois.countDocuments(searchParams);
	let unfilteredCount = count;
	if (filters) {
		delete searchParams.$and;
		unfilteredCount = await Rois.countDocuments(searchParams);
	}

	const totalCount = await Rois.countDocuments({imageId: {$in: imageIds}});

	return {
		data,
		count,
		totalCount,
		unfilteredCount
	};
}

async function countROIsByTask(taskId, userId) {
	const images = await Images.find({taskId: mongoose.Types.ObjectId(taskId), userId});
	const imageIds = images.map(image => image._id);

	const reviewedCount = await Rois.countDocuments({
		imageId: {$in: imageIds},
		isReviewed: true
	});
	const allCount = await Images.countDocuments({
		imageId: {$in: imageIds}
	});
	return {reviewedCount, allCount};
}

async function reviewROI(id, tags, preliminarily, isUpdated) {
	// validation
	if (typeof tags !== "object" || Array.isArray(tags)) throw "Field \"tags\" in image should be an hash";

	const roi = await Rois.findOne({_id: mongoose.Types.ObjectId(id), isReviewed: false});

	if (!roi) throw "Region of interest not found";

	if (roi) {
		roi.meta = roi.meta || {};
		roi.meta.tags = roi.meta.tags || {};

		Object.assign(roi.meta.tags, tags);
		roi.isReviewed = !preliminarily;
		roi.isUpdated = isUpdated;
		roi.updatedDate = Date.now();

		roi.markModified("updatedDate");
		roi.markModified("meta");
		return roi.save();
	}
}

async function setTagsByTask(images, defaultTagValues) {
	return Promise.all(images.map((image) => {
		if (!image.meta.tags) image.meta.tags = {};
		Object.assign(image.meta.tags, defaultTagValues);
		image.markModified("meta");
		return image.save();
	}));
}

async function saveLastState(roisToReview, userId, taskIds) {
	const roisToInsert = await Promise.all(roisToReview.map(async (roiToReview) => {
		const roi = await Rois.findOne({_id: mongoose.Types.ObjectId(roiToReview.id)});
		const roiToInsert = {
			changedByUser: userId,
			roiId: roi._id,
			userId: roi.userId,
			isReviewed: roi.isReviewed,
			taskId: roiToReview.taskId
		};
		return roiToInsert;
	}));

	const res = await RoisReviewHistoryModel.insertMany(roisToInsert);
	taskIds.forEach(async (taskId) => {
		const roisStates = res.filter(roiState => roiState.taskId === taskId);
		const roisIds = roisStates.map(roiState => roiState._id);
		const roisModifiedByUser = new RoisModifiedByUserModel({
			userId,
			roisIds,
			taskId
		});
		await roisModifiedByUser.save();
	});
}

async function deleteTaskHistory(roisIds, userId, taskIds) {
	await RoisReviewHistoryModel.deleteMany({taskId: {$in: taskIds}});
	await RoisModifiedByUserModel.deleteMany({taskId: {$in: taskIds}});
}

async function reviewROIs(rois, taskId, userId, preliminarily) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	if (!Array.isArray(rois)) throw "Field \"images\" should be an array";
	if (!taskId) throw "Field \"taskId\" should be set";
	await Tasks.validateByUserId([taskId], userId);

	const reviewedROIs = await Promise
		.all(rois.map(roi => reviewROI(roi._id, roi.tags, preliminarily, roi.isUpdated)));
	// update task status by reviewed images
	const roisToReview = rois.map(roi => ({id: roi._id, taskId: roi.taskId}));
	saveLastState(roisToReview);
	const {reviewedCount, allCount} = await countROIsByTask(taskId, userId);
	if (allCount === reviewedCount) {
		await Tasks.findByIdAndUpdate(taskId, {$set: {status: "finished"}});
	}
	return {data: reviewedROIs};
}

async function unreviewROIs(taskId, userId) {
	// validation
	if (!userId) throw {name: "UnauthorizedError"};
	if (!taskId) throw "Field \"taskIds\" should be set";
	await Tasks.validateByUserId([taskId], userId);

	const images = await Images
		.find({taskId: mongoose.Types.ObjectId(taskId), userId, isReviewed: true});
	const imageIds = images.map(image => image._id);

	const roisData = await Rois.updateMany(
		{ // filter
			imageId: {$in: imageIds}
		},
		{$set: { // updated fields
			isReviewed: false,
			updatedDate: Date.now()
		}}
	);

	await Tasks.findOneAndUpdate({_id: mongoose.Types.ObjectId(taskId), status: {$ne: "in_progress"}}, {$set: {status: "in_progress"}});

	return roisData;
}

async function undoLastSubmit(taskIds, userId) {
	const roisModifiedByUser = await RoisModifiedByUserModel.find(
		{userId, taskId: {$in: taskIds}}, // filter
		null,
		{sort: {updatedAt: -1}}
	);
	const lastModifiedByUser = roisModifiedByUser.length ? roisModifiedByUser[0] : null;
	if (lastModifiedByUser) {
		await RoisModifiedByUserModel.findByIdAndDelete(lastModifiedByUser._id);
		const roisToUndo = await Promise
			.all(lastModifiedByUser.roisIds
				.map(async roiId => RoisReviewHistoryModel
					.findByIdAndDelete(roiId)));
		const roisToUpdate = roisToUndo.map((roi) => {
			const id = roi.roiId;
			const update = {
				$set: {
					isReviewed: roi.isReviewed
				}
			};
			return {id, update};
		});

		const res = await Promise.all(roisToUpdate.map(async idAndUpdate => Rois.updateOne(
			{_id: idAndUpdate.id},
			idAndUpdate.update
		)));
		return res;
	}
}

module.exports = {
	getCroppedImage,
	create,
	getTaskROIs,
	setTagsByTask,
	reviewROIs,
	unreviewROIs,
	undoLastSubmit
};
