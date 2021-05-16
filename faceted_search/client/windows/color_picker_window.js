define([
	"helpers/base_jet_view",
	"views/components/color_picker",
	"views/components/range_slider",
	"views/components/range_switch",
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
	Debouncer, 
	ajaxActions, 
	stateStore, 
	tilesCollection, 
	constants
) {
	'use strict';
	const FORM_ID = "color-form";
	const HISTOGRAM_CHART_ID = "histogram-chart";
	const chartOverlay = "<div class='chart-overlay'></div>";

	return class ColorPickerWindow extends BaseJetView {
		constructor(app) {
			super(app);
	
			this._colorPicker = new ColorPicker(app, {name: "color", width: 300});
			if(stateStore.bit == constants.EIGHT_BIT) {
				this._rangeSlider = new RangeSlider(app, {}, constants.MAX_EDGE_FOR_8_BIT, 0);
				this._rangeSwitch = new RangeSwitch(app, {}, constants.MAX_EDGE_FOR_8_BIT, this._rangeSlider);
			} else {
				this._rangeSlider = new RangeSlider(app, {}, constants.MAX_EDGE_FOR_16_BIT, 0);
				this._rangeSwitch = new RangeSwitch(app, {}, constants.MAX_EDGE_FOR_16_BIT, this._rangeSlider);
			}

			this.$oninit = () => {
				const chart = this._histogramChart;
				webix.extend(chart, webix.OverlayBox);
		
				const form = this.getForm();
				this._colorPicker.$pickerTemplate().attachEvent("onColorChange", () => {
					this.getRoot().callEvent("colorChanged", [form.getValues()]);
				});
		
				const debounce = new Debouncer(200);
				form.attachEvent("onChange", async() => {
					const values = this.getForm().getValues();
					this.getRoot().callEvent("colorChanged", [values]);
					debounce.execute(this.updateHistorgamHandler, this);
				});
			};
		}
	
		get $ui() {
			return {
				view: "popup",
				css: "color-picker-popup",
				id: this._rootId,
				move: false,
				modal: true,
				height: 850,
				body: {
					view: "form",
					localId: FORM_ID,
					elements: [
						{
							localId: HISTOGRAM_CHART_ID,
							view: "chart",
							height: 160,
							width: 330,
							type: "splineArea",
							scale: "logarithmic",
							yValue: "#yValue#",
							color: "#36abee",
							dynamic: false,
							yAxis: {
								template: (yValue) => (yValue % 50 ? "" : `<span title='${yValue}' class='y-axis-number-item ellipsis-text'>${yValue}</span>`)
							},
							xAxis: {
								start: 0,
								end: 255,
								step: 50,
								template: ({xValue}) => (xValue % 50 ? "" : `<span title='${xValue}'>${xValue}</span>`)
							}
						},
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
										this.closeWindow();
									}
								}
							]
						}
					]
				}
			};
		}
	
		showWindow(initValues, node, pos = "left") {
			this._initValues = webix.copy(initValues);
			this.getRoot().show(node, {pos});
			this.getForm().setValues(initValues);
	
			this._histogramChart.showOverlay(chartOverlay);
			this._getHistogramInfo()
				.then((data) => {
					if (!data) {
						return;
					}
					const [histogram] = data;
					this.setHistogramValues(histogram);
				})
				.finally(() => {
					this._histogramChart.hideOverlay();
				});
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
			this._histogramChart.showOverlay(chartOverlay);
			this._getHistogramInfo().then((data) => {
				if (!data) {
					return;
				}
				const [histogram] = data;
				this.setHistogramValues(histogram);
			})
				.finally(() => {
					this._histogramChart.hideOverlay();
				});
		}

		async getHistogramData(min, max) {
			const tileInfo = await tilesCollection.getImageTileInfo(this._image);
			const binSettings = {
				width: tileInfo.sizeX,
				height: tileInfo.sizeY,
				rangeMin: min,
				rangeMax: max
			};
	
			return ajaxActions.getImageTilesHistogram(this._image._id, '', binSettings);
		}
	
		setHistogramValues(histogram) {
			this._histogram = histogram;
			const chartValues = histogram.hist.map((value, i) => ({xValue: i, yValue: value}));
			this._histogramChart.clearAll();
			this._histogramChart.parse(chartValues);
		}
	
		setMinAndMaxValuesByHistogram({min, max}) {
			if (max > constants.MAX_EDGE_FOR_8_BIT) { 
				max = constants.MAX_EDGE_FOR_16_BIT; 
			} else { 
				max = constants.MAX_EDGE_FOR_8_BIT; 
			}
			this._rangeSlider.setEdges(0, max);
			this._rangeSwitch.setMaxRange(max);
		}
	
		async _getHistogramInfo() {
			if (!this._image || !this._channel) {
				return;
			}
			const values = this.getForm().getValues();
			const binSettings = {
				rangeMin: values.min,
				rangeMax: values.max
			};
	
			return ajaxActions.getImageTilesHistogram(this._image._id, this._channel.index, binSettings);
		}
	
		get _histogramChart() {
			return this.$$(HISTOGRAM_CHART_ID);
		}
	
		getForm() {
			return this.$$(FORM_ID);
		}
	
		get _image() {
			return stateStore.image;
		}
	
		get _channel() {
			return stateStore.adjustedChannel;
		}
	};
});
