define([
	"app",
	"views/components/osd_viewer",
	"views/components/horizontal_collapser",
	"views/components/header_label",
	"models/multichannel_view/state_store",
	"helpers/ajax",
	"helpers/router",
	"helpers/base_jet_view",
	"helpers/multichannel_view/tiles_service",
	"views/components/property_accordion",
	"views/components/controls_view",
	"helpers/controls_events_service",
	"helpers/maker_layer"
], function(
	app,
	OpenSeadragonViewer,
	HorizontalCollapser,
	HeaderLabel,
	stateStore,
	ajaxActions,
	router,
	BaseJetView,
	TilesService,
	PropertyAccordion,
	ControlsView,
	ControlsEventsService,
	MakerLayer
) {
	'use strict';
	const {routes, navigate} = router;
	const DETAILED_IMAGE_WRAP_ID = "detailed-image-wrap";

	class DetailedImageView extends BaseJetView {
		constructor(app) {
			super(app);

			this._osdViewer = new OpenSeadragonViewer(this.app);
			this._controlsView = new ControlsView(this.app, {
				width: 270
			});

			this._metadataPanel = new PropertyAccordion(this.app, {
				scrollviewOptions: {
					width: 350
				}
			});

			this._controlsListCollapser = new HorizontalCollapser(app, {direction: "left"});
			this._metadataPanelCollapser = new HorizontalCollapser(app, {direction: "right"});

			this._tileService = new TilesService();

			this.$oninit = () => {
				const view = this.getRoot();
				const wrapper = this.getDetailedImageWrap();

				webix.extend(wrapper, webix.OverlayBox);
				webix.extend(view, webix.ProgressBar);

				this._controlsEventsService = new ControlsEventsService(
					this.getRoot(),
					this._controlsView
				);
			};

			this.$onurlchange = async (params) => {
				try {
					await this.handleIdChange(params.id);
				} catch (err) {
					navigate(routes.userMode);
				}
			};
		}

		get $ui() {
			return {
				name: "detailedImageViewCell",
				css: "detailed-image-view",
				id: this._rootId,
				rows: [
					{
						view: "toolbar",
						cols: [
							{
								view: "button",
								type: "icon",
								icon: "mdi mdi-arrow-left",
								width: 80,
								height: 30,
								label: "Back",
								click: () => {
									this.app.show("/top/user_mode");
								}
							},
							new HeaderLabel(app),
							{}
						]
					},
					{
						margin: 8,
						localId: DETAILED_IMAGE_WRAP_ID,
						cols: [
							this._controlsView,
							this._controlsListCollapser,
							this._osdViewer,
							this._metadataPanelCollapser,
							this._metadataPanel
						]
					}
				]
			};
		}

		show(imageId) {
			this.app.show(`top/detailed_image_view:id=${imageId}`);
		}

		async handleIdChange(id) {
			const image = stateStore.loadedImages[id] || await ajaxActions.getItem(id);

			if (image) {
				this.setImage(image);
			}
		}

		async setImage(image) {
			this._metadataPanel.setProperties(image);
			this._osdViewer.destroy();
			this.getRoot().showProgress();
			const tileSource = await this._tileService.getTileSources(image);
			const layer = MakerLayer.makeLayer({tileSource});
			const openSeadragonViewer = await this._osdViewer.createViewer({
				tileSources: layer
			});
			this._controlsEventsService.init(openSeadragonViewer, layer);
			this.getRoot().hideProgress();
		}

		getDetailedImageWrap() {
			return this.$$(DETAILED_IMAGE_WRAP_ID);
		}
	}

	return new DetailedImageView(app);
});
