define([
    "models/images",
    "templates/image",
    "views/filter_header",
    "views/image_window",
    "views/multichannel_view",
    "helpers/authentication"
], function (Images, imageTemplate, filterHeaderView, imageWindow, multichannelView, auth) {
    let dataviewId = "images-dataview";
    let ui = {
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
                    onItemClick: async function (id) {
                        const item = this.getItem(id);
                        imageWindow.showWindow(item);
                    }
                },
                onClick: {
                    multichannel: (ev, id) => {
                        const item = $$(dataviewId).getItem(id);
                        multichannelView.validateImage(item.data)
                            .then((isValid) => {
                                if (!isValid) {
                                    webix.message("Image can't be opened in the multichannel mode")
                                    return;
                                }
                                multichannelView.show(item.data._id);
                            });
                        return false;
                    }
                },
                template: function(data) {
                    return imageTemplate.getTemplate(data);
                },
                tooltip: (data) => {
                    return data.data && data.data.name ? data.data.name : "no image"
                }
            }
        ]
    };

    Images.attachEvent("imagesLoaded", function() {
        let data = this.getImages();
        $$(dataviewId).clearAll();
        $$(dataviewId).parse(data);
        $$(dataviewId).hideProgress();
    });

    Images.attachEvent("imagesViewStateChange", function() {
        let sizes = this.getImagesSize($$(dataviewId).$width);
        $$(dataviewId).define("type", sizes);
        $$(dataviewId).render();
    });


    return {
        $ui: ui,
        $oninit: function() {
            let sizes;
            webix.extend($$(dataviewId), webix.ProgressBar);
            webix.extend($$(dataviewId), webix.OverlayBox);
            sizes = Images.getImagesSize($$(dataviewId).$width);
            $$(dataviewId).define("type", sizes);
                $$(dataviewId).showProgress({
                    type: "icon"
                });
                Images.loadImages();
        }
    };
});
