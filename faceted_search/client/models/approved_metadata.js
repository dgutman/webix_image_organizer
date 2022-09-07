define([
	"app",
	"constants"
], function(app, constants) {
	const approvedMetadataURL = `${constants.LOCAL_API}/facets/approved-metadata`;

	let props = [];

	app.attachEvent("approvedMetadata:loadData", function() {
		_loadData(approvedMetadataURL);
	});

	const _loadData = (url) => {
		app.callEvent("editForm:doProgressOnApprovedMetadata");
		webix.ajax().get(url, {})
			.then(function(response) {
				const data = response.json();
				if(data) {
					setProps(data);
				}
				app.callEvent("editForm:onApprovedMetadataLoaded");
				app.callEvent("editForm:approvedMetadataDataLoaded");
			})
			.catch((reason) => {
				console.error(reason);
				app.callEvent("editForm:onApprovedMetadataLoaded");
			});
	};

	const setProps = function(data) {
		props = data;
	};

	const saveApprovedMetadata = function(approvedMetadata) {
		deleteUnnecessaryProperties(approvedMetadata);
		webix.ajax().post(approvedMetadataURL, {data: approvedMetadata});
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
		return props;
	};

	return {
		getProps: getProps,
		saveApprovedMetadata: saveApprovedMetadata
	};
});
