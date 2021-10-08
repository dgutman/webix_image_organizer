const approvedMetadataModel = require('../models/approved_metadata');

class ProcessApprovedMetadataRequest {
	async getApprovedMetadataData() {
		try {
			const approvedMetadata = await approvedMetadataModel.getApprovedMetadata();
			if(approvedMetadata && approvedMetadata.data && approvedMetadata.updatedAt) {
				return {data: approvedMetadata.data, updatedAt: approvedMetadata.updatedAt};
			} else {
				await approvedMetadataModel.initialApprovedMetadata();
				const initialApprovedMetadataData = await approvedMetadataModel.getApprovedMetadataData();
				if(initialApprovedMetadataData
					&& initialApprovedMetadataData.data
					&& initialApprovedMetadataData.updateAt) {
					return {data: initialApprovedMetadataData.data, updateAt: initialApprovedMetadataData.updateAt};
				} else {
					return {data: null, updatedAt: null};
				}
			}
		} catch(e) {
			console.error(e);
		}
	}
}

module.exports = new ProcessApprovedMetadataRequest();
