define([
    "views/filters",
    "app"
], function (filtersViewHelper, app) {
    var transformToFormFormat = function (data) {
        var key, i, elems = [], t;
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                elems.push(filtersViewHelper.getLabelUI(data[key].label));
                for (i = 0; i < data[key].data.length; i++) {
                    t = null;
                    switch (data[key].data[i].type) {
                        case "radio":
                            t = filtersViewHelper.getRadioUI(data[key].data[i]);
                            break;
                        case "slider":
                            t = filtersViewHelper.getSliderUI(data[key].data[i]);
                            break;
                        case "combo_box":
                            t = filtersViewHelper.getComboUI(data[key].data[i]);
                            break;
                        case "checkbox":
                            t = filtersViewHelper.getCheckboxUI(data[key].data[i]);
                            break;
                        case "toggle":
                            t = filtersViewHelper.getToggleUI(data[key].data[i]);
                            break;
                        case "range_slider":
                            t = filtersViewHelper.getRangeSliderUI(data[key].data[i]);
                            break;
                    }
                    elems.push(attachCollapseToFilter(t));
                }
                elems.push({
                    css: 'filter-block-delimiter',
                    id: webix.uid(),
                    height: 10,
                    template: ''
                });
            }
        }
        return elems;
    };
    
    var updateForm = function (data, skipId) {
        var key, i, t, j;
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                for (i = 0; i < data[key].data.length; i++) {
                    t = null;
                    switch (data[key].data[i].type) {
                        case "radio":
                        case "combo_box":
                            if(skipId !== data[key].data[i].id){
                                t = filtersViewHelper.getOptions(data[key].data[i]);
                                app.callEvent("updateForm", [data[key].data[i].id, "options", t]);
                            }
                            break;
                        case "checkbox":
                            t = filtersViewHelper.getCheckboxOptions(data[key].data[i]);
                            for(j = 0; j < t.length; j++) {
                                app.callEvent("updateForm", [t[j].id, "labelRight", t[j].labelRight]);
                            }
                            break;
                        case "toggle":
                            t = filtersViewHelper.getToggleOptions(data[key].data[i]);
                            for(j = 0; j < t.length; j++) {
                                app.callEvent("updateForm", [t[j].id, "label", t[j].label])
                            }
                            break;
                    }
                }
            }
        }
    };

    //we assume that the first child of any filter will be a label
    //and then we attach the handler for its click event to hide or show the other children
    var attachCollapseToFilter = function (filter) {
        var collapsibleFilter = webix.copy(filter);
        var label = collapsibleFilter.rows[0];
        label.css = label.css + ' collapssible-filter hidden-filter';
        label.click = function(){
            var children = this.getParentView().getChildViews();
            var labelObject = children[0];
            var controls = children[1];
            if( !this.config.isRowsVisible ) {
                webix.html.addCss( labelObject.getNode(), "showed-filter");
                webix.html.removeCss( labelObject.getNode(), "hidden-filter");
                this.config.isRowsVisible = true;
                controls.show();
            } else {
                webix.html.removeCss( labelObject.getNode(), "showed-filter");
                webix.html.addCss( labelObject.getNode(), "hidden-filter");
                this.config.isRowsVisible = false;
                controls.hide()
            }
        }

        //initially items are hidden
        collapsibleFilter.rows[1].hidden = true;

        return collapsibleFilter;
    }

    return {
        transformToFormFormat: transformToFormFormat,
        updateForm: updateForm
    };
});