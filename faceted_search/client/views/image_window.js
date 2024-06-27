define([
    "helpers/base_jet_view",
    "helpers/ajax",
    "libs/is/is.min",
    "helpers/openseadragon",
    "views/components/property_accordion",
    "views/components/horizontal_collapser",
    "views/components/controls_view",
    "helpers/controls_events_service",
    "helpers/maker_layer",
    "helpers/multichannel_view/tiles_service",
    "helpers/style_params",
    "models/image"
], function(
  BaseJetView,
  ajax,
  is,
  openseadragon,
  PropertyAccordion,
  HorizontalCollapser,
  ControlsView,
  ControlsEventsService,
  MakerLayer,
  TilesService,
  styleParams,
  Image
) {
    const uid = webix.uid();
    const windowLabelId = `label-${uid}`;
    const openseadragonTemplateId = `openseadragon-template-${uid}`;

    return class ImageWindow extends BaseJetView {
        constructor(app) {
            super(app);

            this._controlsCollapser = new HorizontalCollapser(
              this.app,
              {direction: "left"}
            );
            this._metadataCollapser = new HorizontalCollapser(
              this.app,
              {direction: "right"}
            );
            this._tilesService = new TilesService();

            this.$ondestroy = () => {
                return this.destroy();
            };

            this.$oninit = () => {
                this._controlsEventsService = new ControlsEventsService(this._controlsView);
            };
        }

        get $ui() {
            this._controlsView = new ControlsView(this.app);

            this._propertyAccordion = new PropertyAccordion(this.app, {
                scrollviewOptions: {
                    maxWidth: 400,
                    minWidth: 300
                }
            });

            return {
                view: "window",
                id: this._rootId,
                position: "center",
                width: 1100,
                height: 650,
                minWidth: 720,
                minHeight: 400,
                modal: true,
                resize: true,
                head: {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            width: 140,
                            template: "<img class='app-logo' src='assets/imgs/logo.png'>"
                        },
                        {
                            view: "label",
                            localId: windowLabelId
                        },
                        {
                            view: "button",
                            label: "Close",
                            width: 100,
                            align: "right",
                            click: () => {
                                this.getRoot().close();
                            }
                        }
                    ]
                },
                body: {
                    cols: [
                        {
                            cols: [
                                {
                                    width: 250,
                                    cols: [
                                        this._controlsView
                                    ]
                                },
                                this._controlsCollapser
                            ]
                        },
                        {
                            view: "template",
                            css: "openseadragon-template-image",
                            minWidth: 400,
                            id: openseadragonTemplateId
                        },
                        {
                            cols: [
                                this._metadataCollapser,
                                this._propertyAccordion
                            ]
                        }
                    ]
                }
            };
        }

        async showWindow(data) {
            this.getRoot().show();
            this.$$(windowLabelId).setValue(data.data.name);
            const dataToDisplay = Image.filterData(data.data);
            this._propertyAccordion.setProperties(dataToDisplay);

            // TODO: style parameter not working. message from server: "Style is not a valid json object."
            // const styleParamsString = styleParams.getStyleParams(data.data);
            // const urlParams = {style: styleParamsString};

            let layerConfig;
            let openseadragonConfig;
            if (data.data.largeImage) {
                const tiles = await this._tilesService.getTileSources(data.data, /* urlParams */);
                layerConfig = {tileSource: tiles};
                openseadragonConfig = {imageLoaderLimit: 1};
            } else {
                layerConfig = {
                    type: 'image',
                    url: ajax.getImageUrl(
                      data.data._id,
                      'thumbnail'
                      /* urlParams */
                    )
                };
                openseadragonConfig = {maxZoomPixelRatio: 6};
            }

            const layer = MakerLayer.makeLayer(layerConfig);
            this._initOpenseadragon(layer, openseadragonConfig)
              .then(({eventSource: openSeadragonViewer}) => {
                  this._controlsEventsService.init(openSeadragonViewer, layer);
              });
        }

        _initOpenseadragon(layer, config) {
            const openSeadragonViewer = new openseadragon.Viewer({
                ...config,
                tileSources: layer,
                crossOriginPolicy: "Anonymous",
                loadTilesWithAjax: true,
                element: $$(openseadragonTemplateId).getNode(),
                prefixUrl: "libs/openseadragon/images/"
            });

            return new Promise((resolve, reject) => {
                openSeadragonViewer.addOnceHandler("open", resolve);
                openSeadragonViewer.addOnceHandler("open-failed", reject);
            });
        }
    };
});
