const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tasksSchema = new Schema({
	name: {
		type: String
	},
	parentId: {
		type: String, required: true
	},
	parentCollection: {
		type: String, required: true
	},
	baseParentId: {
		type: String, required: true
	},
	userId: {
		type: Schema.Types.ObjectId, required: true
	},
	folderId: {
		type: String, required: true
	},
	checked_out: {
		type: Boolean,
		default: false
	}
});

tasksSchema.set("toJSON", {virtuals: false});
const Tasks = mongoose.model("Tasks", tasksSchema);

module.exports = Tasks;
