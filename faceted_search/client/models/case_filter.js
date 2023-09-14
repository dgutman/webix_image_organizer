define([
	"app",
	"helpers/authentication",
	"models/applied_filters"
], function(
	app,
	auth,
	AppliedFilters
) {
	const regionPath = "meta|npSchema|region";
	const oldRegionPath = "meta|npSchema|regionName";
	const stainPath = "meta|npSchema|stainID";
	const regionSet = new Set();
	const stainSet = new Set();
	const casesMap = new Map();
	const filteredCasesSet = new Set();
	const filteredImagesIds = [];

	function getImagesRegions() {
		return Array.from(regionSet);
	}

	function setImagesRegions(images) {
		regionSet.clear();
		images.forEach((image) => {
			const regionName = image.facets[regionPath] || image.facets[oldRegionPath];
			if (regionName) {
				regionSet.add(regionName);
			}
		});
	}

	function getImagesStains() {
		return Array.from(stainSet);
	}

	function setImagesStains(images) {
		stainSet.clear();
		images.forEach((image) => {
			if (image.facets[stainPath]) {
				stainSet.add(image.facets[stainPath]);
			}
		});
	}

	function setFilteredCases(cases) {
		filteredCasesSet.clear();
		cases.forEach((caseName) => {
			if (caseName !== "") {
				filteredCasesSet.add(caseName);
			}
		});
	}

	function getFilteredCases() {
		return Array.from(filteredCasesSet);
	}

	function getFilters() {
		const filters = AppliedFilters.getCaseFilters() ?? [];
		if (!filters) {
			setFilters([]);
			return [];
		}
		return filters;
	}

	function setFilters(filters) {
		AppliedFilters.setCaseFilters(filters);
	}

	function addCaseCriteria(caseName, criteriaName) {
		if (casesMap.has(caseName) && !casesMap.get(caseName)?.includes(criteriaName)) {
			casesMap.get(caseName).push(criteriaName);
		} else {
			casesMap.set(caseName, [criteriaName]);
		}
	}

	function isCaseFit(caseName, criterionsCount) {
		return casesMap.get(caseName)?.length === criterionsCount;
	}

	function clearCases() {
		casesMap.clear();
	}

	app.attachEvent("casesFilter:setRegionsAndStains", function(data) {
		setImagesRegions(data);
		setImagesStains(data);
	});

	function setFilteredImagesIds(imagesIds) {
		filteredImagesIds.length = 0;
		filteredImagesIds.push(...imagesIds);
	}

	function getFilteredImagesIds() {
		return filteredImagesIds;
	}

	return {
		getImagesRegions,
		getImagesStains,
		getFilters,
		setFilters,
		setFilteredCases,
		getFilteredCases,
		addCaseCriteria,
		isCaseFit,
		clearCases,
		setFilteredImagesIds,
		getFilteredImagesIds
	};
});

