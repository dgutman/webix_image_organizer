const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupsSchema = new Schema({
	name: {
		type: String,
		unique: true
	},
	_modelType: {
		type: "string",
		default: "task_group",
		set: () => "task_group"
	}
}, {timestamps: {createdAt: "created", updatedAt: "updated"}});


groupsSchema.set("toJSON", {virtuals: false});
const Tasks = mongoose.model("Task_groups", groupsSchema);

module.exports = Tasks;
