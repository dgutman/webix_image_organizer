const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roisReviewHistorySchema = new Schema({
	changedByUser: {
		type: Schema.Types.String,
		required: true
	},
	roiId: {
		type: Schema.Types.ObjectId,
		required: true
	},
	isReviewed: {
		type: Boolean,
		default: false
	},
	taskId: {
		type: Schema.Types.String,
		required: true
	}
}, {timestamps: {createdAt: "addedDate", updatedAt: "updatedDate"}});

roisReviewHistorySchema.set("toJSON", {virtuals: false});

const ImagesReviewHistory = mongoose.model("rois_review_history", roisReviewHistorySchema);

module.exports = ImagesReviewHistory;
