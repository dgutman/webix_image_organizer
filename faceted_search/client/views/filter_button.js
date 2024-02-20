define([
    "models/images",
    "helpers/authentication"
], function(Images, auth) {
    const buttonId = "filterButton";
    const templateId = "button_template";
    let visible = true;
    const ui = {
        id: buttonId,
        cols: [
            {
                view: 'template',
                align: 'center',
                css: "webixtype_base",
                id: templateId,
                template: "<div class='found-button'>Found #count# results!</div>",
                data: {
                    count: 0
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
            $$(templateId).showProgress({
                type: "icon"
            });
            visible = true;
        }
    };
});
