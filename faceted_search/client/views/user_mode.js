define([
	"views/images_dataview",
	"views/filter_form",
	"views/filter_button",
	"helpers/authentication",
	"constants"
], function(
	imagesView,
	filterFormView,
	filterButtonView,
	auth,
	constants
) {
	const dataViewCellId = "dataview_cell";
	const filterCellId = "filter_cell";
	const filterFormLabel = {
		type: "header",
		template: "<p class='filters-header-p'>Filters</p>"
	};
	const ui = {
		cols: [
			{
				minWidth: 200,
				id: filterCellId,
				maxWidth: 400,
				rows: [
					filterFormLabel,
					filterFormView,
					filterButtonView
				]
			},
			{
				body: imagesView,
				minWidth: 550,
				id: dataViewCellId
			}
		]
	};

	return {
		$ui: ui,
		$onurlchange: (_arg1, _arg2, scope) => {
			const switchViews = scope.root.queryView({name: "switchViews"});
			switchViews.setValue(window.location.hash.indexOf("user_mode") > -1 ? constants.USER_MODE : constants.ADMIN_MODE);
		}
	};
});
