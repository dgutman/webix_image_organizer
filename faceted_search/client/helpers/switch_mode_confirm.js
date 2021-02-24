define([
    "app"
    ], function(app){

    return function (callback){
        webix.confirm({
            text: 'All the changes will be lost. Do you want to proceed?',
            ok: 'Yes',
            cancel: 'No',
            callback: callback
        });
    }
})