define([
	"helpers/base_jet_view",
	"views/components/color_picker",
	"views/components/range_slider",
	"views/components/range_switch",
	"views/components/histogram_chart",
	"views/components/scale_type_toggle",
	"helpers/debouncer",
	"helpers/ajax",
	"models/multichannel_view/state_store",
	"models/multichannel_view/tiles_collection",
	"constants"
], function(
	BaseJetView,
	ColorPicker,
	RangeSlider,
	RangeSwitch,
	HistogramChart,
	ScaleTypeToggle,
	Debouncer,
	ajaxActions,
	stateStore,
	tilesCollection,
	constants
) {
	'use strict';
	const FORM_ID = `${constants.FORM_ID}-${webix.uid()}`;
	const HISTOGRAM_FORM_ID = `${constants.HISTOGRAM_FORM_ID}-${webix.uid()}`;
	const chartOverlay = "<div class='chart-overlay'></div>";

	return class ColorPickerWindow extends BaseJetView {
		constructor(app) {
			super(app);
	
			this._colorPicker = new ColorPicker(app, {name: "color", width: 300});
			const initialMaxEdge = stateStore.bit == constants.EIGHT_BIT ?
				constants.MAX_EDGE_FOR_8_BIT : constants.MAX_EDGE_FOR_16_BIT;
			this._rangeSlider = new RangeSlider(app, {}, initialMaxEdge, 0);
			this._rangeSwitch = new RangeSwitch(app, {hidden: true}, initialMaxEdge, this._rangeSlider);
			this._histogramChart = new HistogramChart(app, {width: 330, height: 210});
			this._histogramSlider = new RangeSlider(app, {}, initialMaxEdge, 0);
			this._scaleTypeToggle = new ScaleTypeToggle(
				app, 
				{value: constants.LINEAR_SCALE_VALUE}
			);

			this.$oninit = () => {
				const chart = this._histogramChart.getRoot();
				webix.extend(chart, webix.OverlayBox);
		
				const form = this.getForm();
				this._colorPicker.$pickerTemplate().attachEvent("onColorChange", () => {
					this.getRoot().callEvent("colorChanged", [form.getValues()]);
				});
		
				form.attachEvent("onChange", async () => {
					const values = this.getForm().getValues();
					this.getRoot().callEvent("colorChanged", [values]);
				});


				const toggleRangeSwitchVisibility = () => {
					const rangeSwitchRoot = this._rangeSwitch.getRoot();
					const isVisible = rangeSwitchRoot.isVisible();
					if (isVisible) {
						rangeSwitchRoot.hide();
					} else {
						rangeSwitchRoot.show();
					}
					return false; 
				};
				this.getRoot().attachEvent("onShow", () => {
					webix.UIManager.addHotKey("Shift+S", toggleRangeSwitchVisibility);
				});
				this.getRoot().attachEvent("onHide", () => {
					webix.UIManager.removeHotKey("Shift+S", toggleRangeSwitchVisibility);
				});

				const histogramForm = this.getHistogramForm();
				const debounce = new Debouncer(400);
				histogramForm.attachEvent("onChange", async () => {
					debounce.execute(this.updateHistorgamHandler, this);
				});
			};
		}
	
		get $ui() {
			return {
				view: "window",
				css: "color-picker-popup",
				id: this._rootId,
				move: true,
				modal: false,
				height: 1050,
				width: 700,
				body: {
					cols: [
						{
							view: "form",
							localId: HISTOGRAM_FORM_ID,
							elements: [
								this._histogramChart,
								this._histogramSlider,
								this._scaleTypeToggle
							]
						},
						{
							view: "form",
							localId: FORM_ID,
							elements: [
								this._colorPicker,
								this._rangeSlider,
								this._rangeSwitch,
								{
									cols: [
										{
											view: "button",
											css: "btn-contour",
											label: "Cancel",
											click: () => {
												this.getForm().setValues(this._initValues);
												this.applyChanges();
												this.savePosition();
												this.closeWindow();
											}
										},
										{},
										{
											view: "button",
											css: "btn",
											label: "Apply",
											click: () => {
												this.applyChanges();
												this.savePosition();
												this.closeWindow();
											}
										}
									]
								}
							]
						}
					]
				}
			};
		}
	
		showWindow(initValues, node, pos = "left") {
			this._initValues = webix.copy(initValues);
			const currentWindowPosition = webix.storage.cookie.get("colorPickerWindowPosition");
			if(currentWindowPosition) {
				this.getRoot().setPosition(currentWindowPosition.left, currentWindowPosition.top);
				this.getRoot().show();
			} else {
				this.getRoot().show(node, {pos});
			}
			this.getForm().setValues(initValues);
	
			this._histogramChart.getRoot().showOverlay(chartOverlay);
			this._getHistogramInfo(true)
				.then((data) => {
					if (!data) {
						return;
					}
					const [histogram] = data;
					this.setHistogramValues(histogram);
					this.setMinAndMaxValuesByHistogram(histogram.min, histogram.max);
				})
				.finally(() => {
					this._histogramChart.getRoot().hideOverlay();
				});
		}

		savePosition() {
			const top = this.getRoot().$view.offsetTop;
			const left = this.getRoot().$view.offsetLeft;
			webix.storage.cookie.put("colorPickerWindowPosition", {top: top, left: left});
		}
	
		closeWindow() {
			this.getForm().clear();
			this.getRoot().hide();
		}
	
		applyChanges() {
			const form = this.getForm();
			this.getRoot().callEvent("applyColorChange", [form.getValues()]);
		}
	
		updateHistorgamHandler() {
			this._histogramChart.getRoot().showOverlay(chartOverlay);
			this._getHistogramInfo().then((data) => {
				if (!data) {
					return;
				}
				const [histogram] = data;
				this.setHistogramValues(histogram);
			})
				.finally(() => {
					this._histogramChart.getRoot().hideOverlay();
				});
		}

		async getHistogramData(min, max) {
			// const tileInfo = await tilesCollection.getImageTileInfo(this._image);
			const binSettings = {
				// width: tileInfo.sizeX,
				// height: tileInfo.sizeY,
				// rangeMin: min,
				// rangeMax: max
			};
	
			return ajaxActions.getImageTilesHistogram(this._image._id, '', binSettings);
		}
	
		setHistogramValues(histogram) {
			this._histogram = histogram;
			const yScale = this._scaleTypeToggle.getValue();
			const chartValues = histogram.hist.map((value, i) => {
				const bitMaxEdge = histogram.bin_edges[i + 1];
				const name = typeof bitMaxEdge === "number" ? bitMaxEdge.toFixed(2) : bitMaxEdge;
				return {value, name};
			});
			this._histogramChart.makeChart(chartValues, yScale);
		}
	
		setMinAndMaxValuesByHistogram(min = 0, max) {
			this._rangeSlider.setEdges(min, max);
			this._histogramSlider.setEdges(min, max);
			this._rangeSwitch.setMaxRange(max);
		}
	
		async _getHistogramInfo(initial) {
			if (!this._image || !this._channel) {
				return;
			}
			const {min, max} = this.getHistogramForm().getValues();
			const binSettings = {
				rangeMin: min,
				rangeMax: max
			};
	
			return ajaxActions
				.getImageTilesHistogram(this._image._id, this._channel.index, initial ? null : binSettings);
		}
	
		getForm() {
			return this.$$(FORM_ID);
		}

		getHistogramForm() {
			return this.$$(HISTOGRAM_FORM_ID);
		}
	
		get _image() {
			return stateStore.image;
		}
	
		get _channel() {
			return stateStore.adjustedChannel;
		}
	};
});
