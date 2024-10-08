define([
    "app",
    "models/applied_filters",
    "helpers/debouncer",
    "constants",
], function(app, AppliedFilters, Debouncer, constants) {
    const filtersCollection = new webix.DataCollection({});
    const filters = [];
    let isImagesLoaded = false;
    const aggregateCheckboxName = constants.AGGREGATE_CHECKBOX_NAME;
    const debounce = new Debouncer(300);

    filtersCollection.loadFilters = function() {
        isImagesLoaded = false;
        let isAfterLoadEventCalled = false;
        webix.ajax().get(app.config.defaultAPIPath + "/facets/filters", {data: {}})
            .then(function(response) {
                const data = response.json();
                filters.length = 0;
                const dataToParse = data && Object.keys(data).length > 0 ? data : [];
                filtersCollection.clearAll();
                filtersCollection.parse(dataToParse);
                isAfterLoadEventCalled = true;
            })
            .fail(function() {
                filtersCollection.clearAll();
                filtersCollection.parse([]);
                if (!isAfterLoadEventCalled) {
                    callAfterLoadEvent();
                }
            });
    };

    function callAfterLoadEvent() {
        const keysDelimiter = '|';
        if(isImagesLoaded) {
            filters.length = 0;
            filtersCollection.callEvent("filtersLoaded", filters);
            app.callEvent("filtersLoaded", filters);
            const appliedFilters = AppliedFilters.getAppliedFilters();
            appliedFilters.forEach((filter) => {
                switch(filter.view) {
                    case 'toggle':
                    case 'checkbox':
                        filter?.value?.forEach((value) => {
                            $$(`${filter.key}${keysDelimiter}${value}`)?.toggle();
                        });
                    case 'checkbox':
                        $$(`${filter.key}-${aggregateCheckboxName}`)?.refresh();
                        break;
                    case 'toggle':
                        break;
                    case "combo":
                    case "radio":
                        $$(`${filter.key}`)?.setValue(filter.value);
                        break;
                    case "multiSlider":
                        $$(`${filter.key}${keysDelimiter}start`)?.setValue(filter.min);
                        $$(`${filter.key}${keysDelimiter}end`)?.setValue(filter.max);
                        break;
                    case "slider":
                        $$(`${filter.key}`)?.setValue(filter.value);
                        break;
                }
            });
        }
    };

    app.attachEvent("buildFiltersAfterImagesLoaded", function(flag) {
        isImagesLoaded = flag;
        callAfterLoadEvent();
    });

    filtersCollection.getFiltersCollection = function() {
        return filtersCollection;
    };

    filtersCollection.getSelectedFiltersData = function() {
        return filters;
    };

    filtersCollection.clearSelectedFiltersData = function() {
        filters.length = 0;
    };

    app.attachEvent("filtersChanged", function(data) {
        let i;
        let j;
        let foundIn = false;
        let index;
        let skipThisId = null;
        switch(data?.view) {
            case "radio":
            case "combo":
            case "slider":
            case "multiSlider":
                if(data.view === "combo") {
                    skipThisId = data.key;
                }
                for(i = 0; i < filters.length; i++) {
                    if(filters[i].key === data.key) {
                        filters.splice(i, 1);
                    }
                }
                if((data.hasOwnProperty("value") && data.value !== "All") || data.view === "multiSlider" || data.view === "slider") {
                    filters.push(data);
                }
                break;
            case "checkbox":
            case "toggle":
                if(data.remove) {
                    for(i = 0; i < filters.length; i++) {
                        if(filters[i].key === data.key) {
                            for(j = 0; j < filters[i].value.length; j++) {
                                if(filters[i].value[j] == data.value) {
                                    filters[i].value.splice(j, 1);
                                    if(filters[i].value.length == 0) {
                                        filters.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    for(i = 0; i < filters.length; i++) {
                        if(data.key === filters[i].key) {
                            foundIn = true;
                            index = i;
                            break;
                        }
                    }
                    if(foundIn) {
                        filters[index].value.push(data.value);
                    } else {
                        filters.push({
                            "view": data.view,
                            "key": data.key,
                            "value": [data.value],
                            "remove": data.remove,
                            "status": data.status
                        });
                    }
                }
                break;
        }
        debounce.execute(AppliedFilters.setAppliedFilters, AppliedFilters, [filters]);
        app.callEvent("images:FilterImagesView", [filters, skipThisId]);
        app.callEvent("caseForm: refreshCasesCount");
    });


    return filtersCollection;
});
