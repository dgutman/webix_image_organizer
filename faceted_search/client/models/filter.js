define([
    "app",
    "models/applied_filters"
], function(app, AppliedFilters) {
    const filtersCollection = new webix.DataCollection({});
    const filters = [];
    let isImagesLoaded = false;

    filtersCollection.loadFilters = function() {
        isImagesLoaded = false;
        webix.ajax().get(app.config.defaultAPIPath + "/facets/filters", {data: {}})
            .then(function(response) {
                const data = response.json();
                filters.length = 0;
                const dataToParse = data && Object.keys(data).length > 0 ? data : [];
                filtersCollection.clearAll();
                filtersCollection.parse(dataToParse);
                callAfterLoadEvent();
            })
            .fail(function() {
                filtersCollection.clearAll();
                filtersCollection.parse([]);
                callAfterLoadEvent();
            });
    };

    function callAfterLoadEvent() {
        if(isImagesLoaded) {
            filters.length = 0;
            filtersCollection.callEvent("filtersLoaded", filters);
            app.callEvent("filtersLoaded", filters);
            const appliedFilters = AppliedFilters.getAppliedFilters();
            appliedFilters.forEach((filter) => {
                filter?.value?.forEach((value) => {
                    app.callEvent("filtersChanged", [{
                        view: filter.view,
                        key: filter.key,
                        value,
                        remove: filter.remove,
                        status: filter.status
                    }]);
                });
            });
            // filtersCollection.callEvent("filtersLoaded", []);
            // app.callEvent("filtersLoaded", []);
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
        AppliedFilters.setAppliedFilters(filters);
        app.callEvent("images:FilterImagesView", [filters, skipThisId]);
    });


    return filtersCollection;
});
