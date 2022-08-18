const mongoose = require("mongoose");
const constants = require("../../etc/constants");

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
	owner: {
		type: Schema.Types.ObjectId,
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
			return this.status === constants.TASK_STATUS_CREATED;
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
		enum: [
			constants.TASK_STATUS_CREATED,
			constants.TASK_STATUS_PUBLISHED,
			constants.TASK_STATUS_IN_PROGRESS,
			constants.TASK_STATUS_CANCELED,
			constants.TASK_STATUS_FINISHED
		],
		default: constants.TASK_STATUS_CREATED
	},
	fromROI: {
		type: Boolean,
		default: false
	},
	showROIBorders: {
		type: Boolean,
		default: false
	},
	imgNames: {
		type: Boolean,
		default: false
	},
	showMeta: {
		type: Boolean,
		default: false
	},
	fromPattern: {
		type: Boolean,
		default: false
	},
	finished: {
		type: Array
	},
	type: {
		type: String,
		required: true,
		enum: ["girder", "default"],
		default: "default"
	},
	updatedAt: {
		type: Date
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
		status: {$nin: [constants.TASK_STATUS_CANCELED, constants.TASK_STATUS_CREATED]}
	});
	if (tasks.length !== taskIds.length) throw {name: "AccessError", message: "Access denied"};
	return tasks;
};

tasksSchema.set("toJSON", {virtuals: false});
const Tasks = mongoose.model("Tasks", tasksSchema);

module.exports = Tasks;
