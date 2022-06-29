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
	userId: {
		type: String,
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

imagesReviewHistorySchema.set("toJSON", {virtuals: false});

const ImagesReviewHistory = mongoose.model("images_review_history", imagesReviewHistorySchema);

module.exports = ImagesReviewHistory;
