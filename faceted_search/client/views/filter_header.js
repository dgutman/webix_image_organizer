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
            view: 'select',
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
                    cols: [
                        {
                            view: "label",
                            height: 30,
                            width: 250,
                            template: "<p class='images-header-p'>Filter results</p>"
                        },
                        {},
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
                        {},
                        toggleSkinButton,
                        {},
                        hostDropDown,
                        {},
                        modeToolbar,
                        {},
                        userPanel
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