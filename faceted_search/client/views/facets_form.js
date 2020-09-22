define([
    "app",
    "models/admin_form"
], function (app, AdminForm) {
    var uploadFormId = "upload_form_id",
        selectTypeId = "select_type",
        selectFacetId = "select_facet",
        toInterfaceBtnId = "send_to_interface",
        previewFormId = "preview_form_id",
        scrollViewId = webix.uid(),

        ui = {
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
                                click: function () {
                                    var type = $$(selectTypeId).getValue(),
                                        facet = $$(selectFacetId).getValue(), view, canBeAdded = false;
                                    if (type && facet) {
                                        canBeAdded = AdminForm.checkAbilityToAdd(facet, type);
                                        if (canBeAdded) {
                                            view = AdminForm.addItem(facet, type);
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
                                }
                            },
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
                                click: function () {
                                    AdminForm.saveItems();
                                }
                            }
                        ]
                    }
                ]
            },
            height: NaN
        };
    var getId = function () {
        return uploadFormId;
    };

    var reloadSelectsData = function (reloadOnlyLabels) {
        if(!reloadOnlyLabels) {
            $$(selectTypeId).define("options", AdminForm.getItemTypes());
            $$(selectTypeId).render();
        }
        $$(selectFacetId).define("options", AdminForm.getLabels());
        $$(selectFacetId).render();

    };


    var updateFormSize = function () {
        $$(scrollViewId).resize();
        $$(previewFormId).render();
    };

    var itemRemoved = function (id) {
        var t = AdminForm.getCountOfAddedItems();
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
        var view, canBeAdded = false;
        canBeAdded = AdminForm.checkAbilityToAdd(data.facet, data.newType);
        if (canBeAdded) {
            view = AdminForm.addItem(data.facet, data.newType);
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
        var t = $$(previewFormId).getChildViews(), i;
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
    }
});