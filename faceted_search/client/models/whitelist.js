define([
    "app",
    "constants"
], function(app, constants) {
    const URL = `${constants.LOCAL_API}/facets/whitelist`;

    let props = [];

    app.attachEvent("editForm:loadDataForWhitelist", function() {
       webix.ajax().get(URL, {})
           .then(function(response) {
                const data = response.json();
                setProps(data);
                app.callEvent("editForm:whitelistDataLoaded");
           })
           .catch((reason) => {
               console.error(reason);
           });
    });

    const setProps = function(data) {
        props = data;
    };

    const saveWhitelist = function(whitelist) {
        deleteDollarProperties(whitelist);
        webix.ajax().post(URL, {data: whitelist});
    };

    const deleteDollarProperties = function(whitelist) {
        whitelist.forEach((element) => {
            // eslint-disable-next-line max-len
            let excludedElements = Object.getOwnPropertyNames(element).filter((exception) => exception.charAt(0) === '$');
            excludedElements.forEach((excludedElement) => {
                delete(element[excludedElement]);
            });
            if(element.data) {
                element.data = deleteDollarProperties(element.data);
            } else{
                element.data = [];
            }
        });
        return whitelist;
    };

    const getProps = function() {
        return props;
    };

    return {
        getProps: getProps,
        saveWhitelist: saveWhitelist
    };
});
