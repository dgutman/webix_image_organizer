const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const valuesSchema = new Schema({
	name: {
		type: String, required: true
	},
	hotkey: {
		type: String
	},
	tagId: {
		type: Schema.Types.ObjectId, required: true
	}
});

valuesSchema.set("toJSON", {virtuals: false, versionKey: false});
const UserValues = mongoose.model("Users_values", valuesSchema);

module.exports = UserValues;
