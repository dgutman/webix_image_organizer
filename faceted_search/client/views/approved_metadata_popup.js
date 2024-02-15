define([
	"models/approved_metadata",
	"constants",
	"helpers/checkboxStateService"
], function(
	approvedMetadataModel,
	constants,
	checkboxStateService
) {
	const filterMetadataViewId = "filter_metadata_view_id";

	const approvedMetadataPopup = {
		view: 'popup',
		id: constants.APPROVED_METADATA_POPUP_ID,
		body: {
			view: "scrollview",
			id: filterMetadataViewId,
			minWidth: 200,
			maxWidth: 400,
			minHeight: 300,
			maxHeight: 500,
			body: {
				rows: [
					{
						view: "textarea",
						value: "Please select the metadata which\n" +
							"should be displayed in the User Mode:"
					},
					{
						view: "grouplist",
						id: constants.METADATA_GROUPLIST_ID,
						scroll: "auto",
						navigation: false,
						gravity: 10,
						select: false,
						drag: "source",
						templateGroup: ({value, iconState}, common) => `<div style="width:100%; display: flex">
						<span class='metadata-grouplist__group-value'>${value}</span> ${common.checkboxIconByState(iconState)} <span style="padding-left:4px">Select all</span>
						</div>`,
						templateItem: ({value, checked}, common) => `<div style="width: 100%; display: flex">
						<span class='metadata-grouplist__item-value'>${value}</span> ${common.checkboxIcon(checked)}
						</div>`,
						type: {
							checkboxIconByState: (stateIcon) => {
								let icon;
								switch(stateIcon) {
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
							checkboxIcon: (checked) => {
								const icon = checked ? "checkbox mdi mdi-checkbox-marked" : "checkbox mdi mdi-checkbox-blank-outline";
								return `<span class='metadata-grouplist__checkbox ${icon}'></span>`;
							}
						},
						onClick: {
							checkbox: function(ev, id) {
								const isInverse = false;
								checkboxStateService.handleIconSelect(this, id, "checked", isInverse);
								return false;
							}
						},
						on: {
							onAfterLoad: function() {
								const view = this;
								const data = view.data;
								const isInverse = false;
								data.each(function(element) {
									const isChecked = element.checked;
									checkboxStateService.setElementIcon(view, element, "checked", isChecked, isInverse);
								});
							}
						}
					},
					{
						view: "button",
						id: "confirm-button",
						value: "Confirm",
						click: function() {
							approvedMetadataModel.saveApprovedMetadata($$(constants.METADATA_GROUPLIST_ID).data.serialize());
							$$(constants.APPROVED_METADATA_POPUP_ID).hide();
						}
					}
				]
			}
		}
	};

	return approvedMetadataPopup;
});
