const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const valuesSchema = new Schema({
	value: {
		type: String, required: true
	},
	tagIds: {
		type: [Schema.Types.ObjectId], default: []
	},
	icon: {
		type: String
	},
	hotkey: {
		type: String
	},
	badgevalue: {
		type: String
	},
	badgecolor: {
		type: String
	},
	default: {
		type: Boolean,
		default: false
	}
});

valuesSchema.set("toJSON", {virtuals: false, versionKey: false});
const Values = mongoose.model("Values", valuesSchema);

module.exports = Values;
