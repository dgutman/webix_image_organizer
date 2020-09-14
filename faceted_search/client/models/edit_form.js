define([
    "app",
    "helpers/admin_form",
    "constants"
], function(app, adminFormHelper, constants) {
    var addedItems = [],
        totalFormData = {},
        itemsLabels = [],
        initialItemsLenght = 0,
        saveURL = `${constants.LOCAL_API}/facets/filters`,
        getURL = `${constants.LOCAL_API}/facets/get-filters-with-images`;

    var addItem = function(facet, type) {
        var data = getFacet(facet), i, wasAdded = false, t = {};
        for(i = 0; i < addedItems.length; i++) {
            if(addedItems[i].facet.id === facet) {
                wasAdded = true;
                t = {
                    facet: {
                        id: facet,
                        value: facet.replace(/\|/g, ' \\ ')
                    },
                    type: type,
                    interface: data.values,
                    status: "modified"
                };
                addedItems[i] = t;
                break;
            }
        }
        if(!wasAdded) {
            t = {
                facet: {
                    id: facet,
                    value: facet.replace(/\|/g, ' \\ ')
                },
                type: type,
                interface: data.values,
                status: "added"
            };
            addedItems.push(t);
        }
        for(i = 0; i < itemsLabels.length; i++) {
            if(itemsLabels[i].id === facet) {
                itemsLabels.splice(i, 1);
                break;
            }
        }
        return adminFormHelper.transformToFormFormat(t, type, getItemTypes(), "edit");
    };

    var getFacet = function(facet) {
        if(totalFormData.hasOwnProperty(facet)) {
            return totalFormData[facet];
        }
        return false;
    };

    var removeItem = function(id, facet) {
        var i = 0;
        for(i = 0; i < addedItems.length; i++) {
            if(addedItems[i].facet.id === facet.id) {
                if(addedItems[i].status === "added") {
                    addedItems.splice(i, 1);
                } else {
                    addedItems[i].status = "removed";
                }
                break;
            }
        }
        itemsLabels.splice(0, 0, {id: facet.id, value: facet.value});
        app.callEvent("editForm:doAfterItemRemoved", [id]);
        app.callEvent("editForm:reloadOptions", [true]);
    };

    var saveItems = function() {
        var filters = [];
        app.callEvent("adminMode:doProgress", ["edit"]);

        addedItems.forEach(function(item) {
            var result = {}, path;
            result.id = item.facet.id;
            path = result.id.split('|');
            result.name = path[path.length - 1];
            result.parent = (path.length > 1) ? path[path.length - 2] : "Main";
            result.type = item.type;
            result.options = item.interface;
            result.status = item.status;

            filters.push(result);
        });
        webix.ajax().post(saveURL, {data: filters}, function() {
            var i = 0;
            for(i = 0; i < addedItems.length; i++) {
                if(addedItems[i].status === "removed") {
                    addedItems.splice(i, 1);
                } else {
                    addedItems[i].status = "already_added";
                }
            }
            initialItemsLenght = addedItems.length;
            app.callEvent("adminMode:onLoaded", ["edit", true]);
        });
    };

    app.attachEvent("editForm:removeItem", removeItem);

    var setItemsData = function(data) {
        itemsLabels = Object.keys(data);
        totalFormData = data;
        itemsLabels.forEach(function (item, index, array) {
            array[index] = {id: item, value: item.replace(/\|/g, ' \\ ')};
        });
    };

    var getItemsData = function() {
        return totalFormData;
    };

    var checkAbilityToAdd = function(facet, type) {
        var data = getFacet(facet), i, isNumber = false, add = false;
        if(data) {
            if(type === "slider" || type === "range_slider") {
                isNumber = true;
            } else {
                add = true;
            }
            if(isNumber) {
                for(i = 0; i < data.values.length; i++) {
                    if(!isNumeric(data.values[i])) {
                        add = false;
                        break;
                    }
                    add = true;
                }
            }
        }
        return add;
    };

    var isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };


    var getLabels = function() {
        return itemsLabels;
    };

    var getItemTypes = function() {
        return [
            {"id": "checkbox", "value": "Checkbox"},
            {"id": "combo_box", "value": "Combo Box"},
            {"id": "radio", "value": "Radio"},
            {"id": "slider", "value": "Slider"},
            {"id": "range_slider", "value": "Range Slider"},
            {"id": "toggle", "value": "Toggle Button"}
        ];
    };

    var getCountOfAddedItems = function() {
        return addedItems.length;
    };

    app.attachEvent("editForm:loadDataForFilters", function() {
        app.callEvent("adminMode:doProgress", ["edit"]);
       webix.ajax().get(getURL, {})
           .then(function(response) {
               addedItems = [];
               totalFormData = {};
               itemsLabels = [];
               var data = response.json(), key, t, q = [], view;
               setItemsData(data.facets);
               for(key in data.filters) {
                   if(data.filters.hasOwnProperty(key)) {
                       t = {
                           facet: {
                               id: key,
                               value: key.replace(/\|/g, ' \\ ')
                           },
                           type: data.filters[key].type,
                           interface: data.filters[key].values,
                           status: "already_added"
                       };
                       addedItems.push(t);
                       totalFormData[key] = JSON.parse(JSON.stringify(data.filters[key]));
                       view = adminFormHelper.transformToFormFormat(t, data.filters[key].type, getItemTypes(), "edit");
                       q.push(view);
                   }
               }
               initialItemsLenght = addedItems.length;
               app.callEvent("editForm:dataLoaded", [q])
               app.callEvent("adminMode:onLoaded", ["edit", false]);
           });
    });

    var updateItemType = function(facet, type) {
        var data = getFacet(facet), i, wasAdded = false, t = {};
        for(i = 0; i < addedItems.length; i++) {
            if(addedItems[i].facet.id === facet) {
                wasAdded = true;
                addedItems[i].type = type;
                break;
            }
        }
        if(!wasAdded) {
            t = {
                facet: {
                    id: facet,
                    value: facet.replace(/\|/g, ' \\ ')
                },
                type: type,
                interface: data.values,
                status: "added"
            };
            addedItems.push(t);
        }
        for(i = 0; i < itemsLabels.length; i++) {
            if(itemsLabels[i].id === facet) {
                itemsLabels.splice(i, 1);
                break;
            }
        }
        return adminFormHelper.transformToFormFormat(t, type, getItemTypes(), "edit");
    };

    var areFiltersNotChanged = function() {
        if (initialItemsLenght === addedItems.length) {
            return addedItems.every((item) => {
                return item.status === "already_added";
            });
        }
        return false;
    }

    return {
        addItem: addItem,
        removeItem: removeItem,
        saveItems: saveItems,
        getItemsData: getItemsData,
        setItemsData: setItemsData,
        getLabels: getLabels,
        getItemTypes: getItemTypes,
        checkAbilityToAdd: checkAbilityToAdd,
        getCountOfAddedItems: getCountOfAddedItems,
        updateItemType: updateItemType,
        areFiltersNotChanged
    };
});