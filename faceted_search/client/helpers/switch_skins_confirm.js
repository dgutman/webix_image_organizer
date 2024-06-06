define([
    "app",
    "constants"
    ], function(app, constants) {
    return function(skin) {
        const toggleSkinUrlUser = '/skin/user/';
        const toggleSkinUrlAdmin = '/skin/admin/';

        const callback = function(result) {
            if(result) {
                const LOCAL_API = constants.LOCAL_API;
                const url = app.config.userMode ? toggleSkinUrlUser : toggleSkinUrlAdmin;
                webix.ajax(`${LOCAL_API}${url}${skin}`, function() {
                    window.location.reload();
                });
            } 
        };

        webix.confirm({
            title: 'Switch skin?',
            text: '',
            ok: 'Yes',
            cancel: 'No',
            callback: callback
        });
    };
});
