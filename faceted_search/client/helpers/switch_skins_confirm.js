define([
    "app",
    "constants"
    ], function(app, constants){

    return function (selectView, skin){

        var toggleSkinUrlUser = '/skin/user/';
        var toggleSkinUrlAdmin = '/skin/admin/';

        var callback = function(result){
            if(result){
                const LOCAL_API = constants.LOCAL_API;
                var url = app.config.userMode ? toggleSkinUrlUser : toggleSkinUrlAdmin
                webix.ajax(`${LOCAL_API}${url}${skin}`, function(){
                    window.location.reload();
                });
            } else {
                selectView.blockEvent(); //another one confirm window will pop up because of onchange event 
                selectView.setValue(app.config.currentSkin);
                selectView.unblockEvent();
            }
        }

        webix.confirm({
            title: 'Switch skin?',
            text: 'Filter settings will be lost. Switch skin?',
            ok: 'Yes',
            cancel: 'No',
            callback: callback
        });
    }
})