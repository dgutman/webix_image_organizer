import {JetView} from "webix-jet";
import ColorPicker from "../../../components/colorPicker";
import RangeSlider from "../../../components/rangeSlider";
import tilesCollection from "../../../../models/imageTilesCollection";
import ajaxActions from "../../../../services/ajaxActions";
import stateStore from "../../../../models/multichannelView/stateStore";
import TimedOutBehavior from "../../../../utils/timedOutBehavior";

const FORM_ID = "color-form";
const HISTOGRAM_CHART_ID = "histogram-chart";
const chartOverlay = "<div class='chart-overlay'></div>";

export default class ColorPickerWindow extends JetView {
	constructor(app) {
		super(app);

		this._colorPicker = new ColorPicker(app, {name: "color", width: 300});
		this._rangeSlider = new RangeSlider(app, {}, 65000, 0);
	}

	config() {
		const colorPopup = {
			view: "popup",
			css: "color-picker-popup",
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
							template: yValue => (yValue % 50 ? "" : `<span title='${yValue}' class='y-axis-number-item ellipsis-text'>${yValue}</span>`)
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

		return colorPopup;
	}

	ready() {
		const chart = this._histogramChart;
		webix.extend(chart, webix.OverlayBox);

		const form = this.getForm();
		this.on(this._colorPicker.$pickerTemplate(), "onColorChange", () => {
			this.getRoot().callEvent("colorChanged", [form.getValues()]);
		});

		const debounce = new TimedOutBehavior(200);
		this.on(form, "onChange", async () => {
			const values = this.getForm().getValues();
			this.getRoot().callEvent("colorChanged", [values]);
			debounce.execute(this.updateHistorgamHandler, this);
		});
	}

	showWindow(initValues, node, pos = "left") {
		this._initValues = webix.copy(initValues);
		this.getRoot().show(node, {pos});
		this.getForm().setValues(initValues);

		this._histogramChart.showOverlay(chartOverlay);
		this._getHistogramInfo()
			.then(([histogram]) => {
				this.setHistogramValues(histogram);
				this.setMinAndMaxValuesByHistogram(histogram);
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
		this._getHistogramInfo().then(([histogram]) => {
			this.setHistogramValues(histogram);
		})
			.finally(() => {
				this._histogramChart.hideOverlay();
			});
	}

	setHistogramValues(histogram) {
		this._histogram = histogram;
		const chartValues = histogram.hist.map((value, i) => ({xValue: i, yValue: value}));
		this._histogramChart.clearAll();
		this._histogramChart.parse(chartValues);
	}

	setMinAndMaxValuesByHistogram({min, max}) {
		this._rangeSlider.setEdges(min, max);
	}

	async _getHistogramInfo() {
		const values = this.getForm().getValues();
		const tileInfo = await tilesCollection.getImageTileInfo(this._image);
		const binSettings = {
			width: tileInfo.sizeX,
			height: tileInfo.sizeY,
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
}
