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
    "helpers/multichannel_view/tiles_service"
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
  TilesService
) {
    const uid = webix.uid();
    const windowLabelId = `label-${uid}`;
    const openseadragonTemplateId = `openseadragon-template-${uid}`;

    return class ImageWindow extends BaseJetView {
        constructor(app) {
            super(app);

            this._propertyAccordion = new PropertyAccordion(this.app, {
                scrollviewOptions: {
                    maxWidth: 400,
                    minWidth: 300
                }
            });

            this._controlsView = new ControlsView(this.app);
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
                this._controlsEventsService = new ControlsEventsService(
                  this.getRoot(),
                  this._controlsView
                );
            };
        }

        get $ui() {
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

        showWindow(data) {
            this.getRoot().show();
            this.$$(windowLabelId).setValue(data.data.name);
            this._propertyAccordion.setProperties(data.data);
            const imageId = data.data._id;

            if (data.data.largeImage) {
                this._tilesService.getTileSources(data.data)
                  .then((tiles) => {
                      const layer = MakerLayer.makeLayer({tileSource: tiles});
                      this.initLargeImageOpenseadragon(layer)
                        .then(({eventSource: openSeadragonViewer}) => {
                            this._controlsEventsService.init(openSeadragonViewer, layer);
                        });
                  })
                  .catch(() => {
                      console.error('something wrong');
                  });
            } else {
                this.initSimpleImageOpenseadragon(imageId);
            }
        }

        initLargeImageOpenseadragon(layer) {
            return this._initOpenseadragon({
                crossOriginPolicy: "Anonymous",
                loadTilesWithAjax: true,
                imageLoaderLimit: 1,
                tileSources: layer
            });
        }

        initSimpleImageOpenseadragon(imageId) {
            return this._initOpenseadragon({
                maxZoomPixelRatio: 6,
                tileSources: {
                    type: 'image',
                    url: ajax.getImageUrl(imageId)
                }
            });
        }

        _initOpenseadragon(config) {
            const openSeadragonViewer = new openseadragon.Viewer({
                ...config,
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
