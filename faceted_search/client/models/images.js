define([
    "app",
    "helpers/ajax"
],function(app, ajax){
    var imagesViewState = false,
        imagesCollection = new webix.DataCollection({}),
        sizes;
    
    imagesCollection.loadImages = function() {
        const params = {
            host: ajax.getHostApiUrl()
        }
        webix.ajax().get(app.config.defaultAPIPath + "/facets/images", params)
            .then(function(response) {
                var data = response.json();
                data = data && data.length > 0 ? data : [];
                imagesCollection.clearAll();
                imagesCollection.parse(data);
                imagesCollection.callEvent("imagesLoaded", []);
                imagesCollection.callEvent("changeButtonAfterImageLoaded", []);
                app.callEvent("buildFiltersAfterImagesLoaded", [true]);
            })
            .fail(function() {
                imagesCollection.clearAll();
                imagesCollection.parse([]);
                imagesCollection.callEvent("imagesLoaded", []);
                imagesCollection.callEvent("changeButtonAfterImageLoaded", []);
                app.callEvent("buildFiltersAfterImagesLoaded", [true]);
            });
    };

    imagesCollection.getImages = function() {
        return this;
    };

    imagesCollection.changeImagesViewState = function(state) {
        imagesViewState = state;
        this.callEvent('imagesViewStateChange', []);
    };

    imagesCollection.getImagesSize = function(dataviewWidth) {
        if(dataviewWidth) {
            if(imagesViewState) {
                sizes = {
                    height: 600,
                    width: dataviewWidth
                };
            } else {
                sizes = {
                    height: 230,
                    width: dataviewWidth/5
                };
            }
        } else if(!sizes) {
            if(imagesViewState) {
                sizes = {
                    height: 600,
                    width: (window.outerWidth - 430)
                };
            } else {
                sizes = {
                    height: 230,
                    width: (window.outerWidth - 430)/5
                };
            }
        }
        return sizes;
    };

    imagesCollection.getImagesViewState = function() {
        return imagesViewState;
    };

    imagesCollection.getImagesCount = function() {
        return this.count();
    };

    var allTrue = function (obj) {
        var key;
        for (key in obj){
            if (!obj[key]) {
                return false;
            }
        }
        return true;
    };

    imagesCollection.filterSingleImage = function (obj, data) {
        var i, show = {}, k, t;
        for(i = 0; i < data.length; i++) {
            show[data[i].key] = false;
            if(obj.facets.hasOwnProperty((data[i].key))) {
                if (data[i].status == "equals") {
                    if (data[i].value instanceof Array) {
                        for (k = 0; k < data[i].value.length; k++) {
                            if (data[i].value[k] == obj.facets[data[i].key]) {
                                show[data[i].key] = true;
                            }
                        }
                    } else if (data[i].value == obj.facets[data[i].key]) {
                        show[data[i].key] = true;
                    }
                } else if (data[i].status == "less" && data[i].value < obj.facets[data[i].key]) {
                    show[data[i].key] = true;

                } else if (data[i].status == "between" && data[i].max >= obj.facets[data[i].key] && data[i].min <= obj.facets[data[i].key]) {
                    show[data[i].key] = true;
                }
            }
        }
        t = allTrue(show);
        return t;
    }

    app.attachEvent("images:FilterImagesView", function(data, skipId) {
        var arr = [];
        imagesCollection.filter(function(obj) {
            const isOk = imagesCollection.filterSingleImage(obj, data);
            if(isOk) {
                arr.push(obj.facets);
            }
            return isOk;
        });
        imagesCollection.callEvent("imagesFiltered", []);
        app.callEvent("reloadFormAfterCalculating", [arr, skipId]);

    });

    return imagesCollection;
});