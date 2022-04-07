import ajax from "../services/ajaxActions";

const npDataCollection = new webix.DataCollection();
let metadataTableData;

function getNPDataCollection() {
	return npDataCollection;
}

function getFilteredKeys(keys) {
	const savedKeys = ["image", "name", "meta_stain", "meta_region", "meta_npSchema_blockID", "meta_npSchema_StainID"];
	return keys.filter(key => savedKeys.includes(key));
}

function getItemWithoutNestFields(item) {
	const newItem = {};
	const itemKeys = Object.keys(item);
	itemKeys.forEach((itemKey) => {
		if (typeof item[itemKey] === "object" && item[itemKey] !== null) {
			const {...obj} = getItemWithoutNestFields(item[itemKey]);
			const objKeys = Object.keys(obj);
			objKeys.forEach((objKey) => {
				newItem[`${itemKey}_${objKey}`] = obj[objKey];
			});
		}
		else {
			newItem[itemKey] = item[itemKey];
		}
	});
	return newItem;
}

function getDataToTranspose(data) {
	const result = [];
	data.forEach((item) => {
		const newItem = getItemWithoutNestFields(item);
		result.push(newItem);
	});
	return result;
}

function _transpose(source) {
	const result = [];
	const dataToTranspose = getDataToTranspose(source);
	const firstItem = dataToTranspose[0];
	const keys = Object.keys(firstItem);
	const filteredKeys = getFilteredKeys(keys);
	filteredKeys.forEach((key) => {
		const tmpObj = {};
		tmpObj.columnName = key;
		for (let i = 0; i < dataToTranspose.length; i++) {
			const id = dataToTranspose[i]._id ? dataToTranspose[i]._id : webix.uid();
			if (dataToTranspose[i].hasOwnProperty(key)) {
				tmpObj[`item_${id}`] = dataToTranspose[i][key];
			}
		}
		if (tmpObj.columnName === "image") {
			tmpObj.columnName = "";
			result.unshift(tmpObj);
		}
		else if (tmpObj.columnName === "meta_npSchema_blockID") {
			tmpObj.columnName = "BlockID";
			result.push(tmpObj);
		}
		else if (tmpObj.columnName === "meta_stain") {
			tmpObj.columnName = "Stain";
			result.push(tmpObj);
		}
		else if (tmpObj.columnName === "meta_region") {
			tmpObj.columnName = "RegionAbbrev";
			result.push(tmpObj);
		}
		else if (tmpObj.columnName === "meta_npSchema_StainID") {
			tmpObj.columnName = "StainID";
			result.push(tmpObj);
		}
		else {
			result.push(tmpObj);
		}
	});
	return result;
}

function setImageTemplate(source) {
	const result = source.map(async (obj) => {
		const newObj = webix.copy(obj);
		newObj.imageSrc = await ajax.getImage(newObj._id, "thumbnail");
		newObj.image = `<img 
			src=${newObj.imageSrc}
			width=256
			height=256
			alt="${newObj.name}">
		`;
		newObj.$css = "npdataView";
		return newObj;
	});
	return Promise.all(result);
}

async function setMetadata(data) {
	npDataCollection.clearAll();
	if (data && data.length > 0) {
		metadataTableData = webix.copy(data);
		const metadataWithImageTemplate = await setImageTemplate(metadataTableData);
		const npData = _transpose(metadataWithImageTemplate);
		npDataCollection.parse(npData);
	}
}

export default {
	getNPDataCollection,
	setMetadata
};
