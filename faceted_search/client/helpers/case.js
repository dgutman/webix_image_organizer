define([
	"app",
	"models/case_filter",
	"models/images"
], function(
	app,
	CaseFilter,
	Images
) {
	function filterByCriterions(criterions) {
		const casesSet = new Set();
		const allImages = Images.getAllImages();
		allImages.forEach((image) => casesSet.add(image.data?.meta?.npSchema?.caseID));
		CaseFilter.clearCases();
		const filteredImagesByCriterions = allImages.filter((image) => {
			const isOk = criterions
				? isCriterionsFit(criterions, image)
				: true;
			return isOk;
		});
		const filteredImagesId = filteredImagesByCriterions.map((filteredImage) => filteredImage.id);
		const filteredCases = Array.from(casesSet).filter((caseName) => {
			return CaseFilter.isCaseFit(caseName, criterions.length);
		});
		CaseFilter.setFilteredCases(filteredCases);
		CaseFilter.setFilteredImagesIds(filteredImagesId);
		app.callEvent("filtersChanged");
	};

	function getCriterionCount(criterion) {
		const allImages = Images.getAllImages();
		const imagesFitsCriteria = allImages.filter((image) => {
			const isOk = image.facets["meta|npSchema|stainID"] === criterion.stain
				&& (image.facets["meta|npSchema|regionName"] || image.facets["meta|npSchema|region"]) === criterion.region;
			return isOk;
		});
		const count = imagesFitsCriteria.length;
		return count;
	};

	function getCasesCount() {
		const images = Images.serialize();
		const result = new Set();
		images.forEach((image) => {
			if (image.data?.meta?.npSchema?.caseID) {
				result.add(image.data?.meta?.npSchema?.caseID);
			}
		});
		return result.size;
	};

	function isCriterionsFit(criterions, image) {
		const isOk = criterions.reduce((isOk, criteria) => {
			if (isOk) {
				return true;
			} else if (
				((image.data?.meta?.npSchema?.regionName || image.data?.meta?.npSchema?.region) === criteria.region)
				&& image.data?.meta?.npSchema?.stainID === criteria.stain
			) {
				CaseFilter.addCaseCriteria(
					image.data?.meta?.npSchema?.caseID,
					`${criteria.region}-${criteria.stain}`
				);
				return true;
			}
			return false;
		}, false);
		return isOk;
	};

	return {
		filterByCriterions,
		getCriterionCount,
		getCasesCount
	};
});
