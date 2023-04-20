define([
	"app",
	"models/filter",
	"models/images",
	"helpers/filters",
	"helpers/authentication",
	"models/case_filter",
	"constants"
], function(
	app,
	Filter,
	Images,
	filterHelper,
	auth,
	CaseFilter,
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
			$$(appliedFiltersId).add({region, stain});
			$$(appliedFiltersId).refresh();
			const filters = $$(appliedFiltersId).serialize().map((item) => ({stain: item.stain, region: item.region}));
			CaseFilter.setFilters(filters);
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
			const criteriaCount = Images.getCriterionCount({region: obj.region, stain: obj.stain});
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
				CaseFilter.setFilters(filters);
				// app.callEvent("images:wsiFilterImagesView", [filter]);
				Images.filterByCriterions(filters);
			}
		}
	};

	const casesCount = {
		view: 'template',
		align: 'center',
		css: "button-text",
		height: 50,
		id: casesCountId,
		template: "<div class='found-button'>Cases #count#<span class='webix_icon button-icon mdi mdi-close-circle'></span></div>",
		data: {
			count: 0
		}
	};

	Images.attachEvent("imagesLoaded", function() {
		const imagesCollection = this.getImages();
		const images = imagesCollection.serialize();
		app.callEvent("casesFilter:setRegionsAndStains", [images]);
		const imagesRegions = CaseFilter.getImagesRegions();
		const imagesStaines = CaseFilter.getImagesStains();
		$$(casesCountId).data.count = this.getCasesCount();
		$$(casesCountId).render();
		$$(regionSelectId).define("options", imagesRegions);
		$$(regionSelectId).render();
		$$(stainSelectId).define("options", imagesStaines);
		$$(stainSelectId).render();
	});

	app.attachEvent("caseForm: filtersChanged", function() {
		const filters = $$(appliedFiltersId).serialize().map((item) => ({stain: item.stain, region: item.region}));
		Images.filterByCriterions(filters);
		$$(casesCountId).data.count = Images.getCasesCount();
		$$(casesCountId).render();
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
			const filters = CaseFilter.getFilters();
			if(filters?.length > 0) {
				$$(appliedFiltersId).parse(filters);
			}
		}
	};
});
