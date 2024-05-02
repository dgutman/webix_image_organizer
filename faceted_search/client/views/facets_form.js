define([
	"app",
	"models/edit_form"
], function(app, EditForm) {
	const uploadFormId = "upload_form_id";
	const selectTypeId = "select_type";
	const selectFacetId = "select_facet";
	const toInterfaceBtnId = "send_to_interface";
	const previewFormId = "preview_form_id";
	const scrollViewId = webix.uid();

	const ui = {
		view: "scrollview",
		id: scrollViewId,
		scroll: "y",
		body: {
			rows: [
				{
					view: "form",
					hidden: true,
					id: uploadFormId,
					elements: [
						{
							view: "select",
							id: selectFacetId,
							label: "Facet",
							options: []
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
							click: function() {
								const type = $$(selectTypeId).getValue();
								const facet = $$(selectFacetId).getValue();
								let view;
								let canBeAdded = false;
								if (type && facet) {
									canBeAdded = EditForm.checkAbilityToAdd(facet, type);
									if (canBeAdded) {
										view = EditForm.addItem(facet, type);
										$$(previewFormId).show();
										$$(toInterfaceBtnId).show();
										$$(previewFormId).addView(view);
										updateFormSize();
										reloadSelectsData();
									} else {
										webix.message("Facet can't be added for selected type");
									}
								} else if (!type) {
									webix.message('Please, select Type before adding');
								} else if (!facet) {
									webix.message('Please, select Facet before adding');
								} else {
									webix.message('No More Attributes To Add');
								}
							}},
						{
							id: previewFormId,
							view: "form",
							hidden: true,
							elements: []
						},
						{
							hidden: true,
							id: toInterfaceBtnId,
							value: "Send To Interface",
							view: "button",
							click: function() {
								EditForm.saveItems();
							}
						}]
				}]
		}
	};
	const getId = function() {
		return uploadFormId;
	};

	const reloadSelectsData = function(reloadOnlyLabels) {
		if(!reloadOnlyLabels) {
			$$(selectTypeId).define("options", EditForm.getItemTypes());
			$$(selectTypeId).render();
		}
		$$(selectFacetId).define("options", EditForm.getLabels());
		$$(selectFacetId).render();
	};


	const updateFormSize = function() {
		$$(scrollViewId).resize();
		$$(previewFormId).render();
	};

	const itemRemoved = function(id) {
		const t = EditForm.getCountOfAddedItems();
		$$(previewFormId).removeView(id);
		updateFormSize();
		if(!t) {
			$$(previewFormId).hide();
			$$(toInterfaceBtnId).hide();
		}
	};


	app.attachEvent("facetsForm:doAfterItemRemoved", itemRemoved);
	app.attachEvent("facetsForm:reloadOptions", reloadSelectsData);
	app.attachEvent("facetsForm:modifyView", function(data) {
		let view;
		let canBeAdded = false;
		canBeAdded = EditForm.checkAbilityToAdd(data.facet, data.newType);
		if (canBeAdded) {
			view = EditForm.addItem(data.facet, data.newType);
			$$(previewFormId).show();
			webix.ui(view, $$(previewFormId), $$(data.formId));
		} else {
			$$(data.comboId).blockEvent();
			$$(data.comboId).setValue(data.oldType);
			$$(data.comboId).unblockEvent();
			webix.message("Facet can't be changed to selected type");
		}
	});

	app.attachEvent("facetsForm:clearAfterSave", function() {
		const t = $$(previewFormId).getChildViews(); let i;
		if(t) {
			for(i = 0; i < t.length; i++) {
				$$(previewFormId).removeView(t[i]);
			}
		}
		$$(toInterfaceBtnId).hide();
	});

	return {
		$ui: ui,
		getId: getId,
		reloadSelectsData: reloadSelectsData
	};
});
