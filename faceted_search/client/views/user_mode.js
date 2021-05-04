define([
    "views/images_dataview",
    "constants"
], function (imagesView, constants) {
    const dataViewCellId = "dataview_cell";
    const ui = {
        cols: [
            {body: imagesView, minWidth: 500, id: dataViewCellId}
        ]
    };

    return {
        $ui: ui,
        $onurlchange: (_arg1, _arg2, scope) => {
            const switchViews = scope.root.queryView({name: "switchViews"});
            switchViews.setValue(window.location.hash.indexOf("user_mode") > -1 ? constants.USER_MODE : constants.ADMIN_MODE);
        }
    }
});