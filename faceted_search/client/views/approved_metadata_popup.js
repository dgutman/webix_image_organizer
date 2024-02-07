define([
	"models/approved_metadata",
	"constants"
], function(
	approvedMetadataModel,
	constants
) {
	const filterMetadataViewId = "filter_metadata_view_id";

	const handleIconSelect = (view, id) => {
		const element = view.getItem(id);
		const data = view.data;
		element.checked = !element.checked;
		element.iconState = element.checked? constants.CHECKBOX_STATE.checked : constants.CHECKBOX_STATE.blank;
		changeChildrenState(id, data, element.checked);
		const parent = view.getItem(element.$parent);
		if (parent) {
			setParentsElementIcon(view, parent);
		}
		view.render();
	};

	const changeChildrenState = (id, data, check) => {
		data.eachChild(id, function(child) {
			child.checked = check;
			if(data.getBranch(child.id).length > 0) {
				changeChildrenState(child.id, data, check);
			}
		});
	};

	function setParentsElementIcon(view, element) {
		setElementIcon(view, element);
		const parent = view.getItem(element.$parent);
		if (parent) {
			setParentsElementIcon(view, parent);
		}
	}

	// TODO: make a single module for approved facets and approved metadata
	function setElementIcon(view, element) {
		const data = view.data;
		const children = data.getBranch(element.id);
		if (children?.length) {
			const checkedChildrenCount = children.reduce((count, child) => {
				if(child.checked) {
					count++;
				}
				return count;
			}, 0);
			const isMinus = !!(children.reduce((count, child) => {
				return count + (child.iconState ?? 0); // blank state is 0
			}, 0));
			if (checkedChildrenCount === children.length) {
				element.iconState = constants.CHECKBOX_STATE.checked;
			}
			else if (isMinus) {
				element.iconState = constants.CHECKBOX_STATE.minus;
			}
			else {
				element.iconState = constants.CHECKBOX_STATE.blank;
			}
		}
		else {
			element.iconState = element.checked
				? constants.CHECKBOX_STATE.checked
				: constants.CHECKBOX_STATE.blank;
		}
	}

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
								handleIconSelect(this, id);
								return false;
							}
						},
						on: {
							onAfterLoad: function() {
								const view = this;
								const data = view.data;
								data.each(function(element) {
									setElementIcon(view, element);
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
