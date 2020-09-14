define([
    "app"
    ], function(app){

    return function (callback){
        webix.confirm({
            text: 'All changes will be lost. Are you sure you want to change the mode?',
            ok: 'Yes',
            cancel: 'No',
            callback: callback
        });
    }
})