const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roisSchema = new Schema({
	name: {
		type: String
	},
	mainId: {
		type: Schema.Types.ObjectId, required: true
	},
	imageId: {
		type: Schema.Types.ObjectId, required: true
	},
	folderId: {
		type: Schema.Types.ObjectId
	},
	apiUrl: {
		type: String,
		default: "",
		required: true
	},
	boxColor: {
		type: Array
	},
	left: {
		type: Number, required: true
	},
	right: {
		type: Number, required: true
	},
	top: {
		type: Number, required: true
	},
	bottom: {
		type: Number, required: true
	},
	isReviewed: {
		type: Boolean, default: false
	},
	isUpdated: {
		type: Boolean, default: false
	},
	roiImg: {
		type: Boolean, default: true
	},
	userId: {
		type: String
	},
	meta: {
		type: Schema.Types.Mixed,
		default: {}
	},
	taggerMode: {
		type: String,
		default: ""
	},
	taggerRegionLabels: {
		type: Array
	},
	style: {
		type: Schema.Types.Mixed,
		default: {},
		required: true
	},
	updatedAt: {
		type: Date
	},
	taskId: {
		type: Schema.Types.ObjectId
	}
}, {timestamps: {createdAt: "addedDate", updatedAt: "updatedDate"}});

roisSchema.set("toJSON", {virtuals: false, versionKey: false});
const ImagesRois = mongoose.model("images_rois", roisSchema);

module.exports = ImagesRois;
