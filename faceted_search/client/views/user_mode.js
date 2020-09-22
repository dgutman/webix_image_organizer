define([
    "views/images_dataview",
    "views/filter_form",
    "views/filter_button",
    "helpers/authentication",
], function (imagesView, filterFormView, filterButtonView, auth) {
    const filterCellId = "filter_cell";
    const dataViewCellId = "dataview_cell";

    const filterFormLabel = {
        type: "header",
        template: "<p class='filters-header-p'>Filters</p>"
    }

    const ui = {
        cols: [
            {
                minWidth: 200, id: filterCellId, maxWidth: 400,
                hidden: !auth.isLoggedIn(),
                rows: [
                    filterFormLabel,
                    filterFormView,
                    filterButtonView
                ]
            },
            {body: imagesView, minWidth: 500, id: dataViewCellId}
        ]
    };

    return {
        $ui: ui,
        $onurlchange: (_arg1, _arg2, scope) => {
            const switchViews = scope.root.queryView({name: "switchViews"});
            switchViews.setValue(window.location.hash.indexOf("user_mode") > -1 ? "user_mode" : "admin_mode");
        }
    }
});