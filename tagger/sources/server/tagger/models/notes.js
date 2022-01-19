const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notesSchema = new Schema({
	content: {
		type: String, required: true
	},
	userId: {
		type: String
	},
	created: {
		type: Date, default: new Date()
	}
});

notesSchema.set("toJSON", {virtuals: false});
const Notes = mongoose.model("Notes", notesSchema);

module.exports = Notes;
