const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imagesReviewHistorySchema = new Schema({
	changedByUser: {
		type: Schema.Types.String,
		required: true
	},
	imageId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	name: {
		type: String, required: true
	},
	meta: {
		type: Schema.Types.Mixed,
		default: {}
	},
	oldMeta: {
		type: Schema.Types.Mixed
	},
	baseParentId: {
		type: String, required: true
	},
	folderId: {
		type: String, required: true
	},
	userId: {
		type: String, required: true
	},
	mainId: {
		type: String, required: true
	},
	taskId: {
		type: Schema.Types.ObjectId
	},
	isReviewed: {
		type: Boolean, default: false
	},
	isUpdated: {
		type: Boolean, default: false
	}
}, {timestamps: {createdAt: "addedDate", updatedAt: "updatedDate"}});

imagesReviewHistorySchema.set("toJSON", {virtuals: false});

imagesReviewHistorySchema.index({taskId: 1, mainId: 1, userId: 1}, {unique: false});

imagesReviewHistorySchema.statics.groupByCollectionIds = async function groupByCollectionIds(ids) {
	const data = await this.aggregate([
		{$match: {_id: {$in: ids.map(id => mongoose.Types.ObjectId(id))}}},
		{
			$group: {
				_id: "$baseParentId", ids: {$addToSet: "$_id"}
			}
		}
	]);
	return data.reduce((result, item) => {
		result[item._id] = item.ids;
		return result;
	}, {});
};

const ImagesReviewHistory = mongoose.model("images_review_history", imagesReviewHistorySchema);

module.exports = ImagesReviewHistory;
