define([
    "helpers/base_jet_view",
    "views/components/property_accordion",
    "models/multichannel_view/state_store"
], function(
    BaseJetView,
    PropertyAccordion,
    stateStore
) {
    return class MetadataPopup extends BaseJetView {
        constructor(app) {
            super(app);

            this._propertyAccordion = new PropertyAccordion(this.app, {
                scrollviewOptions: {
                    maxWidth: 1000,
                    minWidth: 300
                }
            });

            this.$ondestroy = () => {
                stateStore.imageMetadata = null;
            };

            this._closeButtonId = "close-button-id";
        }

        get $ui() {
            return {
                view: "window",
                id: this._rootId,
                resize: true,
                move: true,
                width: 400,
                head: {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            width: 140,
                            label: "Image Metadata"
                        },
                        {gravity: 10},
                        {
                            view: "button",
                            localId: this._closeButtonId,
                            label: "Close",
                            width: 100,
                            align: "right",
                            click: () => {
                                this.getRoot().hide();
                            }
                        }
                    ]
                },
                body: {
                    rows: [
                        {
                            cols: [
                                this._propertyAccordion
                            ]
                        }
                    ]
                }
            };
        }

        setProperties() {
            this._propertyAccordion.setProperties(stateStore.imageMetadata.data);
        }
    };
});
