define(["app", "views/edit_form", "helpers/switch_mode_confirm", "helpers/authentication"], function (app, editFormView, switchModeConfirm, auth) {
    var ui = {
        view: "toolbar",
        width: 250,
        borderless: true,
        cols: [
            {
                view: "radio",
                name: "switchViews",
                hidden: !auth.isAdmin(),
                value: (window.location.hash.indexOf("user_mode") > -1 ? "user_mode" : "admin_mode"),
                css: {"color": "white"},
                options: [
                    {id: "user_mode", value: "User Mode"},
                    {id: "admin_mode", value: "Admin Mode"}
                ],
                on: {
                    onChange: function (id, oldId) {
                        if (window.location.hash.indexOf("admin_mode") > -1 && oldId === "admin_mode" && !editFormView.areFiltersNotChanged()) {
                            switchModeConfirm((result) => {
                                if (result) {
                                    app.show("/top/" + id);
                                }
                                else {
                                    this.blockEvent();
                                    this.setValue(oldId);
                                    this.unblockEvent();
                                }
                            })
                        }
                        else {
                            app.show("/top/" + id);
                        }
                    }
                }
            }
        ]
    };
    return {
        $ui: ui
    };

});
