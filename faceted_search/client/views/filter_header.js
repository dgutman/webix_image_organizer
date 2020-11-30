define([
    "models/images",
    "views/filter_breadcrumbs",
    "helpers/switch_skins_confirm",
    "views/toolbar",
    "views/user_panel",
    "app",
    "helpers/authentication",
    "views/host_drop_down"
], function (Images, breadcrumbs, switchSkinConfirm, modeToolbar, userPanel, app, auth, hostDropDown) {

    window.img = Images;
    var toolbarId = "filter_toolbar",
        toggleBtnId = "toggle_btn_id",
        toggleSkinId = 'toggle_skin_id',
        toggleSkinSelect = 300,
        toggleSkinSelectLabel = 100,
        toggleSkinButton = {
            width:toggleSkinSelect,
            labelWidth: toggleSkinSelectLabel,
            id: toggleSkinId,
            label:"Switch Skin",
            css: 'toggle-skin-button',
            view: 'richselect',
            width: 250,
	    	labelWidth: 100,
            options: app.config.skinsList,
            value: app.config.currentSkin,
            on: {
                onChange: function(skin){
                    switchSkinConfirm(this, skin);
                }
            }
        },
        ui = {
            view: "toolbar",
            id: toolbarId,
            rows: [
                {
                    id: "a1",
                    rows: [
                        {
                            responsive:"a1",
                            cols: [
                                {
                                    view: "label",
                                    height: 30,
                                    width: 200,
                                    template: "<p class='images-header-p'>Filter results</p>"
                                },
                                {height: 5},
                                {
                                    view: "switch",
                                    css: "images-header-toogle",
                                    label: "Rows/columns",
                                    value: 0,
                                    id: toggleBtnId,
                                    width: 200,
                                    labelWidth: 110,
                                    value: Images.getImagesViewState(),
                                    on: {
                                        onChange: function (state) {
                                            Images.changeImagesViewState(state)
                                        }
                                    }
                                },
                                {height: 5},
                                toggleSkinButton,
                                {height: 5},
                                hostDropDown,
                                {height: 5},
                                modeToolbar,
                                {height: 5},
                                userPanel
                            ]
                        }
                    ]
                },
                breadcrumbs
            ]
        };

    return {
        $ui: ui,
        $oninit: function() {
            $$(toggleBtnId).define("value", Images.getImagesViewState());
            $$(toggleBtnId).render();
        }
    }
});