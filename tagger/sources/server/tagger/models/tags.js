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
		type: String,
		enum: ["multiple", "multiple_with_default"],
		default: "multiple"
	},
	icontype: {
		type: String,
		enum: ["pervalue", "badge", "badgecolor"],
		default: "pervalue"
	},
	icon: {
		type: String,
		required() {
			return this.icontype === "badge" || this.icontype === "badgecolor";
		}
	},
	selection: {
		type: String,
		enum: ["multiple", "single"],
		default: "single"
	},
	help: {
		type: String
	},
	description: {
		type: String
	}
});

tagsSchema.set("toJSON", {virtuals: false, versionKey: false});
const Tags = mongoose.model("Tags", tagsSchema);

module.exports = Tags;
