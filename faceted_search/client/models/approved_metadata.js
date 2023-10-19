define([
	"app",
	"constants",
	"helpers/ajax"
], function(app, constants, ajaxActions) {
	const approvedMetadataURL = `${constants.LOCAL_API}/facets/approved-metadata`;

	let props = [];

	app.attachEvent("approvedMetadata:loadData", function() {
		_loadData(approvedMetadataURL);
	});

	const _loadData = (url) => {
		app.callEvent("editForm:doProgressOnApprovedMetadata");
		ajaxActions.getApprovedMetadatata()
			.then((data) => {
				if(data) {
					setProps(data);
				}
				app.callEvent("editForm:onApprovedMetadataLoaded");
				app.callEvent("editForm:approvedMetadataLoaded");
			})
			.catch((reason) => {
				app.callEvent("editForm:onApprovedMetadataLoaded");
			});
	};

	const setProps = function(data) {
		props = data;
	};

	const saveApprovedMetadata = function(approvedMetadata) {
		deleteUnnecessaryProperties(approvedMetadata);
		webix.ajax().post(approvedMetadataURL, {data: approvedMetadata});
		app.callEvent("approvedMetadata:loadData");
	};

	const deleteUnnecessaryProperties = function(approvedMetadata) {
		approvedMetadata.map((element) => {
			const excludedElements =
				Object.getOwnPropertyNames(element)
				.filter((exception) => !['data', 'id', 'checked'].includes(exception));
			excludedElements.forEach((excludedElement) => {
				delete(element[excludedElement]);
			});
			if(element.data) {
				deleteUnnecessaryProperties(element.data);
			} else{
				element.data = [];
			}
			return element;
		});
	};

	const getProps = function() {
		return JSON.parse(JSON.stringify(props));
	};

	return {
		getProps: getProps,
		saveApprovedMetadata: saveApprovedMetadata
	};
});
