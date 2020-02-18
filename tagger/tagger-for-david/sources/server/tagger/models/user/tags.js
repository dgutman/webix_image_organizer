const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagsSchema = new Schema({
	name: {
		type: String, required: true
	},
	taskId: {
		type: Schema.Types.ObjectId, required: true
	},
	selection: {
		type: String, required: true
	},
	description: {
		type: String
	},
	help: {
		type: String
	},
	type: {
		type: String, default: "multiple"
	},
	default: {
		type: String,
		required() {
			return this.type === "multiple_with_default";
		}
	}
});

tagsSchema.set("toJSON", {virtuals: false, versionKey: false});
const UsersTags = mongoose.model("Users_tags", tagsSchema);

module.exports = UsersTags;
