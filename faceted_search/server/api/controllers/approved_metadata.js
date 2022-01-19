const approvedMetadataModel = require('../models/approved_metadata');

const getApprovedMetadataData = async () => {
	try {
		let data = await approvedMetadataModel.getApprovedMetadataData();
		if (!data) {
			await approvedMetadataModel.initialApprovedMetadata();
			data = await approvedMetadataModel.getApprovedMetadataData();
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

module.exports = {getApprovedMetadataData, updateApprovedMetadata};
