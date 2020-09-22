define([
    "app",
    "views/toolbar",
    "views/edit_form",
    "views/uploader",
    "views/uploader_list",
    "views/facets_form",
    "views/host_drop_down",
    "views/user_panel",
    "views/folder_tree",
    "helpers/authentication"
], function (app, toolbar, editFormView, uploaderView, uploaderListView, facetsFormView, hostDropDown, userPanel, folderTree, auth) {
    const editViewId = "editView";
    const uploaderViewId = "uploaderView";
    const tabbarId = "tabbar";
    const ui = {
        rows: [
            {
                view: "toolbar",
                borderless: true,
                cols: [
                    {},
                    hostDropDown,
                    {width: 50},
                    toolbar,
                    {width: 50},
                    userPanel
                ]
            },
            {height: 10},
            {
                view: "accordion",
                id: editViewId,
                cols: [
                    {
                        header: "Folders",
                        collapsed: true,
                        body: folderTree
                    },
                    editFormView
                ]
            }
        ]
    };

    app.attachEvent("adminMode:doProgress", function (type) {
        if(type === "edit") {
            webix.extend($$(editViewId), webix.ProgressBar);
            $$(editViewId).showProgress({
                type: "icon"
            });
        }
    });



    app.attachEvent("adminMode:onLoaded", function (type, showMsg) {
        if(type === "edit") {
            $$(editViewId).hideProgress();
        }
        if(showMsg) {
            webix.message({
                type: "message",
                text: "Filters were saved"
            });
        }
    });

    return {
        $ui: ui,
        $oninit: function () {
            if (auth.isLoggedIn()) {
                app.callEvent("editForm:loadDataForFilters", []);
            }
            else {
                app.show("/top/user_mode");
            }
        },
        $onurlchange: (_arg1, _arg2, scope) => {
            const switchViews = scope.root.queryView({name: "switchViews"});
            switchViews.setValue(window.location.hash.indexOf("user_mode") > -1 ? "user_mode" : "admin_mode");
        }
    };
});