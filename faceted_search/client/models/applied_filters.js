define([
	"app",
	"constants",
	"helpers/authentication"
], function(app, constants, auth) {
	function getAppliedFilters() {
		return webix.storage.local.get(`${constants.APPLIED_FILTERS_LOCAL_STORAGE_KEY}-${auth.getUserId()}`) ?? [];
	}

	function setAppliedFilters(appliedFilters) {
		webix.storage.local.put(
			`${constants.APPLIED_FILTERS_LOCAL_STORAGE_KEY}-${auth.getUserId()}`,
			appliedFilters
		);
	}

	function getCaseFilters() {
		return webix.storage.local.get(`${constants.CASE_FILTERS_LOCAL_STORAGE_KEY}-${auth.getUserId()}` ?? []);
	}

	function setCaseFilters(caseFilters) {
		webix.storage.local.put(`${constants.CASE_FILTERS_LOCAL_STORAGE_KEY}-${auth.getUserId()}`, caseFilters);
	}

	return {
		getAppliedFilters,
		setAppliedFilters,
		getCaseFilters,
		setCaseFilters
	};
});
