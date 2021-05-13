define([
    "app",
    "views/edit_form",
    "helpers/switch_mode_confirm",
    "helpers/authentication",
    "constants"
], function (app, editFormView, switchModeConfirm, auth, constants) {
    const ui = {
        view: "toolbar",
        width: 150,
        borderless: true,
        cols: [
            {
                view: "switch",
                name: "switchViews",
                hidden: !auth.isAdmin(),
                label: "Admin/User",
                value: (window.location.hash.indexOf("user_mode") > -1 ? constants.USER_MODE : constants.ADMIN_MODE),
                on: {
                    onChange: function (id, oldId) {
                        if (window.location.hash.indexOf("admin_mode") > -1 && oldId === constants.ADMIN_MODE && !editFormView.areFiltersNotChanged()) {
                            switchModeConfirm((result) => {
                                if (result) {
                                    if(id === constants.USER_MODE){
                                        app.show("/top/user_mode");
                                    }
                                    if(id === constants.ADMIN_MODE){
                                        app.show("/top/admin_mode");
                                    }
                                }
                                else {
                                    this.blockEvent();
                                    this.setValue(0);
                                    this.unblockEvent();
                                }
                            })
                        }
                        else {
                            if(id === constants.USER_MODE){
                                app.show("/top/user_mode");
                            }
                            if(id === constants.ADMIN_MODE){
                                app.show("/top/admin_mode");
                            }
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
