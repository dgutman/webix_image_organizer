const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imagesModifiedByUserSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	imagesIds: [{
		type: Schema.Types.ObjectId,
		required: true
	}]
}, {timestamps: true});

const imagesModifiedByUserModel = mongoose.model("images_modified_by_user", imagesModifiedByUserSchema);

module.exports = imagesModifiedByUserModel;
