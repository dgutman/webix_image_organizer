const approvedMetadataModel = require('../models/approved_metadata');

const getData = async () => {
	try {
		let data = await approvedMetadataModel.getData();
		if (!data) {
			await approvedMetadataModel.initialApprovedMetadata();
			data = await approvedMetadataModel.getData();
		}
		return data;
	} catch(e) {
		console.error(e);
	}
};

const updateApprovedMetadata = async (valuesForUpdate) => {
	try {
		const data = await approvedMetadataModel.updateApprovedMetadata(valuesForUpdate);
		return data ? data : null;
	} catch(e) {
		console.error(e);
	}
};

module.exports = {getData, updateApprovedMetadata};
