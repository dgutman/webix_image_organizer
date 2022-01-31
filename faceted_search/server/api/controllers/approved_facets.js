const lodash = require("lodash");
const approvedFacetsModel = require("../models/approved_facet");

const getApprovedFacetData = async () => {
	try {
		let data = await approvedFacetsModel.getApprovedFacetData();
		if(data && data.length ===0) {
			await approvedFacetsModel.addApprovedFacetData();
			data = await approvedFacetsModel.getApprovedFacetData();
		}
		let parsedData = [];
		if(data && data.length !== 0) {
			parsedData = parseDataForGroupList(data);
		}
		return parsedData;
	} catch(e) {
		console.error(e);
		return null;
	}
};

const parseDataForGroupList = (data) => {
	data.forEach((item) => {
		item['name'] = null;
	});
	const roots = [];
	const map = {};

	data = data.map((item, i) => {
		map[item.facetId] = i;
		item.data = [];
		item.name = lodash.last(item.facetId.split('|'));
		return item;
	});

	data.forEach((node, index, dataArray) => {
		if(node.parentId !== "") {
			dataArray[map[node.parentId]].data.push(node);
		} else {
			roots.push(node);
		}
	});
	return roots;
};

const updateApprovedFacetData = (dataToSave) => {
	const valuesForUpdate = [];
	parseDataForServer(valuesForUpdate, dataToSave);
	deleteUnnecessaryProperties(valuesForUpdate, ['facetId', 'hidden']);
	return approvedFacetsModel.updateApprovedFacetData(valuesForUpdate);
};

const parseDataForServer = (valuesForUpdate, data) => {
	data.forEach((item) => {
		valuesForUpdate.push(item);
		if(item.data !== undefined) {
			parseDataForServer(valuesForUpdate, item.data);
		}
	});
};

const deleteUnnecessaryProperties = (valuesForUpdate, propsToDisplay) => {
	valuesForUpdate.forEach((element, index, data) => {
		const excludedElements =
			Object.getOwnPropertyNames(element)
				.filter((propName) => {
					return !propsToDisplay.includes(propName);
				});
		excludedElements.forEach((excludedElement) => {
			delete(element[excludedElement]);
		});
		data[index] = element;
	});
};

module.exports = {getApprovedFacetData, updateApprovedFacetData};
