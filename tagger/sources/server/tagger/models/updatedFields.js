const mongoose = require("mongoose");
const Images = require("./images");

const Schema = mongoose.Schema;

const fieldsSchema = new Schema({
	tag: {
		type: String
	},
	value: {
		type: String
	},
	confidence: {
		type: String
	},
	imageIds: {
		type: [String]
	}
});

fieldsSchema.set("toJSON", {virtuals: false, versionKey: false});

fieldsSchema.statics.findByCurrentFields = function findByCurrentFields(searchParams) {
	return this.findOne(searchParams);
};

fieldsSchema.statics.updateOrCreate = async function updateOrCreate(searchParams, newParams) {
	let fieldItem = await this.findOne(searchParams);
	const FieldsModel = this.model("Fields");
	if (!fieldItem) {
		const newItem = searchParams;
		newItem.imageIds = newParams.imageIds || [];
		fieldItem = new FieldsModel(newItem);
	}
	else {
		newParams.imageIds = await FieldsModel.filterImageIds(newParams.imageIds, fieldItem.imageIds);
		Object.assign(fieldItem, newParams);
	}
	return fieldItem.save();
};

fieldsSchema.statics.filterImageIds = async function filterImageIds(newIds, oldIds) {
	const newGroupedIds = await Images.groupByCollectionIds(newIds);
	const oldGroupedIds = await Images.groupByCollectionIds(oldIds);

	const filteredIds = Object.assign(oldGroupedIds, newGroupedIds);
	const arrays = Object.values(filteredIds);
	return arrays.reduce((acc, val) => acc.concat(val), []);
};

const Fields = mongoose.model("Fields", fieldsSchema);

module.exports = Fields;
