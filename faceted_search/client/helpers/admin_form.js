define([
    "app",
    "views/admin_form"
], function (app, filtersViewHelper) {
    var transformToFormFormat = function (data, type, typesData, viewId) {
        var formId = webix.uid(), ui = {}, t, tmpId = webix.uid(),
            facetId = webix.uid(), typeId = webix.uid();
        switch (type) {
            case "radio":
                t = filtersViewHelper.getRadioUI(data);
                break;
            case "slider":
                t = filtersViewHelper.getSliderUI(data);
                break;
            case "combo_box":
                t = filtersViewHelper.getComboUI(data);
                break;
            case "checkbox":
                t = filtersViewHelper.getCheckboxUI(data);
                break;
            case "toggle":
                t = filtersViewHelper.getToggleUI(data);
                break;
            case "range_slider":
                t = filtersViewHelper.getRangeSliderUI(data);
                break;
        }
        ui = {
            id: tmpId,
            cols: [
                {
                    view: "form",
                    id: formId,
                    height: 250,
                    elements: [
                        {
                            label: "Facet",
                            view: "select",
                            value: data.facet.id,
                            options: [data.facet],
                            disabled: true,
                            id: facetId
                        },
                        {
                            label: "Type",
                            view: "select",
                            value: type,
                            options: typesData,
                            id: typeId,
                            on: {
                                onChange: function(newVal, oldVal) {
                                    if(viewId === "upload") {
                                        app.callEvent("facetsForm:modifyView", [
                                            {
                                                oldType: oldVal,
                                                newType: newVal,
                                                comboId: typeId,
                                                formId: tmpId,
                                                facet: $$(facetId).getValue()
                                            }
                                        ]);
                                    } else {
                                        app.callEvent("editForm:modifyView", [
                                            {
                                                oldType: oldVal,
                                                newType: newVal,
                                                comboId: typeId,
                                                formId: tmpId,
                                                facet: $$(facetId).getValue()
                                            }
                                        ]);
                                    }
                                }
                            }
                        },
                        {
                            cols: [
                                {},
                                {},
                                {
                                    value: "Delete",
                                    view: "button",
                                    type: "danger",
                                    inputWidth: 100,
                                    click: function () {
                                        if(viewId === "upload") {
                                            app.callEvent("adminForm:removeItem", [tmpId, data.facet]);
                                        } else {
                                            app.callEvent("editForm:removeItem", [tmpId, data.facet]);
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    view: "form",
                    elements: [
                        t
                    ]
                }
            ]
        };

        return ui;

    };

    return {
        transformToFormFormat: transformToFormFormat
    };
});