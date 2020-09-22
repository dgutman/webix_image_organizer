define([
    "models/images",
    "templates/image",
    "views/filter_header",
    "views/image_window",
    "helpers/authentication"
], function (Images, imageTemplate, filterHeaderView, imageWindow, auth) {
    var dataviewId = "images-dataview", ui = {
        id: "dataview-layout",
        rows: [
            filterHeaderView,
            {
                id: dataviewId,
                view: "dataview",
                css: "images-dataview",
                height: NaN,
                scroll: true,
                select: true,
                data: null,
                on: {
                    onItemClick: function (id) {
                        imageWindow.showWindow(this.getItem(id));
                    }
                },
                template: function(data){
                    return imageTemplate.getTemplate(data);
                },
                tooltip: (data) => {
                    return data.data && data.data.name ? data.data.name : "no image"
                }
            }
        ]
    };

    Images.attachEvent("imagesLoaded", function() {
       var data = this.getImages();
        $$(dataviewId).clearAll();
        $$(dataviewId).parse(data);
        $$(dataviewId).hideProgress();
    });

    Images.attachEvent("imagesViewStateChange", function() {
        var sizes = this.getImagesSize($$(dataviewId).$width);
        $$(dataviewId).define("type", sizes);
        $$(dataviewId).render();

    });


    return {
        $ui: ui,
        $oninit: function() {
            var sizes;
            webix.extend($$(dataviewId), webix.ProgressBar);
            webix.extend($$(dataviewId), webix.OverlayBox);
            sizes = Images.getImagesSize($$(dataviewId).$width);
            $$(dataviewId).define("type", sizes);
            if (auth.isLoggedIn()) {
                $$(dataviewId).showProgress({
                    type:"icon"
                });
                Images.loadImages();
            }
            else {
                $$(dataviewId).showOverlay("<div class='dataview-overlay'>To work with the Filter results, please Login</div>")
            }
        }
    }
});