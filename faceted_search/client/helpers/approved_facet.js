define([
	"helpers/authentication"
], function(
	auth
) {
	const localStorageApprovedFacetsId = "approvedFacets";

	function getLocalStorageId() {
		return `${localStorageApprovedFacetsId}-${auth.getUserId() || "unregistered"}`;
	}

	function setLocalApprovedFacetData(data) {
		webix.storage.local.put(getLocalStorageId(), data);
	}

	function getLocalApprovedFacetData() {
		return webix.storage.local.get(getLocalStorageId());
	}

	function clear() {
		webix.storage.local.put(getLocalStorageId(), []);
	}

	return {
		getLocalApprovedFacetData,
		setLocalApprovedFacetData,
		clear
	};
});
