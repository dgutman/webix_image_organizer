const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagsSchema = new Schema({
	name: {
		type: String, required: true
	},
	collectionIds: {
		type: [String], default: []
	},
	type: {
		type: String, default: "single"
	}
});

tagsSchema.set("toJSON", {virtuals: false, versionKey: false});
const Tags = mongoose.model("Tags", tagsSchema);

module.exports = Tags;
