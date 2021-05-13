define([
    "app",
    "models/filter",
    "models/images",
    "helpers/filters",
    "libs/lodash/lodash.min",
    "helpers/authentication"
], function (app, Filter, Images, filterHelper, _, auth) {
    var scrollViewId = "scroll_view",filterFormId = "filter_form",
        ui = {
            view: "scrollview",
            id: scrollViewId,
            scroll: "y",
            body: {
                rows: [
                    {
                        id: filterFormId,
                        view: "form",
                        elements: []
                    }
                ]
            },
            height: NaN
        };

    Filter.attachEvent("filtersLoaded", function () {
        var i, tmpData, elements,
            images = Images.getImages(), arr = [], key;
        images = images.data.pull;
        for(key in images) {
            if(images.hasOwnProperty(key)) {
                arr.push(images[key].facets);
            }
        }
        // clearForm();
        tmpData = getDataWithCounts(arr);
        elements = filterHelper.transformToFormFormat(tmpData);
        for(i = 0; i < elements.length; i++) {
            $$(filterFormId).addView(elements[i]);
        }
        $$(scrollViewId).hideProgress();
    });

    var clearForm = function () {
        var t, i;
        t = $$(filterFormId).getChildViews();
        if(t) {
            for(i = 0; i < t.length; i++) {
                $$(filterFormId).removeView(t[i]);
            }
        }
    };

    var getDataWithCounts = function (data) {
        var filters = Filter.getFilters().data.pull,
            keys = Object.keys(filters), i, item, j, valuesCount;
        for(i = 0; i < keys.length; i++) {
            for(j = 0; j < filters[keys[i]].data.length; j++) {
                item = filters[keys[i]].data[j];
                valuesCount = getValuesCountById(data, item.id, item.type);
                filters[keys[i]].data[j].count = valuesCount;
            }
        }
        return filters;
    };



    app.attachEvent("reloadFormAfterCalculating", function (data, skipId) {
        var tmp = getDataWithCounts(data);
        filterHelper.updateForm(tmp, skipId);
    });

    app.attachEvent("updateForm", function(id, prop, val) {
        $$(id).define(prop, val);
        $$(id).refresh();
    });

    var getValuesCountById = function (data, key, type) {
        let filtersData = Filter.getSelectedFiltersData();
        const currentFilter = filtersData.find(filter => filter.key === key);
        if ((type === "toggle" || type === "checkbox") && currentFilter) {
            filtersData = filtersData.filter(filter => filter.key != key);

            data = Images.data
                .serialize(true)
                .filter(image => Images.filterSingleImage(image, filtersData))
                .map(image => image.facets)
        }       
        var t = _.map(data, key);
        t = _.groupBy(t);
        return t;
    };


    return {
        $ui: ui,
        $oninit: function () {
            webix.extend($$(scrollViewId), webix.ProgressBar);
            $$(scrollViewId).showProgress({
                type: "icon"
            });
            Filter.loadFilters();
        }
    }
});