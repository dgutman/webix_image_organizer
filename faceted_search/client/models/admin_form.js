define([
    "app",
    "helpers/admin_form",
    "constants"
], function(app, adminFormHelper, constants) {
    const getItemTypes = function() {
        return [
            {"id": "checkbox", "value": "Checkbox"},
            {"id": "combo_box", "value": "Combo Box"},
            {"id": "radio", "value": "Radio"},
            {"id": "slider", "value": "Slider"},
            {"id": "range_slider", "value": "Range Slider"},
            {"id": "toggle", "value": "Toggle Button"}
        ];
    };
    const isNumeric = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    const getFacet = function(facet) {
        if(totalFormData.hasOwnProperty(facet)) {
            return totalFormData[facet];
        }
        return false;
    };
    let addedItems = [];
    let totalFormData = [];
    let itemsLabels = [];
    const url = `${constants.LOCAL_API}/facets/filters`;

    const addItem = function(facet, type) {
        const data = getFacet(facet); let i; let t = {
            facet: {
                id: facet,
                value: facet.replace(/\|/g, ' \\ ')
            },
            type: type,
            interface: data.values,
            status: "added"
        };
        addedItems.push(t);
        for (i = 0; i < itemsLabels.length; i++) {
            if (itemsLabels[i].id === facet) {
                itemsLabels.splice(i, 1);
                break;
            }
        }
        return adminFormHelper.transformToFormFormat(t, type, getItemTypes(), "upload");
    };


    const removeItem = function(id, facet) {
        for (let i = 0; i < addedItems.length; i++) {
            if (addedItems[i].facet.id === facet.id) {
                addedItems.splice(i, 1);
            }
        }
        itemsLabels.splice(0, 0, {id: facet.id, value: facet.value});
        app.callEvent("facetsForm:doAfterItemRemoved", [id]);
        app.callEvent("facetsForm:reloadOptions", [true]);
    };

    const saveItems = function() {
        const filters = [];
        app.callEvent("adminMode:doProgress", ["upload"]);

        addedItems.forEach(function(item) {
            const result = {};
            result.id = item.facet.id;
            const path = result.id.split('|');
            result.name = path[path.length - 1];
            result.parent = (path.length > 1) ? path[path.length - 2] : "Main";
            result.type = item.type;
            result.options = item.interface;
            result.status = "added";

            filters.push(result);
        });
        webix.ajax().post(url, {data: filters}, function() {
            addedItems = [];
            totalFormData = [];
            itemsLabels = [];
            app.callEvent("facetsForm:clearAfterSave", []);
            app.callEvent("uploaderList:clearAfterSave", []);
            app.callEvent("adminMode:onLoaded", ["upload", true]);
        });
    };

    app.attachEvent("adminForm:removeItem", removeItem);

    const setItemsData = function(data) {
        itemsLabels = Object.keys(data);
        totalFormData = data;
        itemsLabels.forEach(function(item, index, array) {
            array[index] = {id: item, value: item.replace(/\|/g, ' \\ ')};
        });
    };

    const getItemsData = function() {
        return totalFormData;
    };

    const checkAbilityToAdd = function(facet, type) {
        const data = getFacet(facet);
        let i;
        let isNumber = false;
        let add = false;
        if (data) {
            if (type === "slider" || type === "range_slider") {
                isNumber = true;
            } else {
                add = true;
            }
            if (isNumber) {
                for (i = 0; i < data.values.length; i++) {
                    if (!isNumeric(data.values[i])) {
                        add = false;
                        break;
                    }
                    add = true;
                }
            }
        }
        return add;
    };


    const getLabels = function() {
        return itemsLabels;
    };


    const getCountOfAddedItems = function() {
        return addedItems.length;
    };

    return {
        addItem: addItem,
        removeItem: removeItem,
        saveItems: saveItems,
        getItemsData: getItemsData,
        setItemsData: setItemsData,
        getLabels: getLabels,
        getItemTypes: getItemTypes,
        checkAbilityToAdd: checkAbilityToAdd,
        getCountOfAddedItems: getCountOfAddedItems
    };
});
