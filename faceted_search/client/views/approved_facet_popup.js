define([
	"app",
	"models/approved_facet",
	"constants"
], function(
	app,
	approvedFacetModel,
	constants
) {
	const handleIconSelect = (view, id) => {
		const element = view.getItem(id);
		const data = view.data;
		element.hidden = element.hidden ? false : true;
		checkData(id, data, element.hidden);
		view.render();
	};

	const checkData = (id, data, check) => {
		data.eachChild(id, function(child) {
			child.hidden = check;
			if(data.getBranch(child.id).length > 0) {
				checkData(child.id, data, check);
			}
		});
	};
	const filterFacetPopup = {
		view: 'popup',
		id: constants.SELECT_FACET_POPUP_ID,
		body: {
			view: "scrollview",
			id: constants.SELECT_APPROVED_FACET_VIEW_ID,
			minWidth: 200,
			maxWidth: 400,
			minHeight: 300,
			maxHeight: 500,
			body: {
				rows: [
					{
						view: "textarea",
						value: "Please select the data which\n" +
							"should be displayed in the facet's dropdown:"
					},
					{
						view: "grouplist",
						id: constants.FACET_FILTER_GROUPLIST_ID,
						scroll: "auto",
						navigation: false,
						gravity: 10,
						select: false,
						drag: "source",
						templateGroup: ({name, hidden}, common) => `<div style="width:100%; display: flex">
						<span class='metadata-grouplist__group-value'>${name}</span> ${common.checkboxState(hidden)} <span style="padding-left: 4px">Select all</span>
						</div>`,
						templateItem: ({name, hidden}, common) => `<div style="width: 100%; display: flex">
						<span class='metadata-grouplist__item-value'>${name}</span> ${common.checkboxState(hidden)}
						</div>`,
						templateBack: ({name}) => `${name}`,
						type: {
							checkboxState: (hidden) => {
								const icon = hidden ? "checkbox mdi mdi-checkbox-blank-outline" : "checkbox mdi mdi-checkbox-marked";
								return `<span class='metadata-grouplist__checkbox ${icon}'></span>`;
							}
						},
						onClick: {
							checkbox: function(ev, id) {
								handleIconSelect(this, id);
								return false;
							}
						}
					},
					{
						view: "button",
						id: "confurm-button",
						value: "Confirm",
						click: function() {
							approvedFacetModel.saveApprovedFacets(
								$$(constants.FACET_FILTER_GROUPLIST_ID)
									.data
									.serialize()
							);
							$$(constants.SELECT_APPROVED_FACET_VIEW_ID).hide();
							app.callEvent("approvedFacet:loadApprovedFacetData");
						}
					}
				]
			}
		}
	};

	return filterFacetPopup;
});
