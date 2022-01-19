define([
    "libs/webix-mvc-core/core",
    "libs/webix-mvc-core/plugins/menu",
    "libs/openseadragon/openseadragon.min.js",
    "constants"
], function (core, menu, osd, constants) {
    //configuration
    var app = core.create({
        id: "app",
        name: "",
        version: "0.1.0",
        debug: false,
        start: "/top/user_mode",
        defaultAPIPath: `${constants.LOCAL_API}`,
        userMode: window.data.userMode,
        skinsList: window.data.skinsList,
        currentSkin: window.data.skin,
        hostsList: window.data.hostsList,
        host: window.data.host
    });

    delete window.userMode;

    app.use(menu);

    
    return app;
});