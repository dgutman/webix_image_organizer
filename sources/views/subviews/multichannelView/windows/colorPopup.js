import {JetView} from "webix-jet";

import constants from "../../../../constants";
// import tilesCollection from "../../../../models/imageTilesCollection";
import stateStore from "../../../../models/multichannelView/stateStore";
import ajaxActions from "../../../../services/ajaxActions";
import TimedOutBehavior from "../../../../utils/timedOutBehavior";
import ColorPicker from "../../../components/colorPicker";
import HistogramChart from "../../../components/histogramChart";
import RangeSlider from "../../../components/rangeSlider";
import ScaleTypeToggle from "../../../components/scaleTypeToggle";

const FORM_ID = `color-form-${webix.uid()}`;
const HISTOGRAM_CHART_ID = `histogram-chart-${webix.uid()}`;
const HISTOGRAM_FORM_ID = `histogram-form-${webix.uid()}`;
const chartOverlay = "<div class='chart-overlay'></div>";

export default class ColorPickerWindow extends JetView {
	constructor(app) {
		super(app);

		this._colorPicker = new ColorPicker(app, {name: "color", width: 300});
		this._histogramChart = new HistogramChart(
			this.app,
			{width: 530, height: 410, localId: HISTOGRAM_CHART_ID}
		);
		const initialMaxEdge = stateStore.bit === constants.EIGHT_BIT
			? constants.MAX_EDGE_FOR_8_BIT
			: constants.MAX_EDGE_FOR_16_BIT;
		this._visibleRangeSlider = new RangeSlider(app, {hidden: true}, initialMaxEdge, 0);
		this._scaleTypeToggle = new ScaleTypeToggle(
			app,
			{value: constants.LOGARITHMIC_SCALE_VALUE}
		);
	}

	config() {
		const colorPopup = {
			view: "window",
			css: "color-picker-popup",
			move: true,
			modal: false,
			width: 900,
			height: 850,
			body: {
				cols: [
					{
						view: "form",
						localId: HISTOGRAM_FORM_ID,
						elements: [
							this._histogramChart,
							this._scaleTypeToggle
						]
					},
					{
						view: "form",
						localId: FORM_ID,
						elements: [
							this._colorPicker,
							this._visibleRangeSlider,
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

		return colorPopup;
	}

	ready() {
		const chart = this._histogramChart.getRoot();
		webix.extend(chart, webix.OverlayBox);

		const form = this.getForm();
		this.on(this._colorPicker.$pickerTemplate(), "onColorChange", () => {
			this.getRoot().callEvent("colorChanged", [form.getValues()]);
		});

		const debounce = new TimedOutBehavior(200);
		this.on(form, "onChange", async () => {
			const values = this.getForm().getValues();
			this.getRoot().callEvent("colorChanged", [values]);
			debounce.execute(this.updateHistogramHandler, this);
		});

		const histogramForm = this.getHistogramForm();
		histogramForm.attachEvent("onChange", async () => {
			debounce.execute(this.updateHistogramHandler, this);
		});
	}

	showWindow(initValues, node, pos = "left") {
		try {
			this._initValues = webix.copy(initValues);
			const currentWindowPosition = webix.storage.cookie.get("colorPickerWindowPosition");
			if (currentWindowPosition) {
				this.getRoot().setPosition(currentWindowPosition.left, currentWindowPosition.top);
				this.getRoot().show();
			}
			else {
				this.getRoot().show(node, {pos});
			}
			this.getForm().setValues(initValues);

			this._histogramChart.getRoot().showOverlay(chartOverlay);
			const getHistogramInfoPromise = this._getHistogramInfo();
			getHistogramInfoPromise
				.then((data) => {
					if (!data) {
						return;
					}
					const [histogram] = data;
					this.setHistogramValues(histogram);
					this.setMinAndMaxValuesByHistogram(histogram);
				})
				.finally(() => {
					this._histogramChart.getRoot().hideOverlay();
				});
		}
		catch (err) {
			console.error(JSON.stringify(err.stack));
		}
	}

	savePosition() {
		const top = this.getRoot().$view.offsetTop;
		const left = this.getRoot().$view.offsetLeft;
		webix.storage.cookie.put("colorPickerWindowPosition", {top, left});
	}

	closeWindow() {
		this.getForm().clear();
		this.getRoot().hide();
	}

	applyChanges() {
		const form = this.getForm();
		this.getRoot().callEvent("applyColorChange", [form.getValues()]);
	}

	updateHistogramHandler() {
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

	setHistogramValues(histogram) {
		this._histogram = histogram;
		const yScale = this._scaleTypeToggle.getValue();
		const chartValues = histogram.hist.map((value, i) => {
			const bitMaxEdge = histogram.bin_edges[i + 1];
			const name = typeof bitMaxEdge === "number" ? bitMaxEdge.toFixed(2) : bitMaxEdge;
			return {value, name};
		});
		this._histogramChart.makeChart(chartValues, yScale);
		const histogramChartDiv = this._histogramChart.getHistogramDiv();
		histogramChartDiv.on("plotly_relayout", (eventData) => {
			const min = eventData["xaxis.range[0]"];
			const max = eventData["xaxis.range[1]"];
			const values = {min, max};
			this.getForm().setValues(values);
			this.getRoot().callEvent("colorChanged", [values]);
		});
	}

	setMinAndMaxValuesByHistogram({min, max}) {
		this._visibleRangeSlider.setEdges(min, max);
	}

	async _getHistogramInfo() {
		if (!this._image || !this._channel) {
			return null;
		}
		const {min, max} = this.getHistogramForm().getValues();
		// TODO: switch to image size
		/* const tileInfo = await tilesCollection.getImageTileInfo(this._image);
		const binSettings = {
			width: tileInfo.sizeX,
			height: tileInfo.sizeY,
			rangeMin: min,
			rangeMax: max
		};
		 */
		const binSettings = {
			rangeMin: min,
			rangeMax: max
		};

		return ajaxActions.getImageTilesHistogram(
			this._image._id,
			this._channel.index,
			binSettings
		);
	}

	getHistogramChart() {
		return this.$$(HISTOGRAM_CHART_ID);
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
}
