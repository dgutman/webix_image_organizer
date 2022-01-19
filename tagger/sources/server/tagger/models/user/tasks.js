const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tasksSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	baseParentId: {
		type: String
	},
	userId: {
		type: [Schema.Types.ObjectId],
		required: true
	},
	creatorId: {
		type: [Schema.Types.ObjectId],
		required: true
	},
	groupId: {
		type: Schema.Types.ObjectId
	},
	folderId: {
		type: String
	},
	deadline: {
		type: Date
	},
	checked_out: {
		type: [Schema.Types.ObjectId],
		required: true,
		default: []
	},
	imageIds: {
		type: [Schema.Types.ObjectId],
		required() {
			return this.status === "created";
		}
	},
	folderIds: {
		type: [Schema.Types.ObjectId],
		required() {
			return this.type === "default";
		}
	},
	status: {
		type: String,
		required: true,
		enum: ["created", "published", "in_progress", "canceled", "finished"],
		default: "created"
	},
	type: {
		type: String,
		required: true,
		enum: ["girder", "default"],
		default: "default"
	},
	_modelType: {
		type: "string",
		default: "task",
		set: () => "task"
	}
}, {timestamps: {createdAt: "created"}});

tasksSchema.statics.validateByUserId = async function validateByUserId(taskIds, userId) {
	const tasks = await this.find({
		_id: {$in: taskIds.map(id => mongoose.Types.ObjectId(id))},
		userId: mongoose.Types.ObjectId(userId),
		status: {$nin: ["canceled", "created"]}
	});
	if (tasks.length !== taskIds.length) throw {name: "AccessError", message: "Access denied"};
	return tasks;
};

tasksSchema.set("toJSON", {virtuals: false});
const Tasks = mongoose.model("Tasks", tasksSchema);

module.exports = Tasks;
