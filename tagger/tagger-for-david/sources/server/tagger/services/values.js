const Values = require("../models/values");
const imageUpdateService = require("./imageUpdate");

async function create(values, createdTagIds) {
	// validation
	if (!Array.isArray(values)) throw "Field \"values\" should be an array";
	// if (!Array.isArray(tagIds)) throw "Field \"tagIds\" should be an array";

	return Promise.all(values.map(async (value) => {
		let tagIds = [];
		if (typeof value === "object") {
			tagIds = value.tagIds && Array.isArray(value.tagIds) ? value.tagIds : tagIds;
			value = value.value;
		}
		if (value === "") return false;
		value = typeof value === "string" ? value : value.toString();
		value = value.toLowerCase();
		tagIds = createdTagIds || tagIds; // tagIds for new values from resource images
		const existedValue = await Values.findOne({value});

		if (existedValue) {
			existedValue.tagIds = existedValue.tagIds.concat(tagIds).unique();
			return existedValue.save();
		}

		const newValue = new Values({value});
		newValue.tagIds = tagIds;
		return newValue.save();
	}));
}

async function getAll() {
	const values = await Values.find().sort({value: 1});
	return values;
}

async function getByTags(tagIds) {
	// validation
	if (!Array.isArray(tagIds)) throw "Field \"tagIds\" should be an array";

	const values = await Values.find({tagIds: {$in: tagIds}}).sort({value: 1});
	return values;
}

async function updateValue(item) {
	const value = await Values.findById(item._id);

	// validation
	if (!value) throw "Value not found";

	const oldValue = {
		value: value.value,
		tagIds: value.tagIds
	};

	if (value.value !== item.value) {
		const existedValue = await Values.findOne({value: item.value});
		if (existedValue) {
			value.tagIds = Array.isArray(value.tagIds) ? value.tagIds : [];
			existedValue.tagIds = existedValue.tagIds.concat(value.tagIds).unique();

			await Values.deleteOne({_id: value._id});

			// update images which linked with this value
			await imageUpdateService.updateImagesByValue(oldValue, item, existedValue.tagIds);

			return existedValue.save();
		}
	}
	// to remove or add value to different tag
	if (item.hasOwnProperty("tagIds")) value.tagIds = item.tagIds;
	delete item.tagIds;

	// update images which linked with this value
	await imageUpdateService.updateImagesByValue(oldValue, item, value.tagIds);

	if (!value.tagIds.length) {
		return _delete([value._id]);
	}

	// copy item properties to value
	Object.assign(value, item);
	return value.save();
}

async function updateMany(values) {
	// validation
	if (!Array.isArray(values)) throw "Field \"values\" should be an array";

	return Promise.all(values.map(async value => updateValue(value)));
}

async function _delete(valueId) {
	return Values.findOneAndDelete({_id: valueId});
}

async function deleteMany(valueIds) {
	// validation
	if (!Array.isArray(valueIds)) throw "Field \"valuesIds\" should be an array";

	return Promise.all(valueIds.map(async valueId => _delete(valueId)));
}

module.exports = {
	getAll,
	create,
	getByTags,
	updateMany,
	_delete,
	deleteMany
};
