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
	deadline: {
		type: Date
	},
	checked_out: {
		type: Boolean,
		default: false
	}
});

tasksSchema.statics.validateByUserId = async function validateByUserId(taskIds, userId) {
	const tasks = await this.find({
		_id: {$in: taskIds.map(id => mongoose.Types.ObjectId(id))},
		userId: mongoose.Types.ObjectId(userId)
	});
	if (tasks.length !== taskIds.length) throw {name: "AccessError", message: "Access denied"};
	return tasks;
};

tasksSchema.set("toJSON", {virtuals: false});
const Tasks = mongoose.model("Tasks", tasksSchema);

module.exports = Tasks;
