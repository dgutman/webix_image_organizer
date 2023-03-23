const projectFolderMetadata = new webix.DataCollection();
// validationSchemas folder in collection
let projectValidationSchemasFolder = {};
const wrongMetadata = new webix.DataCollection();
const validationSchemas = [];
// Key - folder name, value - schemas $ids as []
const folderAndSchemasMapping = new Map();
const collectionFolders = [];
let validationFolder;

function getProjectFolderMetadata() {
	return projectFolderMetadata;
}

function clearProjectFolderMetadata() {
	projectFolderMetadata.clearAll();
}

function getProjectValidationSchemasFolder() {
	return projectValidationSchemasFolder;
}

function setProjectValidationSchemasFolder(newFolder) {
	projectValidationSchemasFolder = newFolder;
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

function getFolderAndSchemasMapping() {
	return folderAndSchemasMapping;
}

function clearFolderAndSchemasMapping() {
	folderAndSchemasMapping.clear();
}

function getCollectionFolders() {
	return collectionFolders;
}

function getValidationFolder() {
	return validationFolder;
}

function setValidationFolder(newValidationFolder) {
	validationFolder = newValidationFolder;
}

function clearCollectionFolders() {
	collectionFolders.length = 0;
}

export default {
	getValidationSchemas,
	getProjectFolderMetadata,
	clearProjectFolderMetadata,
	getProjectValidationSchemasFolder,
	setProjectValidationSchemasFolder,
	getWrongMetadataCollection,
	clearWrongMetadata,
	getFolderAndSchemasMapping,
	clearFolderAndSchemasMapping,
	getCollectionFolders,
	getValidationFolder,
	setValidationFolder,
	clearCollectionFolders
};
