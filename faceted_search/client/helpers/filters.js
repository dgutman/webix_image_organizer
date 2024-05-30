define([
    "views/filters",
    "app"
], function(filtersViewHelper, app) {
    let channelFilterEventId;

    const transformToFormFormat = function(data) {
        let key; 
        let i; 
        const elems = []; 
        let t;
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                const dataItem = data[key];
                elems.push(filtersViewHelper.getLabelUI(dataItem.label, dataItem.path));
                for (i = 0; i < data[key].data.length; i++) {
                    t = null;
                    switch (data[key].data[i].type) {
                        case "radio":
                            if (data[key].data[i].options.length === 0) {
                                continue;
                            }
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
                    if (t) {
                        elems.push(attachCollapseToFilter(t));
                    }
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
    
    const updateForm = function(data, skipId) {
        let key; 
        let i; let t; let j;
        for (key in data) {
            if (data.hasOwnProperty(key)) {
                for (i = 0; i < data[key].data.length; i++) {
                    t = null;
                    switch (data[key].data[i].type) {
                        case "radio":
                        case "combo_box":
                            if(skipId !== data[key].data[i].id) {
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

    // we assume that the first child of any filter will be a label
    // and then we attach the handler for its click event to hide or show the other children
    const attachCollapseToFilter = function(filter) {
        const collapsibleFilter = webix.copy(filter);
        const label = collapsibleFilter.rows[0].cols[0];
        label.css = label.css + ' collapssible-filter hidden-filter';
        label.click = function() {
            const labelObject = this;
            const channelFilter = this.getParentView().queryView({view: "text"});
            const controls = this.getParentView().getParentView().getChildViews()[1];
            if( !this.config.isRowsVisible ) {
                webix.html.addCss( labelObject.getNode(), "showed-filter");
                webix.html.removeCss( labelObject.getNode(), "hidden-filter");
                this.config.isRowsVisible = true;
                controls.show();
                
                if(labelObject.config.label === "channelmap") {
                    showTextFilterForChannelMap(channelFilter, controls);
                }
            } else {
                webix.html.removeCss( labelObject.getNode(), "showed-filter");
                webix.html.addCss( labelObject.getNode(), "hidden-filter");
                this.config.isRowsVisible = false;
                controls.hide();
                if(labelObject.config.label === "channelmap") {
                    hideTextFilterForChannelMap(channelFilter, controls);
                }
            }
        };

        // initially items are hidden
        collapsibleFilter.rows[1].hidden = true;

        return collapsibleFilter;
    };

    const showTextFilterForChannelMap = (channelFilter, controls) => {
        if(channelFilter) {
            switch(channelFilter.config.name) {
                case 'radioTextFilter':
                    channelFilterEventId = channelFilter.attachEvent('onTimedKeyPress', function() {
                        const filterText = channelFilter.getValue();
                        const radioOptions = controls.config.options;
                        radioOptions.forEach((option) => {
                            // TODO Could be added from webix 7.0.
                            // controls.showOption(option.id);
                        });
                        if(filterText !== '') {
                            radioOptions.forEach((option) => {
                                if(!option.id.toLowerCase().includes(filterText.toLowerCase())) {
                                    // TODO Could be added from webix 7.0.
                                    // controls.hideOption(option.id);
                                }
                            });
                        }
                    });
                    // TODO Could be added from webix 7.0
                    // channelFilter.show();
                    break;
                case 'sliderTextFilter':
                    break;
                case 'comboTextFilter':
                    break;
                case 'checkboxTextFilter':
                    channelFilterEventId = channelFilter.attachEvent('onTimedKeyPress', function() {
                        const filterText = channelFilter.getValue();
                        const displayedChildren = controls.getChildViews();
                        displayedChildren.forEach((child) => {
                            child.show();
                        });
                        if(filterText !== '') {
                            displayedChildren.forEach((child) => {
                                let childValue = null;
                                if(child.config.id.lastIndexOf('|') > -1) {
                                    const childValueStartIndex = child.config.id.lastIndexOf('|') + 1;
                                    childValue = child.config.id.slice(childValueStartIndex);
                                }
                                if(!childValue.toLowerCase().includes(filterText.toLowerCase())) {
                                    child.hide();
                                }
                            });
                        }
                    });
                    channelFilter.show();
                    break;
                case 'toggleTextFilter':
                    channelFilterEventId = channelFilter.attachEvent('onTimedKeyPress', function() {
                        const filterText = channelFilter.getValue();
                        const displayedChildren = controls.getChildViews();
                        displayedChildren.forEach((child) => {
                            child.show();
                        });
                        if(filterText !== '') {
                            displayedChildren.forEach((child) => {
                                if(!child.getChildViews()[0].config.label.toLowerCase().includes(filterText.toLowerCase())) {
                                    child.hide();
                                }
                            });
                        }
                    });
                    channelFilter.show();
                    break;
                case 'rangeSliderTextFilter':
                    break;
            }
        }
    };
    
    const hideTextFilterForChannelMap = (channelFilter, controls) => {
        if(channelFilter) {
            channelFilter.detachEvent(channelFilterEventId);
            channelFilter.hide();
        }
    };

    return {
        transformToFormFormat: transformToFormFormat,
        updateForm: updateForm
    };
});
