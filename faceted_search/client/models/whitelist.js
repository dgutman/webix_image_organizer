define([
    "app",
    "constants"
], function(app, constants) {
    const whitelistURL = `${constants.LOCAL_API}/facets/whitelist`;

    let props = [];

    app.attachEvent("whitelist:loadDataForWhitelist", function() {
        loadData(whitelistURL);
    });

    const loadData = (url) => {
        app.callEvent("editForm:doProgressOnWhitelist");
        webix.ajax().get(url, {})
            .then(function(response) {
                const data = response.json();
                if(data) {
                    setProps(data);
                }
                app.callEvent("editForm:onWhitelistLoaded");
                app.callEvent("editForm:whitelistDataLoaded");
            })
            .catch((reason) => {
                console.error(reason);
                app.callEvent("editForm:onWhitelistLoaded");
            });
    };

    const setProps = function(data) {
        props = data;
    };

    const saveWhitelist = function(whitelist) {
        deleteDollarProperties(whitelist);
        webix.ajax().post(whitelistURL, {data: whitelist});
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
