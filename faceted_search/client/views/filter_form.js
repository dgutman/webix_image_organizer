define([
    "app",
    "models/filter",
    "models/images",
    "helpers/filters",
    "libs/lodash/lodash.min",
    "helpers/authentication",
    "constants"
], function(
    app, 
    Filter, 
    Images, 
    filterHelper, 
    lodash, 
    auth, 
    constants
) {
    const scrollViewId = "scroll_view"; 
    const filterFormId = "filter_form";
    const ui = {
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

    const getValuesCountById = function(data, key, type, options) {
        let filtersData = Filter.getSelectedFiltersData();
        const currentFilter = filtersData.find((filter) => filter.key === key);
        if (key === constants.CHANNEL_MAP_FILTER) {
            filtersData = filtersData.filter((filter) => filter.key != key);

            data = Images.data
                .serialize(true)
                .filter((image) => Images.filterSingleImage(image, filtersData));

            const counts = options.reduce((acc, val) => {
                const count = data
                    .filter((image) => lodash
                        .get(image.data, `${constants.CHANNEL_MAP_FIELD_PATH}.${val}`) !== undefined);
                acc[val] = count;
                return acc;
            }, {});

            return counts;
        } else if ((type === "toggle" || type === "checkbox") && currentFilter) {
            filtersData = filtersData.filter((filter) => filter.key != key);

            data = Images.data
                .serialize(true)
                .filter((image) => Images.filterSingleImage(image, filtersData))
                .map((image) => image.facets);
        } 

        let t = lodash.map(data, key);
        t = lodash.groupBy(t);
        return t;
    };

    const getDataWithCounts = function(data) {
        const filters = Filter.getFilters().data.pull;
        const keys = Object.keys(filters);
        for(let i = 0; i < keys.length; i++) {
            for(let j = 0; j < filters[keys[i]].data.length; j++) {
                const item = filters[keys[i]].data[j];
                const valuesCount = getValuesCountById(data, item.id, item.type, item.options);
                filters[keys[i]].data[j].count = valuesCount;
            }
        }
        return filters;
    };

    Filter.attachEvent("filtersLoaded", function() {
        let images = Images.getImages(); const arr = []; let key;
        images = images.data.pull;
        for(key in images) {
            if(images.hasOwnProperty(key)) {
                arr.push(images[key].facets);
            }
        }
        const tmpData = getDataWithCounts(arr);
        const elements = filterHelper.transformToFormFormat(tmpData);
        for(let i = 0; i < elements.length; i++) {
            $$(filterFormId).addView(elements[i]);
        }
        $$(scrollViewId).hideProgress();
    });

    app.attachEvent("reloadFormAfterCalculating", function(data, skipId) {
        const tmp = getDataWithCounts(data);
        filterHelper.updateForm(tmp, skipId);
    });

    app.attachEvent("updateForm", function(id, prop, val) {
        $$(id).define(prop, val);
        $$(id).refresh();
    });


    return {
        $ui: ui,
        $oninit: function() {
            webix.extend($$(scrollViewId), webix.ProgressBar);
            $$(scrollViewId).showProgress({
                type: "icon"
            });
            Filter.loadFilters();
        }
    };
});
