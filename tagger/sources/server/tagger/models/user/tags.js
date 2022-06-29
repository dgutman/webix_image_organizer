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
		type: String,
		default: "multiple",
		enum: ["multiple", "multiple_with_default", "binary"]
	},
	default: {
		type: String,
		required() {
			return this.type === "multiple_with_default";
		}
	},
	icontype: {
		type: String
	},
	icon: {
		type: String,
		required() {
			return this.icontype === "badge" || this.icontype === "badgecolor";
		}
	},
	roi: {
		type: Boolean,
		default: false
	}
});

tagsSchema.index({taskId: 1, name: 1}, {unique: true});

tagsSchema.statics.collectDefaultValues = async function collectDefaultValues(taskId) {
	const data = await this.aggregate([
		{$match: {taskId: mongoose.Types.ObjectId(taskId)}}
	]);

	return data.reduce((result, item) => {
		result[item.name] = [];
		if (item.type === "multiple_with_default" && item.default) {
			result[item.name].push({value: item.default});
		}
		return result;
	}, {});
};

tagsSchema.set("toJSON", {virtuals: false, versionKey: false});
const UsersTags = mongoose.model("Users_tags", tagsSchema);

module.exports = UsersTags;
