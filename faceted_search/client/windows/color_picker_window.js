define([
	"helpers/base_jet_view",
	"views/components/color_picker",
	"views/components/range_slider",
	"views/components/range_switch",
	"helpers/debouncer",
	"helpers/ajax",
	"models/multichannel_view/state_store",
	"models/multichannel_view/tiles_collection",
	"models/multichannel_view/histogram_chart",
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
	HistogramChart,
	constants
) {
	'use strict';
	const FORM_ID = "color-form";
	const chartOverlay = "<div class='chart-overlay'></div>";

	return class ColorPickerWindow extends BaseJetView {
		constructor(app) {
			super(app);
	
			this._colorPicker = new ColorPicker(app, {name: "color", width: 300});
			const initialMaxEdge = stateStore.bit == constants.EIGHT_BIT ?
				constants.MAX_EDGE_FOR_8_BIT : constants.MAX_EDGE_FOR_16_BIT;
			this._rangeSlider = new RangeSlider(app, {}, initialMaxEdge, 0);
			this._rangeSwitch = new RangeSwitch(app, {hidden: true}, initialMaxEdge, this._rangeSlider);
			this._histogramChart = new HistogramChart(app, {width: 330, height: 190});

			this.$oninit = () => {
				const chart = this._histogramChart.getRoot();
				webix.extend(chart, webix.OverlayBox);
		
				const form = this.getForm();
				this._colorPicker.$pickerTemplate().attachEvent("onColorChange", () => {
					this.getRoot().callEvent("colorChanged", [form.getValues()]);
				});
		
				const debounce = new Debouncer(400);
				form.attachEvent("onChange", async () => {
					const values = this.getForm().getValues();
					this.getRoot().callEvent("colorChanged", [values]);
					debounce.execute(this.updateHistorgamHandler, this);
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
			};
		}
	
		get $ui() {
			return {
				view: "popup",
				css: "color-picker-popup",
				id: this._rootId,
				move: false,
				modal: true,
				height: 1050,
				width: 700,
				body: {
					view: "form",
					localId: FORM_ID,
					elements: [
						this._histogramChart,
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
	
			this._histogramChart.getRoot().showOverlay(chartOverlay);
			this._getHistogramInfo()
				.then((data) => {
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
			const chartValues = histogram.hist.map((value, i) => {
				const bitMaxEdge = histogram.bin_edges[i + 1];
				const name = typeof bitMaxEdge === "number" ? bitMaxEdge.toFixed(2) : bitMaxEdge;
				return {value, name};
			})
			.reduce((acc, current, i) => {
				const lastFiltered = acc[acc.length - 1];
				if (lastFiltered && lastFiltered.value === current.value && current.value === 0) {
					lastFiltered.name = current.name;
					return acc;
				}
				acc.push(current);
				return acc;
			}, []);
			this._histogramChart.makeChart(chartValues);
		}
	
		setMinAndMaxValuesByHistogram(min = 0, max) {
			if (max > constants.MAX_EDGE_FOR_8_BIT) { 
				max = constants.MAX_EDGE_FOR_16_BIT; 
			} else { 
				max = constants.MAX_EDGE_FOR_8_BIT; 
			}
			this._rangeSlider.setEdges(min, max);
			this._rangeSwitch.setMaxRange(max);
		}
	
		async _getHistogramInfo() {
			if (!this._image || !this._channel) {
				return;
			}
			const {min, max} = this.getForm().getValues();
			const binSettings = {
				rangeMin: min,
				rangeMax: max
			};
	
			return ajaxActions.getImageTilesHistogram(this._image._id, this._channel.index, binSettings);
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
