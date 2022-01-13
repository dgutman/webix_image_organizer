let metadataTableModel;
let caseMetadataTableModel;

function getMetadataTableModel() {
	return metadataTableModel;
}

function setMetadataTableModel(model) {
	metadataTableModel = model;
}

function getCaseMetadataTableModel() {
	return caseMetadataTableModel;
}

function setCaseMetadataTableModel(model) {
	caseMetadataTableModel = model;
}

export default {
	setMetadataTableModel,
	getMetadataTableModel,
	setCaseMetadataTableModel,
	getCaseMetadataTableModel
};
