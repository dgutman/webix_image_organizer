define([
	"helpers/authentication"
], function(
	auth
) {
	function getColorTemplateData() {
		return webix.storage.local.get(`colorTemplate-${auth.getUserId() || "unregistered"}`);
	}

	function setColorTemplateData(colorTemplateData) {
		webix.storage.local.put(`colorTemplate-${auth.getUserId() || "unregistered"}`, colorTemplateData);
	}
	
	return {
		getColorTemplateData,
		setColorTemplateData
	};
});
