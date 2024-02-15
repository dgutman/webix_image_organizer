define([
	"app",
	"models/approved_facet",
	"constants",
	"helpers/checkboxStateService"
], function(
	app,
	approvedFacetModel,
	constants,
	checkboxStateService
) {
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
						templateGroup: ({name, iconState}, common) => `<div style="width:100%; display: flex">
						<span class='metadata-grouplist__group-value'>${name}</span> ${common.checkboxIconByState(iconState)} <span style="padding-left: 4px">Select all</span>
						</div>`,
						templateItem: ({name, hidden}, common) => `<div style="width: 100%; display: flex">
						<span class='metadata-grouplist__item-value'>${name}</span> ${common.checkboxIcon(hidden)}
						</div>`,
						templateBack: ({name}) => `${name}`,
						type: {
							checkboxIconByState: (iconState) => {
								let icon;
								switch(iconState) {
									case constants.CHECKBOX_STATE.blank:
										icon = "checkbox mdi mdi-checkbox-blank-outline";
										break;
									case constants.CHECKBOX_STATE.checked:
										icon = "checkbox mdi mdi-checkbox-marked";
										break;
									case constants.CHECKBOX_STATE.minus:
										icon = "checkbox mdi mdi-minus-box-outline";
										break;
									default:
										break;
								}
								return `<span class='metadata-grouplist__checkbox ${icon}'></span>`;
							},
							checkboxIcon: (hidden) => {
								const icon = hidden ? "checkbox mdi mdi-checkbox-blank-outline" : "checkbox mdi mdi-checkbox-marked";
								return `<span class='metadata-grouplist__checkbox ${icon}'></span>`;
							}
						},
						onClick: {
							checkbox: function(ev, id) {
								const element = this.getItem(id);
								const isInverse = true;
								checkboxStateService.handleIconSelect(this, id, "hidden", isInverse);
								return false;
							}
						},
						on: {
							onAfterLoad: function() {
								const view = this;
								const data = view.data;
								const isInverse = true;
								data.each(function(element) {
									const isChecked = !element.hidden;
									checkboxStateService.setElementIcon(view, element, "hidden", isChecked, isInverse);
								});
							}
						}
					},
					{
						view: "button",
						id: "confirm-facets-button",
						value: "Confirm",
						click: function() {
							const data = $$(constants.FACET_FILTER_GROUPLIST_ID)
								.data
								.serialize();
							delete data.iconState;
							delete data.checked;
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
