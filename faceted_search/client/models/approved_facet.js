define([
	"app",
	"constants"
], function(
	app,
	constants
) {
	const approvedFacetURL = `${constants.LOCAL_API}/facets/approved-facet`;
	let approvedFacetsData = [];
	let approvedFacetsLabels = [];

	app.attachEvent("approvedFacet:loadApprovedFacetData", function() {
		_loadData(approvedFacetURL);
	});

	const _loadData = (url) => {
		app.callEvent("editForm:doProgressOnApprovedFacet");
		webix.ajax().get(url, {})
			.then(function(response) {
				const data = response.json();
				if(data) {
					approvedFacetsData = data;
				}
				approvedFacetsLabels = [];
				parseForFilter(approvedFacetsLabels, approvedFacetsData);
				app.callEvent("editForm:onApprovedFacetLoaded");
				app.callEvent("editForm:approvedFacetDataLoaded");
				app.callEvent("editForm:loadDataForFilters", approvedFacetsLabels);
			})
			.catch((reason) => {
				console.error(reason);
				app.callEvent("editForm:onApprovedFacetLoaded");
			});
	};

	const getApprovedFacetsData = () => {
		return approvedFacetsData;
	};

	const getApprovedFacetsLabels = () => {
		return approvedFacetsLabels;
	};

	const saveApprovedFacets = async (data) => {
		try{
			approvedFacetsData = data;
			const response = await webix.ajax().post(approvedFacetURL, {data: data});
			return response.text();
		} catch(err) {
			webix.message({
				type: "message",
				text: err.response
			});
		}
	};

	const parseForFilter = (approvedFacetsLabels, approvedFacetsData) => {
		approvedFacetsData.forEach((approvedFacetData) => {
			if(!approvedFacetData.hidden) {
				approvedFacetsLabels.push(approvedFacetData.facetId.replace(/\|/g, ' \\ '));
				if(approvedFacetData.data
					&& approvedFacetData.data.length > 0) {
					parseForFilter(approvedFacetsLabels, approvedFacetData.data);
				}
			}
		});
	};

	return {
		getApprovedFacetsData: getApprovedFacetsData,
		saveApprovedFacets: saveApprovedFacets,
		getApprovedFacetsLabels: getApprovedFacetsLabels
	};
});
