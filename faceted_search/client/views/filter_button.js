define([
    "models/images",
    "helpers/authentication"
], function (Images, auth) {
    var buttonId = "filterButton",
        templateId = "button_template",
        visible = true,
        ui = {
        id: buttonId,
        cols: [
            {
                view: 'template',
                align: 'center',
                css: "button-text",
                id: templateId,
                template: "<div class='found-button'>Found #count# results!<span class='webix_icon button-icon mdi mdi-close-circle'></span></div>",
                data: {
                    count: 0
                },
                onClick: {
                    "button-icon": () => {
                        $$(buttonId).hide();
                        $$(buttonId).destructor();
                        visible = false;
                    }
                }
            }
        ],
        height: 50
    };

    Images.attachEvent("changeButtonAfterImageLoaded", function() {
        $$(templateId).define("data", {count: this.getImagesCount()});
        $$(templateId).render();
        $$(templateId).hideProgress();
    });

    Images.attachEvent("imagesFiltered", function() {
        if(visible) {
            $$(templateId).define("data", {count: this.getImagesCount()});
            $$(templateId).render();
        }
    });

    return {
        $ui: ui,
        $oninit: function() {
            webix.extend($$(templateId), webix.ProgressBar);
            if (auth.isLoggedIn()) {
                $$(templateId).showProgress({
                    type:"icon"
                });
            }
            visible = true;
        }
    }
});