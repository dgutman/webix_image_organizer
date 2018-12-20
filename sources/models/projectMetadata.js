const projectFolderMetadata = new webix.DataCollection();
const wrongMetadata = new webix.DataCollection();

function getProjectFolderMetadata() {
	return projectFolderMetadata;
}

function getWrongMetadataCollection() {
	return wrongMetadata;
}

function clearWrongMetadata() {
	wrongMetadata.clearAll();
}

export default {
	getProjectFolderMetadata,
	getWrongMetadataCollection,
	clearWrongMetadata
};