import ajaxActions from "../services/ajaxActions";

const patientsData = new webix.DataCollection();
let _patientsDataFolderId;

function getPatientsDataCollection() {
	return patientsData;
}

function getPatientsData() {
	return patientsData.data.serialize();
}

function getPatientsDataFolderId() {
	return _patientsDataFolderId;
}

function setPatientsDataFolderId(patientsDataFolder) {
	if (patientsDataFolder && patientsDataFolder._id) {
		_patientsDataFolderId = patientsDataFolder._id;
	}
}

async function createNewPatientRecord(patientsName) {
	const uniquePatients = [...new Set(patientsName)];
	uniquePatients.forEach((patientName) => {
		webix.confirm({
			title: "Add new patient",
			text: `Patient named "${patientName}" is missing. Do you want to add a new one?`
		})
			.then(async (result) => {
				if (result) {
					const newPatient = await ajaxActions.createNewItem(_patientsDataFolderId, patientName);
					if (newPatient) {
						patientsData.add(newPatient);
					}
				}
			});
	});
}

export default {
	getPatientsData,
	getPatientsDataCollection,
	getPatientsDataFolderId,
	setPatientsDataFolderId,
	createNewPatientRecord
};
