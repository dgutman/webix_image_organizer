const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roisModifiedByUserSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	roisIds: [{
		type: Schema.Types.ObjectId,
		required: true
	}],
	taskId: {
		type: String,
		required: true
	}
}, {timestamps: true});

const roisModifiedByUserModel = mongoose.model("rois_modified_by_user", roisModifiedByUserSchema);

module.exports = roisModifiedByUserModel;
