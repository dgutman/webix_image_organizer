define([
	"app",
	"constants",
	"helpers/approved_facet"
], function(
	app,
	constants,
	approvedFacetsHelper
) {
	const approvedFacetURL = `${constants.LOCAL_API}/facets/approved-facet`;
	let approvedFacetsData = [];
	const approvedFacetsLabels = [];

	app.attachEvent("approvedFacet:loadApprovedFacetData", function() {
		_loadData(approvedFacetURL);
	});

	function parseApprovedFacetsForLocalStorage(approvedFacetsData) {
		const cachedData = [];
		approvedFacetsData.forEach((approvedFacetItem) => {
			if (approvedFacetItem.data) {
				cachedData.push(...parseApprovedFacetsForLocalStorage(approvedFacetItem.data));
			}
			cachedData.push({facetId: approvedFacetItem.facetId, hidden: approvedFacetItem.hidden});
		});
		return cachedData;
	};

	const _loadData = (url) => {
		app.callEvent("editForm:doProgressOnApprovedFacet");
		webix.ajax().get(url, {})
			.then(function(response) {
				const data = response.json();
				if(data) {
					const cachedData = approvedFacetsHelper.getLocalApprovedFacetData();
					if (Array.isArray(cachedData)) {
						approvedFacetsData = mergeDataWithCache(data, cachedData);
					} else {
						approvedFacetsData = data;
					}
				}
				approvedFacetsLabels.length = 0;
				approvedFacetsLabels.push(...parseForFilter(approvedFacetsData));
				app.callEvent("editForm:approvedFacetDataLoaded");
				app.callEvent("editForm:loadDataForFilters", approvedFacetsLabels);
				app.callEvent("editForm:onApprovedFacetLoaded");
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
			approvedFacetsData = webix.copy(data);
			const cachedApprovedFacets = parseApprovedFacetsForLocalStorage(approvedFacetsData);
			approvedFacetsHelper.setLocalApprovedFacetData(cachedApprovedFacets);
			const response = await webix.ajax().post(approvedFacetURL, {data: data});
			return response.text();
		} catch(err) {
			webix.message({
				type: "message",
				text: err.response
			});
		} finally {
			app.callEvent("editForm:reloadOptions");
		}
	};

	const parseForFilter = (approvedFacetsData) => {
		const approvedFacetsLabels = [];
		approvedFacetsData.forEach((approvedFacetData) => {
			if(!approvedFacetData.hidden) {
				approvedFacetsLabels.push(approvedFacetData.facetId.replace(/\|/g, ' \\ '));
			}
			if(approvedFacetData.data
				&& approvedFacetData.data.length > 0) {
				approvedFacetsLabels.push(...parseForFilter(approvedFacetData.data));
			}
		});
		return approvedFacetsLabels;
	};

	function mergeDataWithCache(approvedFacetsData, cachedData) {
		const cachedDataIds = cachedData.map((data) => data.facetId);
		const result = approvedFacetsData.map((approvedFacetData) => {
			const cachedDataIndex = cachedDataIds.indexOf(approvedFacetData.facetId);
			if (cachedDataIndex !== -1) {
				approvedFacetData.hidden = cachedData[cachedDataIndex].hidden;
			}
			if (cachedDataIndex !== -1 && approvedFacetData.data?.length > 0) {
				approvedFacetData.data = mergeDataWithCache(approvedFacetData.data, cachedData);
			}
			return approvedFacetData;
		});
		return result;
	};

	return {
		getApprovedFacetsData: getApprovedFacetsData,
		saveApprovedFacets: saveApprovedFacets,
		getApprovedFacetsLabels: getApprovedFacetsLabels
	};
});
