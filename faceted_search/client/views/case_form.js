define([
	"app",
	"models/case_filter",
	"models/filter",
	"models/images",
	"helpers/case",
	"helpers/filters",
	"helpers/authentication",
	"constants"
], function(
	app,
	CaseFilterModel,
	FilterModel,
	Images,
	caseHelper,
	filterHelper,
	auth,
	constants
) {
	const appliedFiltersId = `case-applied-filters-${webix.uid()}`;
	const caseFilterID = `case-filter-form-${webix.uid()}`;
	const regionSelectId = `case-region-select-${webix.uid()}`;
	const stainSelectId = `case-stain-select-${webix.uid()}`;
	const casesCountId = `case-cases-count-${webix.uid()}`;

	const caseFilterFormLabel = {
		view: "template",
		type: "header",
		template: "<div class='panel-header'>Case filters</div>"
	};

	const regionSelect = {
		view: "select",
		id: regionSelectId,
		label: "Region",
		options: []
	};

	const stainSelect = {
		view: "select",
		id: stainSelectId,
		label: "Stain",
		options: []
	};

	const addButton = {
		view: "button",
		value: "Add",
		click: () => {
			const region = $$(regionSelectId).getValue();
			const stain = $$(stainSelectId).getValue();
			const values = $$(appliedFiltersId).serialize();
			const isFound = values.find((value) => {
				if (value.region === region && value.stain === stain) {
					return true;
				}
			});
			if (!isFound) {
				$$(appliedFiltersId).add({region, stain});
				$$(appliedFiltersId).refresh();
				const filters = $$(appliedFiltersId).serialize().map((item) => ({stain: item.stain, region: item.region}));
				CaseFilterModel.setFilters(filters);
			}
			app.callEvent("caseForm: filtersChanged");
		}
	};

	const caseForm = {
		id: caseFilterID,
		view: "form",
		elements: [
			{
				rows: [
					stainSelect,
					regionSelect,
					addButton
				]
			}
		]
	};

	const appliedFilters = {
		view: "list",
		id: appliedFiltersId,
		gravity: 10,
		template: (obj, common) => {
			const criteriaCount = caseHelper.getCriterionCount({region: obj.region, stain: obj.stain});
			return `<div>
				<span class="delbtn mdi mdi-minus-circle"></span>
				count: (${criteriaCount}), stain="${obj.stain}", region="${obj.region}"
			</div>`;
		},
		onClick: {
			"delbtn": (ev, id) => {
				const appliedFiltersList = $$(appliedFiltersId);
				appliedFiltersList.remove(id);
				appliedFiltersList.refresh();
				const filters = $$(appliedFiltersId).serialize().map((item) => ({stain: item.stain, region: item.region}));
				CaseFilterModel.setFilters(filters);
				// app.callEvent("images:wsiFilterImagesView", [filter]);
				// Images.filterByCriterions(filters);
				caseHelper.filterByCriterions(filters);
				app.callEvent("caseForm: filtersChanged");
			}
		}
	};

	const casesCount = {
		view: 'template',
		align: 'center',
		css: "webixtype_base",
		height: 50,
		id: casesCountId,
		template: "<div class='found-button'>Cases #count#</div>",
		data: {
			count: 0
		}
	};

	Images.attachEvent("imagesLoaded", function() {
		const imagesCollection = Images.getImages();
		const images = imagesCollection.serialize();
		app.callEvent("casesFilter:setRegionsAndStains", [images]);
		const imagesRegions = CaseFilterModel.getImagesRegions();
		const imagesStaines = CaseFilterModel.getImagesStains();
		const filters = CaseFilterModel.getFilters();
		if(filters?.length > 0) {
			$$(appliedFiltersId).parse(filters);
		}

		const casesCount = $$(casesCountId);
		const regionSelect = $$(regionSelectId);
		const stainSelect = $$(stainSelectId);
		const appliedFilters = $$(appliedFiltersId);
		const caseFilter = $$(caseFilterID);

		if (casesCount) {
			casesCount.data.count = caseHelper.getCasesCount();
			casesCount.render();
		}
		regionSelect?.define("options", imagesRegions);
		regionSelect?.render();
		stainSelect?.define("options", imagesStaines);
		stainSelect?.render();
		appliedFilters?.hideProgress();
		casesCount?.hideProgress();
		caseFilter?.hideProgress();
	});

	app.attachEvent("caseForm: filtersChanged", function() {
		const appliedFiltersView = $$(appliedFiltersId);
		const filters = appliedFiltersView && !appliedFiltersView.$destructed
			? $$(appliedFiltersId).serialize().map((item) => ({stain: item.stain, region: item.region}))
			: null;
		// Images.filterByCriterions(filters);
		if (filters) {
			caseHelper.filterByCriterions(filters);
		}
		app.callEvent("caseForm: refreshCasesCount");
	});

	app.attachEvent("caseForm: refreshCasesCount", () => {
		const casesCountView = $$(casesCountId);
		if (casesCountView && !casesCountView.$destructed) {
			$$(casesCountId).data.count = caseHelper.getCasesCount();
			$$(casesCountId).render();
		}
	});

	const ui = {
		rows: [
			caseFilterFormLabel,
			caseForm,
			appliedFilters,
			casesCount
		]
	};

	return {
		$ui: ui,
		$oninit: function() {
			const viewsIDsForProgressBar = [casesCountId, appliedFiltersId, caseFilterID];
			viewsIDsForProgressBar.forEach((viewId) => {
				webix.extend($$(viewId), webix.ProgressBar);
				$$(viewId).showProgress({
					type: "icon"
				});
			});
		}
	};
});
