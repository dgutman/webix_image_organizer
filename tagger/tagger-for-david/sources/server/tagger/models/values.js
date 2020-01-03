const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const valuesSchema = new Schema({
	value: {
		type: String, required: true
	},
	tagIds: {
		type: [String], default: []
	}
});

valuesSchema.set("toJSON", {virtuals: false, versionKey: false});
const Values = mongoose.model("Values", valuesSchema);

module.exports = Values;
