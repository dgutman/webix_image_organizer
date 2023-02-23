const projectFolderMetadata = new webix.DataCollection();
const wrongMetadata = new webix.DataCollection();
const validationSchemas = new webix.DataCollection();

function getProjectFolderMetadata() {
	return projectFolderMetadata;
}

function getValidationSchemas() {
	return validationSchemas;
}

function getWrongMetadataCollection() {
	return wrongMetadata;
}

function clearWrongMetadata() {
	wrongMetadata.clearAll();
}

export default {
	getValidationSchemas,
	getProjectFolderMetadata,
	getWrongMetadataCollection,
	clearWrongMetadata
};
