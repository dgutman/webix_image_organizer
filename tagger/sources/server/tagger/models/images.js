const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const imagesSchema = new Schema({
	name: {
		type: String, required: true
	},
	meta: {
		type: Schema.Types.Mixed,
		default: {}
	},
	oldMeta: {
		type: Schema.Types.Mixed
	},
	baseParentId: {
		type: String, required: true
	},
	folderId: {
		type: String, required: true
	},
	userId: {
		type: String, required: true
	},
	mainId: {
		type: String, required: true
	},
	taskId: {
		type: Schema.Types.ObjectId
	},
	isReviewed: {
		type: Boolean, default: false
	},
	isUpdated: {
		type: Boolean, default: false
	}
}, {timestamps: {createdAt: "addedDate", updatedAt: "updatedDate"}});

imagesSchema.set("toJSON", {virtuals: false});

imagesSchema.index({taskId: 1, mainId: 1, userId: 1}, {unique: true});

imagesSchema.statics.groupByCollectionIds = async function groupByCollectionIds(ids) {
	const data = await this.aggregate([
		{$match: {_id: {$in: ids.map(id => mongoose.Types.ObjectId(id))}}},
		{
			$group: {
				_id: "$baseParentId", ids: {$addToSet: "$_id"}
			}
		}
	]);
	return data.reduce((result, item) => {
		result[item._id] = item.ids;
		return result;
	}, {});
};

const Images = mongoose.model("Images", imagesSchema);

module.exports = Images;
