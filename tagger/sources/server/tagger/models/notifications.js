const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationsSchema = new Schema({
	text: {
		type: String, required: true
	},
	userId: {
		type: Schema.Types.ObjectId, required: true
	},
	taskId: {
		type: Schema.Types.ObjectId, required: true
	},
	isRead: {
		type: Boolean, default: false
	}
}, {timestamps: {createdAt: "created"}});

notificationsSchema.set("toJSON", {virtuals: false});
const Notifications = mongoose.model("Notifications", notificationsSchema);

module.exports = Notifications;
