define([
	"app",
	"models/edit_form",
	"models/approved_metadata",
	"models/approved_facet",
	"views/approved_metadata_popup",
	"views/approved_facet_popup",
	"constants"
], function(
	app,
	EditForm,
	approvedMetadataModel,
	approvedFacetModel,
	approvedMetadataPopup,
	approvedFacetPopup,
	constants
) {
	const uploadFormId = "edit_upload_form_id";
	const selectTypeId = "edit_select_type";
	const selectFacetId = "edit_select_facet";
	const toInterfaceBtnId = "edit_send_to_interface";
	const previewFormId = "edit_preview_form_id";
	const setVisibleFacetsButtonId = "set_visible_facets_button_id";
	const setVisibleMetadataButtonId = "set_visible_metadata_button_id";
	// const metadataGrouplistId = "metadata-grouplist-id";
	const scrollViewId = webix.uid();

		const ui = {
			view: "scrollview",
			id: scrollViewId,
			scroll: "auto",
			body: {
				rows: [
					{
						view: "form",
						id: uploadFormId,
						paddingY: 5,
						elements: [
							{
								margin: 20,
								cols: [
									{
										view: "select",
										id: selectFacetId,
										label: "Facet",
										options: []
									},
									{
										view: "button",
										id: setVisibleFacetsButtonId,
										value: "Set visible facets",
										width: 200,
										type: "form",
										click: function() {
											$$(constants.SELECT_FACET_POPUP_ID)?.show(this.getNode());
										}
									},
									{
										view: "select",
										id: selectTypeId,
										label: "Type",
										options: []
									},
									{
										view: "button",
										value: "Add",
										type: "form",
										width: 230,
										click: function() {
											const type = $$(selectTypeId)?.getValue();
											const facet = $$(selectFacetId)?.getValue();
											let canBeAdded = false;
											let message = "Facet can't be added for selected type";
											if (type && facet) {
												canBeAdded = EditForm.checkAbilityToAdd(facet, type);
												if (canBeAdded) {
													const view = EditForm.addItem(facet, type);
													$$(previewFormId)?.show();
													$$(previewFormId)?.addView(view);
													updateFormSize();
													reloadSelectsData();
												} else {
													webix.message({
														type: "message",
														text: message
													});
												}
												return;
											} else if (!type) {
												message = "Please, select Type before adding";
											} else if (!facet) {
												message = "Please, select Facet before adding";
											} else {
												message = "No More Attributes To Add";
											}
											webix.message({
												type: "message",
												text: message
											});
										}
									},
									{
										view: "button",
										id: setVisibleMetadataButtonId,
										value: "Set visible metadata",
										width: 200,
										type: "form",
										click: function() {
											$$(constants.APPROVED_METADATA_POPUP_ID)?.show(this.getNode());
										}
									}
								]
							},
							{
								view: "scrollview",
								scroll: "y",
								body: {
									rows: [
										{
											borderless: true,
											cols: [
												{
													css: "webix_header filter-list-header",
													borderless: true,
													template: "Filter",
													type: "header"
												},
												{
													css: "webix_header filter-list-header",
													borderless: true,
													template: "Value",
													type: "header"
												}
											]
										},
										{
											id: previewFormId,
											view: "form",
											hidden: true,
											elements: []
										}
									]
								}
							},
							{
								cols: [
									{},
									{
										view: "button",
										id: toInterfaceBtnId,
										value: "Save changes",
										width: 450,
										click: function() {
											EditForm.saveItems();
										}
									},
									{}
								]
							}
						]
					}
				]
			}
		};

	const getId = function() {
		return uploadFormId;
	};

	app.attachEvent("editForm:dataLoaded", function(views) {
		const childViews = $$(previewFormId)?.getChildViews();
		let i;
		if(childViews) {
			for(i = 0; i < childViews.length; i++) {
				$$(previewFormId)?.removeView(childViews[i]);
				i--;
			}
		}
		if(views && views.length) {
			$$(previewFormId)?.show();
			for(i = 0; i < views.length; i++) {
				$$(previewFormId)?.addView(views[i]);
			}
		}
		$$(scrollViewId)?.resize();
		$$(previewFormId)?.resize();
		reloadSelectsData();
	});

	app.attachEvent("editForm:clearForm", function() {
		const childViews = $$(previewFormId)?.getChildViews();
		let i;
		if(childViews) {
			for(i = 0; i < childViews.length; i++) {
				$$(previewFormId)?.removeView(childViews[i]);
				i--;
			}
		}
	});

	const reloadSelectsData = function(reloadOnlyLabels) {
		if(!reloadOnlyLabels) {
			$$(selectTypeId)?.define("options", EditForm.getItemTypes());
			$$(selectTypeId)?.render();
		}
		$$(selectFacetId)?.define("options", EditForm.getLabels());
		$$(selectFacetId)?.render();
	};


	const updateFormSize = function() {
		$$(scrollViewId)?.resize();
		$$(previewFormId)?.render();
	};

	const itemRemoved = function(id) {
		const countOfAddedItems = EditForm.getCountOfAddedItems();
		$$(previewFormId)?.removeView(id);
		updateFormSize();
		if(!countOfAddedItems) {
			$$(previewFormId)?.hide();
		}
	};

	const loadApprovedMetadataData = function() {
		const props = approvedMetadataModel.getProps();
		$$(constants.METADATA_GROUPLIST_ID)?.parse(props);
	};

	const loadApprovedFacetData = function() {
		const approvedFacetsData = approvedFacetModel.getApprovedFacetsData();
		$$(constants.FACET_FILTER_GROUPLIST_ID)?.clearAll();
		$$(constants.FACET_FILTER_GROUPLIST_ID)?.parse(approvedFacetsData);
		$$(constants.FACET_FILTER_GROUPLIST_ID)?.refresh();
	};

	const areFiltersNotChanged = function() {
		return EditForm.areFiltersNotChanged();
	};

	app.attachEvent("editForm:modifyView", function(data) {
		let view;
		const canBeAdded = EditForm.checkAbilityToAdd(data.facet, data.newType);
		if (canBeAdded) {
			view = EditForm.addItem(data.facet, data.newType);
			$$(previewFormId)?.show();
			webix.ui(view, $$(previewFormId), $$(data.formId));
		} else {
			$$(data.comboId)?.blockEvent();
			$$(data.comboId)?.setValue(data.oldType);
			$$(data.comboId)?.unblockEvent();
			webix.message({
				type: "message",
				text: "Facet can't be changed to selected type"
			});
		}
	});
	app.attachEvent("editForm:reloadOptions", reloadSelectsData);
	app.attachEvent("editForm:doAfterItemRemoved", itemRemoved);
	app.attachEvent("editForm:approvedMetadataLoaded", loadApprovedMetadataData);
	app.attachEvent("editForm:approvedFacetDataLoaded", loadApprovedFacetData);

	app.ui(approvedMetadataPopup);
	app.ui(approvedFacetPopup);

	app.attachEvent("editForm:doProgressOnApprovedMetadata", function() {
		const approvedMetadataPopup = $$(constants.APPROVED_METADATA_POPUP_ID);
		if (approvedMetadataPopup) {
			webix.extend($$(constants.APPROVED_METADATA_POPUP_ID), webix.ProgressBar);
			$$(constants.APPROVED_METADATA_POPUP_ID)?.showProgress({
				type: "icon"
			});
		}
	});

	app.attachEvent("editForm:onApprovedMetadataLoaded", function() {
		if ($$(constants.APPROVED_METADATA_POPUP_ID)?.hideProgress) {
			$$(constants.APPROVED_METADATA_POPUP_ID)?.hideProgress();
		}
	});

	app.attachEvent("editForm:doProgressOnApprovedFacet", function() {
		const selectFacetPopup = $$(constants.SELECT_FACET_POPUP_ID);
		if (selectFacetPopup) {
			webix.extend($$(constants.SELECT_FACET_POPUP_ID), webix.ProgressBar);
			selectFacetPopup.showProgress({
				type: "icon"
			});
		}
	});

	app.attachEvent("editForm:onApprovedFacetLoaded", function() {
		if ($$(constants.SELECT_FACET_POPUP_ID)?.hideProgress) {
			$$(constants.SELECT_FACET_POPUP_ID)?.hideProgress();
		}
	});

	return {
		$ui: ui,
		getId: getId,
		reloadSelectsData: reloadSelectsData,
		areFiltersNotChanged
	};
});
