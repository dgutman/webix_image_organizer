define([
        "app",
        "models/filter",
        "helpers/authentication",
    ], function(app, filtersCollection, auth) {

    function getScrollState() {
        const crumbsTemplateNode = $$("crumbsTemplate").getNode();
        const cont = crumbsTemplateNode.querySelector(".crumbs-scroll-cont");
        return {
            y: cont ? cont.scrollTop : 0,
            x: cont ? cont.scrollLeft : 0
        };
    }

    function setCrumbs(data) {
        const crumbsTemplate = $$("crumbsTemplate");
        const scrollY = getScrollState().y;

        const renderEvent = crumbsTemplate.attachEvent("onAfterRender", () => {
            const cont = crumbsTemplate.getNode().querySelector(".crumbs-scroll-cont");
            cont.scroll(0, scrollY);
            crumbsTemplate.detachEvent(renderEvent)
        });

        crumbsTemplate.setValues(data);
    }

    var keysDelimiter = '|';

    // will contain breadcrumbs data
    var crumbsArr = {};

    var filtersConfig;

    const crumbsTemplate = {
        view: "template",
        id: "crumbsTemplate",
        css: "crumbs-template",
        hidden: !auth.isLoggedIn(),
        height: 100,
        template: (data) => {
            let HTMLstring = "<div class='crumbs-scroll-cont'>";
            const crumbs = Object.keys(data) || [];

            if (crumbs.length > 1) {
                HTMLstring += `<div class="webix_view crumb-button clear-all-crumbs"><span class="crumb-text">Clear All</span></div>`
            }

            crumbs.forEach((crumbKey) => {
                HTMLstring += `<div class="webix_view crumb-button"><span class="crumb-text">${data[crumbKey].name}</span><span id='${crumbKey}' class='delete-crumb webix_icon wxi-close'></span></div>`
            });
            HTMLstring += "</div>";
            return HTMLstring;
        },
        onClick: {
            "delete-crumb": function (e, id, element) {
                crumbClickHandler(crumbsArr[element.id], element.id);
            },
            "clear-all-crumbs": function (e, id, element) {
                const entryArr = Object.entries(crumbsArr);
                entryArr.forEach(([id, data]) => {
                    crumbClickHandler(data, id, true);
                });
                filtersCollection.clearSelectedFiltersData();
                crumbsArr = {};
                setCrumbs(crumbsArr);
                app.callEvent("images:FilterImagesView", []);
            }
        }
    }

    app.attachEvent("filtersChanged", function(data){
        filtersChangedHandler(data);
    });

    app.attachEvent("filtersLoaded", function(){
        crumbsArr = {};
        filtersConfig = filtersCollection.getFilters().serialize();
    });

    var getConfigForFilter = function(key){
        var config;
        for(var groupIndex = 0; groupIndex<filtersConfig.length; groupIndex++){
            for(var filterIndex = 0; filterIndex<filtersConfig[groupIndex].data.length; filterIndex++){
                if(filtersConfig[groupIndex].data[filterIndex].id === key){
                    config = filtersConfig[groupIndex].data[filterIndex];
                }
            }
        }
        return config;
    }

    // remove crumb
    var crumbClickHandler = function(data, key, blockEvent) {
        switch(data.view){
            case 'toggle':
            case 'checkbox':
                var ids = [];
                for(var i = 0; i<crumbsArr[key].value.length; i++){
                    ids.push(key + keysDelimiter + crumbsArr[key].value[i]);
                }
                for(var i = 0; i<ids.length; i++){
                    if (blockEvent) $$(ids[i]).blockEvent();
                    $$(ids[i]).toggle();
                    $$(ids[i]).unblockEvent();
                }
                break;
            case 'combo':
            case 'radio':
                if (blockEvent) $$(key).blockEvent();
                $$(key).setValue('All');
                $$(key).unblockEvent();
                break;
            case 'multiSlider':
                if (blockEvent) $$(`${key}${keysDelimiter}start`).blockEvent();
                if (blockEvent) $$(`${key}${keysDelimiter}end`).blockEvent();
                $$(key+ keysDelimiter + 'start').setValue(crumbsArr[key].min);
                $$(key+ keysDelimiter + 'end').setValue(crumbsArr[key].max);
                $$(`${key}${keysDelimiter}start`).unblockEvent();
                $$(`${key}${keysDelimiter}end`).unblockEvent();
                break;
            case 'slider':
                if (blockEvent) $$(key).blockEvent();
                $$(key).setValue(0);
                $$(key).unblockEvent();
        }
        delete crumbsArr[key];
        setCrumbs(crumbsArr);
    }

    var parseIntArray = function(data) {
        var parsed = [];
        for(var i = 0; i<data.length; i++){
            parsed.push(parseInt(data[i]));
        }
        return parsed;
    }

    var filtersChangedHandler = function(data) {
        var key = data.key;
        var show = false;
        var parsedKey = key.split(keysDelimiter);
        var name = parsedKey[parsedKey.length-1];
        var crumbData = crumbsArr[key];
        switch(data.view){
            case 'toggle':
            case 'checkbox':
                if(data.remove){
                    var valueIndex = crumbsArr[key].value.indexOf(data.value);
                    if(valueIndex >= 0) crumbsArr[key].value.splice(valueIndex, 1);
                    if(crumbsArr[key].value.length !== 0) {
                        crumbsArr[key].name = `${name}: selected ${crumbsArr[key].value.length} items`;
                        show = true;
                    }
                } else {
                    if(!crumbData){
                        crumbsArr[key] = {
                            value: [data.value],
                            view: data.view,
                            name: `${name}: selected 1 item`
                        }
                        show = true;
                    } else {
                        crumbData.value.push(data.value);
                        crumbData.name = `${name}: selected ${crumbsArr[key].value.length} items`;
                        show = true;
                    }
                }
                break;

            case 'combo':
            case 'radio':
                if(!crumbData){
                    crumbsArr[key] = {
                        value: data.value,
                        view: data.view,
                        name: `${name}: ${data.value}`
                    }
                    show = true;
                } else if(data.value !== 'All'){
                    crumbsArr[key].name = `${name}: ${data.value}`
                    show = true;
                }
                break;

            case 'multiSlider':
                if(!crumbData){
                    var config = getConfigForFilter(key);
                    var options = parseIntArray(config.options);
                    var min = Math.min.apply(Math, options);
                    var max = Math.max.apply(Math, options);
                    crumbsArr[key] = {
                        min: min,
                        max: max,
                        value: {min: data.min, max: data.max},
                        view: data.view,
                        name: `${name} : from ${data.min} to ${data.max}`
                    }
                    show = true;
                } else if(data.min !== crumbData.min || data.max !== crumbData.max) {
                    crumbsArr[key].name = `${name} : from ${data.min} to ${data.max}`
                    show = true;
                }
                break;

            case 'slider':
                if(!crumbData){
                    var config = getConfigForFilter(key);
                    crumbsArr[key] = {
                        value: data.value,
                        view: data.view,
                        minValue: config.options[0] - 1,
                        name: `${name}: ${data.value}`
                    }
                    show = true;
                } else {
                    crumbsArr[key].name = `${name}: ${data.value}`
                    show = true;
                }
        }

        if(!show){
            delete crumbsArr[key];
        }
        setCrumbs(crumbsArr);
    }

    return {
        $ui: crumbsTemplate
    }
});