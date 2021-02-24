define([
    "libs/webix-mvc-core/core",
    "libs/webix-mvc-core/plugins/menu",
    "constants"
], function (core, menu, constants) {

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
        currentSkin: window.data.skin
    });

    delete window.userMode;

    app.use(menu);

    
    return app;
});