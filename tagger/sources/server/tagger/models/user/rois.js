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
	apiUrl: {
		type: String,
		default: "",
		required: true
	},
	boxColor: {
		type: Array
	},
	// TODO: check if the coordinates are required
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
	taskId: {
		type: Schema.Types.ObjectId
	}
});

roisSchema.set("toJSON", {virtuals: false, versionKey: false});
const ImagesRois = mongoose.model("images_rois", roisSchema);

module.exports = ImagesRois;
