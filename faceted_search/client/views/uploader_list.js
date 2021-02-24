define([
    "app"
], function (app) {

    var loaderId = "loader_list_view", ui = {
        view: "list",
        template: '#title#',
        id: loaderId,
        data: [],
        autoheight: true
    };

    var getId = function() {
        return loaderId;
    };


    return {
        $ui: ui,
        getId: getId
    }
});