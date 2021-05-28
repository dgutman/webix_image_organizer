define([
    "app",
    "helpers/ajax",
    "models/multichannel_view/state_store"
], function(
    app,
    ajax,
    stateStore
) {
    'use strict';
    class ImageMetadata {
        constructor(
            app,
            metadataPopup
        ) {
            this._metadataPopup = metadataPopup;
        }

        loadImageMetadata(id) {
            const params = {
                host: ajax.getHostApiUrl(),
                id: id
            };
            webix.ajax().get(app.config.defaultAPIPath + "/facets/image", params)
                .then((response) => {
                    stateStore.imageMetadata = response.json();
                });
        }
    }

    return new ImageMetadata();
});
