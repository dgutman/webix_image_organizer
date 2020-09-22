define([
    "app"
],function(app) {
    var filtersCollection = new webix.DataCollection({}),
        filters = [],
        isImagesLoaded = false;

    filtersCollection.loadFilters = function() {
        isImagesLoaded = false;
        webix.ajax().get(app.config.defaultAPIPath + "/facets/filters", {data: {}})
            .then(function(response) {
                var data = response.json();
                filters = [];
                data = data && Object.keys(data).length > 0 ? data : [];
                filtersCollection.clearAll();
                filtersCollection.parse(data);
                callAfterLoadEvent();
            })
            .fail(function() {
                filtersCollection.clearAll();
                filtersCollection.parse([]);
                callAfterLoadEvent();
            });
    };

    var callAfterLoadEvent = function () {
        if(isImagesLoaded){
            filtersCollection.callEvent("filtersLoaded", []);
            app.callEvent("filtersLoaded", []);
        }
    };

    app.attachEvent("buildFiltersAfterImagesLoaded", function(flag) {
        isImagesLoaded = flag;
        callAfterLoadEvent();
    });

    filtersCollection.getFilters = function() {
        return filtersCollection;
    };

    filtersCollection.getSelectedFiltersData = function() {
        return filters;
    };

    app.attachEvent("filtersChanged", function(data) {
        var i, j, foundIn = false, index, skipThisId = null;
        switch(data.view) {
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
                        })
                    }
                }
                break;
        }
        app.callEvent("images:FilterImagesView", [filters, skipThisId]);
    });


    return filtersCollection;
});